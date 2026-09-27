import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { sendSubscriberWelcome } from "@/lib/email";

const schema = z.object({ email: z.string().email() });

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email." }, { status: 400 });
  }

  const existing = await prisma.subscriber.findUnique({ where: { email: parsed.data.email } });

  await prisma.subscriber.upsert({
    where: { email: parsed.data.email },
    update: {},
    create: { email: parsed.data.email },
  });

  // Only welcome genuinely new subscribers, never re-send on a repeat submission.
  if (!existing) {
    sendSubscriberWelcome({ to: parsed.data.email }).catch((err) =>
      console.error("Welcome email failed:", err)
    );
  }

  return NextResponse.json({ ok: true });
}
