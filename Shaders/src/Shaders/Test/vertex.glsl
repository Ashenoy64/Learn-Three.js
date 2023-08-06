uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

uniform vec2 uFrequency;
uniform float uTime;
// uniform vec3 uColor;

attribute vec2 uv;
attribute float aRandom;
attribute vec3 position;

varying vec2 vUv;
varying float vRandom;
varying float vElev;
void main()
{
    vec4 modelPosition = modelMatrix * vec4(position,1.0);

    float elevation =sin(modelPosition.x *uFrequency.x -uTime)*0.1;
    elevation +=sin(modelPosition.y *uFrequency.y -uTime)*0.1;

    modelPosition.z += sin(modelPosition.x*uFrequency.x - uTime) *0.1;
    modelPosition.z += sin(modelPosition.y*uFrequency.y) *0.1;
    // modelPosition.z +=aRandom *0.1;

    vec4 viewPosition = viewMatrix *modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;

    vRandom = aRandom;
    vUv=uv;
    vElev=elevation;
}