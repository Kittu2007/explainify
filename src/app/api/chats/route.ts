import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";

/**
 * GET /api/chats
 * List chats for a user
 */
export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");
  
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const { data: chats, error } = await supabase
    .from("chats")
    .select("*, messages(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(chats || []);
}

/**
 * POST /api/chats
 * Create a new chat or save a message
 */
export async function POST(request: NextRequest) {
  try {
    const { userId, chatId, title, documentId, message } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    let currentChatId = chatId;

    // Create new chat if not provided
    if (!currentChatId) {
      const { data: newChat, error: chatError } = await supabase
        .from("chats")
        .insert({
          user_id: userId,
          title: title || "New Chat",
          document_id: documentId || null
        })
        .select()
        .single();

      if (chatError) {
        return NextResponse.json({ error: chatError.message }, { status: 500 });
      }
      currentChatId = newChat.id;
    }

    // Save message if provided
    if (message) {
      const { error: msgError } = await supabase
        .from("messages")
        .insert({
          chat_id: currentChatId,
          role: message.role,
          content: message.content
        });

      if (msgError) {
        return NextResponse.json({ error: msgError.message }, { status: 500 });
      }
    }

    return NextResponse.json({ chatId: currentChatId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
