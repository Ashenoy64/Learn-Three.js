varying float vRandom;
varying vec2 vUv;
varying float vElev;

uniform vec3 uColor;
uniform sampler2D uTexture;


void main()
{
    
    // gl_FragColor =vec4(0.5,vRandom,0.6,1.0);

    vec4 textureColor = texture2D(uTexture,vUv) ;
    textureColor.rgb*=vElev*2.0+0.9;
    gl_FragColor =textureColor;//vec4(textureColor,1.0);
 }