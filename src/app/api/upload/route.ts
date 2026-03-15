import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { extractText } from "@/lib/pdf";
import { chunkText } from "@/lib/chunker";
import { generateEmbeddings } from "@/lib/embeddings";

export const runtime = "nodejs";
export const maxDuration = 60; // Allow up to 60s for large PDFs

/**
 * POST /api/upload
 *
 * Upload a PDF file, extract text, chunk it, generate embeddings,
 * and store everything in Supabase.
 *
 * Body: FormData with a "file" field containing the PDF
 *
 * Response: { documentId, filename, pageCount, chunkCount }
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided. Send a PDF file in the 'file' field." },
        { status: 400 }
      );
    }

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json(
        { error: "Only PDF files are supported." },
        { status: 400 }
      );
    }

    // Read file into buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract text from PDF
    const { text, pageCount } = await extractText(buffer);

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        {
          error:
            "Could not extract text from this PDF. It may be a scanned/image-only document.",
        },
        { status: 422 }
      );
    }

    // Insert document record
    const { data: doc, error: docError } = await supabase
      .from("documents")
      .insert({
        filename: file.name,
        file_size: buffer.length,
        page_count: pageCount,
        metadata: {
          contentType: file.type,
          uploadedAt: new Date().toISOString(),
        },
      })
      .select("id")
      .single();

    if (docError || !doc) {
      console.error("Failed to insert document:", docError);
      return NextResponse.json(
        { error: "Failed to store document in database." },
        { status: 500 }
      );
    }

    // Chunk the text
    const chunks = chunkText(text);

    // Generate embeddings for all chunks
    const embeddings = await generateEmbeddings(chunks);

    // Insert chunks with embeddings
    const chunkRows = chunks.map((content, index) => ({
      document_id: doc.id,
      content,
      chunk_index: index,
      embedding: JSON.stringify(embeddings[index]),
    }));

    // Insert in batches of 50 to avoid payload limits
    const BATCH_SIZE = 50;
    for (let i = 0; i < chunkRows.length; i += BATCH_SIZE) {
      const batch = chunkRows.slice(i, i + BATCH_SIZE);
      const { error: chunkError } = await supabase
        .from("chunks")
        .insert(batch);

      if (chunkError) {
        console.error("Failed to insert chunks:", chunkError);
        // Clean up the document if chunk insertion fails
        await supabase.from("documents").delete().eq("id", doc.id);
        return NextResponse.json(
          { error: "Failed to store document chunks." },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      documentId: doc.id,
      filename: file.name,
      pageCount,
      chunkCount: chunks.length,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal server error during file upload." },
      { status: 500 }
    );
  }
}
