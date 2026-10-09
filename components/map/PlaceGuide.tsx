"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CategoryFilters } from "@/components/map/CategoryFilters";
import { IslandMap } from "@/components/map/IslandMap";
import { PlaceCard } from "@/components/map/PlaceCard";
import { PlaceList } from "@/components/map/PlaceList";
import type { Place, PlaceFilter } from "@/lib/places/types";

type PlaceGuideProps = {
  places: Place[];
};

export function PlaceGuide({ places }: PlaceGuideProps) {
  const [filter, setFilter] = useState<PlaceFilter>("todos");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const visible = useMemo(
    () =>
      filter === "todos"
        ? places
        : places.filter((place) => place.category === filter),
    [filter, places],
  );

  const selected = visible.find((place) => place.id === selectedId) ?? null;

  useEffect(() => {
    if (!selected) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    cardRef.current?.scrollIntoView({
      block: "nearest",
      behavior: reduce ? "auto" : "smooth",
    });
    cardRef.current
      ?.querySelector<HTMLElement>("#ficha-titulo")
      ?.focus({ preventScroll: true });
  }, [selected]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function changeFilter(next: PlaceFilter) {
    setFilter(next);
    setSelectedId((current) => {
      if (!current) return null;
      const pool =
        next === "todos" ? places : places.filter((place) => place.category === next);
      return pool.some((place) => place.id === current) ? current : null;
    });
  }

  function closeCard() {
    const current = selectedId;
    setSelectedId(null);
    if (!current) return;
    document.getElementById(`lugar-${current}`)?.focus();
  }

  return (
    <div className="guide-body">
      <CategoryFilters places={places} value={filter} onChange={changeFilter} />
      <div className="guide-stage">
        <IslandMap places={visible} selectedId={selected?.id ?? null} onSelect={setSelectedId} />
        <div className="guide-panel">
          {selected ? (
            <div ref={cardRef}>
              <PlaceCard place={selected} onClose={closeCard} />
            </div>
          ) : (
            <p className="guide-hint">
              Elige un marcador o un resultado para abrir su ficha.
            </p>
          )}
          <PlaceList
            places={visible}
            selectedId={selected?.id ?? null}
            onSelect={setSelectedId}
          />
        </div>
      </div>
    </div>
  );
}
