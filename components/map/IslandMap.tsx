"use client";

import { useEffect, useRef, useState } from "react";
import {
  AttributionControl,
  LngLatBounds,
  Map,
  Marker,
  NavigationControl,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { islandCenter, islandMaxBounds, mapStyleUrl } from "@/lib/map/style";
import { hasCoordinates } from "@/lib/places/geo";
import type { Place } from "@/lib/places/types";

type IslandMapProps = {
  places: Place[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
};

type MapStatus = "loading" | "ready" | "error";

export function IslandMap({ places, selectedId, onSelect }: IslandMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const onSelectRef = useRef(onSelect);
  const placesRef = useRef(places);
  const ignoreMapClick = useRef(false);
  const [status, setStatus] = useState<MapStatus>("loading");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    onSelectRef.current = onSelect;
    placesRef.current = places;
  }, [onSelect, places]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let active = true;
    const map = new Map({
      container,
      style: mapStyleUrl,
      center: islandCenter,
      zoom: 12.2,
      minZoom: 11,
      maxZoom: 18,
      maxBounds: islandMaxBounds,
      maxPitch: 0,
      dragRotate: false,
      pitchWithRotate: false,
      touchPitch: false,
      attributionControl: false,
      locale: {
        "NavigationControl.ZoomIn": "Acercar",
        "NavigationControl.ZoomOut": "Alejar",
        "AttributionControl.ToggleAttribution": "Atribución del mapa",
      },
    });

    map.addControl(
      new NavigationControl({ showCompass: false, visualizePitch: false }),
      "top-right",
    );
    map.addControl(new AttributionControl({ compact: false }), "bottom-right");

    const fail = () => {
      if (active) setStatus("error");
    };
    const timer = window.setTimeout(() => {
      if (!map.loaded()) fail();
    }, 12000);

    map.on("load", () => {
      if (!active) return;
      window.clearTimeout(timer);
      map.resize();
      setStatus("ready");
    });
    map.on("error", (event) => {
      const message = event.error?.message ?? "";
      if (!map.loaded() && /style|fetch|network|ajax|Failed/i.test(message)) fail();
    });
    map.on("click", () => {
      if (ignoreMapClick.current) {
        ignoreMapClick.current = false;
        return;
      }
      onSelectRef.current(null);
    });

    mapRef.current = map;

    return () => {
      active = false;
      window.clearTimeout(timer);
      for (const marker of markersRef.current) marker.remove();
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, [attempt]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || status !== "ready") return;

    for (const marker of markersRef.current) marker.remove();
    markersRef.current = [];

    for (const place of places) {
      if (!hasCoordinates(place)) continue;
      const button = document.createElement("button");
      button.type = "button";
      button.className = [
        "map-pin",
        `map-pin-${place.category}`,
        place.visibility === "destacado" ? "is-featured" : "",
        place.visibility === "aliado" ? "is-ally" : "",
        place.id === selectedId ? "is-selected" : "",
      ]
        .filter(Boolean)
        .join(" ");
      button.setAttribute("aria-label", place.name);
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        ignoreMapClick.current = true;
        onSelectRef.current(place.id);
      });

      const marker = new Marker({ element: button, anchor: "center" })
        .setLngLat([place.coordinates.longitude, place.coordinates.latitude])
        .addTo(map);
      markersRef.current.push(marker);
    }
  }, [places, selectedId, status]);

  const locatedKey = places
    .filter(hasCoordinates)
    .map((place) => place.id)
    .join("|");

  useEffect(() => {
    const map = mapRef.current;
    if (!map || status !== "ready") return;

    const located = placesRef.current.filter(hasCoordinates);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reduce ? 0 : 700;

    if (located.length === 0) {
      map.easeTo({ center: islandCenter, zoom: 12.2, duration });
      return;
    }

    if (located.length === 1) {
      map.easeTo({
        center: [located[0].coordinates.longitude, located[0].coordinates.latitude],
        zoom: 15,
        duration,
      });
      return;
    }

    const bounds = new LngLatBounds();
    for (const place of located) {
      bounds.extend([place.coordinates.longitude, place.coordinates.latitude]);
    }
    map.fitBounds(bounds, { padding: 56, maxZoom: 14.6, duration });
  }, [locatedKey, status]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || status !== "ready" || !selectedId) return;
    const place = placesRef.current.find((item) => item.id === selectedId);
    if (!place || !hasCoordinates(place)) return;
    const target: [number, number] = [
      place.coordinates.longitude,
      place.coordinates.latitude,
    ];
    if (map.getBounds().contains(target)) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    map.easeTo({
      center: target,
      zoom: Math.max(map.getZoom(), 14.5),
      duration: reduce ? 0 : 500,
    });
  }, [selectedId, status]);

  return (
    <div className="island-map">
      <div
        ref={containerRef}
        className="island-map-canvas"
        role="application"
        aria-label="Mapa de Isla Mujeres"
      />
      {status === "loading" ? (
        <p className="island-map-status" role="status">
          Cargando el mapa…
        </p>
      ) : null}
      {status === "error" ? (
        <div className="island-map-status" role="alert">
          <p>No se pudo cargar el mapa. La lista de lugares sigue disponible.</p>
          <button
            type="button"
            onClick={() => {
              setStatus("loading");
              setAttempt((current) => current + 1);
            }}
          >
            Reintentar
          </button>
        </div>
      ) : null}
    </div>
  );
}
