import Parser from "rss-parser";

export type LiveNewsCategory =
  | "politics"
  | "business"
  | "sports"
  | "entertainment"
  | "health"
  | "tech"
  | "world";

export type LiveNewsItem = {
  title: string;
  link: string;
  excerpt: string;
  source: string;
  imageUrl: string | null;
  publishedAt: Date;
  category: LiveNewsCategory;
};

type FeedSource = {
  name: string;
  url: string;
  category: LiveNewsCategory;
};

// Real, publicly syndicated RSS feeds. Add/remove sources here.
const FEEDS: FeedSource[] = [
  { name: "Premium Times", url: "https://www.premiumtimesng.com/feed", category: "politics" },
  { name: "Punch Nigeria", url: "https://punchng.com/feed/", category: "politics" },
  { name: "Vanguard Nigeria", url: "https://www.vanguardngr.com/feed/", category: "world" },
  { name: "The Guardian Nigeria", url: "https://guardian.ng/feed/", category: "world" },
  { name: "BusinessDay NG", url: "https://businessday.ng/feed/", category: "business" },
  { name: "TechCabal", url: "https://techcabal.com/feed/", category: "tech" },
  { name: "BBC Africa", url: "https://feeds.bbci.co.uk/news/world/africa/rss.xml", category: "world" },
  { name: "Reuters World", url: "https://www.reutersagency.com/feed/?best-topics=world&post_type=best", category: "world" },
];

const parser = new Parser({
  timeout: 8000,
  headers: { "User-Agent": "Mozilla/5.0 (compatible; LetusTV/1.0)" },
});

type CacheEntry = { items: LiveNewsItem[]; fetchedAt: number };
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
let cache: CacheEntry | null = null;

function extractImage(item: Parser.Item & { [key: string]: unknown }): string | null {
  const mediaContent = item["media:content"] as { $: { url?: string } } | undefined;
  if (mediaContent?.$?.url) return mediaContent.$.url;

  const enclosure = item.enclosure as { url?: string } | undefined;
  if (enclosure?.url) return enclosure.url;

  const contentHtml = (item["content:encoded"] as string) || item.content || "";
  const match = contentHtml.match(/<img[^>]+src="([^">]+)"/);
  if (match) return match[1];

  return null;
}

function stripHtml(html: string | undefined): string {
  if (!html) return "";
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchFeed(source: FeedSource): Promise<LiveNewsItem[]> {
  try {
    const feed = await parser.parseURL(source.url);
    return (feed.items || []).slice(0, 15).map((item) => ({
      title: item.title?.trim() || "Untitled",
      link: item.link || "",
      excerpt: stripHtml(item.contentSnippet || item.summary || item.content).slice(0, 220),
      source: source.name,
      imageUrl: extractImage(item as Parser.Item & { [key: string]: unknown }),
      publishedAt: item.isoDate ? new Date(item.isoDate) : new Date(),
      category: source.category,
    }));
  } catch {
    // A single dead/slow feed should never take down the page.
    return [];
  }
}

async function fetchAllFeeds(): Promise<LiveNewsItem[]> {
  const results = await Promise.allSettled(FEEDS.map(fetchFeed));
  const items = results.flatMap((r) => (r.status === "fulfilled" ? r.value : []));
  items.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  return items.filter((item) => item.link && item.title);
}

async function getCachedLiveNews(): Promise<LiveNewsItem[]> {
  const now = Date.now();
  if (cache && now - cache.fetchedAt < CACHE_TTL_MS) {
    return cache.items;
  }
  const items = await fetchAllFeeds();
  if (items.length > 0) {
    cache = { items, fetchedAt: now };
    return items;
  }
  // All feeds failed this cycle — serve stale cache rather than an empty page, if we have one.
  return cache?.items ?? [];
}

export async function getLiveNews(limit: number = 20): Promise<LiveNewsItem[]> {
  const items = await getCachedLiveNews();
  return items.slice(0, limit);
}

export async function getLiveNewsByCategory(
  category: LiveNewsCategory,
  limit: number = 12
): Promise<LiveNewsItem[]> {
  const items = await getCachedLiveNews();
  return items.filter((item) => item.category === category).slice(0, limit);
}
