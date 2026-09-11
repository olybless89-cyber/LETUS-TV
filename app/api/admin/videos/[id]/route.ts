import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

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

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const video = await prisma.video.findUnique({ where: { id } });
  if (!video) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ video });
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = videoSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid submission." }, { status: 400 });
  }

  const conflict = await prisma.video.findFirst({ where: { slug: parsed.data.slug, NOT: { id } } });
  if (conflict) {
    return NextResponse.json({ error: "Another video already uses this slug." }, { status: 409 });
  }

  const current = await prisma.video.findUnique({ where: { id } });
  if (!current) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const video = await prisma.video.update({
    where: { id },
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
      publishedAt:
        parsed.data.status === "PUBLISHED" && !current.publishedAt ? new Date() : current.publishedAt,
    },
  });

  return NextResponse.json({ video });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.video.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
