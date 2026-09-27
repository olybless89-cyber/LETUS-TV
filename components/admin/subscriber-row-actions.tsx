"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SubscriberRowActions({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Remove this subscriber?")) return;
    setLoading(true);
    const res = await fetch(`/api/admin/subscribers/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
    else setLoading(false);
  }

  return (
    <button onClick={handleDelete} disabled={loading} className="font-display text-xs font-semibold text-live hover:underline disabled:opacity-50">
      Remove
    </button>
  );
}
