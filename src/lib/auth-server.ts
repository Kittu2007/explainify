import { auth } from "@/lib/firebase-admin";
import { cookies } from "next/headers";

/**
 * Get the currently authenticated user from the session cookie.
 */
export async function getServerUser() {
  const sessionCookie = cookies().get("session")?.value;

  if (!sessionCookie) {
    return null;
  }

  try {
    const decodedToken = await auth.verifySessionCookie(sessionCookie, true);
    return decodedToken;
  } catch (error) {
    console.error("Failed to verify session cookie:", error);
    return null;
  }
}
