import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { getChannelVideos } from "@/lib/youtube";
import { getAllCategories } from "@/lib/server-data";
import { guessCategorySlug } from "@/lib/category-guess";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [channelVideos, categories] = await Promise.all([
    getChannelVideos(30),
    getAllCategories(),
  ]);

  const existing = await prisma.video.findMany({ select: { slug: true } });
  const existingSlugs = new Set(existing.map((v) => v.slug));

  const categoryBySlug = new Map(categories.map((c) => [c.slug, c.id]));
  const fallbackCategoryId = categories[0]?.id ?? null;

  const items = channelVideos.map((v) => {
    const slug = slugify(v.title);
    const guessedSlug = guessCategorySlug(v.title);
    const suggestedCategoryId = (guessedSlug && categoryBySlug.get(guessedSlug)) || fallbackCategoryId;
    return {
      youtubeId: v.id,
      title: v.title,
      thumbnailUrl: v.thumbnailUrl,
      publishedAt: v.publishedAt,
      slug,
      alreadyImported: existingSlugs.has(slug),
      suggestedCategoryId,
    };
  });

  return NextResponse.json({
    items,
    categories: categories.map((c) => ({ id: c.id, name: c.name })),
  });
}

const importSchema = z.object({
  selections: z
    .array(
      z.object({
        youtubeId: z.string().min(1),
        title: z.string().min(1),
        thumbnailUrl: z.string().url(),
        publishedAt: z.string(),
        categoryId: z.string().min(1),
      })
    )
    .min(1),
});

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = importSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid submission." }, { status: 400 });
  }

  let created = 0;
  let skipped = 0;

  for (const item of parsed.data.selections) {
    const slug = slugify(item.title);
    const exists = await prisma.video.findUnique({ where: { slug } });
    if (exists) {
      skipped++;
      continue;
    }

    await prisma.video.create({
      data: {
        title: item.title,
        slug,
        thumbnailUrl: item.thumbnailUrl,
        videoUrl: `https://www.youtube.com/watch?v=${item.youtubeId}`,
        videoType: "YOUTUBE",
        categoryId: item.categoryId,
        status: "PUBLISHED",
        publishedAt: new Date(item.publishedAt),
      },
    });
    created++;
  }

  return NextResponse.json({ created, skipped });
}
