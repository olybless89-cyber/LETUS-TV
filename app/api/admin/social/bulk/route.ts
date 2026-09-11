import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { detectSocialPlatform } from "@/lib/social-platform";

const schema = z.object({ urls: z.string().min(1) });

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
  }

  const lines = parsed.data.urls
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const existingCount = await prisma.socialPost.count();
  let created = 0;
  const skipped: { url: string; reason: string }[] = [];

  for (let i = 0; i < lines.length; i++) {
    const url = lines[i];
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      skipped.push({ url, reason: "Not a valid URL" });
      continue;
    }

    const platform = detectSocialPlatform(parsedUrl.toString());
    if (!platform) {
      skipped.push({ url, reason: "Not a recognized Instagram/TikTok/Facebook link" });
      continue;
    }

    const exists = await prisma.socialPost.findFirst({ where: { url: parsedUrl.toString() } });
    if (exists) {
      skipped.push({ url, reason: "Already added" });
      continue;
    }

    await prisma.socialPost.create({
      data: {
        platform,
        url: parsedUrl.toString(),
        isActive: true,
        order: existingCount + created,
      },
    });
    created++;
  }

  return NextResponse.json({ created, skipped });
}
