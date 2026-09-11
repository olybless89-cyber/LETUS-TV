import Image from "next/image";
import Link from "next/link";
import type { Article, Category, Author } from "@prisma/client";
import { timeAgo } from "@/lib/utils";

type Props = {
  article: Article & { category: Category; author?: Author };
  variant?: "default" | "compact" | "horizontal";
};

export function ArticleCard({ article, variant = "default" }: Props) {
  if (variant === "horizontal") {
    return (
      <Link href={`/articles/${article.slug}`} className="group flex gap-4 py-4 border-b border-line">
        <div className="relative h-20 w-28 shrink-0 overflow-hidden bg-line">
          {article.featuredImage && (
            <Image src={article.featuredImage} alt={article.title} fill className="object-cover" />
          )}
        </div>
        <div className="min-w-0">
          <span className="font-display text-xs font-semibold" style={{ color: article.category.color ?? "#1642c5" }}>
            {article.category.name}
          </span>
          <h3 className="mt-1 font-display text-base font-semibold leading-snug text-ink group-hover:text-blue">
            {article.title}
          </h3>
          <span className="mt-1 block text-xs text-ink-soft">{timeAgo(article.publishedAt)}</span>
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link href={`/articles/${article.slug}`} className="group block border-b border-line py-3">
        <span className="font-display text-xs font-semibold" style={{ color: article.category.color ?? "#1642c5" }}>
          {article.category.name}
        </span>
        <h3 className="mt-1 font-display text-sm font-semibold leading-snug text-ink group-hover:text-blue">
          {article.title}
        </h3>
      </Link>
    );
  }

  return (
    <Link href={`/articles/${article.slug}`} className="group block">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-line">
        {article.featuredImage && (
          <Image
            src={article.featuredImage}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        )}
      </div>
      <div className="pt-3">
        <span className="font-display text-xs font-semibold" style={{ color: article.category.color ?? "#1642c5" }}>
          {article.category.name}
        </span>
        <h3 className="mt-1 font-display text-lg font-semibold leading-snug text-ink group-hover:text-blue">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="mt-1 line-clamp-2 text-sm text-ink-soft">{article.excerpt}</p>
        )}
        <div className="mt-2 flex items-center gap-2 text-xs text-ink-soft">
          {article.author?.name && <span>{article.author.name}</span>}
          <span>&middot;</span>
          <span>{timeAgo(article.publishedAt)}</span>
        </div>
      </div>
    </Link>
  );
}
