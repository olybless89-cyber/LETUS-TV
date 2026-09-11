"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

type Category = { id: string; name: string };

type Initial = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  featuredImage: string;
  categoryId: string;
  status: string;
  isFeatured: boolean;
  isBreaking: boolean;
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function ArticleForm({ categories, initial }: { categories: Category[]; initial?: Initial }) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);

  const [form, setForm] = useState<Initial>(
    initial ?? {
      title: "",
      slug: "",
      excerpt: "",
      body: "",
      featuredImage: "",
      categoryId: categories[0]?.id ?? "",
      status: "PUBLISHED",
      isFeatured: false,
      isBreaking: false,
    }
  );
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleTitleChange(title: string) {
    setForm((f) => ({ ...f, title, slug: slugTouched ? f.slug : slugify(title) }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt || null,
      body: form.body,
      featuredImage: form.featuredImage || null,
      categoryId: form.categoryId,
      status: form.status,
      isFeatured: form.isFeatured,
      isBreaking: form.isBreaking,
    };

    try {
      const res = await fetch(isEdit ? `/api/admin/news/${initial!.id}` : "/api/admin/news", {
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
      router.push("/admin/news");
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

      <div>
        <label className="font-display text-xs font-semibold text-paper/60">Featured image URL (optional)</label>
        <input
          type="url"
          placeholder="https://..."
          value={form.featuredImage}
          onChange={(e) => setForm((f) => ({ ...f, featuredImage: e.target.value }))}
          className="mt-1 w-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-paper focus:border-blue-bright focus:outline-none"
        />
      </div>

      <div>
        <label className="font-display text-xs font-semibold text-paper/60">Excerpt (optional)</label>
        <textarea
          rows={2}
          value={form.excerpt}
          onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
          placeholder="A short one or two sentence summary shown on cards."
          className="mt-1 w-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-paper focus:border-blue-bright focus:outline-none"
        />
      </div>

      <div>
        <label className="font-display text-xs font-semibold text-paper/60">Body</label>
        <textarea
          required
          rows={14}
          value={form.body}
          onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
          placeholder={"Write the story here.\n\nLeave a blank line between paragraphs — each one becomes its own paragraph on the page."}
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
        <div className="flex items-end pb-2.5">
          <label className="flex items-center gap-2 text-sm text-paper">
            <input
              type="checkbox"
              checked={form.isBreaking}
              onChange={(e) => setForm((f) => ({ ...f, isBreaking: e.target.checked }))}
              className="h-4 w-4"
            />
            Mark as breaking
          </label>
        </div>
      </div>

      {error && <p className="text-sm text-live">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue px-5 py-2.5 font-display text-sm font-bold text-paper disabled:opacity-60"
      >
        {loading ? "Saving..." : isEdit ? "Save changes" : "Publish article"}
      </button>
    </form>
  );
}
