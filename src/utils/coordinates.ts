import { useMemo } from "react";

export function calcPosFromLatLonRad(lat: number, lon: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return [x, y, z] as Coords;
}

export function calculateDistance(
  [x1, y1, z1]: readonly [number, number, number],
  [x2, y2, z2]: readonly [number, number, number],
) {
  const distance = Math.sqrt(
    Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2),
  );
  return distance;
}

export type LngLat = [number, number];

export type Coords = readonly [number, number, number];

export function useCoordinates([lng, lat]: LngLat, radius: number) {
  return useMemo(
    () => calcPosFromLatLonRad(lat, lng, radius),
    [lat, lng, radius],
  );
}
