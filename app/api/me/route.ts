import { cookies } from "next/headers";
import { agendaForAttendee } from "@/data/agendaSource";
import { SESSION_COOKIE, readSessionToken } from "@/lib/server/auth";

/** The logged-in attendee's own rooms. Never includes who else attends. */
export async function GET() {
  const cookieStore = await cookies();
  const id = await readSessionToken(cookieStore.get(SESSION_COOKIE)?.value);
  if (!id) return Response.json({ error: "Not signed in." }, { status: 401 });
  return Response.json(
    { rooms: agendaForAttendee(id) },
    { headers: { "Cache-Control": "no-store" } },
  );
}
