/**
 * SERVER ONLY — attendee ids and login names. A password is the attendee's
 * first name followed by a shared suffix (see lib/server/auth.ts). The full
 * name is only ever sent back to that same attendee (welcome screen).
 */

import type { AttendeeId } from "@/data/agendaSource";

export const ATTENDEES: readonly { id: AttendeeId; firstName: string; fullName: string }[] = [
  { id: "a1", firstName: "attendee1", fullName: "Jane Doe" },
  { id: "a2", firstName: "attendee2", fullName: "Jane Doe" },
  { id: "a3", firstName: "attendee3", fullName: "Jane Doe" },
  { id: "a4", firstName: "attendee4", fullName: "Jane Doe" },
  { id: "a5", firstName: "attendee5", fullName: "Jane Doe" },
  { id: "a6", firstName: "attendee6", fullName: "Jane Doe" },
  { id: "a7", firstName: "attendee7", fullName: "Jane Doe" },
];
