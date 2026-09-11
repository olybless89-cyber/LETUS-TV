"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function PollRowActions({ id, isActive }: { id: string; isActive: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    setLoading(true);
    const res = await fetch(`/api/admin/polls/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    if (res.ok) router.refresh();
    else alert("Could not update this poll.");
    setLoading(false);
  }

  async function handleDelete() {
    if (!confirm("Delete this poll and all its votes? This can't be undone.")) return;
    setLoading(true);
    const res = await fetch(`/api/admin/polls/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
    else {
      alert("Could not delete this poll.");
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleToggle}
        disabled={loading}
        className="font-display text-xs font-semibold text-blue-bright hover:underline disabled:opacity-50"
      >
        {isActive ? "Deactivate" : "Activate"}
      </button>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="font-display text-xs font-semibold text-live hover:underline disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  );
}
