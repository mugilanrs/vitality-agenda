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
        <div className="js-brand">
          <span>
            <i />
            TCS · Vitality
          </span>
          <span>8 Oct 2026</span>
        </div>
        <div className="js-eyebrow">An AI-first day at TCS Siruseri</div>
        <h1 className="font-display js-title" style={{ fontWeight: 800, letterSpacing: "-0.02em" }}>
          Your journey starts here
        </h1>
        <p className="js-copy">Use the password the event team shared with you.</p>

        <label htmlFor="password" className="js-label">
          Password
        </label>
        <div style={{ position: "relative", marginTop: 8 }}>
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="#9a8a95"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)" }}
          >
            <circle cx="8" cy="15" r="4" />
            <path d="M11 12l9-9M16 7l3 3M14 9l2 2" />
          </svg>
          <input
            id="password"
            type={show ? "text" : "password"}
            autoComplete="current-password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-[14px] border bg-white py-[15px] pl-[44px] pr-12 text-base outline-none focus:ring-2"
            style={{ borderColor: error ? "#D81B60" : "#e4c3d1", color: "#16203A" }}
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5"
            style={{ color: "#8b7a86" }}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z" />
              <circle cx="12" cy="12" r="3" />
              {show && <path d="M4 4l16 16" />}
            </svg>
          </button>
        </div>
        <div role="alert" className="mt-2 min-h-[1.25rem] text-[13px] font-semibold" style={{ color: "#B0124F" }}>
          {error}
        </div>

        <button type="submit" disabled={busy || !password.trim()} className="js-btn" style={{ marginTop: 6 }}>
          {busy ? "Checking…" : "Enter my journey"}
          {!busy && <span aria-hidden>→</span>}
        </button>

        <div className="js-facts">
          <div>
            Date
            <b>Thu 8 Oct</b>
          </div>
          <div>
            Venue
            <b>TCS Siruseri</b>
          </div>
          <div>
            You see
            <b>Your sessions</b>
          </div>
        </div>
        <div className="js-hint">Trouble signing in? Ask the event coordinator.</div>
      </form>
    </JourneyShell>
  );
}
