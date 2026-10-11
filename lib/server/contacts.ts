/**
 * SERVER ONLY — placeholder contact list shown under the phone icon.
 * Replace these entries in code with real contacts when needed.
 */

export type Contact = { role: string; name: string; phone: string };

export const CONTACTS: readonly Contact[] = [
  { role: "Event coordinator", name: "Jane Doe", phone: "+00 00000 00000" },
  { role: "Reception", name: "Jane Doe", phone: "+00 00000 00000" },
  { role: "Transport", name: "Jane Doe", phone: "+00 00000 00000" },
];
