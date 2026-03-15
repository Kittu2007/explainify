import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";
import { generateEmbedding } from "@/lib/embeddings";
import { rerankPassages } from "@/lib/reranker";
import { askWithContextStream } from "@/lib/ai";

export const runtime = "nodejs";
export const maxDuration = 30;

/**
 * POST /api/query
 *
 * Ask a question about uploaded documents using RAG with reranking.
 * This version uses STREAMING to prevent Vercel/Render timeouts.
 *
 * Pipeline: embed query → vector search → rerank → LLM answer (Stream)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, documentId } = body;

    if (!question || typeof question !== "string" || question.trim().length === 0) {
      return new Response(JSON.stringify({ error: "A 'question' field is required." }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
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
      return new Response(JSON.stringify({ 
        answer: "No relevant content found. Please upload a document first or rephrase your question.",
        sources: [] 
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
        // First, send the sources as a header or special first chunk
        const sources = rerankedResults.map((r) => {
          const originalMatch = matches[r.index];
          return {
            content: r.content.substring(0, 200) + "...",
            chunkIndex: originalMatch.chunk_index,
            documentId: originalMatch.document_id,
          };
        });

        // Send metadata first chunk: metadata:JSON\n
        controller.enqueue(encoder.encode(`__METADATA__:${JSON.stringify({ sources })}\n`));

        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
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
