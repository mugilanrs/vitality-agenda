/**
 * SERVER ONLY — contact list shown under the phone icon, read from the
 * CONTACTS environment variable (a JSON array; see .env.example).
 */

export type Contact = { role: string; name: string; phone: string };

export function contactsFromEnv(): Contact[] {
  const raw = process.env.CONTACTS;
  if (!raw) return [];
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    const out: Contact[] = [];
    for (const item of data) {
      if (!item || typeof item !== "object") continue;
      const { role, name, phone } = item as Record<string, unknown>;
      if (typeof phone !== "string" || !phone.trim()) continue;
      out.push({
        role: typeof role === "string" ? role.trim().slice(0, 60) : "",
        name: typeof name === "string" ? name.trim().slice(0, 80) : "",
        phone: phone.trim().slice(0, 30),
      });
    }
    return out.slice(0, 20);
  } catch {
    console.error("CONTACTS is not valid JSON");
    return [];
  }
}
