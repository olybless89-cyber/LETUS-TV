import type { Metadata } from "next";
import { getChannelVideos, getLiveEmbedUrl } from "@/lib/youtube";
import { ClickToPlayYouTube } from "@/components/click-to-play-youtube";
import { YouTubeVideoCard } from "@/components/youtube-video-card";
import { SectionHeading } from "@/components/section-heading";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Live TV — Letus TV",
};

export default async function LivePage() {
  const recent = await getChannelVideos(4);

  return (
    <div className="container-page py-8 space-y-12">
      <div>
        <span className="inline-flex items-center gap-2 font-display text-xs font-bold text-live">
          <span className="h-2 w-2 rounded-full bg-live animate-live-pulse" />
          LETUS TV LIVE
        </span>
        <h1 className="mt-2 font-display text-2xl font-bold text-ink sm:text-3xl">
          Letus TV Live
        </h1>
        <p className="mt-1 max-w-2xl text-ink-soft">
          24/7 live television: news, current affairs and entertainment. Tap play to join the broadcast.
        </p>
      </div>

      <div className="mx-auto max-w-4xl">
        <ClickToPlayYouTube
          embedUrl={getLiveEmbedUrl()}
          title="Letus TV Live"
          isLive
        />
      </div>

      {recent.length > 0 && (
        <section className="space-y-6">
          <SectionHeading title="Recent Broadcasts" href="/videos" hrefLabel="All videos" />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {recent.map((video) => (
              <YouTubeVideoCard key={video.id} video={video} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
