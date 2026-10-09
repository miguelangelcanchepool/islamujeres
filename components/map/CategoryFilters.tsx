import { categoryLabel } from "@/lib/places/categories";
import { placeCategories, type Place, type PlaceFilter } from "@/lib/places/types";

type CategoryFiltersProps = {
  places: Place[];
  value: PlaceFilter;
  onChange: (value: PlaceFilter) => void;
};

const filters: { id: PlaceFilter; label: string }[] = [
  { id: "todos", label: "Todos los lugares" },
  ...placeCategories.map((id) => ({ id, label: categoryLabel[id] })),
];

export function CategoryFilters({ places, value, onChange }: CategoryFiltersProps) {
  return (
    <div className="guide-filters" role="toolbar" aria-label="Filtrar lugares">
      {filters.map((filter) => {
        const count =
          filter.id === "todos"
            ? places.length
            : places.filter((place) => place.category === filter.id).length;
        const current = value === filter.id;
        return (
          <button
            key={filter.id}
            type="button"
            className={current ? "guide-filter is-current" : "guide-filter"}
            aria-pressed={current}
            onClick={() => onChange(filter.id)}
          >
            {filter.label}
            <span className="guide-count">{count}</span>
          </button>
        );
      })}
    </div>
  );
}
