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
      const topicEmbedding = await generateEmbedding(topic, "query");

      const { data: matches, error: matchError } = await supabase.rpc(
        "match_chunks",
        {
          query_embedding: JSON.stringify(topicEmbedding),
          match_count: 15,
          filter_document_id: documentId,
        }
      );

      if (matchError) {
        console.error("Vector search error:", matchError);
        return NextResponse.json(
          { error: "Failed to search document chunks." },
          { status: 500 }
        );
      }

      if (matches && matches.length > 0) {
        // Rerank for better context quality
        const passages = matches.map(
          (m: { content: string }, i: number) => ({
            content: m.content,
            index: i,
          })
        );

        const reranked = await rerankPassages(topic, passages, 8);
        contextChunks = reranked.map((r) => r.content);
      }
    }

    // Generate the baseline script text
    const script = await generateVideoScript(topic, contextChunks);

    // Generate TTS Audio for each scene in parallel
    const scenesWithAudio = await Promise.all(
      script.scenes.map(async (scene) => {
        try {
          const audioUrl = await generateNarrationAudio(scene.narration);
          return { ...scene, audioUrl };
        } catch (audioError) {
          console.error("Failed to generate audio for scene " + scene.sceneNumber + ":", audioError);
          // Return null audio if generation fails, so the app doesn't crash completely
          return { ...scene, audioUrl: null };
        }
      })
    );

    const finalScript = { ...script, scenes: scenesWithAudio };

    return NextResponse.json({
      script: finalScript,
      topic,
      documentGrounded: contextChunks.length > 0,
    });
  } catch (error) {
    console.error("Video explain error:", error);
    return NextResponse.json(
      { error: "Internal server error during video explanation generation." },
      { status: 500 }
    );
  }
}
