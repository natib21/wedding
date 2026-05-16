import { cookies } from "next/headers";
import {
  createSessionPayload,
  decodeSession,
  encodeSession,
  type SessionPayload,
} from "@/lib/auth/session-core";

export type { SessionPayload };
export const SESSION_COOKIE = "wedding_session";

const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 7;

export async function createSessionToken(input: Omit<SessionPayload, "exp">): Promise<string> {
  return encodeSession(createSessionPayload(input, SESSION_MAX_AGE_SEC));
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return decodeSession(token);
}

export async function requireAdminSession(): Promise<SessionPayload | null> {
  const session = await getSession();
  if (!session?.isAdmin) return null;
  return session;
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_MAX_AGE_SEC,
};
