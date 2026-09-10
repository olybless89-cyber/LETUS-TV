import type { Article, Category, Author, Video } from "@prisma/client";

export type ArticleWithRelations = Article & {
  category: Category;
  author: Author;
  tags?: { tag: { name: string; slug: string } }[];
};

export type VideoWithCategory = Video & { category: Category };

export type CategoryWithCount = Category & {
  _count: { articles: number; videos: number };
};