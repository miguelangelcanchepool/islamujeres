"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { signOut } from "@/app/admin/actions";

const links = [
  { href: "/admin", label: "Inicio" },
  { href: "/admin/lugares", label: "Lugares" },
  { href: "/admin/patrocinadores", label: "Patrocinadores" },
] as const;

const pending = ["Comercios", "Configuración"] as const;

export function AdminFrame({ email, children }: { email: string; children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function close() {
    setOpen(false);
  }

  return (
    <div className="admin-screen">
      <div className="admin-frame">
        <div className="admin-topbar">
          <button
            type="button"
            aria-expanded={open}
            aria-controls="menu-panel"
            onClick={() => setOpen((current) => !current)}
          >
            {open ? "Cerrar" : "Menú"}
          </button>
          <span>Panel de control</span>
        </div>
        {open ? (
          <button type="button" className="admin-backdrop" aria-label="Cerrar menú" onClick={close} />
        ) : null}
        <aside id="menu-panel" className={`admin-sidebar${open ? " is-open" : ""}`}>
          <Link href="/admin" className="admin-brand" onClick={close}>
            <span>Descubre</span>
            <strong>Isla Mujeres</strong>
          </Link>
          <nav aria-label="Secciones del panel">
            <ul className="admin-menu">
              {links.map((item) => {
                const current =
                  item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={current ? "page" : undefined}
                      onClick={close}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
              {pending.map((label) => (
                <li key={label}>
                  <span className="admin-nav-pending" aria-disabled="true">
                    {label}
                    <small>Pendiente</small>
                  </span>
                </li>
              ))}
            </ul>
          </nav>
          <div className="admin-sidebar-foot">
            <p>{email}</p>
            <form action={signOut}>
              <button type="submit">Cerrar sesión</button>
            </form>
          </div>
        </aside>
        <div className="admin-main">{children}</div>
      </div>
    </div>
  );
}
