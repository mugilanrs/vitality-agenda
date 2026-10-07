import { cookies } from "next/headers";
import { agendaForAttendee } from "@/data/agendaSource";
import { ATTENDEES } from "@/data/attendees";
import { SESSION_COOKIE, readSessionToken } from "@/lib/server/auth";
import { arrivalsForViewer } from "@/lib/server/arrivals";
import { contactsFromEnv } from "@/lib/server/contacts";

/**
 * The logged-in attendee's own name, rooms and the shared contact list.
 * Never includes who else attends.
 */
export async function GET() {
  const cookieStore = await cookies();
  let id = null;
  try {
    id = await readSessionToken(cookieStore.get(SESSION_COOKIE)?.value);
  } catch {
    // Missing SESSION_SECRET: treat as signed out rather than erroring.
  }
  if (!id) return Response.json({ error: "Not signed in." }, { status: 401 });
  const name = id === "admin" ? "Admin" : (ATTENDEES.find((a) => a.id === id)?.fullName ?? "");
  return Response.json(
    {
      name,
      rooms: agendaForAttendee(id),
      contacts: contactsFromEnv(),
      arrivals: arrivalsForViewer(id),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
