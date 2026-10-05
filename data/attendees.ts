/**
 * SERVER ONLY — attendee ids and login names. A password is the attendee's
 * first name followed by a shared suffix (see lib/server/auth.ts).
 */

import type { AttendeeId } from "@/data/agendaSource";

export const ATTENDEES: readonly { id: AttendeeId; firstName: string }[] = [
  { id: "a1", firstName: "Imraan" },
  { id: "a2", firstName: "Amith" },
  { id: "a3", firstName: "Charles" },
  { id: "a4", firstName: "Dhesigan" },
  { id: "a5", firstName: "Phathutshedzo" },
  { id: "a6", firstName: "Lee" },
  { id: "a7", firstName: "Zayd" },
];
