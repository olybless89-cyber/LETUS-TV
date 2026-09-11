import Image from "next/image";
import Link from "next/link";
import { getLiveNews, getLiveNewsByCategory, type LiveNewsCategory } from "@/lib/rss";
import { getChannelVideos, getLiveEmbedUrl } from "@/lib/youtube";
import { LiveNewsCard } from "@/components/live-news-card";
import { YouTubeVideoCard } from "@/components/youtube-video-card";
import { ClickToPlayYouTube } from "@/components/click-to-play-youtube";
import { SectionHeading } from "@/components/section-heading";
import { TradingViewTickerTape } from "@/components/tradingview-ticker-tape";
import { TradingViewAdvancedChart } from "@/components/tradingview-advanced-chart";
import { timeAgo } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const RAIL_CATEGORIES: { key: LiveNewsCategory; label: string; color: string }[] = [
  { key: "business", label: "Business", color: "#2f6fed" },
  { key: "tech", label: "Technology", color: "#e3a336" },
];

export default async function HomePage() {
  const [news, videos, ...railFeeds] = await Promise.all([
    getLiveNews(9),
    getChannelVideos(4),
    ...RAIL_CATEGORIES.map((c) => getLiveNewsByCategory(c.key, 4)),
  ]);

  const [lead, ...rundown] = news;

  return (
    <div className="container-page py-8 space-y-16">
      {/* Hero rundown */}
      {lead && (
        <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <a
            href={lead.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block overflow-hidden bg-ink"
          >
            <div className="relative aspect-[16/10] w-full">
              {lead.imageUrl && (
                <Image
                  src={lead.imageUrl}
                  alt={lead.title}
                  fill
                  priority
                  unoptimized
                  className="object-cover opacity-90 transition-opacity group-hover:opacity-100"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
              <span className="inline-block font-display text-xs font-bold px-2 py-1 rounded-sm bg-blue text-paper">
                {lead.source}
              </span>
              <h1 className="mt-3 max-w-xl font-display text-2xl font-bold leading-tight text-paper sm:text-3xl lg:text-4xl">
                {lead.title}
              </h1>
              <p className="mt-2 text-sm text-paper/70">{timeAgo(lead.publishedAt)}</p>
            </div>
          </a>

          <div className="flex flex-col">
            <h2 className="font-display text-sm font-bold tracking-tight text-ink-soft border-b border-line pb-2">
              Also in the rundown
            </h2>
            {rundown.slice(0, 4).map((item, i) => (
              <LiveNewsCard key={`${item.link}-${i}`} item={item} variant="horizontal" />
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
      <section className="bg-blue-deep text-paper">
        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 font-display text-xs font-bold text-live">
              <span className="h-2 w-2 rounded-full bg-live animate-live-pulse" />
              ON AIR NOW
            </span>
            <h2 className="mt-3 font-display text-2xl font-bold sm:text-3xl">
              Letus TV Live
            </h2>
            <p className="mt-2 max-w-md text-sm text-paper/70">
              24/7 live television: news, current affairs and entertainment.
            </p>
            <Link
              href="/live"
              className="mt-5 inline-block bg-gold px-5 py-2.5 font-display text-sm font-bold text-blue-deep"
            >
              Watch Live
            </Link>
          </div>
          <ClickToPlayYouTube embedUrl={getLiveEmbedUrl()} title="Letus TV Live" isLive />
        </div>
      </section>

      {/* Latest news grid */}
      <section className="space-y-6">
        <SectionHeading title="Latest News" href="/articles" hrefLabel="All news" />
        {news.length === 0 ? (
          <p className="text-ink-soft">Live feeds are temporarily unavailable. Check back shortly.</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {news.map((item, i) => (
              <LiveNewsCard key={`${item.link}-${i}`} item={item} />
            ))}
          </div>
        )}
      </section>

      {/* Category rails */}
      {RAIL_CATEGORIES.map((cat, i) => (
        railFeeds[i].length > 0 && (
          <section key={cat.key} className="space-y-6">
            <SectionHeading title={cat.label} href={`/category/${cat.key}`} accent={cat.color} />
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {railFeeds[i].map((item, j) => (
                <LiveNewsCard key={`${item.link}-${j}`} item={item} variant="compact" />
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
              <YouTubeVideoCard key={video.id} video={video} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
