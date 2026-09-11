import Parser from "rss-parser";

export const LETUS_TV_CHANNEL_ID = "UCPjeBKYq8V97xWerZIPRifg";

export type YouTubeVideoItem = {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: Date;
};

const parser = new Parser({
  timeout: 8000,
  headers: { "User-Agent": "Mozilla/5.0 (compatible; LetusTV/1.0)" },
});

type CacheEntry = { items: YouTubeVideoItem[]; fetchedAt: number };
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes
let cache: CacheEntry | null = null;

function extractVideoId(link: string | undefined): string | null {
  if (!link) return null;
  const match = link.match(/[?&]v=([^&]+)/);
  return match ? match[1] : null;
}

async function fetchChannelVideos(): Promise<YouTubeVideoItem[]> {
  try {
    const feed = await parser.parseURL(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${LETUS_TV_CHANNEL_ID}`
    );
    return (feed.items || [])
      .map((item) => {
        const id = extractVideoId(item.link);
        if (!id) return null;
        return {
          id,
          title: item.title?.trim() || "Untitled",
          description: (item.contentSnippet || item.content || "").slice(0, 300),
          thumbnailUrl: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
          publishedAt: item.isoDate ? new Date(item.isoDate) : new Date(),
        };
      })
      .filter((v): v is YouTubeVideoItem => v !== null);
  } catch {
    return [];
  }
}

async function getCachedChannelVideos(): Promise<YouTubeVideoItem[]> {
  const now = Date.now();
  if (cache && now - cache.fetchedAt < CACHE_TTL_MS) return cache.items;
  const items = await fetchChannelVideos();
  if (items.length > 0) {
    cache = { items, fetchedAt: now };
    return items;
  }
  return cache?.items ?? [];
}

export async function getChannelVideos(limit: number = 12): Promise<YouTubeVideoItem[]> {
  const items = await getCachedChannelVideos();
  return items.slice(0, limit);
}

export async function getChannelVideoById(id: string): Promise<YouTubeVideoItem | null> {
  const items = await getCachedChannelVideos();
  return items.find((v) => v.id === id) ?? null;
}

