import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { getAllArticlesForAdmin, getOrCreateAuthorForAdmin } from "@/lib/server-data";

const schema = z.object({
  title: z.string().min(1).max(300),
  slug: z.string().min(1).max(300),
  excerpt: z.string().max(500).optional().nullable(),
  body: z.string().min(1),
  featuredImage: z.string().url().optional().nullable().or(z.literal("")),
  categoryId: z.string().min(1),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  isFeatured: z.boolean().default(false),
  isBreaking: z.boolean().default(false),
});

function toParagraphs(text: string): string {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${p.replace(/\n/g, "<br />")}</p>`)
    .join("\n");
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const articles = await getAllArticlesForAdmin();
  return NextResponse.json({ articles });
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid submission." }, { status: 400 });
  }

  const existing = await prisma.article.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) {
    return NextResponse.json({ error: "An article with this slug already exists." }, { status: 409 });
  }

  const author = await getOrCreateAuthorForAdmin(admin);

  const article = await prisma.article.create({
    data: {
      title: parsed.data.title,
      slug: parsed.data.slug,
      excerpt: parsed.data.excerpt || null,
      body: toParagraphs(parsed.data.body),
      featuredImage: parsed.data.featuredImage || null,
      categoryId: parsed.data.categoryId,
      authorId: author.id,
      status: parsed.data.status,
      isFeatured: parsed.data.isFeatured,
      isBreaking: parsed.data.isBreaking,
      publishedAt: parsed.data.status === "PUBLISHED" ? new Date() : null,
    },
  });

  return NextResponse.json({ article });
}
