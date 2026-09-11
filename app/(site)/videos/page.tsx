import type { Metadata } from "next";
import { getVideosPage } from "@/lib/server-data";
import { SectionHeading } from "@/components/section-heading";
import { timeAgo } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Videos — Letus TV",
};

export default async function VideosPage() {
  const { videos } = await getVideosPage(1, 48);

  return (
    <div className="container-page py-8 space-y-8">
      <SectionHeading title="Videos" />
      {videos.length === 0 ? (
        <p className="text-ink-soft">No videos published yet. Check back soon.</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
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
              <h3 className="font-display text-base font-semibold leading-snug text-ink group-hover:text-blue">
                {video.title}
              </h3>
              <span className="mt-1 block text-xs text-ink-soft">{timeAgo(video.publishedAt)}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
