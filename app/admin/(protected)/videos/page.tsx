import Link from "next/link";
import { getAllVideosForAdmin } from "@/lib/server-data";
import { VideoRowActions } from "@/components/admin/video-row-actions";

export default async function AdminVideosPage() {
  const videos = await getAllVideosForAdmin();

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-paper">Videos</h1>
          <p className="mt-1 text-sm text-paper/50">Content from any platform — YouTube, Instagram, TikTok, Facebook, or a direct link.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/videos/import" className="border border-white/10 px-4 py-2.5 font-display text-sm font-bold text-paper hover:bg-white/5">
            Import from YouTube
          </Link>
          <Link href="/admin/videos/new" className="bg-blue px-4 py-2.5 font-display text-sm font-bold text-paper">
            + Add a video
          </Link>
        </div>
      </div>

      {videos.length === 0 ? (
        <div className="border border-dashed border-white/15 p-10 text-center">
          <p className="text-paper/60">No videos yet.</p>
          <Link href="/admin/videos/new" className="mt-3 inline-block font-display text-sm font-bold text-blue-bright hover:underline">
            Add your first one
          </Link>
        </div>
      ) : (
        <div className="border border-white/10">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs text-paper/50">
                <th className="px-4 py-3 font-display font-semibold">Title</th>
                <th className="px-4 py-3 font-display font-semibold">Platform</th>
                <th className="px-4 py-3 font-display font-semibold">Category</th>
                <th className="px-4 py-3 font-display font-semibold">Status</th>
                <th className="px-4 py-3 font-display font-semibold">Featured</th>
                <th className="px-4 py-3 font-display font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {videos.map((v) => (
                <tr key={v.id} className="border-b border-white/5 last:border-0">
                  <td className="max-w-xs truncate px-4 py-3 text-paper">{v.title}</td>
                  <td className="px-4 py-3 text-paper/70">{v.videoType}</td>
                  <td className="px-4 py-3 text-paper/70">{v.category.name}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-sm px-2 py-0.5 text-xs font-semibold ${
                        v.status === "PUBLISHED"
                          ? "bg-emerald-500/15 text-emerald-400"
                          : v.status === "DRAFT"
                          ? "bg-gold/15 text-gold"
                          : "bg-white/10 text-paper/50"
                      }`}
                    >
                      {v.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-paper/70">{v.isFeatured ? "Yes" : "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link href={`/admin/videos/${v.id}/edit`} className="font-display text-xs font-semibold text-blue-bright hover:underline">
                        Edit
                      </Link>
                      <VideoRowActions id={v.id} title={v.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
