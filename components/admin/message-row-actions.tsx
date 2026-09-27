"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function MessageRowActions({ id, isRead }: { id: string; isRead: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleMarkRead() {
    setLoading(true);
    const res = await fetch(`/api/admin/messages/${id}`, { method: "PATCH" });
    if (res.ok) router.refresh();
    setLoading(false);
  }

  async function handleDelete() {
    if (!confirm("Delete this message?")) return;
    setLoading(true);
    const res = await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
    else setLoading(false);
  }

  return (
    <div className="flex items-center gap-3">
      {!isRead && (
        <button onClick={handleMarkRead} disabled={loading} className="font-display text-xs font-semibold text-blue-bright hover:underline disabled:opacity-50">
          Mark read
        </button>
      )}
      <button onClick={handleDelete} disabled={loading} className="font-display text-xs font-semibold text-live hover:underline disabled:opacity-50">
        Delete
      </button>
    </div>
  );
}
