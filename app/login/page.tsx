"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Password gate. The password decides whose journey loads (see
 * lib/server/auth.ts); the page never says who the password belongs to.
 */
export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
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
    <main
      className="fixed inset-0 flex items-center justify-center overflow-hidden px-5"
      style={{ background: "linear-gradient(180deg, #FBE8D2, #F2C2D6)" }}
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: "url(/welcome/campus.jpg) 50% 50% / cover no-repeat",
          filter: "blur(14px)",
          opacity: 0.55,
          transform: "scale(1.06)",
        }}
      />
      <form
        onSubmit={submit}
        className="relative w-full max-w-[420px] rounded-[26px] px-6 py-7 text-center"
        style={{
          background: "rgba(255,246,238,.82)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "2px solid rgba(255,105,170,.92)",
          boxShadow: "0 18px 50px rgba(120,20,80,.22)",
        }}
      >
        <div
          className="text-[12px] font-extrabold uppercase tracking-[0.24em]"
          style={{ color: "#9E0F48" }}
        >
          A day across the TCS Siruseri
        </div>
        <h1
          className="font-display mt-2 text-4xl font-extrabold"
          style={{ color: "#16203A", lineHeight: 1.04, letterSpacing: "-0.02em" }}
        >
          Welcome to TCS
        </h1>
        <p className="mt-2 text-sm" style={{ color: "#2F2836" }}>
          Enter your password to see your journey.
        </p>

        <label htmlFor="password" className="sr-only">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="mt-5 w-full rounded-full border px-4 py-3 text-center text-base outline-none focus:ring-2"
          style={{
            background: "rgba(255,255,255,.95)",
            borderColor: error ? "#D81B60" : "rgba(33,26,35,.18)",
            color: "#16203A",
          }}
        />
        <div role="alert" className="mt-2 min-h-[1.25rem] text-[13px] font-semibold" style={{ color: "#B0124F" }}>
          {error}
        </div>

        <button
          type="submit"
          disabled={busy || !password.trim()}
          className="mt-2 w-full rounded-full px-4 py-3 text-sm font-bold text-white disabled:opacity-60"
          style={{ background: "#D81B60", boxShadow: "0 8px 24px rgba(120,20,80,.25)" }}
        >
          {busy ? "Checking…" : "Enter"}
        </button>
      </form>
    </main>
  );
}
