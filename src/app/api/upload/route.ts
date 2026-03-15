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
    const { filePath, filename, fileSize } = await request.json();

    if (!filePath) {
      return NextResponse.json(
        { error: "No filePath provided." },
        { status: 400 }
      );
    }

    // 1. Download file from Supabase Storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from("explainify")
      .download(filePath);

    if (downloadError || !fileData) {
      console.error("Storage download error:", downloadError);
      return NextResponse.json(
        { error: `Failed to download file from storage: ${downloadError?.message}` },
        { status: 500 }
      );
    }

    // Read file into buffer
    const arrayBuffer = await fileData.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract text based on file type
    const fileExt = filename ? filename.split('.').pop()?.toLowerCase() : "";
    let text = "";
    let pageCount = 1;

    try {
      if (fileExt === "pdf") {
        const { extractText: extractPdf } = await import("@/lib/pdf");
        const extracted = await extractPdf(buffer);
        text = extracted.text;
        pageCount = extracted.pageCount;
      } else if (fileExt === "doc" || fileExt === "docx") {
        const { extractWordText } = await import("@/lib/docx");
        const extracted = await extractWordText(buffer);
        text = extracted.text;
        pageCount = extracted.pageCount;
      } else if (fileExt === "txt") {
        text = buffer.toString("utf-8");
      } else {
        return NextResponse.json(
          { error: `Unsupported file type: .${fileExt}. Please upload PDF, Word, or TXT.` },
          { status: 400 }
        );
      }
    } catch (extractErr: any) {
      console.error("Text extraction failed:", extractErr);
      return NextResponse.json(
        { error: `Extraction error: ${extractErr.message || "Failed to parse document format."}` },
        { status: 422 }
      );
    }

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        {
          error: "Unable to scan document. This file appears to be a scanned image without a text layer. OCR is required.",
        },
        { status: 422 }
      );
    }

    // Insert document record
    const { data: doc, error: docError } = await supabase
      .from("documents")
      .insert({
        filename: filename || "document.pdf",
        file_size: buffer.length,
        page_count: pageCount,
        metadata: {
          contentType: fileExt === "pdf" ? "application/pdf" : "application/msword",
          uploadedAt: new Date().toISOString(),
        },
      })
      .select("id")
      .single();

    if (docError || !doc) {
      console.error("Failed to insert document:", docError);
      return NextResponse.json(
        { error: `Database Error (Documents): ${docError?.message}` },
        { status: 500 }
      );
    }

    // Chunk the text
    const chunks = chunkText(text);

    // Generate embeddings for all chunks
    let embeddings: number[][] = [];
    try {
      embeddings = await generateEmbeddings(chunks);
    } catch (embedError: any) {
      console.error("Embedding generation failed:", embedError);
      await supabase.from("documents").delete().eq("id", doc.id);
      return NextResponse.json(
        { error: `NVIDIA API Error: ${embedError.message || "Failed to generate embeddings."}` },
        { status: 502 }
      );
    }

    // Insert chunks with embeddings
    // Use Direct Postgres if DATABASE_URL is available for speed, fallback to REST if not
    if (process.env.DATABASE_URL) {
      console.log("Using direct Postgres for batch insertion...");
      try {
        const { insertEmbeddings } = await import("@/lib/db");
        await insertEmbeddings(doc.id, chunks, embeddings);
      } catch (dbError: any) {
        console.error("Direct Postgres insert failed, falling back to REST:", dbError.message);
        // Fallback to REST if direct connection fails
        await insertChunksREST(doc.id, chunks, embeddings, supabase);
      }
    } else {
      console.log("DATABASE_URL not found. Using Supabase REST API for insertion...");
      await insertChunksREST(doc.id, chunks, embeddings, supabase);
    }

    return NextResponse.json({
      documentId: doc.id,
      filename: filename || "document.txt",
      pageCount,
      chunkCount: chunks.length,
    });
  } catch (error: any) {
    console.error("Upload unhandled error:", error);
    return NextResponse.json(
      { error: `Internal Server Error: ${error.message || String(error)}` },
      { status: 500 }
    );
  }
}

/**
 * Fallback chunk insertion using Supabase REST client
 */
async function insertChunksREST(documentId: string, chunks: string[], embeddings: number[][], supabase: any) {
  const chunkRows = chunks.map((content, index) => ({
    document_id: documentId,
    content,
    chunk_index: index,
    embedding: JSON.stringify(embeddings[index]),
  }));

  const BATCH_SIZE = 50;
  for (let i = 0; i < chunkRows.length; i += BATCH_SIZE) {
    const batch = chunkRows.slice(i, i + BATCH_SIZE);
    const { error: chunkError } = await supabase
      .from("chunks")
      .insert(batch);

    if (chunkError) {
      console.error(`REST insert failed for batch ${i}:`, chunkError);
      await supabase.from("documents").delete().eq("id", documentId);
      throw new Error(`Database Error (Chunks): ${chunkError?.message}`);
    }
  }
}
