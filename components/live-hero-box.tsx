"use client";

import { useRef } from "react";
import { FloatingLivePlayer } from "@/components/floating-live-player";

type LiveData = {
  streamUrl: string | null;
  streamType: string | null;
  title: string | null;
  description: string | null;
  thumbnailUrl: string | null;
  isLive: boolean;
  isVisible: boolean;
} | null;

const YOUTUBE_CHANNEL_URL = "https://youtube.com/@letus-tv";

export function LiveHeroBox({ live }: { live: LiveData }) {
  const ref = useRef<HTMLAnchorElement>(null);

  const liveHref = live?.streamUrl || YOUTUBE_CHANNEL_URL;
  const liveTitle = live?.title || "Letus TV Live";
  const liveDescription =
    live?.description || "24/7 live television: news, current affairs and entertainment.";

  return (
    <>
      <a
        ref={ref}
        href={liveHref}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block aspect-video w-full overflow-hidden bg-ink"
      >
        {live?.thumbnailUrl ? (
          <img
            src={live.thumbnailUrl}
            alt={liveTitle}
            className="absolute inset-0 h-full w-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
          />
        ) : (
          <div className="absolute inset-0 bg-blue-deep" />
        )}
        {live?.isLive && (
          <span className="absolute top-3 left-3 flex items-center gap-2 rounded-sm bg-live px-2 py-1 font-display text-xs font-bold text-paper">
            <span className="h-2 w-2 rounded-full bg-paper animate-live-pulse" />
            LIVE
          </span>
        )}
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-paper/90 transition-transform group-hover:scale-110">
            <span className="ml-1 border-y-[10px] border-l-[16px] border-y-transparent border-l-ink" />
          </span>
        </span>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ink/90 to-transparent p-4">
          <p className="font-display text-sm font-bold text-paper">{liveTitle}</p>
          <p className="mt-0.5 text-xs text-paper/70">{liveDescription}</p>
        </div>
      </a>

      <FloatingLivePlayer
        anchorRef={ref}
        streamUrl={live?.streamUrl}
        streamType={live?.streamType}
        isVisible={live?.isVisible ?? true}
        title={liveTitle}
      />
    </>
  );
}
