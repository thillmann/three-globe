import { forwardRef, useLayoutEffect, useRef } from "react";
import { BackSide, Color, Mesh } from "three";

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
        <meshStandardMaterial
          color={props.color ?? new Color(0xff0000)}
          side={BackSide}
          transparent
          opacity={0}
        />
      </mesh>
    );
  },
);
