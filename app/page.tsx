import { getChannelVideos } from "@/lib/youtube";
import { YouTubeVideoCard } from "@/components/youtube-video-card";
import { SectionHeading } from "@/components/section-heading";
import { TradingViewTickerTape } from "@/components/tradingview-ticker-tape";
import { TradingViewMarketOverview } from "@/components/tradingview-market-overview";
import { timeAgo } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const YOUTUBE_CHANNEL_URL = "https://youtube.com/@letus-tv";

export default async function HomePage() {
  const videos = await getChannelVideos(9);
  const [featured, ...rest] = videos;

  return (
    <div className="container-page py-8 space-y-16">
      {/* Featured — latest upload */}
      {featured && (
        <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <a
            href={`https://www.youtube.com/watch?v=${featured.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block overflow-hidden bg-ink"
          >
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
          </a>
          <div className="flex flex-col border border-line bg-blue-deep">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <span className="font-display text-xs font-bold text-gold">World FX Markets</span>
              <a
                href={YOUTUBE_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 font-display text-xs font-bold text-live"
              >
                <span className="h-2 w-2 rounded-full bg-live animate-live-pulse" />
                Watch Live
              </a>
            </div>
            <div className="flex-1">
              <TradingViewMarketOverview />
            </div>
          </div>
        </section>
      )}

      {/* Market ticker */}
      <section className="-mx-5 sm:-mx-0">
        <TradingViewTickerTape />
      </section>

      {/* More from the channel */}
      {rest.length > 0 && (
        <section className="space-y-6">
          <SectionHeading title="More from the channel" />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {rest.slice(0, 4).map((video) => (
              <a
                key={video.id}
                href={`https://www.youtube.com/watch?v=${video.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-line">
                  <img src={video.thumbnailUrl} alt={video.title} className="h-full w-full object-cover" />
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

      {/* Watch on YouTube CTA */}
      <section className="bg-blue-deep text-paper">
        <div className="flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <span className="inline-flex items-center gap-2 font-display text-xs font-bold text-live">
              <span className="h-2 w-2 rounded-full bg-live animate-live-pulse" />
              ON AIR NOW
            </span>
            <h2 className="mt-3 font-display text-2xl font-bold sm:text-3xl">
              Watch Letus TV Live
            </h2>
            <p className="mt-2 max-w-md text-sm text-paper/70">
              24/7 live television: news, current affairs and entertainment — live now on our YouTube channel.
            </p>
          </div>
          <a
            href={YOUTUBE_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block shrink-0 bg-gold px-5 py-2.5 font-display text-sm font-bold text-blue-deep"
          >
            Watch on YouTube
          </a>
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
