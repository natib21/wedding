import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    isAdmin: session.isAdmin,
    slug: session.slug,
    fullName: session.fullName,
    inviteId: session.inviteId,
  });
}
