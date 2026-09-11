import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page flex flex-col items-center justify-center py-32 text-center">
      <span className="font-display text-sm font-bold text-blue">404</span>
      <h1 className="mt-2 font-display text-3xl font-bold text-ink">Off air</h1>
      <p className="mt-2 max-w-sm text-ink-soft">
        This page doesn&apos;t exist, or it might have been moved.
      </p>
      <Link href="/" className="mt-6 bg-blue px-5 py-2.5 font-display text-sm font-bold text-paper">
        Back to Letus TV
      </Link>
    </div>
  );
}
