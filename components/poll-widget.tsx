"use client";

import { useState } from "react";

type Option = { id: string; label: string; votes: number };
type PollData = { id: string; question: string; options: Option[] };

export function PollWidget({ poll }: { poll: PollData }) {
  const [current, setCurrent] = useState(poll);
  const [voted, setVoted] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const total = current.options.reduce((sum, o) => sum + o.votes, 0);

  async function handleVote() {
    if (!selected) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/polls/${current.id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionId: selected }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not submit your vote.");
        if (data.poll) setCurrent(data.poll);
        setVoted(true);
        setLoading(false);
        return;
      }
      setCurrent(data.poll);
      setVoted(true);
    } catch {
      setError("Could not reach the server. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border border-line bg-white">
      <div className="flex items-center justify-between bg-blue-deep px-6 py-4">
        <span className="font-display text-lg font-bold text-gold">Your Opinion Matters</span>
      </div>
      <div className="p-6 sm:p-8">
        <h3 className="font-display text-xl font-bold text-ink sm:text-2xl">{current.question}</h3>

        {!voted ? (
          <div className="mt-5 space-y-3">
            {current.options.map((opt) => (
              <label
                key={opt.id}
                className="flex cursor-pointer items-center gap-3 border border-line px-4 py-3 hover:bg-paper"
              >
                <input
                  type="radio"
                  name="poll-option"
                  checked={selected === opt.id}
                  onChange={() => setSelected(opt.id)}
                  className="h-4 w-4"
                />
                <span className="text-ink">{opt.label}</span>
              </label>
            ))}
            {error && <p className="text-sm text-live">{error}</p>}
            <button
              onClick={handleVote}
              disabled={!selected || loading}
              className="mt-2 bg-blue px-5 py-2.5 font-display text-sm font-bold text-paper disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Vote"}
            </button>
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            {error && <p className="mb-2 text-sm text-live">{error}</p>}
            {current.options.map((opt) => {
              const pct = total > 0 ? Math.round((opt.votes / total) * 100) : 0;
              return (
                <div key={opt.id}>
                  <div className="flex justify-between text-sm text-ink">
                    <span>{opt.label}</span>
                    <span className="text-ink-soft">{pct}%</span>
                  </div>
                  <div className="mt-1 h-2 w-full bg-line">
                    <div className="h-2 bg-blue" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
            <p className="pt-2 text-xs text-ink-soft">{total} total vote{total === 1 ? "" : "s"}</p>
          </div>
        )}
      </div>
    </div>
  );
}
