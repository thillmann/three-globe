varying vec3 vNormal;
varying vec3 vPosition;

uniform vec3 color;

void main() {
    vec3 lightPosition = vec3(-15.0, 15.0, 15.0);
    vec3 lightDirection = normalize(lightPosition - vPosition);
    float dotNL = clamp(dot(lightDirection, vNormal), 0.0, 1.0);
    float intensity = pow(0.65 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) ), 5.0);
    float intensityAccent = pow(0.4 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) ), 2.0);
    gl_FragColor = vec4( color, 1.0 ) * intensity + vec4(0.859, 0.918, 1, 1) * intensityAccent * dotNL;
}
