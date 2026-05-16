import { NextResponse } from "next/server";
import { getSession, requireAdminSession } from "@/lib/auth/session";

export async function requireAdminApi() {
  const session = await requireAdminSession();
  if (!session) {
    return {
      session: null,
      response: NextResponse.json(
        { error: "Unauthorized. Admin login required." },
        { status: 401 },
      ),
    };
  }
  return { session, response: null };
}

export async function getOptionalSession() {
  return getSession();
}
