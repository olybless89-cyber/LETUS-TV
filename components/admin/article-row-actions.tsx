"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ArticleRowActions({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm(`Delete "${title}"? This can't be undone.`)) return;
    setDeleting(true);
    const res = await fetch(`/api/admin/news/${id}`, { method: "DELETE" });
    if (res.ok) {
      router.refresh();
    } else {
      alert("Could not delete this article.");
      setDeleting(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="font-display text-xs font-semibold text-live hover:underline disabled:opacity-50"
    >
      {deleting ? "..." : "Delete"}
    </button>
  );
}
