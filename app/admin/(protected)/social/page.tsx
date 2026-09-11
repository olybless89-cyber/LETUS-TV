import Link from "next/link";
import { getAllSocialPostsForAdmin } from "@/lib/server-data";
import { SocialPostRowActions } from "@/components/admin/social-post-row-actions";

export default async function AdminSocialPage() {
  const posts = await getAllSocialPostsForAdmin();

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-paper">Social Posts</h1>
          <p className="mt-1 text-sm text-paper/50">
            Real embedded posts from Instagram, TikTok, or Facebook — shown on the homepage.
          </p>
        </div>
        <Link href="/admin/social/new" className="bg-blue px-4 py-2.5 font-display text-sm font-bold text-paper">
          + Add a post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="border border-dashed border-white/15 p-10 text-center">
          <p className="text-paper/60">No social posts yet.</p>
          <Link href="/admin/social/new" className="mt-3 inline-block font-display text-sm font-bold text-blue-bright hover:underline">
            Add your first one
          </Link>
        </div>
      ) : (
        <div className="border border-white/10">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs text-paper/50">
                <th className="px-4 py-3 font-display font-semibold">Platform</th>
                <th className="px-4 py-3 font-display font-semibold">URL</th>
                <th className="px-4 py-3 font-display font-semibold">Active</th>
                <th className="px-4 py-3 font-display font-semibold">Order</th>
                <th className="px-4 py-3 font-display font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id} className="border-b border-white/5 last:border-0">
                  <td className="px-4 py-3 text-paper">{p.platform}</td>
                  <td className="max-w-xs truncate px-4 py-3 text-paper/70">{p.url}</td>
                  <td className="px-4 py-3 text-paper/70">{p.isActive ? "Yes" : "—"}</td>
                  <td className="px-4 py-3 text-paper/70">{p.order}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link href={`/admin/social/${p.id}/edit`} className="font-display text-xs font-semibold text-blue-bright hover:underline">
                        Edit
                      </Link>
                      <SocialPostRowActions id={p.id} />
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
