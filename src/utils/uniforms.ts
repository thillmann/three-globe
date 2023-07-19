import { IUniform, UniformsUtils } from "three";

type Uniforms = {
  [key: string]: IUniform<unknown>;
};

export function mergeUniforms(uniforms: Uniforms[]): Uniforms {
  return UniformsUtils.merge(uniforms) as Uniforms;
}
