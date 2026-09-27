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

  const newCount = items.filter((i) => !i.alreadyImported).length;
  const allCaughtUp = items.length > 0 && newCount === 0;

  return (
    <div className="space-y-4">
      {result && (
        <p className="text-sm text-emerald-400">
          Imported {result.created} video{result.created === 1 ? "" : "s"}
          {result.skipped > 0 ? `, skipped ${result.skipped} already-imported` : ""}.
        </p>
      )}
      {error && <p className="text-sm text-live">{error}</p>}

      <div className="border border-white/10 bg-white/[0.03] p-5">
        <p className="font-display text-sm font-bold text-paper">
          {items.length} video{items.length === 1 ? "" : "s"} found on your channel
          {newCount > 0 && ` — ${newCount} new`}
        </p>
        <p className="mt-1 text-xs text-paper/50">
          Every new video below is already pre-selected with its category auto-detected from the title. One click imports all of them, sorted straight into the right section — Sports to Sports, Tech to Tech, and so on.
        </p>

        {allCaughtUp ? (
          <p className="mt-4 text-sm text-gold">
            You&apos;re all caught up — every video on your channel is already imported. Upload something new on YouTube, then come back and click this again.
          </p>
        ) : items.length === 0 ? (
          <p className="mt-4 text-sm text-paper/50">No videos found on your channel yet.</p>
        ) : (
          <button
            onClick={handleImport}
            disabled={importing || selectedCount === 0}
            className="mt-4 bg-blue px-6 py-3 font-display text-sm font-bold text-paper disabled:opacity-50"
          >
            {importing ? "Importing..." : `Import All ${selectedCount} New Video${selectedCount === 1 ? "" : "s"} (Auto-Categorized)`}
          </button>
        )}
      </div>

      {items.length > 0 && (
        <details className="border border-white/10">
          <summary className="cursor-pointer px-4 py-3 font-display text-xs font-semibold text-paper/60 hover:text-paper">
            Adjust categories or uncheck individual videos (optional)
          </summary>
          <div className="border-t border-white/10">
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
        </details>
      )}
    </div>
  );
}
