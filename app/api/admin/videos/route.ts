import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { getAllVideosForAdmin } from "@/lib/server-data";

const videoSchema = z.object({
  title: z.string().min(1).max(300),
  slug: z.string().min(1).max(300),
  description: z.string().max(3000).optional().nullable(),
  thumbnailUrl: z.string().url().optional().nullable().or(z.literal("")),
  videoUrl: z.string().url(),
  videoType: z.enum(["YOUTUBE", "INSTAGRAM", "TIKTOK", "FACEBOOK", "EXTERNAL", "SELF_HOSTED"]),
  categoryId: z.string().min(1),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  isFeatured: z.boolean().default(false),
  duration: z.string().max(20).optional().nullable(),
});

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const videos = await getAllVideosForAdmin();
  return NextResponse.json({ videos });
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = videoSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid submission." }, { status: 400 });
  }

  const existing = await prisma.video.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) {
    return NextResponse.json({ error: "A video with this slug already exists." }, { status: 409 });
  }

  const video = await prisma.video.create({
    data: {
      title: parsed.data.title,
      slug: parsed.data.slug,
      description: parsed.data.description || null,
      thumbnailUrl: parsed.data.thumbnailUrl || null,
      videoUrl: parsed.data.videoUrl,
      videoType: parsed.data.videoType,
      categoryId: parsed.data.categoryId,
      status: parsed.data.status,
      isFeatured: parsed.data.isFeatured,
      duration: parsed.data.duration || null,
      publishedAt: parsed.data.status === "PUBLISHED" ? new Date() : null,
    },
  });

  return NextResponse.json({ video });
}
