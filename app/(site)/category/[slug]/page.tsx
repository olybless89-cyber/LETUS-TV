import type { Metadata } from "next";
import { getCategoryBySlug, getArticlesByCategory, getVideosPage } from "@/lib/server-data";
import { ArticleCard } from "@/components/article-card";
import { SectionHeading } from "@/components/section-heading";
import { timeAgo } from "@/lib/utils";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};
  return { title: `${category.name} — Letus TV` };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category || !category.isActive) notFound();

  const [articles, { videos }] = await Promise.all([
    getArticlesByCategory(slug, 12),
    getVideosPage(1, 8, slug),
  ]);

  return (
    <div className="container-page py-8 space-y-12">
      <div>
        <SectionHeading title={category.name} accent={category.color} />
        {category.description && (
          <p className="mt-3 max-w-2xl text-ink-soft">{category.description}</p>
        )}
      </div>

      {articles.length > 0 && (
        <section className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </section>
      )}

      {videos.length > 0 && (
        <section className="space-y-6">
          <SectionHeading title={`${category.name} Videos`} accent={category.color} />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {videos.map((video) => (
              <a
                key={video.id}
                href={video.videoUrl ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-line">
                  {video.thumbnailUrl && (
                    <img src={video.thumbnailUrl} alt={video.title} className="h-full w-full object-cover" />
                  )}
                </div>
                <h3 className="mt-2 font-display text-sm font-semibold leading-snug text-ink group-hover:text-blue">
                  {video.title}
                </h3>
                <span className="mt-1 block text-xs text-ink-soft">{timeAgo(video.publishedAt)}</span>
              </a>
            ))}
          </div>
        </section>
      )}

      {articles.length === 0 && videos.length === 0 && (
        <p className="text-ink-soft">Nothing published in {category.name} yet.</p>
      )}
    </div>
  );
}
