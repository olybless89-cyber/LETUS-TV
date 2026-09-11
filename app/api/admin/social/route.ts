import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { getAllSocialPostsForAdmin } from "@/lib/server-data";

const schema = z.object({
  platform: z.enum(["INSTAGRAM", "TIKTOK", "FACEBOOK"]),
  url: z.string().url(),
  caption: z.string().max(500).optional().nullable(),
  isActive: z.boolean().default(true),
  order: z.number().int().default(0),
});

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const posts = await getAllSocialPostsForAdmin();
  return NextResponse.json({ posts });
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid submission." }, { status: 400 });
  }

  const post = await prisma.socialPost.create({
    data: {
      platform: parsed.data.platform,
      url: parsed.data.url,
      caption: parsed.data.caption || null,
      isActive: parsed.data.isActive,
      order: parsed.data.order,
    },
  });

  return NextResponse.json({ post });
}
