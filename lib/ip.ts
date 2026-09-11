import { createHash } from "crypto";
import { headers } from "next/headers";

export async function getRequestIpHash(): Promise<string | null> {
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    null;
  if (!ip) return null;
  return createHash("sha256").update(ip).digest("hex");
}
