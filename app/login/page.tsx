"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import JourneyShell from "@/components/ui/JourneyShell";

/**
 * Password gate. The password decides whose journey loads (see
 * lib/server/auth.ts); the page never says who the password belongs to.
 */
export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy || !password.trim()) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.replace("/");
        return;
      }
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setError(data.error ?? "Something went wrong. Please try again.");
    } catch {
      setError("Couldn't reach the server. Please try again.");
    }
    setBusy(false);
  }

  return (
    <JourneyShell>
      <form onSubmit={submit}>
        <div className="js-lock" aria-hidden>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="11" width="14" height="9" rx="2.5" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" />
          </svg>
        </div>
        <div className="js-eyebrow">An AI-first day at TCS Siruseri</div>
        <h1 className="font-display js-title" style={{ fontWeight: 800, letterSpacing: "-0.02em" }}>
          Welcome to TCS
        </h1>
        <p className="js-copy">Sign in with the password you were given to see your sessions, rooms and timings.</p>

        <label htmlFor="password" className="sr-only">
          Password
        </label>
        <div style={{ position: "relative", marginTop: 24 }}>
          <input
            id="password"
            type={show ? "text" : "password"}
            autoComplete="current-password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-[14px] border bg-white py-[15px] pl-[18px] pr-14 text-base outline-none focus:ring-2"
            style={{ borderColor: error ? "#D81B60" : "#e4c3d1", color: "#16203A" }}
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs font-bold"
            style={{ color: "#9E0F48" }}
          >
            {show ? "Hide" : "Show"}
          </button>
        </div>
        <div role="alert" className="mt-2 min-h-[1.25rem] text-[13px] font-semibold" style={{ color: "#B0124F" }}>
          {error}
        </div>

        <button type="submit" disabled={busy || !password.trim()} className="js-btn" style={{ marginTop: 6 }}>
          {busy ? "Checking…" : "Enter my journey"}
        </button>
        <div className="js-hint">Need help? Ask the event coordinator.</div>
      </form>
    </JourneyShell>
  );
}
