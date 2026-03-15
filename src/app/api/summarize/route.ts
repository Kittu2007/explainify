import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { summarize } from "@/lib/ai";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * POST /api/summarize
 *
 * Generate a structured summary of an uploaded document.
 * Returns summary text, key takeaways, themes, metrics, and sentiment score
 * to populate the full ResultsDashboard UI.
 *
 * Body: { documentId: string }
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
    console.log(`[Summarize] Fetching document meta for ${documentId}...`);
    const { data: doc, error: docError } = await supabase
      .from("documents")
      .select("id, filename")
      .eq("id", documentId)
      .single();

    if (docError || !doc) {
      console.error("[Summarize] Doc fetch error:", docError);
      return NextResponse.json(
        { error: "Document not found." },
        { status: 404 }
      );
    }

    // Fetch all chunks for this document, ordered by index
    console.log(`[Summarize] Fetching chunks for ${doc.filename}...`);
    const { data: chunks, error: chunkError } = await supabase
      .from("chunks")
      .select("content, chunk_index")
      .eq("document_id", documentId)
      .order("chunk_index", { ascending: true });

    if (chunkError || !chunks || chunks.length === 0) {
      console.error("[Summarize] Chunk fetch error:", chunkError);
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

    const startTime = Date.now();

    // Generate summary
    console.log(`[Summarize] Running LLM on ${combinedText.length} characters...`);
    const summaryText = await summarize(combinedText.trim());

    const processingTimeMs = Date.now() - startTime;
    const processingTimeStr = processingTimeMs < 1000 
      ? `${processingTimeMs}ms` 
      : `${(processingTimeMs / 1000).toFixed(1)}s`;

    console.log("[Summarize] Success.");

    // Extract key takeaways from the summary (parse bullet points)
    const keyTakeaways = extractKeyTakeaways(summaryText);
    
    // Extract themes from the summary and text more intelligently
    const themes = extractThemes(summaryText, combinedText);

    // Dynamic Sentiment Score (Heuristic: analytical vs conversational)
    const analyticalKeywords = ['analysis', 'data', 'technical', 'research', 'scientific', 'system', 'process', 'result', 'finding'];
    const lowerSummary = summaryText.toLowerCase();
    const analyticalCount = analyticalKeywords.filter(w => lowerSummary.includes(w)).length;
    const sentimentScore = Math.min(65 + (analyticalCount * 5), 98); // Higher = more analytical/formal

    // Calculate metrics from the original text
    const wordCount = combinedText.split(/\s+/).filter(w => w.length > 0).length;

    return NextResponse.json({
      summary: summaryText,
      keyTakeaways,
      themes,
      sentimentScore,
      metrics: {
        processingTime: processingTimeStr,
        wordCount: wordCount.toLocaleString(),
        chunkCount: chunks.length,
      },
      documentId: doc.id,
      filename: doc.filename,
    });
  } catch (error: any) {
    console.error("[Summarize] Unhandled error:", error);
    return NextResponse.json(
      { error: `Summarization failed: ${error.message || String(error)}` },
      { status: 500 }
    );
  }
}

/**
 * Extract key takeaways from the summary text by looking for bullet points,
 * numbered items, or short sentences.
 */
function extractKeyTakeaways(summary: string): string[] {
  const lines = summary.split('\n');
  const takeaways: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    // Match lines that look like bullet points or numbered items
    if (/^[-•*]\s+/.test(trimmed) || /^\d+[.)]\s+/.test(trimmed)) {
      const clean = trimmed.replace(/^[-•*\d.)]+\s*/, '').trim();
      if (clean.length > 10 && clean.length < 300) {
        takeaways.push(clean);
      }
    }
  }

  // If no bullet points found, extract the first few sentences
  if (takeaways.length === 0) {
    const sentences = summary.match(/[^.!?]+[.!?]+/g) || [];
    return sentences.slice(0, 5).map(s => s.trim());
  }

  return takeaways.slice(0, 8);
}

/**
 * Extract themes/topics from the summary by looking for key phrases.
 */
function extractThemes(summary: string, fullText: string): string[] {
  const combined = (summary + " " + fullText.substring(0, 2000)).toLowerCase();
  
  const potentialThemes: { word: string; count: number }[] = [];
  
  // Find capitalized multi-word terms (likely important topics/themes)
  const capitalizedTerms = summary.match(/[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*/g) || [];
  const termCounts: Record<string, number> = {};
  
  for (const term of capitalizedTerms) {
    if (term.length > 3 && !['The', 'This', 'That', 'These', 'Those', 'What', 'When', 'Where', 'Which', 'While', 'There', 'Their', 'Here', 'However', 'Source', 'Based', 'According'].includes(term)) {
      termCounts[term] = (termCounts[term] || 0) + 1;
    }
  }

  // Sort by frequency and take top themes
  const sortedTerms = Object.entries(termCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([term]) => term);

  if (sortedTerms.length >= 3) {
    return sortedTerms;
  }

  // Fallback: use common academic/technical topics
  const fallbackThemes = ["Analysis", "Comparison", "Technology", "Applications", "Research"];
  return [...sortedTerms, ...fallbackThemes].slice(0, 5);
}
