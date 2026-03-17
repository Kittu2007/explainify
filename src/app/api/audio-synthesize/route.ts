import { NextRequest, NextResponse } from "next/server";
import { generateNarrationAudio } from "@/lib/tts";

export const runtime = "nodejs";
export const maxDuration = 30;

/**
 * POST /api/audio-synthesize
 * 
 * Synthesizes speech for a given text segment.
 */
export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();
    
    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const audioUrl = await generateNarrationAudio(text);
    
    return NextResponse.json({ audioUrl });
  } catch (error: any) {
    console.error("[AudioSynth] Failed:", error);
    return NextResponse.json(
      { error: `Audio synthesis failed: ${error.message}` },
      { status: 500 }
    );
  }
}
