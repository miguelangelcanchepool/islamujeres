import { categoryLabel, visibilityLabel } from "@/lib/places/categories";
import type { Place } from "@/lib/places/types";

type PlaceListProps = {
  places: Place[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export function PlaceList({ places, selectedId, onSelect }: PlaceListProps) {
  if (places.length === 0) {
    return (
      <p className="guide-empty" role="status">
        Ningún lugar publicado coincide con este filtro.
      </p>
    );
  }

  const unlocated = places.every((place) => !place.coordinates);

  return (
    <div className="guide-results">
      {unlocated ? (
        <p className="guide-note" role="status">
          Estos registros no tienen coordenadas publicadas, así que el mapa no
          muestra marcadores.
        </p>
      ) : null}
      <h3 className="guide-results-title">Resultados</h3>
      <ul className="guide-list">
        {places.map((place) => {
          const selected = place.id === selectedId;
          return (
            <li key={place.id}>
              <button
                type="button"
                id={`lugar-${place.id}`}
                className={selected ? "guide-result is-current" : "guide-result"}
                aria-pressed={selected}
                onClick={() => onSelect(place.id)}
              >
                <span
                  className={`guide-dot guide-dot-${place.category}${place.visibility === "destacado" ? " is-featured" : ""}`}
                  aria-hidden="true"
                />
                <span className="guide-result-copy">
                  <strong>{place.name}</strong>
                  <span>{categoryLabel[place.category]}</span>
                </span>
                <span className="guide-badges">
                  {place.origin === "demostracion" ? (
                    <em>Demostración</em>
                  ) : null}
                  {place.visibility !== "informativo" ? (
                    <em className={place.visibility === "destacado" ? "is-featured" : undefined}>
                      {visibilityLabel[place.visibility]}
                    </em>
                  ) : null}
                  {!place.coordinates ? <em>Sin ubicación</em> : null}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
