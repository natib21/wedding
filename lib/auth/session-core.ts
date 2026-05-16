export type SessionPayload = {
  inviteId: string;
  slug: string;
  fullName: string;
  isAdmin: boolean;
  exp: number;
};

function getSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("AUTH_SECRET environment variable is required in production");
    }
    return "dev-only-change-auth-secret-in-production";
  }
  return secret;
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  const binary = atob(padded + pad);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function importKey(secret: string) {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

async function signPayload(payload: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await importKey(getSecret());
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return toBase64Url(new Uint8Array(signature));
}

async function verifyPayload(payload: string, signature: string): Promise<boolean> {
  const enc = new TextEncoder();
  const key = await importKey(getSecret());
  try {
    return await crypto.subtle.verify(
      "HMAC",
      key,
      new Uint8Array(fromBase64Url(signature)),
      enc.encode(payload),
    );
  } catch {
    return false;
  }
}

export async function encodeSession(data: SessionPayload): Promise<string> {
  const payload = toBase64Url(new TextEncoder().encode(JSON.stringify(data)));
  const signature = await signPayload(payload);
  return `${payload}.${signature}`;
}

export async function decodeSession(token: string): Promise<SessionPayload | null> {
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const valid = await verifyPayload(payload, signature);
  if (!valid) return null;

  try {
    const json = new TextDecoder().decode(fromBase64Url(payload));
    const data = JSON.parse(json) as SessionPayload;
    if (!data.exp || Date.now() > data.exp) return null;
    if (!data.inviteId || !data.slug) return null;
    return data;
  } catch {
    return null;
  }
}

export function createSessionPayload(input: Omit<SessionPayload, "exp">, maxAgeSec = 60 * 60 * 24 * 7): SessionPayload {
  return {
    ...input,
    exp: Date.now() + maxAgeSec * 1000,
  };
}
