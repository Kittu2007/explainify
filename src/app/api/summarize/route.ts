import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { summarize } from "@/lib/ai";

export const runtime = "nodejs";
export const maxDuration = 30;

/**
 * POST /api/summarize
 *
 * Generate a concise summary of an uploaded document.
 *
 * Body: { documentId: string }
 *
 * Response: { summary: string, documentId: string, filename: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { documentId } = body;

    if (!documentId || typeof documentId !== "string") {
      return NextResponse.json(
        { error: "A 'documentId' field is required." },
        { status: 400 }
      );
    }

    // Fetch the document to verify it exists
    const { data: doc, error: docError } = await supabase
      .from("documents")
      .select("id, filename")
      .eq("id", documentId)
      .single();

    if (docError || !doc) {
      return NextResponse.json(
        { error: "Document not found." },
        { status: 404 }
      );
    }

    // Fetch all chunks for this document, ordered by index
    const { data: chunks, error: chunkError } = await supabase
      .from("chunks")
      .select("content, chunk_index")
      .eq("document_id", documentId)
      .order("chunk_index", { ascending: true });

    if (chunkError || !chunks || chunks.length === 0) {
      return NextResponse.json(
        { error: "No content found for this document." },
        { status: 404 }
      );
    }

    // Concatenate chunks (limit to ~50k chars to stay within LLM context)
    const MAX_CHARS = 50000;
    let combinedText = "";
    for (const chunk of chunks) {
      if (combinedText.length + chunk.content.length > MAX_CHARS) {
        combinedText +=
          "\n\n[... remainder truncated for summarization ...]";
        break;
      }
      combinedText += chunk.content + "\n\n";
    }

    // Generate summary
    const summary = await summarize(combinedText.trim());

    return NextResponse.json({
      summary,
      documentId: doc.id,
      filename: doc.filename,
    });
  } catch (error) {
    console.error("Summarize error:", error);
    return NextResponse.json(
      { error: "Internal server error during summarization." },
      { status: 500 }
    );
  }
}
