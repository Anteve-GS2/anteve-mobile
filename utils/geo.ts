export interface Coord {
  latitude: number;
  longitude: number;
}

const rad = (d: number) => (d * Math.PI) / 180;

export function distanciaKm(a: Coord, b: Coord): number {
  const dLat = rad(b.latitude - a.latitude);
  const dLon = rad(b.longitude - a.longitude);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.latitude)) * Math.cos(rad(b.latitude)) * Math.sin(dLon / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

export function interpolar(a: Coord, b: Coord, p: number): Coord {
  return {
    latitude: a.latitude + (b.latitude - a.latitude) * p,
    longitude: a.longitude + (b.longitude - a.longitude) * p,
  };
}