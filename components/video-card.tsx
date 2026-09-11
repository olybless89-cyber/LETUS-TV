import Image from "next/image";
import Link from "next/link";
import type { Video, Category } from "@prisma/client";
import { formatViews } from "@/lib/utils";

export function VideoCard({ video }: { video: Video & { category: Category } }) {
  return (
    <Link href={`/videos/${video.slug}`} className="group block">
      <div className="relative aspect-video w-full overflow-hidden bg-ink">
        {video.thumbnailUrl ? (
          <Image
            src={video.thumbnailUrl}
            alt={video.title}
            fill
            className="object-cover opacity-90 transition-opacity group-hover:opacity-100"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-blue-deep text-paper/40 font-display text-sm">
            {video.category.name}
          </div>
        )}
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-paper/90 transition-transform group-hover:scale-110">
            <span className="ml-1 border-y-8 border-l-[14px] border-y-transparent border-l-ink" />
          </span>
        </span>
        {video.duration && (
          <span className="absolute bottom-2 right-2 rounded-sm bg-ink/80 px-1.5 py-0.5 text-xs text-paper font-display">
            {video.duration}
          </span>
        )}
      </div>
      <div className="pt-2">
        <span className="font-display text-xs font-semibold text-blue">{video.category.name}</span>
        <h3 className="mt-1 font-display text-base font-semibold leading-snug text-ink group-hover:text-blue">
          {video.title}
        </h3>
        <span className="mt-1 block text-xs text-ink-soft">{formatViews(video.views)} views</span>
      </div>
    </Link>
  );
}
