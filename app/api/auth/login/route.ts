import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { SESSION_COOKIE, sessionCookieOptions, createSessionToken } from "@/lib/auth/session";
import { findInviteForLogin } from "@/lib/findInviteForLogin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";
    const phoneNumber =
      typeof body.phoneNumber === "string" ? body.phoneNumber.trim() : undefined;

    if (!fullName) {
      return NextResponse.json({ error: "Full name is required" }, { status: 400 });
    }

    await connectDB();

    const invite = await findInviteForLogin(fullName, phoneNumber);

    if (!invite) {
      return NextResponse.json(
        { error: "No invitation found for these details. Please check your name." },
        { status: 401 },
      );
    }

    const token = await createSessionToken({
      inviteId: String(invite._id),
      slug: invite.slug,
      fullName: invite.fullName,
      isAdmin: invite.isAdmin,
    });

    const response = NextResponse.json({
      success: true,
      isAdmin: invite.isAdmin,
      slug: invite.slug,
      inviteId: String(invite._id),
      fullName: invite.fullName,
    });

    response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Login failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
