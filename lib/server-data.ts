import { prisma } from "@/lib/db";

export async function getCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: {
          articles: true,
          videos: true,
        },
      },
    },
  });
}

export async function getAllCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: {
          articles: true,
          videos: true,
        },
      },
    },
  });
}

export async function getAllAuthors() {
  return prisma.author.findMany({
    orderBy: { name: "asc" },
  });
}

export async function getAllUsers() {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
}
export async function getTrendingArticles(limit: number = 5, days: number = 30) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const rows = await prisma.articleView.groupBy({
    by: ["articleId"],
    where: { viewedAt: { gte: since } },
    _count: { articleId: true },
    orderBy: { _count: { articleId: "desc" } },
    take: limit * 3,
  });
  const ids = rows.map((r) => r.articleId);
  if (ids.length === 0) return [];
  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    include: { category: true, author: true },
  });
  return rows
    .map((r) => articles.find((a) => a.id === r.articleId))
    .filter((a) => a !== undefined)
    .slice(0, limit);
}
export async function getLatestArticles(limit: number = 8) {
  return prisma.article.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    include: { category: true, author: true },
    take: limit,
  });
}

export async function getActiveBreakingNews() {
  return prisma.breakingNews.findMany({
    where: { isActive: true, expiresAt: { gte: new Date() } },
    orderBy: { priority: "desc" },
    include: { article: true },
  });
}

export async function getFeaturedArticles(limit: number = 5) {
  return prisma.article.findMany({
    where: { status: "PUBLISHED", isFeatured: true },
    orderBy: { publishedAt: "desc" },
    include: { category: true, author: true },
    take: limit,
  });
}
export async function getHeroArticles(limit: number = 5) {
  return prisma.article.findMany({
    where: { status: "PUBLISHED", isFeatured: true },
    orderBy: { publishedAt: "desc" },
    include: { category: true, author: true },
    take: limit,
  });
}

export async function getLatestVideos(limit: number = 8) {
  return prisma.video.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    include: { category: true },
    take: limit,
  });
}

export async function getFeaturedVideos(limit: number = 4) {
  return prisma.video.findMany({
    where: { status: "PUBLISHED", isFeatured: true },
    orderBy: { publishedAt: "desc" },
    include: { category: true },
    take: limit,
  });
}

export async function getLiveStreamSettings() {
  return prisma.liveStreamSettings.findFirst({
    orderBy: { updatedAt: "desc" },
  });
}
export async function getArticleBySlug(slug: string) {
  return prisma.article.findUnique({
    where: { slug },
    include: { category: true, author: true, tags: { include: { tag: true } } },
  });
}

export async function getRelatedArticles(articleId: string, categoryId: string, limit: number =  4) {
  return prisma.article.findMany({
    where: { status: "PUBLISHED", categoryId, id: { not: articleId } },
    orderBy: { publishedAt: "desc" },
    include: { category: true },
    take: limit,
  });
}

export async function getArticlesByCategory(categorySlug: string, limit: number =  12) {
  return prisma.article.findMany({
    where: { status: "PUBLISHED", category: { isActive: true, slug: categorySlug } },
    orderBy: { publishedAt: "desc" },
    include: { category: true, author: true },
    take: limit,
  });
}

export async function getPublishedArticleCount() {
  return prisma.article.count({ where: { status: "PUBLISHED" } });
}

export async function getDraftArticleCount() {
  return prisma.article.count({ where: { status: "DRAFT" } });
}

export async function getTotalArticleViews() {
  const agg = await prisma.articleView.aggregate({ _count: { _all: true } });
  return agg._count._all ?? 0;
}
