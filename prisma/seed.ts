import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@letustv.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "ChangeMe123!";
const ADMIN_NAME = process.env.ADMIN_NAME ?? "Letus TV Admin";

type SeedArticle = {
  title: string; slug: string; excerpt: string;
  category: string; author: string; image: string;
  featured: boolean; views: number; daysAgo: number;
  tags: string[]; body: string[];
};
type SeedVideo = {
  title: string; slug: string; description: string;
  category: string; url: string;
  featured: boolean; views: number; daysAgo: number;
};

const seedData = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "prisma", "seed-data.json"), "utf8")
) as {
  categories: { name: string; slug: string; description: string; color: string }[];
  authors: { name: string; slug: string; email: string; bio: string }[];
  articles: SeedArticle[];
  videos: SeedVideo[];
  breaking: { headline: string; articleSlug: string; priority: number }[];
};

function buildBody(paragraphs: string[]): string {
  return paragraphs.map((p) => `<p>${p}</p>`).join("\n");
}

const DAY_MS = 24 * 60 * 60 * 1000;

async function main() {
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { name: ADMIN_NAME, passwordHash, role: "ADMIN" },
    create: { email: ADMIN_EMAIL, name: ADMIN_NAME, passwordHash, role: "ADMIN" },
  });

  for (const c of seedData.categories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, description: c.description, color: c.color, isActive: true },
      create: { name: c.name, slug: c.slug, description: c.description, color: c.color },
    });
  }

  for (const a of seedData.authors) {
    await prisma.author.upsert({
      where: { slug: a.slug },
      update: { name: a.name, bio: a.bio, email: a.email },
      create: { name: a.name, slug: a.slug, bio: a.bio, email: a.email },
    });
  }

  const categoriesDb = await prisma.category.findMany();
  const authorsDb = await prisma.author.findMany();
  const categoryBySlug = new Map(categoriesDb.map((c) => [c.slug, c.id]));
  const authorBySlug = new Map(authorsDb.map((a) => [a.slug, a.id]));

  for (const art of seedData.articles) {
    const categoryId = categoryBySlug.get(art.category);
    const authorId = authorBySlug.get(art.author);
    if (!categoryId || !authorId) {
      console.warn("Skipping", art.slug);
      continue;
    }
    const publishedAt = new Date(Date.now() - (art.daysAgo ?? 0) * DAY_MS);
    const slug = art.slug;
    const data = {
      title: art.title,
      slug,
      excerpt: art.excerpt,
      body: buildBody(art.body),
      featuredImage: art.image,
      publishedAt,
      status: "PUBLISHED" as const,
      views: art.views,
      isFeatured: art.featured,
      isBreaking: false,
      authorId,
      categoryId,
      seoTitle: art.title,
      seoDescription: art.excerpt,
      seoKeywords: art.tags.join(", "),
    };

    const existing = await prisma.article.findUnique({ where: { slug } });
    if (existing) {
      await prisma.article.update({ where: { slug }, data });
    } else {
      await prisma.article.create({ data });
    }

    for (const tagName of art.tags) {
      const tagSlug = tagName.toLowerCase().replace(/\s+/g, "-");
      const tag = await prisma.tag.upsert({
        where: { slug: tagSlug },
        update: {},
        create: { name: tagName, slug: tagSlug },
      });
      const article = await prisma.article.findUnique({ where: { slug } });
      if (article) {
        await prisma.articleTags.upsert({
          where: { articleId_tagId: { articleId: article.id, tagId: tag.id } },
          update: {},
          create: { articleId: article.id, tagId: tag.id },
        });
      }
    }
  }

  for (const v of seedData.videos) {
    const categoryId = categoryBySlug.get(v.category);
    if (!categoryId) {
      console.warn("Skipping", v.slug);
      continue;
    }
    const publishedAt = new Date(Date.now() - (v.daysAgo ?? 0) * DAY_MS);
    await prisma.video.upsert({
      where: { slug: v.slug },
      update: {
        title: v.title,
        description: v.description,
        categoryId,
        videoUrl: v.url,
        videoType: "YOUTUBE" as const,
        views: v.views,
        isFeatured: v.featured,
        publishedAt,
        status: "PUBLISHED" as const,
      },
      create: {
        title: v.title,
        slug: v.slug,
        description: v.description,
        categoryId,
        videoUrl: v.url,
        videoType: "YOUTUBE" as const,
        views: v.views,
        isFeatured: v.featured,
        publishedAt,
        status: "PUBLISHED" as const,
      },
    });
  }

  for (const b of seedData.breaking) {
    const article = await prisma.article.findUnique({ where: { slug: b.articleSlug } });
    if (article) {
      await prisma.breakingNews.createMany({
        data: [{
          headline: b.headline,
          content: null,
          isActive: true,
          priority: b.priority,
          articleId: article.id,
          startsAt: new Date(Date.now() - 24 * DAY_MS),
          expiresAt: new Date(Date.now() + 30 * DAY_MS),
        }],
        skipDuplicates: true,
      });
    }
  }

  await prisma.liveStreamSettings.upsert({
    where: { id: "live-main" },
    update: {
      streamUrl: "https://example.com/live/letus.m3u8",
      streamType: "HLS" as const,
      title: "Letus TV Live",
      description: "24/7 live television: news, current affairs and entertainment.",
      isLive: true,
      isVisible: true,
    },
    create: {
      id: "live-main",
      streamUrl: "https://example.com/live/letus.m3u8",
      streamType: "HLS" as const,
      title: "Letus TV Live",
      description: "24/7 live television: news, current affairs and entertainment.",
      isLive: true,
      isVisible: true,
    },
  });

  await prisma.siteSettings.upsert({
    where: { id: "site-main" },
    update: {
      siteName: "Letus TV",
      tagline: "Let's Watch. Let's Know. Let's Connect.",
      description: "A vibrant online television station bringing trusted news, current affairs, information and entertainment for audiences of all ages.",
      contactEmail: ADMIN_EMAIL,
      facebookUrl: "https://facebook.com/letustv",
      instagramUrl: "https://instagram.com/letustv",
      youtubeUrl: "https://youtube.com/@letustv",
      tiktokUrl: "https://tiktok.com/@letustv",
      twitterUrl: "https://x.com/letustv",
      footerText: "Let's Watch. Let's Know. Let's Connect.",
    },
    create: {
      id: "site-main",
      siteName: "Letus TV",
      tagline: "Let's Watch. Let's Know. Let's Connect.",
      description: "A vibrant online television station bringing trusted news, current affairs, information and entertainment for audiences of all ages.",
      contactEmail: ADMIN_EMAIL,
      facebookUrl: "https://facebook.com/letustv",
      instagramUrl: "https://instagram.com/letustv",
      youtubeUrl: "https://youtube.com/@letustv",
      tiktokUrl: "https://tiktok.com/@letustv",
      twitterUrl: "https://x.com/letustv",
      footerText: "Let's Watch. Let's Know. Let's Connect.",
    },
  });

  console.log("Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
