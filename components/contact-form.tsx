"use client";

import { useState, type FormEvent } from "react";

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="border border-line bg-paper-raised p-6">
        <p className="font-display font-semibold text-ink">Message sent.</p>
        <p className="mt-1 text-sm text-ink-soft">We&apos;ll get back to you soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border border-line bg-paper-raised p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="font-display text-xs font-semibold text-ink-soft">Name</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="mt-1 w-full border border-line bg-transparent px-3 py-2 text-sm focus:border-blue focus:outline-none"
          />
        </div>
        <div>
          <label className="font-display text-xs font-semibold text-ink-soft">Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="mt-1 w-full border border-line bg-transparent px-3 py-2 text-sm focus:border-blue focus:outline-none"
          />
        </div>
      </div>
      <div>
        <label className="font-display text-xs font-semibold text-ink-soft">Subject</label>
        <input
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          className="mt-1 w-full border border-line bg-transparent px-3 py-2 text-sm focus:border-blue focus:outline-none"
        />
      </div>
      <div>
        <label className="font-display text-xs font-semibold text-ink-soft">Message</label>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="mt-1 w-full border border-line bg-transparent px-3 py-2 text-sm focus:border-blue focus:outline-none"
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="bg-blue px-5 py-2.5 font-display text-sm font-bold text-paper disabled:opacity-60"
      >
        {status === "loading" ? "Sending..." : "Send message"}
      </button>
      {status === "error" && (
        <p className="text-sm text-live">Something went wrong. Please try again.</p>
      )}
    </form>
  );
}
