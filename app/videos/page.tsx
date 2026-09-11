import Link from "next/link";
import type { Metadata } from "next";
import { getVideosPage } from "@/lib/server-data";
import { VideoCard } from "@/components/video-card";
import { SectionHeading } from "@/components/section-heading";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Videos — Letus TV",
};

export default async function VideosPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam ?? 1) || 1);
  const { videos, pageCount } = await getVideosPage(page, 12);

  return (
    <div className="container-page py-8 space-y-8">
      <SectionHeading title="Videos" />
      {videos.length === 0 ? (
        <p className="text-ink-soft">No videos published yet. Check back soon.</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}

      {pageCount > 1 && (
        <nav className="flex items-center justify-between border-t border-line pt-6 font-display text-sm">
          {page > 1 ? (
            <Link href={`/videos?page=${page - 1}`} className="text-blue hover:underline">
              &larr; Newer
            </Link>
          ) : <span />}
          <span className="text-ink-soft">Page {page} of {pageCount}</span>
          {page < pageCount ? (
            <Link href={`/videos?page=${page + 1}`} className="text-blue hover:underline">
              Older &rarr;
            </Link>
          ) : <span />}
        </nav>
      )}
    </div>
  );
}
