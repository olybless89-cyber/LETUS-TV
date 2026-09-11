"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/videos", label: "Videos" },
  { href: "/admin/social", label: "Social Posts" },
  { href: "/admin/polls", label: "Polls" },
  { href: "/admin/live", label: "Live Settings" },
  { href: "/admin/settings", label: "Site Settings" },
];

export function AdminNav({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="flex h-full w-56 shrink-0 flex-col border-r border-white/10 bg-[#0b1220] text-paper">
      <div className="border-b border-white/10 px-5 py-5">
        <span className="font-display text-lg font-bold">
          Letus<span className="text-blue-bright">TV</span>
        </span>
        <p className="mt-0.5 text-xs text-paper/50">Admin</p>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-sm px-3 py-2 font-display text-sm ${
                active ? "bg-blue text-paper" : "text-paper/70 hover:bg-white/5 hover:text-paper"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 px-3 py-4">
        <p className="truncate px-3 text-xs text-paper/40">{email}</p>
        <button
          onClick={handleLogout}
          className="mt-2 w-full rounded-sm px-3 py-2 text-left font-display text-sm text-paper/70 hover:bg-white/5 hover:text-paper"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}
