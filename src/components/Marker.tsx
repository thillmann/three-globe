import { forwardRef, useLayoutEffect, useRef } from "react";
import type { Mesh } from "three";
import { BackSide, Color } from "three";

import { useMergeRefs } from "../utils/useMergeRefs";

interface MarkerProps {
  coords: readonly [number, number, number];
  color?: Color;
}

export const Marker = forwardRef<Mesh, MarkerProps>(
  function BaseMarker(props, ref) {
    const innerRef = useRef<Mesh>(null);
    const meshRef = useMergeRefs(ref, innerRef);

    useLayoutEffect(() => {
      if (innerRef.current) {
        innerRef.current.lookAt(0, 0, 0);
      }
    }, []);

    return (
      <mesh position={props.coords} ref={meshRef}>
        <circleGeometry args={[0.05, 16]} />
        <meshBasicMaterial
          color={props.color ?? new Color(0xff0000)}
          side={BackSide}
          transparent
          opacity={0}
        />
      </mesh>
    );
  },
);

export const MarkerRing = forwardRef<Mesh, MarkerProps>(
  function MarkerRing(props, ref) {
    const innerRef = useRef<Mesh>(null);
    const meshRef = useMergeRefs(ref, innerRef);

    useLayoutEffect(() => {
      if (innerRef.current) {
        innerRef.current.lookAt(0, 0, 0);
      }
    }, []);

    return (
      <mesh position={props.coords} ref={meshRef}>
        <ringGeometry args={[0.04, 0.05]} />
        <meshBasicMaterial
          color={props.color ?? new Color(0xff0000)}
          side={BackSide}
          transparent
          opacity={0}
        />
      </mesh>
    );
  },
);
