import type { Metadata } from "next";
import { getLiveNewsByCategory, type LiveNewsCategory } from "@/lib/rss";
import { LiveNewsCard } from "@/components/live-news-card";
import { SectionHeading } from "@/components/section-heading";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const VALID_CATEGORIES: LiveNewsCategory[] = [
  "politics",
  "business",
  "sports",
  "entertainment",
  "health",
  "tech",
  "world",
];

const LABELS: Record<LiveNewsCategory, string> = {
  politics: "Politics",
  business: "Business",
  sports: "Sports",
  entertainment: "Entertainment",
  health: "Health",
  tech: "Technology",
  world: "World",
};

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!VALID_CATEGORIES.includes(slug as LiveNewsCategory)) return {};
  return { title: `${LABELS[slug as LiveNewsCategory]} — Letus TV` };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const isValid = VALID_CATEGORIES.includes(slug as LiveNewsCategory);
  const category = slug as LiveNewsCategory;

  const news = isValid ? await getLiveNewsByCategory(category, 24) : [];

  return (
    <div className="container-page py-8 space-y-12">
      <SectionHeading title={isValid ? LABELS[category] : slug} />

      {news.length > 0 && (
        <section className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {news.map((item, i) => (
            <LiveNewsCard key={`${item.link}-${i}`} item={item} />
          ))}
        </section>
      )}

      {news.length === 0 && (
        <p className="text-ink-soft">Nothing live in this category right now.</p>
      )}
    </div>
  );
}
