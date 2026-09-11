import Link from "next/link";

export function SectionHeading({
  title,
  href,
  hrefLabel = "See all",
  accent,
}: {
  title: string;
  href?: string;
  hrefLabel?: string;
  accent?: string | null;
}) {
  return (
    <div className="flex items-center justify-between border-b-2 pb-2" style={{ borderColor: accent ?? "#0b1220" }}>
      <h2 className="font-display text-xl font-bold text-ink sm:text-2xl">{title}</h2>
      {href && (
        <Link href={href} className="font-display text-sm text-blue hover:underline">
          {hrefLabel}
        </Link>
      )}
    </div>
  );
}
