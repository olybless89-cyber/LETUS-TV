import Image from "next/image";
import type { YouTubeVideoItem } from "@/lib/youtube";
import { timeAgo } from "@/lib/utils";

export function YouTubeVideoCard({ video }: { video: YouTubeVideoItem }) {
  return (
    <a
      href={`https://www.youtube.com/watch?v=${video.id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-ink">
        <Image
          src={video.thumbnailUrl}
          alt={video.title}
          fill
          unoptimized
          className="object-cover opacity-90 transition-opacity group-hover:opacity-100"
        />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-paper/90 transition-transform group-hover:scale-110">
            <span className="ml-1 border-y-8 border-l-[14px] border-y-transparent border-l-ink" />
          </span>
        </span>
      </div>
      <div className="pt-2">
        <span className="font-display text-xs font-semibold text-blue">Letus TV</span>
        <h3 className="mt-1 font-display text-base font-semibold leading-snug text-ink group-hover:text-blue">
          {video.title}
        </h3>
        <span className="mt-1 block text-xs text-ink-soft">{timeAgo(video.publishedAt)}</span>
      </div>
    </a>
  );
}
