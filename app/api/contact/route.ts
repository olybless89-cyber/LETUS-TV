import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSiteSettings } from "@/lib/server-data";
import { sendContactNotification, sendContactAutoReply } from "@/lib/email";

const schema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  subject: z.string().max(300).optional(),
  message: z.string().min(1).max(5000),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
  }

  await prisma.contactMessage.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      subject: parsed.data.subject || null,
      message: parsed.data.message,
    },
  });

  // Fire-and-forget: a slow or failed email should never block the form from succeeding.
  (async () => {
    const settings = await getSiteSettings().catch(() => null);
    const notifyTo = settings?.contactEmail || "hello@letustv.com";
    await sendContactNotification({
      to: notifyTo,
      name: parsed.data.name,
      email: parsed.data.email,
      subject: parsed.data.subject || null,
      message: parsed.data.message,
    });
    await sendContactAutoReply({ to: parsed.data.email, name: parsed.data.name });
  })().catch((err) => console.error("Contact email flow failed:", err));

  return NextResponse.json({ ok: true });
}
