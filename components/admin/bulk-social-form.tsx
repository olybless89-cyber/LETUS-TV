"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export function BulkSocialForm() {
  const router = useRouter();
  const [urls, setUrls] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ created: number; skipped: { url: string; reason: string }[] } | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/admin/social/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setLoading(false);
        return;
      }
      setResult(data);
      setUrls("");
      router.refresh();
    } catch {
      setError("Could not reach the server. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
      <div>
        <label className="font-display text-xs font-semibold text-paper/60">Paste URLs, one per line</label>
        <textarea
          required
          rows={10}
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
          placeholder={"https://www.instagram.com/p/...\nhttps://www.tiktok.com/@letustv/video/...\nhttps://www.facebook.com/.../videos/..."}
          className="mt-1 w-full border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs text-paper focus:border-blue-bright focus:outline-none"
        />
        <p className="mt-1 text-xs text-paper/40">
          Platform is detected automatically from each URL. Mix Instagram, TikTok, and Facebook links freely.
        </p>
      </div>

      {error && <p className="text-sm text-live">{error}</p>}

      {result && (
        <div className="space-y-2 border border-white/10 bg-white/[0.03] p-4">
          <p className="text-sm text-emerald-400">Added {result.created} post{result.created === 1 ? "" : "s"}.</p>
          {result.skipped.length > 0 && (
            <div>
              <p className="text-xs text-paper/60">Skipped {result.skipped.length}:</p>
              <ul className="mt-1 space-y-1 text-xs text-paper/50">
                {result.skipped.map((s, i) => (
                  <li key={i} className="truncate">{s.url} — {s.reason}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue px-5 py-2.5 font-display text-sm font-bold text-paper disabled:opacity-60"
      >
        {loading ? "Adding..." : "Add all"}
      </button>
    </form>
  );
}
