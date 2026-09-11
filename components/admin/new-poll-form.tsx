"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export function NewPollForm() {
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function updateOption(i: number, value: string) {
    setOptions((opts) => opts.map((o, idx) => (idx === i ? value : o)));
  }

  function addOption() {
    if (options.length >= 8) return;
    setOptions((opts) => [...opts, ""]);
  }

  function removeOption(i: number) {
    if (options.length <= 2) return;
    setOptions((opts) => opts.filter((_, idx) => idx !== i));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const cleanOptions = options.map((o) => o.trim()).filter(Boolean);
    if (cleanOptions.length < 2) {
      setError("Add at least two options.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/polls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, options: cleanOptions, isActive: true }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setLoading(false);
        return;
      }
      router.push("/admin/polls");
      router.refresh();
    } catch {
      setError("Could not reach the server. Try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
      <div>
        <label className="font-display text-xs font-semibold text-paper/60">Question</label>
        <input
          required
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="What is your position on subsidy?"
          className="mt-1 w-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-paper focus:border-blue-bright focus:outline-none"
        />
      </div>

      <div>
        <label className="font-display text-xs font-semibold text-paper/60">Options</label>
        <div className="mt-1 space-y-2">
          {options.map((opt, i) => (
            <div key={i} className="flex gap-2">
              <input
                required
                value={opt}
                onChange={(e) => updateOption(i, e.target.value)}
                placeholder={`Option ${i + 1}`}
                className="w-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-paper focus:border-blue-bright focus:outline-none"
              />
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOption(i)}
                  className="px-2 text-paper/50 hover:text-live"
                  aria-label="Remove option"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
        {options.length < 8 && (
          <button
            type="button"
            onClick={addOption}
            className="mt-2 font-display text-xs font-semibold text-blue-bright hover:underline"
          >
            + Add option
          </button>
        )}
      </div>

      <p className="text-xs text-paper/40">
        This poll will become the active one shown on the homepage — any currently active poll will be deactivated automatically.
      </p>

      {error && <p className="text-sm text-live">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue px-5 py-2.5 font-display text-sm font-bold text-paper disabled:opacity-60"
      >
        {loading ? "Creating..." : "Create poll"}
      </button>
    </form>
  );
}
