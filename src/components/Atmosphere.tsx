import { AdditiveBlending, BackSide, Color } from "three";

import frag from "../shaders/atmosphere.frag?raw";
import vertex from "../shaders/atmosphere.vert?raw";

interface AtmosphereProps {
  radius: number;
}

export function Atmosphere(props: AtmosphereProps) {
  return (
    <mesh scale={[1.35, 1.35, 1.35]}>
      <sphereGeometry args={[props.radius, 50, 50]} />
      <shaderMaterial
        vertexShader={vertex}
        fragmentShader={frag}
        blending={AdditiveBlending}
        side={BackSide}
        transparent
        uniforms={{ color: { value: new Color("#a78bfa") } }}
      />
    </mesh>
  );
}
