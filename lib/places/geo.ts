import type { Place, PlaceCoordinates } from "@/lib/places/types";

export function formatCoordinates(coordinates: PlaceCoordinates) {
  const latitude = Math.abs(coordinates.latitude).toFixed(5);
  const longitude = Math.abs(coordinates.longitude).toFixed(5);
  const latHemisphere = coordinates.latitude >= 0 ? "N" : "S";
  const lngHemisphere = coordinates.longitude >= 0 ? "E" : "O";
  return `${latitude}° ${latHemisphere}, ${longitude}° ${lngHemisphere}`;
}

export function directionsUrl(coordinates: PlaceCoordinates) {
  const { latitude, longitude } = coordinates;
  return `https://www.openstreetmap.org/directions?to=${latitude}%2C${longitude}#map=17/${latitude}/${longitude}`;
}

export function hasCoordinates(
  place: Place,
): place is Place & { coordinates: PlaceCoordinates } {
  return place.coordinates != null;
}
