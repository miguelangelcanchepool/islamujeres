"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav } from "@/lib/site";

export function SiteHeader() {
  const pathname = usePathname();
  const [solid, setSolid] = useState(false);
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("nav-open", open);
    return () => document.body.classList.remove("nav-open");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenPath(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={`site-header${solid || open ? " is-solid" : ""}${open ? " is-open" : ""}`}>
      <div className="header-bar">
        <Link href="/" className="brand">
          <span className="brand-kicker">Descubre</span>
          <span className="brand-name">Isla Mujeres</span>
        </Link>
        <nav className="site-nav" aria-label="Secciones">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-link"
              aria-current={pathname === item.href ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          className="menu-button"
          aria-expanded={open}
          aria-controls="menu-principal"
          onClick={() => setOpenPath(open ? null : pathname)}
        >
          {open ? "Cerrar" : "Menú"}
        </button>
      </div>
      {open ? (
        <div className="nav-panel" id="menu-principal" role="dialog" aria-label="Menú">
          <nav className="nav-panel-list">
            <Link href="/" aria-current={pathname === "/" ? "page" : undefined}>
              Inicio
            </Link>
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
