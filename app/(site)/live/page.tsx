import type { Metadata } from "next";
import { getLiveStreamSettings, getLatestVideos } from "@/lib/server-data";
import { timeAgo } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const YOUTUBE_CHANNEL_URL = "https://youtube.com/@letus-tv";

export const metadata: Metadata = {
  title: "Live TV — Letus TV",
};

export default async function LivePage() {
  const [live, recent] = await Promise.all([
    getLiveStreamSettings(),
    getLatestVideos(4),
  ]);

  const liveHref = live?.streamUrl || YOUTUBE_CHANNEL_URL;
  const liveTitle = live?.title || "Letus TV Live";
  const liveDescription =
    live?.description || "24/7 live television: news, current affairs and entertainment.";

  return (
    <div className="container-page py-8 space-y-12">
      <div>
        <span className="inline-flex items-center gap-2 font-display text-xs font-bold text-live">
          <span className="h-2 w-2 rounded-full bg-live animate-live-pulse" />
          {live?.isLive ? "LETUS TV LIVE" : "WATCH LIVE"}
        </span>
        <h1 className="mt-2 font-display text-2xl font-bold text-ink sm:text-3xl">
          {liveTitle}
        </h1>
        <p className="mt-1 max-w-2xl text-ink-soft">{liveDescription}</p>
      </div>

      <div className="mx-auto max-w-2xl">
        <a
          href={liveHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 bg-live px-6 py-4 font-display text-lg font-bold text-paper"
        >
          <span className="h-2.5 w-2.5 rounded-full bg-paper animate-live-pulse" />
          Watch Live
        </a>
      </div>

      {recent.length > 0 && (
        <section className="space-y-6">
          <h2 className="border-b border-line pb-2 font-display text-xl font-bold text-ink">
            Recent Broadcasts
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {recent.map((video) => (
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
    </div>
  );
}
