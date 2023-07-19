varying vec3 vNormal;
varying vec3 vViewPosition;

#include <common>
#include <lights_pars_begin>
#include <lights_physical_pars_fragment>

uniform vec3 color;
uniform float fadeThreshold;
uniform float alphaFallOff;

void main() {
    vec4 diffuseColor = vec4( color, 1.0 );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = vec3(0.0, 0.0, 0.0);
	float metalnessFactor = 0.0;
	float roughnessFactor = 1.0;
	vec3 normal = normalize( vNormal );
	vec3 geometryNormal = normal;

    #include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_end>

	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;

    vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
    
    gl_FragColor = vec4( outgoingLight, diffuseColor.a );

    float depth = gl_FragCoord.z/gl_FragCoord.w;

    if (depth > fadeThreshold) {
        gl_FragColor.a = 1.0 + (fadeThreshold - depth) * alphaFallOff;
    }

    gl_FragColor = linearToOutputTexel( gl_FragColor );
}