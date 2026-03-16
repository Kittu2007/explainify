import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { generateEmbedding } from "@/lib/embeddings";
import { rerankPassages } from "@/lib/reranker";
import { generateVideoScript } from "@/lib/ai";
import { generateNarrationAudio } from "@/lib/tts";

export const runtime = "nodejs";
export const maxDuration = 60; // Increased to 60s for TTS API generation

/**
 * POST /api/video-explain
 *
 * Generate a structured video explanation script for a topic,
 * optionally grounded in uploaded document content, and generate
 * speech audio for each scene's narration.
 *
 * Body: { topic: string, documentId?: string }
 *
 * Response: { script: { title, description, scenes: [{ sceneNumber, narration, visual, duration, audioUrl }] }, topic, documentGrounded }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, documentId } = body;

    if (!topic || typeof topic !== "string" || topic.trim().length === 0) {
      return NextResponse.json(
        { error: "A 'topic' field is required." },
        { status: 400 }
      );
    }

    let contextChunks: string[] = [];

    // If a documentId is provided, retrieve and rerank relevant chunks
    if (documentId) {
      console.log(`[Video] Embedding topic for document grounding: "${topic.substring(0, 50)}..."`);
      const topicEmbedding = await generateEmbedding(topic, "query");

      console.log(`[Video] Searching for matches in document ${documentId}...`);
      const { data: matches, error: matchError } = await supabase.rpc(
        "match_chunks",
        {
          query_embedding: topicEmbedding, // Pass array directly
          match_count: 15,
          filter_document_id: documentId,
        }
      );

      if (matchError) {
        console.error("[Video] Vector search error:", matchError);
        return NextResponse.json(
          { error: `Database Search Error: ${matchError.message}` },
          { status: 500 }
        );
      }

      if (matches && matches.length > 0) {
        console.log(`[Video] Found ${matches.length} matches. Reranking...`);
        // Rerank for better context quality
        const passages = matches.map(
          (m: { content: string }, i: number) => ({
            content: m.content,
            index: i,
          })
        );

        const reranked = await rerankPassages(topic, passages, 8);
        contextChunks = reranked.map((r) => r.content);
      } else {
        console.log("[Video] No matches found. Proceeding with general knowledge.");
      }
    }

    // Generate the baseline script text
    console.log("[Video] Generating script with LLM...");
    const script = await generateVideoScript(topic, contextChunks);

    // Generate Audio for each scene in parallel (Audio is fast, Video will be lazy-loaded)
    console.log(`[Video] Generating Audio for ${script.scenes.length} scenes...`);
    const scenesWithAudio = await Promise.all(
      script.scenes.map(async (scene) => {
        try {
          const audioUrl = await generateNarrationAudio(scene.narration);
          return { ...scene, audioUrl, videoUrl: null }; // videoUrl set to null for frontend lazy-loading
        } catch (mediaError: any) {
          console.error(`[Video] Audio generation failed for scene:`, mediaError.message);
          return { ...scene, audioUrl: null, videoUrl: null };
        }
      })
    );

    const finalScript = { ...script, scenes: scenesWithAudio };
    console.log("[Video] Success.");

    return NextResponse.json({
      script: finalScript,
      topic,
      documentGrounded: contextChunks.length > 0,
    });
  } catch (error: any) {
    console.error("[Video] Unhandled error:", error);
    return NextResponse.json(
      { error: `Video explanation failed: ${error.message || String(error)}` },
      { status: 500 }
    );
  }
}
