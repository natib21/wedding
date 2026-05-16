import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeSession } from "@/lib/auth/session-core";

const SESSION_COOKIE = "wedding_session";
const ADMIN_LOGIN = "/admin/login";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (pathname === ADMIN_LOGIN) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await decodeSession(token) : null;

  if (!session?.isAdmin) {
    const loginUrl = new URL(ADMIN_LOGIN, request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
