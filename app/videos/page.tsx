import type { Metadata } from "next";
import { getChannelVideos } from "@/lib/youtube";
import { YouTubeVideoCard } from "@/components/youtube-video-card";
import { SectionHeading } from "@/components/section-heading";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Videos — Letus TV",
};

export default async function VideosPage() {
  const videos = await getChannelVideos(24);

  return (
    <div className="container-page py-8 space-y-8">
      <SectionHeading title="Videos" />
      {videos.length === 0 ? (
        <p className="text-ink-soft">No videos published yet. Check back soon.</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <YouTubeVideoCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}
