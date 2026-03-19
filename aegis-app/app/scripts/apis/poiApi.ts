export type Poi = {
  osm_id: number;
  name: string | null;
  amenity: string | null;
  shop: string | null;
  tourism: string | null;
  leisure: string | null;
  highway: string | null;
  poi_lat: number;
  poi_lng: number;
  meters: number;
};

export async function fetchNearbyPois(lat: number, lng: number): Promise<Poi[]> {
  const res = await fetch("https://poi.burntheatlantic.com/rpc/nearby_pois", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lat, lng }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`nearby_pois failed: ${res.status} ${text}`);
  }

  return res.json();
}

export function poiLabel(p: Poi): string {
  const base = p.name ?? p.amenity ?? p.shop ?? p.tourism ?? p.leisure ?? p.highway ?? "POI";
  return `${base} (${Math.round(p.meters)}m)`;
}