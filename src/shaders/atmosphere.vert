varying vec3 vNormal;
varying vec3 vPosition;

void main() {
    vNormal = normalize(normalMatrix * normal);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vPosition = gl_Position.xyz;
}

// http://pymud.net/proj/space/