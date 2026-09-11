import Link from "next/link";
import { getFeaturedVideos, getLatestVideos, getPopularVideos, getLiveStreamSettings, getActiveSocialPosts, getActivePoll, getSiteSettings } from "@/lib/server-data";
import { SocialPostEmbed } from "@/components/embeds/social-post-embed";
import { PollWidget } from "@/components/poll-widget";
import { JoinConversationCard, AudioRoomsCard } from "@/components/promo-cards";
import { SectionHeading } from "@/components/section-heading";
import { LiveHeroBox } from "@/components/live-hero-box";
import { TradingViewTickerTape } from "@/components/tradingview-ticker-tape";
import { TradingViewMarketOverview } from "@/components/tradingview-market-overview";
import { timeAgo } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const YOUTUBE_CHANNEL_URL = "https://youtube.com/@letus-tv";

function EmptyCard({ message }: { message: string }) {
  return (
    <div className="flex h-full min-h-[220px] flex-col items-center justify-center border border-dashed border-line bg-white/50 p-6 text-center">
      <p className="text-sm text-ink-soft">{message}</p>
      <Link href="/admin" className="mt-2 font-display text-xs font-bold text-blue hover:underline">
        Go to admin panel →
      </Link>
    </div>
  );
}

export default async function HomePage() {
  const [featuredList, popular, latest, live, socialPosts, poll, settings] = await Promise.all([
    getFeaturedVideos(1),
    getPopularVideos(5),
    getLatestVideos(12),
    getLiveStreamSettings(),
    getActiveSocialPosts(6),
    getActivePoll(),
    getSiteSettings(),
  ]);

  const featured = featuredList[0] ?? latest[0] ?? null;
  const rest = latest.filter((v) => v.id !== featured?.id);

  const liveHref = live?.streamUrl || YOUTUBE_CHANNEL_URL;
  const liveTitle = live?.title || "Letus TV Live";
  const liveDescription =
    live?.description || "24/7 live television: news, current affairs and entertainment.";

  return (
    <div className="container-page py-8 space-y-12">
      {/* Top: video + popular (left) | featured story (center) | markets (right) */}
      <section className="grid gap-6 lg:grid-cols-[1.1fr_1.3fr_1fr]">
        {/* Left column: live/video + popular */}
        <div className="flex flex-col gap-6">
          <LiveHeroBox live={live} />

          <div>
            <div className="bg-live px-4 py-2">
              <span className="font-display text-sm font-bold tracking-wide text-paper">POPULAR</span>
            </div>
            {popular.length === 0 ? (
              <div className="border border-t-0 border-line p-6">
                <EmptyCard message="No videos yet." />
              </div>
            ) : (
              <div className="border border-t-0 border-line">
                {popular.map((v) => (
                  <a
                    key={v.id}
                    href={v.videoUrl ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex gap-3 border-b border-line p-3 last:border-0 hover:bg-white/60"
                  >
                    <div className="relative h-16 w-24 shrink-0 overflow-hidden bg-line">
                      {v.thumbnailUrl && (
                        <img src={v.thumbnailUrl} alt={v.title} className="h-full w-full object-cover" />
                      )}
                    </div>
                    <h3 className="font-display text-sm font-semibold leading-snug text-ink group-hover:text-blue">
                      {v.title}
                    </h3>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center: featured story */}
        <div className="border-t-4 border-live">
          {featured ? (
            <a
              href={featured.videoUrl ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-line">
                {featured.thumbnailUrl && (
                  <img src={featured.thumbnailUrl} alt={featured.title} className="h-full w-full object-cover" />
                )}
              </div>
              <div className="border border-t-0 border-line p-5">
                <span className="font-display text-xs font-bold text-blue">{featured.category.name}</span>
                <h1 className="mt-2 font-display text-2xl font-bold leading-tight text-ink group-hover:text-blue sm:text-3xl">
                  {featured.title}
                </h1>
                {featured.description && (
                  <p className="mt-3 text-ink-soft">{featured.description}</p>
                )}
                <span className="mt-3 block text-xs text-ink-soft">{timeAgo(featured.publishedAt)}</span>
              </div>
            </a>
          ) : (
            <EmptyCard message="No featured story yet — add and feature a video from the admin panel." />
          )}
        </div>

        {/* Right: world FX markets */}
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

      {/* Market ticker */}
      <section className="-mx-5 sm:-mx-0">
        <TradingViewTickerTape />
      </section>

      {/* Community promo cards */}
      {(settings?.conversationCtaEnabled || settings?.audioRoomsEnabled) && (
        <section className="grid gap-6 sm:grid-cols-2">
          <JoinConversationCard settings={settings} />
          <AudioRoomsCard settings={settings} />
        </section>
      )}

      {/* Opinion poll */}
      {poll && (
        <section>
          <PollWidget poll={poll} />
        </section>
      )}

      {/* Latest videos grid */}
      <section className="space-y-6">
        <SectionHeading title="Latest from Letus TV" href="/videos" hrefLabel="All videos" />
        {rest.length === 0 ? (
          <EmptyCard message="No videos added yet. Add your first one from the admin panel." />
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {rest.slice(0, 8).map((video) => (
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
                <span className="mt-2 block font-display text-xs font-semibold text-blue">{video.category.name}</span>
                <h3 className="font-display text-sm font-semibold leading-snug text-ink group-hover:text-blue">
                  {video.title}
                </h3>
                <span className="mt-1 block text-xs text-ink-soft">{timeAgo(video.publishedAt)}</span>
              </a>
            ))}
          </div>
        )}
      </section>

      {/* From our socials */}
      <section className="space-y-6">
        <SectionHeading title="From Our Socials" />
        {socialPosts.length === 0 ? (
          <EmptyCard message="No social posts featured yet. Add real Instagram, TikTok, or Facebook posts from the admin panel." />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {socialPosts.map((post) => (
              <div key={post.id} className="border border-line bg-white p-3">
                <SocialPostEmbed platform={post.platform} url={post.url} caption={post.caption} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Watch on YouTube CTA */}
      <section className="bg-blue-deep text-paper">
        <div className="flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <span className="inline-flex items-center gap-2 font-display text-xs font-bold text-live">
              <span className="h-2 w-2 rounded-full bg-live animate-live-pulse" />
              {live?.isLive ? "ON AIR NOW" : "WATCH LIVE"}
            </span>
            <h2 className="mt-3 font-display text-2xl font-bold sm:text-3xl">
              Watch Letus TV Live
            </h2>
            <p className="mt-2 max-w-md text-sm text-paper/70">{liveDescription}</p>
          </div>
          <a
            href={liveHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block shrink-0 bg-gold px-5 py-2.5 font-display text-sm font-bold text-blue-deep"
          >
            Watch Live
          </a>
        </div>
      </section>
    </div>
  );
}
