import Image from "next/image";
import type { LiveNewsItem } from "@/lib/rss";
import { timeAgo } from "@/lib/utils";

export function LiveNewsCard({
  item,
  variant = "default",
}: {
  item: LiveNewsItem;
  variant?: "default" | "compact" | "horizontal";
}) {
  if (variant === "horizontal") {
    return (
      <a
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex gap-4 py-4 border-b border-line"
      >
        <div className="relative h-20 w-28 shrink-0 overflow-hidden bg-line">
          {item.imageUrl && (
            <Image src={item.imageUrl} alt={item.title} fill unoptimized className="object-cover" />
          )}
        </div>
        <div className="min-w-0">
          <span className="font-display text-xs font-semibold text-blue">{item.source}</span>
          <h3 className="mt-1 font-display text-base font-semibold leading-snug text-ink group-hover:text-blue">
            {item.title}
          </h3>
          <span className="mt-1 block text-xs text-ink-soft">{timeAgo(item.publishedAt)}</span>
        </div>
      </a>
    );
  }

  if (variant === "compact") {
    return (
      <a href={item.link} target="_blank" rel="noopener noreferrer" className="group block border-b border-line py-3">
        <span className="font-display text-xs font-semibold text-blue">{item.source}</span>
        <h3 className="mt-1 font-display text-sm font-semibold leading-snug text-ink group-hover:text-blue">
          {item.title}
        </h3>
      </a>
    );
  }

  return (
    <a href={item.link} target="_blank" rel="noopener noreferrer" className="group block">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-line">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            unoptimized
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-blue-deep font-display text-sm text-paper/40">
            {item.source}
          </div>
        )}
      </div>
      <div className="pt-3">
        <span className="font-display text-xs font-semibold text-blue">{item.source}</span>
        <h3 className="mt-1 font-display text-lg font-semibold leading-snug text-ink group-hover:text-blue">
          {item.title}
        </h3>
        {item.excerpt && (
          <p className="mt-1 line-clamp-2 text-sm text-ink-soft">{item.excerpt}</p>
        )}
        <span className="mt-2 block text-xs text-ink-soft">{timeAgo(item.publishedAt)}</span>
      </div>
    </a>
  );
}
