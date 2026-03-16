import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";
import { generateEmbedding } from "@/lib/embeddings";
import { rerankPassages } from "@/lib/reranker";
import { askWithContextStream } from "@/lib/ai";
import { getServerUser } from "@/lib/auth-server";

export const runtime = "nodejs";
export const maxDuration = 30;

/**
 * POST /api/query
 *
 * Ask a question about uploaded documents using RAG with reranking.
 * This version uses STREAMING and Now Persists to DB.
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getServerUser();
    const body = await request.json();
    const { question, documentId, chatId } = body;

    if (!question || typeof question !== "string" || question.trim().length === 0) {
      return new Response(JSON.stringify({ error: "A 'question' field is required." }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    let activeChatId = chatId;

    // Persist user question to DB if user is logged in
    if (user && !activeChatId) {
      // Create a new chat if none exists
      const { data: newChat, error: chatError } = await supabase
        .from("chats")
        .insert({
          user_id: user.uid,
          title: question.substring(0, 50) + (question.length > 50 ? "..." : ""),
          document_id: (documentId && documentId.trim() !== "") ? documentId : null,
        })
        .select("id")
        .single();
      
      if (!chatError && newChat) {
        activeChatId = newChat.id;
      }
    }

    if (user && activeChatId) {
       await supabase.from("messages").insert({
         chat_id: activeChatId,
         role: 'user',
         content: question
       });
    }

    // Step 1: Embed the question
    console.log(`[Query] Embedding: "${question.substring(0, 50)}..."`);
    const queryEmbedding = await generateEmbedding(question, "query");

    // Step 2: Vector Search
    const { data: matches, error: matchError } = await supabase.rpc(
      "match_chunks",
      {
        query_embedding: queryEmbedding,
        match_count: 20,
        filter_document_id: (documentId && documentId.trim() !== "") ? documentId : null,
      }
    );

    if (matchError || !matches || matches.length === 0) {
      const fallbackAnswer = "No relevant content found. Please upload a document first or rephrase your question.";
      if (user && activeChatId) {
        await supabase.from("messages").insert({
          chat_id: activeChatId,
          role: 'assistant',
          content: fallbackAnswer
        });
      }
      return new Response(JSON.stringify({ 
        answer: fallbackAnswer,
        sources: [],
        chatId: activeChatId
      }), { 
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Step 3: Rerank
    const passages = matches.map((m: any, i: number) => ({
      content: m.content,
      index: i,
    }));
    const rerankedResults = await rerankPassages(question, passages, 5);
    const contextChunks = rerankedResults.map((r) => r.content);

    // Step 4: Stream the Response
    console.log("[Query] Starting Stream...");
    const stream = await askWithContextStream(question, contextChunks);

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        const sources = rerankedResults.map((r) => {
          const originalMatch = matches[r.index];
          return {
            content: r.content.substring(0, 200) + "...",
            chunkIndex: originalMatch.chunk_index,
            documentId: originalMatch.document_id,
          };
        });

        // Send metadata including chatId
        controller.enqueue(encoder.encode(`__METADATA__:${JSON.stringify({ sources, chatId: activeChatId })}\n`));

        let fullAssistantResponse = "";
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              fullAssistantResponse += content;
              controller.enqueue(encoder.encode(content));
            }
          }

          // Persist assistant response to DB
          if (user && activeChatId) {
            await supabase.from("messages").insert({
              chat_id: activeChatId,
              role: 'assistant',
              content: fullAssistantResponse
            });
          }
        } catch (err) {
          console.error("[Stream] Error:", err);
          controller.enqueue(encoder.encode("\n[Error during streaming]"));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });

  } catch (error: any) {
    console.error("[Query] Unhandled error:", error);
    return new Response(JSON.stringify({ error: `Query failed: ${error.message}` }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
