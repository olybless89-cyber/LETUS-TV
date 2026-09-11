import Link from "next/link";
import type { Metadata } from "next";
import { getArticlesPage } from "@/lib/server-data";
import { ArticleCard } from "@/components/article-card";
import { SectionHeading } from "@/components/section-heading";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "News — Letus TV",
};

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam ?? 1) || 1);
  const { articles, pageCount } = await getArticlesPage(page, 12);

  return (
    <div className="container-page py-8 space-y-8">
      <SectionHeading title="News" />
      {articles.length === 0 ? (
        <p className="text-ink-soft">No stories published yet. Check back soon.</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}

      {pageCount > 1 && (
        <nav className="flex items-center justify-between border-t border-line pt-6 font-display text-sm">
          {page > 1 ? (
            <Link href={`/articles?page=${page - 1}`} className="text-blue hover:underline">
              &larr; Newer
            </Link>
          ) : <span />}
          <span className="text-ink-soft">Page {page} of {pageCount}</span>
          {page < pageCount ? (
            <Link href={`/articles?page=${page + 1}`} className="text-blue hover:underline">
              Older &rarr;
            </Link>
          ) : <span />}
        </nav>
      )}
    </div>
  );
}
