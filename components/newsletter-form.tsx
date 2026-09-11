"use client";

import { useState, type FormEvent } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return <p className="mt-4 text-sm text-gold">You&apos;re subscribed. Welcome aboard.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@email.com"
        className="w-full min-w-0 rounded-sm border border-white/20 bg-white/5 px-3 py-2 text-sm text-paper placeholder:text-paper/40 focus:border-gold focus:outline-none"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="shrink-0 rounded-sm bg-gold px-4 py-2 text-sm font-display font-semibold text-blue-deep disabled:opacity-60"
      >
        {status === "loading" ? "..." : "Join"}
      </button>
      {status === "error" && (
        <span className="sr-only">Something went wrong. Try again.</span>
      )}
    </form>
  );
}
