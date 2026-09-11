import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategoryBySlug, getArticlesByCategory, getVideosPage } from "@/lib/server-data";
import { ArticleCard } from "@/components/article-card";
import { VideoCard } from "@/components/video-card";
import { SectionHeading } from "@/components/section-heading";

export const dynamic = "force-dynamic";

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
              <VideoCard key={video.id} video={video} />
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
