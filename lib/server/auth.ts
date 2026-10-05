/**
 * SERVER ONLY — password check and signed session cookie.
 *
 * Password = `<first name><suffix>`, e.g. imraan@india2026 (first name is
 * case-insensitive). The cookie holds the attendee id + expiry, signed with
 * HMAC-SHA256 using SESSION_SECRET, so it can't be forged or edited.
 */

import { ATTENDEES } from "@/data/attendees";
import type { ViewerId } from "@/data/agendaSource";

export const SESSION_COOKIE = "vv_session";
const SESSION_HOURS = 48;

const enc = new TextEncoder();

function passwordSuffix(): string {
  return process.env.ATTENDEE_PASSWORD_SUFFIX ?? "@india2026";
}

function secret(): string {
  const s = process.env.SESSION_SECRET;
  if (s) return s;
  if (process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET is not set");
  }
  return "dev-only-secret-change-me";
}

function toBase64Url(bytes: Uint8Array): string {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(text: string): Uint8Array {
  const pad = "=".repeat((4 - (text.length % 4)) % 4);
  const bin = atob(text.replace(/-/g, "+").replace(/_/g, "/") + pad);
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

async function hmacKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

/** Equal-length comparison that doesn't bail out at the first difference. */
function safeEqual(a: string, b: string): boolean {
  const len = Math.max(a.length, b.length);
  let diff = a.length ^ b.length;
  for (let i = 0; i < len; i++) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0;
}

/**
 * Returns who this password belongs to, or null. Admin follows the same
 * pattern as attendees ("admin" + suffix, i.e. admin@india2026); setting the
 * ADMIN_PASSWORD env var replaces it with a custom (case-sensitive) one.
 */
export function attendeeForPassword(password: string): ViewerId | null {
  const customAdmin = process.env.ADMIN_PASSWORD;
  const isAdmin = customAdmin
    ? safeEqual(password.trim(), customAdmin)
    : safeEqual(password.trim().toLowerCase(), `admin${passwordSuffix()}`.toLowerCase());
  if (isAdmin) return "admin";
  const given = password.trim().toLowerCase();
  let found: ViewerId | null = null;
  for (const a of ATTENDEES) {
    const expected = `${a.firstName}${passwordSuffix()}`.toLowerCase();
    if (safeEqual(given, expected)) found = a.id;
  }
  return found;
}

export async function createSessionToken(id: ViewerId): Promise<string> {
  const payload = toBase64Url(
    enc.encode(JSON.stringify({ id, exp: Date.now() + SESSION_HOURS * 3600_000 })),
  );
  const sig = await crypto.subtle.sign("HMAC", await hmacKey(), enc.encode(payload));
  return `${payload}.${toBase64Url(new Uint8Array(sig))}`;
}

export async function readSessionToken(token: string | undefined): Promise<ViewerId | null> {
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  try {
    const ok = await crypto.subtle.verify(
      "HMAC",
      await hmacKey(),
      fromBase64Url(sig) as BufferSource,
      enc.encode(payload),
    );
    if (!ok) return null;
    const data = JSON.parse(new TextDecoder().decode(fromBase64Url(payload))) as {
      id?: string;
      exp?: number;
    };
    if (typeof data.exp !== "number" || data.exp < Date.now()) return null;
    if (data.id === "admin") return "admin";
    return ATTENDEES.find((a) => a.id === data.id)?.id ?? null;
  } catch {
    return null;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_HOURS * 3600,
};

// ---- Simple in-memory brute-force limiter (per server instance) ----

const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 10;
const WINDOW_MS = 10 * 60_000;

export function tooManyAttempts(key: string): boolean {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || entry.resetAt < now) return false;
  return entry.count >= MAX_ATTEMPTS;
}

export function recordFailedAttempt(key: string) {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || entry.resetAt < now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
  } else {
    entry.count += 1;
  }
}

export function clearAttempts(key: string) {
  attempts.delete(key);
}
