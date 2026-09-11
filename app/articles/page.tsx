import type { Metadata } from "next";
import { getLiveNews } from "@/lib/rss";
import { LiveNewsCard } from "@/components/live-news-card";
import { SectionHeading } from "@/components/section-heading";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "News — Letus TV",
};

export default async function ArticlesPage() {
  const news = await getLiveNews(40);

  return (
    <div className="container-page py-8 space-y-8">
      <SectionHeading title="News" />
      <p className="text-sm text-ink-soft -mt-2">
        Live headlines from trusted sources. Tap any story to read the full article at its source.
      </p>
      {news.length === 0 ? (
        <p className="text-ink-soft">Live feeds are temporarily unavailable. Check back shortly.</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {news.map((item, i) => (
            <LiveNewsCard key={`${item.link}-${i}`} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
