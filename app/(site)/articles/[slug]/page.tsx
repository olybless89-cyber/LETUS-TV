import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getArticleBySlug,
  getRelatedArticles,
  incrementArticleViews,
} from "@/lib/server-data";
import { formatDate, formatViews } from "@/lib/utils";
import { ArticleCard } from "@/components/article-card";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: `${article.seoTitle ?? article.title} — Letus TV`,
    description: article.seoDescription ?? article.excerpt ?? undefined,
  };
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article || article.status !== "PUBLISHED") notFound();

  incrementArticleViews(article.id);
  const related = await getRelatedArticles(article.id, article.categoryId, 3);

  return (
    <div className="container-page py-8">
      <article className="mx-auto max-w-3xl">
        <span
          className="font-display text-xs font-bold"
          style={{ color: article.category.color ?? "#1642c5" }}
        >
          {article.category.name}
        </span>
        <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-ink sm:text-4xl">
          {article.title}
        </h1>
        {article.excerpt && (
          <p className="mt-3 text-lg text-ink-soft font-body">{article.excerpt}</p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 border-y border-line py-3 text-sm text-ink-soft">
          <span>By {article.author.name}</span>
          <span>&middot;</span>
          <span>{formatDate(article.publishedAt)}</span>
          <span>&middot;</span>
          <span>{formatViews(article.views)} views</span>
        </div>

        {article.featuredImage && (
          <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden bg-line">
            <Image src={article.featuredImage} alt={article.title} fill className="object-cover" priority />
          </div>
        )}

        <div
          className="prose-article mt-8 max-w-none font-body text-[1.05rem] leading-relaxed text-ink"
          dangerouslySetInnerHTML={{ __html: article.body }}
        />
      </article>

      {related.length > 0 && (
        <section className="mx-auto mt-16 max-w-5xl">
          <h2 className="border-b border-line pb-2 font-display text-xl font-bold text-ink">
            Related stories
          </h2>
          <div className="mt-6 grid gap-8 sm:grid-cols-3">
            {related.map((r) => (
              <ArticleCard key={r.id} article={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
