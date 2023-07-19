import { useDetectGPU } from "@react-three/drei";
import { useLayoutEffect, useMemo, useRef } from "react";
import {
  BackSide,
  Color,
  InstancedMesh,
  Object3D,
  UniformsLib,
  Vector3,
} from "three";

import frag from "../shaders/land.frag?raw";
import vertex from "../shaders/land.vert?raw";
import { calcPosFromLatLonRad } from "../utils/coordinates";
import { loadEarthMask, visibilityForCoordinate } from "../utils/earthMask";
import { createResource } from "../utils/resources";
import { mergeUniforms } from "../utils/uniforms";

const imageResource = createResource(loadEarthMask());

function getDotsForSphere(
  rows: number,
  dotDensity: number,
  sphereRadius: number,
) {
  const items: (readonly [number, number, number])[] = [];
  for (let lat = -90; lat <= 90; lat += 180 / rows) {
    const latRad = (Math.abs(lat) * Math.PI) / 180;
    const circumference = 2 * Math.PI * sphereRadius * Math.cos(latRad);
    const dotsForLat = circumference * dotDensity;
    for (let i = 0; i < dotsForLat; i++) {
      const lng = -180 + (i * 360) / dotsForLat;
      const pos = calcPosFromLatLonRad(lat, lng, sphereRadius);
      if (visibilityForCoordinate(lng, lat)) {
        items.push(pos);
      }
    }
  }
  return items;
}

function useDots(rows: number, dotDensity: number, sphereRadius: number) {
  return useMemo(
    () => getDotsForSphere(rows, dotDensity, sphereRadius),
    [rows, dotDensity, sphereRadius],
  );
}

function isLowTier(gpu: ReturnType<typeof useDetectGPU>) {
  return gpu.isMobile || gpu.tier < 1;
}

function useLandConfiguration() {
  const gpu = useDetectGPU();
  return useMemo(() => {
    const dotDensity = isLowTier(gpu) ? 6 : 12;
    const size = dotDensity === 6 ? 0.024 : 0.012;
    const rows = isLowTier(gpu) ? 120 : 240;
    return { dotDensity, size, rows };
  }, [gpu]);
}

const o = new Object3D();

function useInstances(items: (readonly [number, number, number])[]) {
  const ref = useRef<InstancedMesh>(null);
  useLayoutEffect(() => {
    if (ref.current) {
      let id = 0;
      for (const item of items) {
        const [x, y, z] = item;
        o.position.set(x, y, z);
        o.lookAt(new Vector3(0, 0, 0));
        o.updateMatrix();
        ref.current.setMatrixAt(id++, o.matrix);
      }
      ref.current.instanceMatrix.needsUpdate = true;
    }
  }, [items]);
  return ref;
}

interface LandProps {
  radius: number;
}

export function Land(props: LandProps) {
  imageResource.read();
  const { dotDensity, size, rows } = useLandConfiguration();
  const items = useDots(rows, dotDensity, props.radius);
  const ref = useInstances(items);
  return (
    <instancedMesh args={[undefined, undefined, items.length]} ref={ref}>
      <circleGeometry args={[size, 5]} />
      <shaderMaterial
        vertexShader={vertex}
        fragmentShader={frag}
        side={BackSide}
        alphaTest={0.02}
        transparent
        depthWrite={false}
        lights
        uniforms={mergeUniforms([
          UniformsLib.lights,
          {
            color: { value: new Color("#a5b4fc") },
            fadeThreshold: { value: 5.5 },
            alphaFallOff: { value: 0.8 },
          },
        ])}
      />
    </instancedMesh>
  );
}
