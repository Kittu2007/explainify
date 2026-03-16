import { auth } from "@/lib/firebase-admin";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { idToken } = await request.json();

  if (!idToken) {
    // Sign out case: remove the cookie
    cookies().set("session", "", {
      maxAge: 0,
      path: "/",
    });
    return NextResponse.json({ status: "success" });
  }

  try {
    // Create a session cookie with a 5-day expiration
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });

    cookies().set("session", sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("Firebase Session Helper Error:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
