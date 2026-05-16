/** Admin-only QR / gatekeeper check-in URL */
export function buildCheckInUrl(slug: string, origin?: string): string {
  const base = origin ?? process.env.NEXT_PUBLIC_APP_URL ?? "";
  return `${base.replace(/\/$/, "")}/admin/check-in/${slug}`;
}

/** Public guest invitation (no login) */
export function buildInvitationUrl(slug: string, origin?: string): string {
  const base = origin ?? process.env.NEXT_PUBLIC_APP_URL ?? "";
  return `${base.replace(/\/$/, "")}/invitation/${slug}`;
}

export function getRequestOrigin(request: Request): string {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, "");

  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") ?? "http";
  if (host) return `${proto}://${host}`;
  return "http://localhost:3000";
}
