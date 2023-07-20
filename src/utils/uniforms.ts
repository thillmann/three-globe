import type { IUniform } from "three";
import { UniformsUtils } from "three";

type Uniforms = {
  [key: string]: IUniform<unknown>;
};

export function mergeUniforms(uniforms: Uniforms[]): Uniforms {
  return UniformsUtils.merge(uniforms) as Uniforms;
}
