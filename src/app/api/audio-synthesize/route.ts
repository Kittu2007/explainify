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

    console.log(`[AudioGET] Request text length: ${text?.length}`);

    if (!text) return NextResponse.json({ error: "No text provided" }, { status: 400 });

    const buffer = await generateNarrationBuffer(text);
    
    if (!buffer || buffer.length === 0) {
      throw new Error("Generated audio buffer is empty");
    }

    const responseBody = new Uint8Array(buffer);
    console.log(`[AudioGET] Success: ${responseBody.length} bytes`);
    
    return new Response(responseBody, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": responseBody.length.toString(),
        "X-Audio-Status": "Success",
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    });
  } catch (error: any) {
    console.error("[AudioGET] Fatal Error:", error.message);
    // Return the error message so we can see it in the Network tab
    return new Response(`Audio failed: ${error.message}`, { 
      status: 500,
      headers: { "X-Audio-Error": error.message }
    });
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
