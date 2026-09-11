import Image from "next/image";
import Link from "next/link";
import {
  getHeroArticles,
  getLatestArticles,
  getLatestVideos,
  getLiveStreamSettings,
  getAllCategories,
  getArticlesByCategory,
} from "@/lib/server-data";
import { ArticleCard } from "@/components/article-card";
import { VideoCard } from "@/components/video-card";
import { SectionHeading } from "@/components/section-heading";
import { TradingViewTickerTape } from "@/components/tradingview-ticker-tape";
import { TradingViewAdvancedChart } from "@/components/tradingview-advanced-chart";
import { timeAgo } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [hero, latest, videos, live, categories] = await Promise.all([
    getHeroArticles(5),
    getLatestArticles(9),
    getLatestVideos(4),
    getLiveStreamSettings(),
    getAllCategories(),
  ]);

  const [lead, ...rundown] = hero;
  const rails = categories.filter((c) => c._count.articles > 0).slice(0, 2);
  const railArticles = await Promise.all(
    rails.map((c) => getArticlesByCategory(c.slug, 4))
  );

  return (
    <div className="container-page py-8 space-y-16">
      {/* Hero rundown */}
      {lead && (
        <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <Link href={`/articles/${lead.slug}`} className="group relative block overflow-hidden bg-ink">
            <div className="relative aspect-[16/10] w-full">
              {lead.featuredImage && (
                <Image
                  src={lead.featuredImage}
                  alt={lead.title}
                  fill
                  priority
                  className="object-cover opacity-90 transition-opacity group-hover:opacity-100"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
              <span
                className="inline-block font-display text-xs font-bold px-2 py-1 rounded-sm"
                style={{ background: lead.category.color ?? "#1642c5", color: "#fff" }}
              >
                {lead.category.name}
              </span>
              <h1 className="mt-3 max-w-xl font-display text-2xl font-bold leading-tight text-paper sm:text-3xl lg:text-4xl">
                {lead.title}
              </h1>
              <p className="mt-2 text-sm text-paper/70">{timeAgo(lead.publishedAt)}</p>
            </div>
          </Link>

          <div className="flex flex-col">
            <h2 className="font-display text-sm font-bold tracking-tight text-ink-soft border-b border-line pb-2">
              Also in the rundown
            </h2>
            {rundown.slice(0, 4).map((article) => (
              <ArticleCard key={article.id} article={article} variant="horizontal" />
            ))}
          </div>
        </section>
      )}

      {/* Market ticker */}
      <section className="-mx-5 sm:-mx-0">
        <TradingViewTickerTape />
      </section>

      {/* Markets */}
      <section className="space-y-6">
        <SectionHeading title="Markets" accent="#e3a336" />
        <div className="border border-line bg-blue-deep p-1">
          <TradingViewAdvancedChart defaultSymbol="FX_IDC:USDNGN" />
        </div>
      </section>

      {/* Live now */}
      {live?.isVisible && (
        <section className="bg-blue-deep text-paper">
          <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 font-display text-xs font-bold text-live">
                <span className="h-2 w-2 rounded-full bg-live animate-live-pulse" />
                {live.isLive ? "ON AIR NOW" : "COMING UP"}
              </span>
              <h2 className="mt-3 font-display text-2xl font-bold sm:text-3xl">
                {live.title ?? "Letus TV Live"}
              </h2>
              <p className="mt-2 max-w-md text-sm text-paper/70">
                {live.description ?? "24/7 live television: news, current affairs and entertainment."}
              </p>
              <Link
                href="/live"
                className="mt-5 inline-block bg-gold px-5 py-2.5 font-display text-sm font-bold text-blue-deep"
              >
                Watch Live
              </Link>
            </div>
            <div className="relative aspect-video w-full overflow-hidden border border-white/10 bg-black/40">
              {live.thumbnailUrl ? (
                <Image src={live.thumbnailUrl} alt="Live stream" fill className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center font-display text-sm text-paper/40">
                  Live player
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Latest news grid */}
      <section className="space-y-6">
        <SectionHeading title="Latest News" href="/articles" hrefLabel="All news" />
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      {/* Category rails */}
      {rails.map((cat, i) => (
        railArticles[i].length > 0 && (
          <section key={cat.id} className="space-y-6">
            <SectionHeading title={cat.name} href={`/category/${cat.slug}`} accent={cat.color} />
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {railArticles[i].map((article) => (
                <ArticleCard key={article.id} article={article} variant="compact" />
              ))}
            </div>
          </section>
        )
      ))}

      {/* Videos */}
      {videos.length > 0 && (
        <section className="space-y-6">
          <SectionHeading title="Latest Videos" href="/videos" hrefLabel="All videos" />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
