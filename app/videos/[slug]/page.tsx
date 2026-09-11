import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getVideoBySlug,
  getRelatedVideos,
  incrementVideoViews,
} from "@/lib/server-data";
import { formatDate, formatViews, getYouTubeId } from "@/lib/utils";
import { YouTubePlayer } from "@/components/youtube-player";
import { VideoCard } from "@/components/video-card";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const video = await getVideoBySlug(slug);
  if (!video) return {};
  return {
    title: `${video.title} — Letus TV`,
    description: video.description ?? undefined,
  };
}

export default async function VideoDetailPage({ params }: Props) {
  const { slug } = await params;
  const video = await getVideoBySlug(slug);
  if (!video || video.status !== "PUBLISHED") notFound();

  incrementVideoViews(video.id);
  const related = await getRelatedVideos(video.id, video.categoryId, 4);
  const youtubeId = video.videoType === "YOUTUBE" ? getYouTubeId(video.videoUrl) : null;

  return (
    <div className="container-page py-8">
      <div className="mx-auto max-w-4xl">
        {youtubeId ? (
          <YouTubePlayer videoId={youtubeId} title={video.title} />
        ) : video.videoUrl ? (
          <video controls className="aspect-video w-full bg-black" src={video.videoUrl} poster={video.thumbnailUrl ?? undefined} />
        ) : (
          <div className="flex aspect-video w-full items-center justify-center bg-ink font-display text-paper/50">
            Video unavailable
          </div>
        )}

        <span className="mt-5 inline-block font-display text-xs font-bold text-blue">
          {video.category.name}
        </span>
        <h1 className="mt-2 font-display text-2xl font-bold leading-tight text-ink sm:text-3xl">
          {video.title}
        </h1>
        <div className="mt-2 flex items-center gap-3 text-sm text-ink-soft">
          <span>{formatViews(video.views)} views</span>
          <span>&middot;</span>
          <span>{formatDate(video.publishedAt)}</span>
        </div>
        {video.description && (
          <p className="mt-4 max-w-2xl text-ink-soft font-body leading-relaxed">{video.description}</p>
        )}
      </div>

      {related.length > 0 && (
        <section className="mx-auto mt-16 max-w-5xl">
          <h2 className="border-b border-line pb-2 font-display text-xl font-bold text-ink">
            More like this
          </h2>
          <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((v) => (
              <VideoCard key={v.id} video={v} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
