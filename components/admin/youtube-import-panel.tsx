"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Item = {
  youtubeId: string;
  title: string;
  thumbnailUrl: string;
  publishedAt: string;
  slug: string;
  alreadyImported: boolean;
  suggestedCategoryId: string | null;
};

type Category = { id: string; name: string };

export function YouTubeImportPanel() {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [categoryChoice, setCategoryChoice] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ created: number; skipped: number } | null>(null);

  useEffect(() => {
    fetch("/api/admin/videos/import")
      .then((res) => res.json())
      .then((data) => {
        setItems(data.items ?? []);
        setCategories(data.categories ?? []);
        const initialSelected: Record<string, boolean> = {};
        const initialCategory: Record<string, string> = {};
        for (const item of data.items ?? []) {
          initialSelected[item.youtubeId] = !item.alreadyImported;
          initialCategory[item.youtubeId] = item.suggestedCategoryId ?? data.categories?.[0]?.id ?? "";
        }
        setSelected(initialSelected);
        setCategoryChoice(initialCategory);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load your channel's videos.");
        setLoading(false);
      });
  }, []);

  async function handleImport() {
    const selections = items
      .filter((item) => selected[item.youtubeId] && !item.alreadyImported)
      .map((item) => ({
        youtubeId: item.youtubeId,
        title: item.title,
        thumbnailUrl: item.thumbnailUrl,
        publishedAt: item.publishedAt,
        categoryId: categoryChoice[item.youtubeId],
      }));

    if (selections.length === 0) {
      setError("Select at least one video to import.");
      return;
    }

    setImporting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/videos/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selections }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setImporting(false);
        return;
      }
      setResult(data);
      router.refresh();
    } catch {
      setError("Could not reach the server. Try again.");
    } finally {
      setImporting(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-paper/50">Loading your channel&apos;s videos...</p>;
  }

  if (error && items.length === 0) {
    return <p className="text-sm text-live">{error}</p>;
  }

  const selectedCount = items.filter((i) => selected[i.youtubeId] && !i.alreadyImported).length;

  return (
    <div className="space-y-4">
      {result && (
        <p className="text-sm text-emerald-400">
          Imported {result.created} video{result.created === 1 ? "" : "s"}
          {result.skipped > 0 ? `, skipped ${result.skipped} already-imported` : ""}.
        </p>
      )}
      {error && <p className="text-sm text-live">{error}</p>}

      <div className="flex items-center justify-between">
        <p className="text-sm text-paper/60">{items.length} videos found on your channel.</p>
        <button
          onClick={handleImport}
          disabled={importing || selectedCount === 0}
          className="bg-blue px-5 py-2.5 font-display text-sm font-bold text-paper disabled:opacity-50"
        >
          {importing ? "Importing..." : `Import ${selectedCount} selected`}
        </button>
      </div>

      <div className="border border-white/10">
        {items.map((item) => (
          <div
            key={item.youtubeId}
            className={`flex items-center gap-4 border-b border-white/5 p-3 last:border-0 ${
              item.alreadyImported ? "opacity-40" : ""
            }`}
          >
            <input
              type="checkbox"
              checked={!!selected[item.youtubeId] && !item.alreadyImported}
              disabled={item.alreadyImported}
              onChange={(e) => setSelected((s) => ({ ...s, [item.youtubeId]: e.target.checked }))}
              className="h-4 w-4"
            />
            <img src={item.thumbnailUrl} alt={item.title} className="h-12 w-20 shrink-0 object-cover" />
            <span className="min-w-0 flex-1 truncate text-sm text-paper">
              {item.title}
              {item.alreadyImported && <span className="ml-2 text-xs text-paper/40">(already imported)</span>}
            </span>
            <select
              value={categoryChoice[item.youtubeId] ?? ""}
              disabled={item.alreadyImported}
              onChange={(e) => setCategoryChoice((c) => ({ ...c, [item.youtubeId]: e.target.value }))}
              className="shrink-0 border border-white/10 bg-white/5 px-2 py-1 text-xs text-paper"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
