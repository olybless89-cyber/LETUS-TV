"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

type LiveInitial = {
  streamUrl: string;
  streamType: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  isLive: boolean;
  isVisible: boolean;
};

export function LiveForm({ initial }: { initial: LiveInitial }) {
  const router = useRouter();
  const [form, setForm] = useState<LiveInitial>(initial);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSaved(false);

    try {
      const res = await fetch("/api/admin/live", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          streamUrl: form.streamUrl || null,
          streamType: form.streamType,
          title: form.title || null,
          description: form.description || null,
          thumbnailUrl: form.thumbnailUrl || null,
          isLive: form.isLive,
          isVisible: form.isVisible,
        }),
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
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      <div>
        <label className="font-display text-xs font-semibold text-paper/60">Live stream URL</label>
        <input
          type="url"
          placeholder="https://..."
          value={form.streamUrl}
          onChange={(e) => setForm((f) => ({ ...f, streamUrl: e.target.value }))}
          className="mt-1 w-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-paper focus:border-blue-bright focus:outline-none"
        />
        <p className="mt-1 text-xs text-paper/40">
          Leave blank if you just want the site to link straight to your YouTube channel (default behavior).
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="font-display text-xs font-semibold text-paper/60">Stream type</label>
          <select
            value={form.streamType}
            onChange={(e) => setForm((f) => ({ ...f, streamType: e.target.value }))}
            className="mt-1 w-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-paper focus:border-blue-bright focus:outline-none"
          >
            <option value="YOUTUBE">YouTube</option>
            <option value="HLS">HLS stream</option>
            <option value="EMBED">Embed URL</option>
            <option value="EXTERNAL">External link</option>
          </select>
        </div>
        <div>
          <label className="font-display text-xs font-semibold text-paper/60">Title</label>
          <input
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="mt-1 w-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-paper focus:border-blue-bright focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="font-display text-xs font-semibold text-paper/60">Description</label>
        <textarea
          rows={3}
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          className="mt-1 w-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-paper focus:border-blue-bright focus:outline-none"
        />
      </div>

      <div>
        <label className="font-display text-xs font-semibold text-paper/60">Thumbnail image URL</label>
        <input
          type="url"
          value={form.thumbnailUrl}
          onChange={(e) => setForm((f) => ({ ...f, thumbnailUrl: e.target.value }))}
          className="mt-1 w-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-paper focus:border-blue-bright focus:outline-none"
        />
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-paper">
          <input
            type="checkbox"
            checked={form.isLive}
            onChange={(e) => setForm((f) => ({ ...f, isLive: e.target.checked }))}
            className="h-4 w-4"
          />
          Currently live
        </label>
        <label className="flex items-center gap-2 text-sm text-paper">
          <input
            type="checkbox"
            checked={form.isVisible}
            onChange={(e) => setForm((f) => ({ ...f, isVisible: e.target.checked }))}
            className="h-4 w-4"
          />
          Show on site
        </label>
      </div>

      {error && <p className="text-sm text-live">{error}</p>}
      {saved && !error && <p className="text-sm text-emerald-400">Saved.</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue px-5 py-2.5 font-display text-sm font-bold text-paper disabled:opacity-60"
      >
        {loading ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
