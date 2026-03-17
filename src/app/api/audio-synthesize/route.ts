import { NextRequest, NextResponse } from "next/server";
import { generateNarrationAudio, generateNarrationBuffer } from "@/lib/tts";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    let text = searchParams.get("text") || searchParams.get("t");
    
    if (searchParams.get("t")) {
      try {
        text = Buffer.from(text!, 'base64').toString('utf8');
      } catch (e) {
        console.warn("Base64 decode failed, using raw 't' param");
      }
    }

    if (!text) return NextResponse.json({ error: "No text provided" }, { status: 400 });

    const buffer = await generateNarrationBuffer(text);
    
    // Explicitly convert Buffer to Uint8Array for Response body
    const responseBody = new Uint8Array(buffer);
    
    return new Response(responseBody, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": responseBody.length.toString(),
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    });
  } catch (error: any) {
    console.error("[AudioGET] Failed:", error);
    return new Response("Audio generation failed", { status: 500 });
  }
}

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
