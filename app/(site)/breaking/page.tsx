import type { Metadata } from "next";
import { getBreakingArticles } from "@/lib/server-data";
import { ArticleCard } from "@/components/article-card";
import { SectionHeading } from "@/components/section-heading";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Breaking News — Letus TV",
};

export default async function BreakingPage() {
  const articles = await getBreakingArticles(24);

  return (
    <div className="container-page py-8 space-y-8">
      <SectionHeading title="Breaking News" accent="#d62828" />
      {articles.length === 0 ? (
        <p className="text-ink-soft">Nothing marked as breaking right now.</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
