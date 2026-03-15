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
        { error: extractErr.message || "Failed to read the document. It may contain complex images or be encrypted." },
        { status: 422 }
      );
    }

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        {
          error: "Could not extract text from this document. It may be a scanned image-only file without OCR.",
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
          contentType: "application/pdf",
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
      filename: filename || "document.pdf",
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
