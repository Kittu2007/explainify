import { NextResponse } from "next/server";

/**
 * GET /api/health
 *
 * Health check endpoint for monitoring and deployment validation.
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "explainify",
    timestamp: new Date().toISOString(),
    endpoints: ["/api/upload", "/api/query", "/api/summarize", "/api/video-explain"],
  });
}
