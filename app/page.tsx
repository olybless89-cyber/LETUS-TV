import Link from "next/link";
import { getChannelVideos, getLiveEmbedUrl } from "@/lib/youtube";
import { YouTubeVideoCard } from "@/components/youtube-video-card";
import { ClickToPlayYouTube } from "@/components/click-to-play-youtube";
import { SectionHeading } from "@/components/section-heading";
import { TradingViewTickerTape } from "@/components/tradingview-ticker-tape";
import { TradingViewAdvancedChart } from "@/components/tradingview-advanced-chart";
import { timeAgo } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const videos = await getChannelVideos(9);
  const [featured, ...rest] = videos;

  return (
    <div className="container-page py-8 space-y-16">
      {/* Featured — latest upload */}
      {featured && (
        <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <Link href={`/videos/${featured.id}`} className="group relative block overflow-hidden bg-ink">
            <div className="relative aspect-[16/10] w-full">
              <img
                src={featured.thumbnailUrl}
                alt={featured.title}
                className="absolute inset-0 h-full w-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-paper/90 transition-transform group-hover:scale-110">
                  <span className="ml-1.5 border-y-[12px] border-l-[20px] border-y-transparent border-l-ink" />
                </span>
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
              <span className="inline-block font-display text-xs font-bold px-2 py-1 rounded-sm bg-blue text-paper">
                Letus TV
              </span>
              <h1 className="mt-3 max-w-xl font-display text-2xl font-bold leading-tight text-paper sm:text-3xl lg:text-4xl">
                {featured.title}
              </h1>
              <p className="mt-2 text-sm text-paper/70">{timeAgo(featured.publishedAt)}</p>
            </div>
          </Link>

          <div className="flex flex-col">
            <h2 className="font-display text-sm font-bold tracking-tight text-ink-soft border-b border-line pb-2">
              More from the channel
            </h2>
            {rest.slice(0, 4).map((video) => (
              <Link key={video.id} href={`/videos/${video.id}`} className="group flex gap-4 py-4 border-b border-line">
                <div className="relative h-20 w-28 shrink-0 overflow-hidden bg-line">
                  <img src={video.thumbnailUrl} alt={video.title} className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-display text-base font-semibold leading-snug text-ink group-hover:text-blue">
                    {video.title}
                  </h3>
                  <span className="mt-1 block text-xs text-ink-soft">{timeAgo(video.publishedAt)}</span>
                </div>
              </Link>
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

      {/* All videos */}
      {videos.length > 0 && (
        <section className="space-y-6">
          <SectionHeading title="Latest from Letus TV" href="/videos" hrefLabel="All videos" />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {videos.slice(0, 8).map((video) => (
              <YouTubeVideoCard key={video.id} video={video} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
