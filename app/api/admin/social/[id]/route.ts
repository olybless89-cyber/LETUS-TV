import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

const schema = z.object({
  platform: z.enum(["INSTAGRAM", "TIKTOK", "FACEBOOK"]),
  url: z.string().url(),
  caption: z.string().max(500).optional().nullable(),
  isActive: z.boolean().default(true),
  order: z.number().int().default(0),
});

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid submission." }, { status: 400 });
  }

  const post = await prisma.socialPost.update({
    where: { id },
    data: {
      platform: parsed.data.platform,
      url: parsed.data.url,
      caption: parsed.data.caption || null,
      isActive: parsed.data.isActive,
      order: parsed.data.order,
    },
  }).catch(() => null);

  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ post });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.socialPost.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
