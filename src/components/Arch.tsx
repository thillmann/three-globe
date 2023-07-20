import { forwardRef, useState } from "react";
import type { Mesh } from "three";
import { CatmullRomCurve3, Color, Vector3 } from "three";

import type { Coords } from "../utils/coordinates";
import { calculateDistance } from "../utils/coordinates";

interface ArchProps {
  color?: Color;
  from: Coords;
  to: Coords;
  radius: number;
}

const tubularSegments = 48;

function orbitForPath(from: Coords, to: Coords) {
  const distance = calculateDistance(from, to);
  if (distance > 6) {
    return 1.2;
  }
  if (distance > 3) {
    return 0.5;
  }
  return 0.25;
}

function useArchPath(from: Coords, to: Coords, sphereRadius: number) {
  const [path] = useState(() => {
    const randomness = Math.random() * 0.8 - 0.4;
    const archHeightMultiplier = Math.max(
      0.25,
      orbitForPath(from, to) + randomness,
    );
    const vA = new Vector3(...from);
    const vB = new Vector3(...to);
    const points = [];
    for (let i = 0; i <= tubularSegments; i++) {
      const p = new Vector3().lerpVectors(vA, vB, i / tubularSegments);
      p.normalize();
      p.multiplyScalar(
        sphereRadius +
          archHeightMultiplier * Math.sin(Math.PI * (i / tubularSegments)),
      );
      points.push(p);
    }
    return new CatmullRomCurve3(points);
  });
  return path;
}

export const Arch = forwardRef<Mesh, ArchProps>(function BaseArch(props, ref) {
  const path = useArchPath(props.from, props.to, props.radius);
  return (
    <mesh ref={ref} receiveShadow={false} castShadow={false}>
      <tubeGeometry
        args={[path, tubularSegments, 0.01, 8, false]}
        drawRange={{ count: 0, start: 0 }}
      />
      <meshBasicMaterial
        color={props.color ?? new Color("white")}
        transparent
      />
    </mesh>
  );
});
