varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
    vec3 objectNormal = vec3(normal);

    vec3 transformedNormal = objectNormal;
    mat3 m = mat3(instanceMatrix);

    transformedNormal /= vec3(dot(m[0], m[0]), dot(m[1], m[1]), dot(m[2], m[2]));

    transformedNormal = m * transformedNormal;
    transformedNormal = normalMatrix * transformedNormal;
    transformedNormal = -transformedNormal;

    vNormal = normalize(transformedNormal);

    vec3 transformed = vec3(position);

    vec4 mvPosition = vec4(transformed, 1.0);
    mvPosition = instanceMatrix * mvPosition;

    mvPosition = modelViewMatrix * mvPosition;

    gl_Position = projectionMatrix * mvPosition;

    vViewPosition = -mvPosition.xyz;
}
