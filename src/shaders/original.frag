uniform vec3 color;

struct PointLight {
    vec3 position;
    vec3 color;
    float distance;
    float decay;
};

uniform PointLight pointLights[ NUM_POINT_LIGHTS ];

varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
	vec4 addedLights = vec4(0.0,0.0,0.0,1.0);
    vec3 ambientLight = vec3(0.2);
	
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		vec3 lightDirection = normalize(vViewPosition - pointLights[i].position);
    	addedLights.rgb += clamp(dot(-lightDirection, vNormal), 0.0, 1.0) * pointLights[i].color;
	}
	#pragma unroll_loop_end

	vec4 ambient = vec4(ambientLight, 1.0);
    gl_FragColor = vec4(color, 1.0 ) * (ambient + addedLights);

	gl_FragColor = linearToOutputTexel( gl_FragColor );
}
