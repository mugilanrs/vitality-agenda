/**
 * SERVER ONLY — attendee ids and login names. A password is the attendee's
 * first name followed by a shared suffix (see lib/server/auth.ts). The full
 * name is only ever sent back to that same attendee (welcome screen).
 */

import type { AttendeeId } from "@/data/agendaSource";

export const ATTENDEES: readonly { id: AttendeeId; firstName: string; fullName: string }[] = [
  { id: "a1", firstName: "Imraan", fullName: "Imraan Kadir" },
  { id: "a2", firstName: "Amith", fullName: "Amith Sewnarain" },
  { id: "a3", firstName: "Charles", fullName: "Charles Bresler" },
  { id: "a4", firstName: "Dhesigan", fullName: "Dhesigan Naidu" },
  { id: "a5", firstName: "Phathutshedzo", fullName: "Phathutshedzo Ramuhovhi" },
  { id: "a6", firstName: "Lee", fullName: "Lee Buxton" },
  { id: "a7", firstName: "Zayd", fullName: "Zayd Mahomed" },
];
