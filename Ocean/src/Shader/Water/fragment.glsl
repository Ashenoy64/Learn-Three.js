uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;

uniform float uColorMultiplier;
uniform float uColorOffset;

varying float vElevation;
void main()
{
    float mixStrength = vElevation * uColorMultiplier + uColorOffset;
    vec3 newMixColor = mix(uDepthColor,uSurfaceColor,mixStrength);
    gl_FragColor = vec4(newMixColor,1.0);
}