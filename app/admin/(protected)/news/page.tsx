import Link from "next/link";
import { getAllArticlesForAdmin } from "@/lib/server-data";
import { ArticleRowActions } from "@/components/admin/article-row-actions";

export default async function AdminNewsPage() {
  const articles = await getAllArticlesForAdmin();

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-paper">News</h1>
          <p className="mt-1 text-sm text-paper/50">Original articles written and published by your team.</p>
        </div>
        <Link href="/admin/news/new" className="bg-blue px-4 py-2.5 font-display text-sm font-bold text-paper">
          + Write an article
        </Link>
      </div>

      {articles.length === 0 ? (
        <div className="border border-dashed border-white/15 p-10 text-center">
          <p className="text-paper/60">No articles yet.</p>
          <Link href="/admin/news/new" className="mt-3 inline-block font-display text-sm font-bold text-blue-bright hover:underline">
            Write your first one
          </Link>
        </div>
      ) : (
        <div className="border border-white/10">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs text-paper/50">
                <th className="px-4 py-3 font-display font-semibold">Title</th>
                <th className="px-4 py-3 font-display font-semibold">Category</th>
                <th className="px-4 py-3 font-display font-semibold">Status</th>
                <th className="px-4 py-3 font-display font-semibold">Featured</th>
                <th className="px-4 py-3 font-display font-semibold">Breaking</th>
                <th className="px-4 py-3 font-display font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {articles.map((a) => (
                <tr key={a.id} className="border-b border-white/5 last:border-0">
                  <td className="max-w-xs truncate px-4 py-3 text-paper">{a.title}</td>
                  <td className="px-4 py-3 text-paper/70">{a.category.name}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-sm px-2 py-0.5 text-xs font-semibold ${
                        a.status === "PUBLISHED"
                          ? "bg-emerald-500/15 text-emerald-400"
                          : a.status === "DRAFT"
                          ? "bg-gold/15 text-gold"
                          : "bg-white/10 text-paper/50"
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-paper/70">{a.isFeatured ? "Yes" : "—"}</td>
                  <td className="px-4 py-3 text-paper/70">{a.isBreaking ? "Yes" : "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link href={`/admin/news/${a.id}/edit`} className="font-display text-xs font-semibold text-blue-bright hover:underline">
                        Edit
                      </Link>
                      <ArticleRowActions id={a.id} title={a.title} />
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
