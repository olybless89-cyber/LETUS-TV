"use client";

import { useState } from "react";
import Image from "next/image";

export function ClickToPlayYouTube({
  embedUrl,
  thumbnailUrl,
  title,
  isLive = false,
}: {
  embedUrl: string;
  thumbnailUrl?: string | null;
  title: string;
  isLive?: boolean;
}) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div className="relative aspect-video w-full overflow-hidden bg-black">
        <iframe
          src={`${embedUrl}${embedUrl.includes("?") ? "&" : "?"}autoplay=1`}
          title={title}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className="group relative aspect-video w-full overflow-hidden bg-ink text-left"
      aria-label={`Play ${title}`}
    >
      {thumbnailUrl ? (
        <Image src={thumbnailUrl} alt={title} fill unoptimized className="object-cover opacity-90 transition-opacity group-hover:opacity-100" />
      ) : (
        <div className="absolute inset-0 bg-blue-deep" />
      )}
      {isLive && (
        <span className="absolute top-3 left-3 flex items-center gap-2 rounded-sm bg-live px-2 py-1 font-display text-xs font-bold text-paper">
          <span className="h-2 w-2 rounded-full bg-paper animate-live-pulse" />
          LIVE
        </span>
      )}
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-paper/90 transition-transform group-hover:scale-110">
          <span className="ml-1.5 border-y-[12px] border-l-[20px] border-y-transparent border-l-ink" />
        </span>
      </span>
    </button>
  );
}
