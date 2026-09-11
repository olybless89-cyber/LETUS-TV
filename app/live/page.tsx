import type { Metadata } from "next";
import { getLiveStreamSettings, getLatestVideos } from "@/lib/server-data";
import { getYouTubeId } from "@/lib/utils";
import { HlsPlayer } from "@/components/hls-player";
import { YouTubePlayer } from "@/components/youtube-player";
import { VideoCard } from "@/components/video-card";
import { SectionHeading } from "@/components/section-heading";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Live TV — Letus TV",
};

export default async function LivePage() {
  const [live, recent] = await Promise.all([
    getLiveStreamSettings(),
    getLatestVideos(4),
  ]);

  return (
    <div className="container-page py-8 space-y-12">
      <div>
        <span className="inline-flex items-center gap-2 font-display text-xs font-bold text-live">
          <span className="h-2 w-2 rounded-full bg-live animate-live-pulse" />
          {live?.isLive ? "ON AIR NOW" : "OFFLINE"}
        </span>
        <h1 className="mt-2 font-display text-2xl font-bold text-ink sm:text-3xl">
          {live?.title ?? "Letus TV Live"}
        </h1>
        {live?.description && (
          <p className="mt-1 max-w-2xl text-ink-soft">{live.description}</p>
        )}
      </div>

      <div className="mx-auto max-w-4xl">
        {!live || !live.isVisible ? (
          <div className="flex aspect-video w-full items-center justify-center bg-ink font-display text-paper/50">
            Live stream is offline right now.
          </div>
        ) : live.streamType === "HLS" && live.streamUrl ? (
          <HlsPlayer src={live.streamUrl} poster={live.thumbnailUrl} />
        ) : live.streamType === "YOUTUBE" && getYouTubeId(live.streamUrl) ? (
          <YouTubePlayer videoId={getYouTubeId(live.streamUrl)!} title={live.title ?? "Letus TV Live"} />
        ) : (live.streamType === "EMBED" || live.streamType === "EXTERNAL") && live.streamUrl ? (
          <div className="relative aspect-video w-full overflow-hidden bg-black">
            <iframe src={live.streamUrl} title={live.title ?? "Letus TV Live"} className="absolute inset-0 h-full w-full" allowFullScreen />
          </div>
        ) : (
          <div className="flex aspect-video w-full items-center justify-center bg-ink font-display text-paper/50">
            Live stream is offline right now.
          </div>
        )}
      </div>

      {recent.length > 0 && (
        <section className="space-y-6">
          <SectionHeading title="Recent Broadcasts" href="/videos" hrefLabel="All videos" />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {recent.map((v) => (
              <VideoCard key={v.id} video={v} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
