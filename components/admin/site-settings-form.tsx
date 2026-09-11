"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

type Initial = {
  siteName: string;
  tagline: string;
  description: string;
  contactEmail: string;
  phone: string;
  address: string;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  tiktokUrl: string;
  twitterUrl: string;
  conversationCtaEnabled: boolean;
  conversationCtaHeading: string;
  conversationCtaText: string;
  conversationCtaUrl: string;
  conversationCtaButtonText: string;
  audioRoomsEnabled: boolean;
  audioRoomsHeading: string;
  audioRoomsText: string;
};

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="font-display text-xs font-semibold text-paper/60">{label}</label>
      <div className="mt-1">{children}</div>
      {hint && <p className="mt-1 text-xs text-paper/40">{hint}</p>}
    </div>
  );
}

const inputClass =
  "w-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-paper focus:border-blue-bright focus:outline-none";

export function SiteSettingsForm({ initial }: { initial: Initial }) {
  const router = useRouter();
  const [form, setForm] = useState<Initial>(initial);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  function set<K extends keyof Initial>(key: K, value: Initial[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSaved(false);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setLoading(false);
        return;
      }
      setSaved(true);
      router.refresh();
    } catch {
      setError("Could not reach the server. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-10">
      <section className="space-y-5">
        <h2 className="font-display text-sm font-bold text-paper">General</h2>
        <Field label="Site name">
          <input required value={form.siteName} onChange={(e) => set("siteName", e.target.value)} className={inputClass} />
        </Field>
        <Field label="Tagline">
          <input value={form.tagline} onChange={(e) => set("tagline", e.target.value)} className={inputClass} />
        </Field>
        <Field label="Description">
          <textarea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} className={inputClass} />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Contact email">
            <input type="email" value={form.contactEmail} onChange={(e) => set("contactEmail", e.target.value)} className={inputClass} />
          </Field>
          <Field label="Phone">
            <input value={form.phone} onChange={(e) => set("phone", e.target.value)} className={inputClass} />
          </Field>
        </div>
        <Field label="Address">
          <input value={form.address} onChange={(e) => set("address", e.target.value)} className={inputClass} />
        </Field>
      </section>

      <section className="space-y-5">
        <h2 className="font-display text-sm font-bold text-paper">Social links</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="YouTube"><input value={form.youtubeUrl} onChange={(e) => set("youtubeUrl", e.target.value)} className={inputClass} /></Field>
          <Field label="Instagram"><input value={form.instagramUrl} onChange={(e) => set("instagramUrl", e.target.value)} className={inputClass} /></Field>
          <Field label="TikTok"><input value={form.tiktokUrl} onChange={(e) => set("tiktokUrl", e.target.value)} className={inputClass} /></Field>
          <Field label="Facebook"><input value={form.facebookUrl} onChange={(e) => set("facebookUrl", e.target.value)} className={inputClass} /></Field>
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-sm font-bold text-paper">&quot;Join the Conversation&quot; card</h2>
          <label className="flex items-center gap-2 text-xs text-paper">
            <input type="checkbox" checked={form.conversationCtaEnabled} onChange={(e) => set("conversationCtaEnabled", e.target.checked)} className="h-4 w-4" />
            Show on site
          </label>
        </div>
        <p className="text-xs text-paper/40">
          A real call-to-action card pointing wherever you want engagement to go — your WhatsApp group, Telegram, comments, or anywhere else. Not a fake live activity feed.
        </p>
        <Field label="Heading"><input value={form.conversationCtaHeading} onChange={(e) => set("conversationCtaHeading", e.target.value)} placeholder="Join the conversation" className={inputClass} /></Field>
        <Field label="Text"><textarea rows={2} value={form.conversationCtaText} onChange={(e) => set("conversationCtaText", e.target.value)} className={inputClass} /></Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Destination URL"><input type="url" value={form.conversationCtaUrl} onChange={(e) => set("conversationCtaUrl", e.target.value)} placeholder="https://chat.whatsapp.com/..." className={inputClass} /></Field>
          <Field label="Button text"><input value={form.conversationCtaButtonText} onChange={(e) => set("conversationCtaButtonText", e.target.value)} placeholder="Join the conversation" className={inputClass} /></Field>
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-sm font-bold text-paper">&quot;Audio Rooms&quot; promo card</h2>
          <label className="flex items-center gap-2 text-xs text-paper">
            <input type="checkbox" checked={form.audioRoomsEnabled} onChange={(e) => set("audioRoomsEnabled", e.target.checked)} className="h-4 w-4" />
            Show on site
          </label>
        </div>
        <p className="text-xs text-paper/40">
          A &quot;coming soon&quot; teaser card — live audio rooms aren&apos;t built yet, so this is honest about that rather than pretending the feature exists.
        </p>
        <Field label="Heading"><input value={form.audioRoomsHeading} onChange={(e) => set("audioRoomsHeading", e.target.value)} placeholder="Audio Rooms are coming" className={inputClass} /></Field>
        <Field label="Text"><textarea rows={2} value={form.audioRoomsText} onChange={(e) => set("audioRoomsText", e.target.value)} className={inputClass} /></Field>
      </section>

      {error && <p className="text-sm text-live">{error}</p>}
      {saved && !error && <p className="text-sm text-emerald-400">Saved.</p>}

      <button type="submit" disabled={loading} className="bg-blue px-5 py-2.5 font-display text-sm font-bold text-paper disabled:opacity-60">
        {loading ? "Saving..." : "Save settings"}
      </button>
    </form>
  );
}
