"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";

type Ally = {
  name: string;
  label: string;
  logo: string | null;
  href: string;
};

const allies: Ally[] = [
  { name: "ISLA MARINA", label: "DEMO", logo: null, href: "#" },
  { name: "CARIBE TOURS", label: "DEMO", logo: null, href: "#" },
  { name: "MAYA BEACH", label: "DEMO", logo: null, href: "#" },
  { name: "MAR AZUL", label: "DEMO", logo: null, href: "#" },
  { name: "ISLA LIFE", label: "DEMO", logo: null, href: "#" },
];

const AUTOPLAY_MS = 6500;
const PAUSE_MS = 12000;

function hasLogo(logo: string | null) {
  return typeof logo === "string" && logo.length > 0;
}

export function AlliesSection() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const pauseUntil = useRef(0);
  const drag = useRef({ x: 0, y: 0, active: false, moved: false });
  const [visible, setVisible] = useState(1);
  const [index, setIndex] = useState(0);
  const [motion, setMotion] = useState(true);

  const count = allies.length;
  const slides = [...allies, ...allies];
  const canSlide = visible < count;
  const active = index % count;

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const next = Number(
      getComputedStyle(track).getPropertyValue("--visible"),
    );
    if (!Number.isFinite(next) || next < 1) return;
    const shown = Math.max(1, Math.min(count - 1, Math.round(next)));
    setVisible(shown);
    setIndex((current) => (shown >= count ? 0 : current % count));
  }, [count]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [measure]);

  const hold = useCallback(() => {
    pauseUntil.current = Date.now() + PAUSE_MS;
  }, []);

  useEffect(() => {
    if (index < count || !motion) return;
    const track = trackRef.current;
    let settled = false;
    const snap = () => {
      if (settled) return;
      settled = true;
      setMotion(false);
      setIndex(0);
    };
    const timer = window.setTimeout(snap, 760);
    track?.addEventListener("transitionend", snap);
    return () => {
      window.clearTimeout(timer);
      track?.removeEventListener("transitionend", snap);
    };
  }, [index, count, motion]);

  useEffect(() => {
    if (motion || index === count) return;
    const frame = window.requestAnimationFrame(() => setMotion(true));
    return () => window.cancelAnimationFrame(frame);
  }, [motion, index, count]);

  const next = useCallback(() => {
    if (!canSlide) return;
    setMotion(true);
    setIndex((current) => (current >= count - 1 ? count : current + 1));
  }, [canSlide, count]);

  const prev = useCallback(() => {
    if (!canSlide) return;
    hold();
    if (index % count === 0) {
      setMotion(false);
      setIndex(count);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          setMotion(true);
          setIndex(count - 1);
        });
      });
      return;
    }
    setMotion(true);
    setIndex((current) => current - 1);
  }, [canSlide, count, hold, index]);

  const goTo = useCallback(
    (target: number) => {
      if (!canSlide) return;
      hold();
      setMotion(true);
      setIndex(target);
    },
    [canSlide, hold],
  );

  useEffect(() => {
    if (!canSlide) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      if (document.hidden || Date.now() < pauseUntil.current) return;
      next();
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [canSlide, next]);

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    drag.current = {
      x: event.clientX,
      y: event.clientY,
      active: true,
      moved: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    if (!drag.current.active) return;
    const dx = event.clientX - drag.current.x;
    const dy = event.clientY - drag.current.y;
    drag.current.active = false;
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
    drag.current.moved = true;
    hold();
    if (dx < 0) next();
    else prev();
  }

  function onAllyClick(
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) {
    if (drag.current.moved) {
      event.preventDefault();
      drag.current.moved = false;
      return;
    }
    if (href === "#") event.preventDefault();
  }

  return (
    <section
      className="allies"
      id="aliados"
      aria-roledescription="carrusel"
      aria-labelledby="aliados-titulo"
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") {
          event.preventDefault();
          hold();
          next();
        }
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          prev();
        }
      }}
    >
      <div className="allies-intro">
        <h2 id="aliados-titulo">Aliados de la isla</h2>
        <p>Empresas y marcas que creen en compartir lo mejor de Isla Mujeres.</p>
      </div>

      <div className="allies-rail">
        <button
          type="button"
          className="allies-nav"
          aria-label="Aliado anterior"
          onClick={prev}
          disabled={!canSlide}
        >
          ←
        </button>
        <div
          className="allies-viewport"
          ref={viewportRef}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => {
            drag.current.active = false;
          }}
        >
          <ul
            className={motion ? "allies-track" : "allies-track is-instant"}
            ref={trackRef}
            style={{ "--index": index } as CSSProperties}
          >
            {slides.map((ally, slideIndex) => (
              <li
                className="ally-slide"
                key={`${ally.name}-${slideIndex}`}
                aria-hidden={slideIndex >= count}
              >
                <a
                  className="ally"
                  href={ally.href}
                  tabIndex={slideIndex >= count ? -1 : undefined}
                  onClick={(event) => onAllyClick(event, ally.href)}
                >
                  {hasLogo(ally.logo) ? (
                    <Image
                      className="ally-logo"
                      src={ally.logo as string}
                      alt=""
                      width={120}
                      height={32}
                    />
                  ) : null}
                  <span className="ally-name">{ally.name}</span>
                  <span className="ally-label">{ally.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <button
          type="button"
          className="allies-nav"
          aria-label="Aliado siguiente"
          onClick={() => {
            hold();
            next();
          }}
          disabled={!canSlide}
        >
          →
        </button>
      </div>

      <div className="allies-dots" role="tablist" aria-label="Aliados visibles">
        {allies.map((ally, dotIndex) => (
          <button
            key={ally.name}
            type="button"
            className={
              canSlide && dotIndex === active
                ? "allies-dot is-current"
                : "allies-dot"
            }
            role="tab"
            aria-label={ally.name}
            aria-selected={canSlide ? dotIndex === active : undefined}
            onClick={() => goTo(dotIndex)}
          />
        ))}
      </div>

      <a
        className="allies-cta"
        href="#"
        onClick={(event) => event.preventDefault()}
      >
        ¿Quieres formar parte de Descubre Isla Mujeres?
      </a>
    </section>
  );
}
