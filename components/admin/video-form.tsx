"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

type Category = { id: string; name: string };

type VideoInitial = {
  id?: string;
  title: string;
  slug: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  videoType: string;
  categoryId: string;
  status: string;
  isFeatured: boolean;
  duration: string;
};

const PLATFORMS = [
  { value: "YOUTUBE", label: "YouTube" },
  { value: "INSTAGRAM", label: "Instagram" },
  { value: "TIKTOK", label: "TikTok" },
  { value: "FACEBOOK", label: "Facebook" },
  { value: "EXTERNAL", label: "Other / External link" },
  { value: "SELF_HOSTED", label: "Self-hosted file" },
];

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function VideoForm({
  categories,
  initial,
}: {
  categories: Category[];
  initial?: VideoInitial;
}) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);

  const [form, setForm] = useState<VideoInitial>(
    initial ?? {
      title: "",
      slug: "",
      description: "",
      thumbnailUrl: "",
      videoUrl: "",
      videoType: "YOUTUBE",
      categoryId: categories[0]?.id ?? "",
      status: "PUBLISHED",
      isFeatured: false,
      duration: "",
    }
  );
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleTitleChange(title: string) {
    setForm((f) => ({
      ...f,
      title,
      slug: slugTouched ? f.slug : slugify(title),
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      title: form.title,
      slug: form.slug,
      description: form.description || null,
      thumbnailUrl: form.thumbnailUrl || null,
      videoUrl: form.videoUrl,
      videoType: form.videoType,
      categoryId: form.categoryId,
      status: form.status,
      isFeatured: form.isFeatured,
      duration: form.duration || null,
    };

    try {
      const res = await fetch(isEdit ? `/api/admin/videos/${initial!.id}` : "/api/admin/videos", {
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
      router.push("/admin/videos");
      router.refresh();
    } catch {
      setError("Could not reach the server. Try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      <div>
        <label className="font-display text-xs font-semibold text-paper/60">Title</label>
        <input
          required
          value={form.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="mt-1 w-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-paper focus:border-blue-bright focus:outline-none"
        />
      </div>

      <div>
        <label className="font-display text-xs font-semibold text-paper/60">Slug</label>
        <input
          required
          value={form.slug}
          onChange={(e) => {
            setSlugTouched(true);
            setForm((f) => ({ ...f, slug: e.target.value }));
          }}
          className="mt-1 w-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-paper focus:border-blue-bright focus:outline-none"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="font-display text-xs font-semibold text-paper/60">Platform</label>
          <select
            value={form.videoType}
            onChange={(e) => setForm((f) => ({ ...f, videoType: e.target.value }))}
            className="mt-1 w-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-paper focus:border-blue-bright focus:outline-none"
          >
            {PLATFORMS.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="font-display text-xs font-semibold text-paper/60">Category</label>
          <select
            required
            value={form.categoryId}
            onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
            className="mt-1 w-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-paper focus:border-blue-bright focus:outline-none"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="font-display text-xs font-semibold text-paper/60">Video URL</label>
        <input
          required
          type="url"
          placeholder="https://..."
          value={form.videoUrl}
          onChange={(e) => setForm((f) => ({ ...f, videoUrl: e.target.value }))}
          className="mt-1 w-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-paper focus:border-blue-bright focus:outline-none"
        />
        <p className="mt-1 text-xs text-paper/40">Paste the link from YouTube, Instagram, TikTok, Facebook, or anywhere else. This is where viewers will be sent.</p>
      </div>

      <div>
        <label className="font-display text-xs font-semibold text-paper/60">Thumbnail image URL (optional)</label>
        <input
          type="url"
          placeholder="https://..."
          value={form.thumbnailUrl}
          onChange={(e) => setForm((f) => ({ ...f, thumbnailUrl: e.target.value }))}
          className="mt-1 w-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-paper focus:border-blue-bright focus:outline-none"
        />
        <p className="mt-1 text-xs text-paper/40">For YouTube, you can use https://i.ytimg.com/vi/VIDEO_ID/hqdefault.jpg</p>
      </div>

      <div>
        <label className="font-display text-xs font-semibold text-paper/60">Description (optional)</label>
        <textarea
          rows={3}
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          className="mt-1 w-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-paper focus:border-blue-bright focus:outline-none"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label className="font-display text-xs font-semibold text-paper/60">Status</label>
          <select
            value={form.status}
            onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
            className="mt-1 w-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-paper focus:border-blue-bright focus:outline-none"
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
        <div>
          <label className="font-display text-xs font-semibold text-paper/60">Duration (optional)</label>
          <input
            placeholder="e.g. 4:32"
            value={form.duration}
            onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
            className="mt-1 w-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-paper focus:border-blue-bright focus:outline-none"
          />
        </div>
        <div className="flex items-end pb-2.5">
          <label className="flex items-center gap-2 text-sm text-paper">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(e) => setForm((f) => ({ ...f, isFeatured: e.target.checked }))}
              className="h-4 w-4"
            />
            Feature on homepage
          </label>
        </div>
      </div>

      {error && <p className="text-sm text-live">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue px-5 py-2.5 font-display text-sm font-bold text-paper disabled:opacity-60"
        >
          {loading ? "Saving..." : isEdit ? "Save changes" : "Add video"}
        </button>
      </div>
    </form>
  );
}
