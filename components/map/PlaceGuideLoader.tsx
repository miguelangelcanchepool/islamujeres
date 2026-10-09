"use client";

import dynamic from "next/dynamic";
import type { Place } from "@/lib/places/types";

const PlaceGuide = dynamic(
  () => import("@/components/map/PlaceGuide").then((mod) => mod.PlaceGuide),
  {
    ssr: false,
    loading: () => (
      <div className="guide-stage">
        <div className="island-map">
          <p className="island-map-status" role="status">
            Cargando el mapa…
          </p>
        </div>
      </div>
    ),
  },
);

export function PlaceGuideLoader({ places }: { places: Place[] }) {
  return <PlaceGuide places={places} />;
}
