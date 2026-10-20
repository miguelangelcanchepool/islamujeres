import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/app/admin/login/login-form";
import { getAdminAccess } from "@/lib/admin/session";

export const metadata: Metadata = {
  title: "Acceso",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main id="contenido" className="admin-screen admin-login">
      <div className="admin-card">
        <p className="eyebrow">Acceso</p>
        <h1>Panel de la guía.</h1>
        <p className="lede">Solo una cuenta autorizada puede entrar. No hay registro público.</p>
        <Suspense fallback={<p className="admin-note">Cargando el acceso…</p>}>
          <LoginGate />
        </Suspense>
      </div>
    </main>
  );
}

async function LoginGate() {
  const access = await getAdminAccess();
  if (access.kind === "admin") redirect("/admin");
  return <LoginForm denied={access.kind === "forbidden"} />;
}
