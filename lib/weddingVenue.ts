/** Default venue — East West | Gofa Mebrat, Addis Ababa */
export const DEFAULT_WEDDING_VENUE = {
  locationName: "Mekoninoch Kibeb | Tor hayloch",
  location: "Addis Ababa, Ethiopia",
  coordinates: { lat: 9.0099965, lng: 38.7282175},
} as const;

export function getVenueFromData(data: {
  location?: string;
  locationName?: string;
  coordinates?: { lat: number; lng: number };
}) {
  return {
    locationName: data.locationName ?? DEFAULT_WEDDING_VENUE.locationName,
    location: data.location ?? DEFAULT_WEDDING_VENUE.location,
    coordinates: data.coordinates ?? DEFAULT_WEDDING_VENUE.coordinates,
  };
}

export function getDirectionsUrl(lat: number, lng: number, label?: string) {
  const query = label ? encodeURIComponent(label) : `${lat},${lng}`;
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

export function getMapEmbedUrl(lat: number, lng: number) {
  const delta = 0.014;
  const bbox = [lng - delta, lat - delta, lng + delta, lat + delta].join(",");
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;
}
