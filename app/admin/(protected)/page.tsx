import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function AdminDashboard() {
  const [total, published, draft, featured] = await Promise.all([
    prisma.video.count(),
    prisma.video.count({ where: { status: "PUBLISHED" } }),
    prisma.video.count({ where: { status: "DRAFT" } }),
    prisma.video.count({ where: { isFeatured: true, status: "PUBLISHED" } }),
  ]);

  const stats = [
    { label: "Total videos", value: total },
    { label: "Published", value: published },
    { label: "Drafts", value: draft },
    { label: "Featured", value: featured },
  ];

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-paper">Dashboard</h1>
        <p className="mt-1 text-sm text-paper/50">Overview of your content.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="border border-white/10 bg-white/[0.03] p-4">
            <p className="font-display text-2xl font-bold text-paper">{s.value}</p>
            <p className="mt-1 text-xs text-paper/50">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/admin/videos/new" className="bg-blue px-4 py-2.5 font-display text-sm font-bold text-paper">
          + Add a video
        </Link>
        <Link href="/admin/live" className="border border-white/10 px-4 py-2.5 font-display text-sm font-bold text-paper hover:bg-white/5">
          Manage live feed
        </Link>
        <Link href="/" target="_blank" className="border border-white/10 px-4 py-2.5 font-display text-sm font-bold text-paper hover:bg-white/5">
          View site →
        </Link>
      </div>
    </div>
  );
}
