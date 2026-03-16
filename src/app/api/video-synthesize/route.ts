import { NextResponse } from "next/server";
import { generateVideoClip } from "@/lib/video-gen";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    console.log(`[Synthesize] Synthesizing video for: "${prompt.substring(0, 30)}..."`);
    const videoUrl = await generateVideoClip(prompt);

    return NextResponse.json({ videoUrl });
  } catch (error: any) {
    console.error("[Synthesize] Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
