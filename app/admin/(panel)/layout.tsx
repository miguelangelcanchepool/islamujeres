import { Suspense, type ReactNode } from "react";
import type { Metadata } from "next";
import { AdminFrame } from "@/components/admin/AdminFrame";
import { requireAdmin } from "@/lib/admin/session";

export const metadata: Metadata = {
  title: "Panel",
  robots: { index: false, follow: false },
};

export default function AdminPanelLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <main id="contenido" className="admin-screen admin-login">
          <p className="admin-quiet">Comprobando la sesión…</p>
        </main>
      }
    >
      <AdminGuard>{children}</AdminGuard>
    </Suspense>
  );
}

async function AdminGuard({ children }: { children: ReactNode }) {
  const admin = await requireAdmin();

  return <AdminFrame email={admin.email}>{children}</AdminFrame>;
}
