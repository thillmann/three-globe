varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
	vec3 transformed = vec3(position);
	vec4 mvPosition = vec4(transformed, 1.0);
	mvPosition = modelViewMatrix * mvPosition;
	vNormal = normalize(normalMatrix * normal);
	vViewPosition = -mvPosition.xyz;
	gl_Position = projectionMatrix * mvPosition;
}