import type { Metadata } from "next";
import { getChannelVideos } from "@/lib/youtube";
import { YouTubeVideoCard } from "@/components/youtube-video-card";
import { SectionHeading } from "@/components/section-heading";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const YOUTUBE_CHANNEL_URL = "https://youtube.com/@letus-tv";

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
          24/7 live television: news, current affairs and entertainment — live now on our YouTube channel.
        </p>
      </div>

      <div className="mx-auto max-w-2xl">
        <a
          href={YOUTUBE_CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 bg-live px-6 py-4 font-display text-lg font-bold text-paper"
        >
          <span className="h-2.5 w-2.5 rounded-full bg-paper animate-live-pulse" />
          Watch Live on YouTube
        </a>
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
