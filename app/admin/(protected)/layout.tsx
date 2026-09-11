import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { AdminNav } from "@/components/admin/admin-nav";

export default async function ProtectedAdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <div className="flex min-h-screen">
      <AdminNav email={admin.email} />
      <main className="flex-1 overflow-y-auto bg-[#0b1220] p-6 sm:p-8">{children}</main>
    </div>
  );
}
