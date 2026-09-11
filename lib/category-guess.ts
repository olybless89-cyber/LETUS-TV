const KEYWORD_MAP: { slug: string; keywords: string[] }[] = [
  { slug: "sports", keywords: ["match", "league", "football", "npfl", "afcon", "boxing", "athlete", "world cup", "tournament", "coach"] },
  { slug: "politics", keywords: ["president", "senate", "election", "government", "policy", "tinubu", "assembly", "minister", "governor", "inec", "party"] },
  { slug: "business", keywords: ["market", "economy", "naira", "bank", "business", "investment", "trade", "startup", "revenue", "fx", "inflation"] },
  { slug: "entertainment", keywords: ["movie", "music", "celebrity", "nollywood", "album", "premiere", "concert", "actor", "actress", "wedding"] },
  { slug: "health", keywords: ["health", "hospital", "disease", "vaccine", "doctor", "clinic", "wellness", "medical"] },
  { slug: "tech", keywords: ["tech", " ai ", "app", "startup", "software", "internet", "digital", "cyber", "gadget"] },
];

export function guessCategorySlug(title: string): string | null {
  const lower = ` ${title.toLowerCase()} `;
  for (const entry of KEYWORD_MAP) {
    if (entry.keywords.some((k) => lower.includes(k))) return entry.slug;
  }
  return null;
}
