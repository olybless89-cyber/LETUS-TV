"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

type Initial = {
  id?: string;
  platform: string;
  url: string;
  caption: string;
  isActive: boolean;
  order: number;
};

export function SocialPostForm({ initial }: { initial?: Initial }) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);

  const [form, setForm] = useState<Initial>(
    initial ?? { platform: "INSTAGRAM", url: "", caption: "", isActive: true, order: 0 }
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      platform: form.platform,
      url: form.url,
      caption: form.caption || null,
      isActive: form.isActive,
      order: Number(form.order) || 0,
    };

    try {
      const res = await fetch(isEdit ? `/api/admin/social/${initial!.id}` : "/api/admin/social", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setLoading(false);
        return;
      }
      router.push("/admin/social");
      router.refresh();
    } catch {
      setError("Could not reach the server. Try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
      <div>
        <label className="font-display text-xs font-semibold text-paper/60">Platform</label>
        <select
          value={form.platform}
          onChange={(e) => setForm((f) => ({ ...f, platform: e.target.value }))}
          className="mt-1 w-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-paper focus:border-blue-bright focus:outline-none"
        >
          <option value="INSTAGRAM">Instagram</option>
          <option value="TIKTOK">TikTok</option>
          <option value="FACEBOOK">Facebook</option>
        </select>
      </div>

      <div>
        <label className="font-display text-xs font-semibold text-paper/60">Post URL</label>
        <input
          required
          type="url"
          placeholder="https://www.instagram.com/p/..."
          value={form.url}
          onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
          className="mt-1 w-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-paper focus:border-blue-bright focus:outline-none"
        />
        <p className="mt-1 text-xs text-paper/40">
          Instagram: the post/reel permalink (instagram.com/p/... or /reel/...). TikTok: the video URL (tiktok.com/@user/video/...).
          Facebook: the post or video permalink.
        </p>
      </div>

      <div>
        <label className="font-display text-xs font-semibold text-paper/60">Caption (optional)</label>
        <input
          value={form.caption}
          onChange={(e) => setForm((f) => ({ ...f, caption: e.target.value }))}
          className="mt-1 w-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-paper focus:border-blue-bright focus:outline-none"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="font-display text-xs font-semibold text-paper/60">Order (lower shows first)</label>
          <input
            type="number"
            value={form.order}
            onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) }))}
            className="mt-1 w-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-paper focus:border-blue-bright focus:outline-none"
          />
        </div>
        <div className="flex items-end pb-2.5">
          <label className="flex items-center gap-2 text-sm text-paper">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
              className="h-4 w-4"
            />
            Show on site
          </label>
        </div>
      </div>

      {error && <p className="text-sm text-live">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue px-5 py-2.5 font-display text-sm font-bold text-paper disabled:opacity-60"
      >
        {loading ? "Saving..." : isEdit ? "Save changes" : "Add post"}
      </button>
    </form>
  );
}
