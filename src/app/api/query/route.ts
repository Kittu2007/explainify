import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { generateEmbedding } from "@/lib/embeddings";
import { rerankPassages } from "@/lib/reranker";
import { askWithContext } from "@/lib/ai";

export const runtime = "nodejs";
export const maxDuration = 30;

/**
 * POST /api/query
 *
 * Ask a question about uploaded documents using RAG with reranking.
 *
 * Pipeline: embed query → vector search → rerank → LLM answer
 *
 * Body: { question: string, documentId?: string }
 *
 * Response: { answer: string, sources: [{ content, chunkIndex, similarity }] }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, documentId } = body;

    if (!question || typeof question !== "string" || question.trim().length === 0) {
      return NextResponse.json(
        { error: "A 'question' field is required." },
        { status: 400 }
      );
    }

    // Step 1: Embed the question (input_type: "query")
    const queryEmbedding = await generateEmbedding(question, "query");

    // Step 2: Vector similarity search — retrieve top 20 candidates
    const { data: matches, error: matchError } = await supabase.rpc(
      "match_chunks",
      {
        query_embedding: JSON.stringify(queryEmbedding),
        match_count: 20,
        filter_document_id: documentId || null,
      }
    );

    if (matchError) {
      console.error("Vector search error:", matchError);
      return NextResponse.json(
        { error: "Failed to search document chunks." },
        { status: 500 }
      );
    }

    if (!matches || matches.length === 0) {
      return NextResponse.json({
        answer:
          "No relevant content found. Please upload a document first or rephrase your question.",
        sources: [],
      });
    }

    // Step 3: Rerank — pass top 20 candidates through reranker, keep top 5
    const passages = matches.map(
      (m: { content: string; chunk_index: number }, i: number) => ({
        content: m.content,
        index: i,
      })
    );

    const rerankedResults = await rerankPassages(question, passages, 5);

    // Step 4: Generate answer with reranked context
    const contextChunks = rerankedResults.map((r) => r.content);
    const answer = await askWithContext(question, contextChunks);

    // Format sources from reranked results
    const sources = rerankedResults.map((r) => {
      const originalMatch = matches[r.index];
      return {
        content:
          r.content.substring(0, 200) + (r.content.length > 200 ? "..." : ""),
        chunkIndex: originalMatch.chunk_index,
        documentId: originalMatch.document_id,
        relevanceScore: Math.round(r.logit * 100) / 100,
      };
    });

    return NextResponse.json({
      answer,
      sources,
    });
  } catch (error) {
    console.error("Query error:", error);
    return NextResponse.json(
      { error: "Internal server error during query." },
      { status: 500 }
    );
  }
}
