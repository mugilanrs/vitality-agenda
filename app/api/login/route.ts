import { cookies } from "next/headers";
import {
  SESSION_COOKIE,
  attendeeForPassword,
  clearAttempts,
  createSessionToken,
  recordFailedAttempt,
  sessionCookieOptions,
  tooManyAttempts,
} from "@/lib/server/auth";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (tooManyAttempts(ip)) {
    return Response.json({ error: "Too many attempts. Try again in a few minutes." }, { status: 429 });
  }

  let password = "";
  try {
    const body = (await request.json()) as { password?: unknown };
    if (typeof body.password === "string") password = body.password.slice(0, 100);
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const id = attendeeForPassword(password);
  if (!id) {
    recordFailedAttempt(ip);
    return Response.json({ error: "That password isn't right." }, { status: 401 });
  }

  clearAttempts(ip);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, await createSessionToken(id), sessionCookieOptions);
  return Response.json({ ok: true });
}
