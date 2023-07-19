import { Color, UniformsLib } from "three";

import frag from "../shaders/planet.frag?raw";
import vertex from "../shaders/planet.vert?raw";
import { mergeUniforms } from "../utils/uniforms";

interface PlanetProps {
  radius: number;
}

export function Planet(props: PlanetProps) {
  return (
    <mesh>
      <sphereGeometry args={[props.radius, 60, 60]} />
      <shaderMaterial
        vertexShader={vertex}
        fragmentShader={frag}
        lights
        fog
        clipping
        uniforms={mergeUniforms([
          UniformsLib.lights,
          {
            color: { value: new Color("#3730a3") },
          },
        ])}
      />
    </mesh>
  );
}
