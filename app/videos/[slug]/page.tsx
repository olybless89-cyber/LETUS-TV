import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getChannelVideoById, getChannelVideos } from "@/lib/youtube";
import { formatDate } from "@/lib/utils";
import { YouTubePlayer } from "@/components/youtube-player";
import { YouTubeVideoCard } from "@/components/youtube-video-card";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const video = await getChannelVideoById(slug);
  if (!video) return {};
  return {
    title: `${video.title} — Letus TV`,
    description: video.description || undefined,
  };
}

export default async function VideoDetailPage({ params }: Props) {
  const { slug } = await params;
  const video = await getChannelVideoById(slug);
  if (!video) notFound();

  const all = await getChannelVideos(8);
  const related = all.filter((v) => v.id !== video.id).slice(0, 4);

  return (
    <div className="container-page py-8">
      <div className="mx-auto max-w-4xl">
        <YouTubePlayer videoId={video.id} title={video.title} />

        <span className="mt-5 inline-block font-display text-xs font-bold text-blue">
          Letus TV
        </span>
        <h1 className="mt-2 font-display text-2xl font-bold leading-tight text-ink sm:text-3xl">
          {video.title}
        </h1>
        <div className="mt-2 flex items-center gap-3 text-sm text-ink-soft">
          <span>{formatDate(video.publishedAt)}</span>
        </div>
        {video.description && (
          <p className="mt-4 max-w-2xl whitespace-pre-line text-ink-soft font-body leading-relaxed">
            {video.description}
          </p>
        )}
      </div>

      {related.length > 0 && (
        <section className="mx-auto mt-16 max-w-5xl">
          <h2 className="border-b border-line pb-2 font-display text-xl font-bold text-ink">
            More from Letus TV
          </h2>
          <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((v) => (
              <YouTubeVideoCard key={v.id} video={v} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
