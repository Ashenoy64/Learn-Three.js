import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as dat from 'lil-gui'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass' 
import {GammaCorrectionShader} from 'three/examples/jsm/shaders/GammaCorrectionShader'
import {SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()
const textureLoader = new THREE.TextureLoader()

/**
 * Update all materials
 */
const updateAllMaterials = () =>
{
    scene.traverse((child) =>
    {
        if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
        {
            child.material.envMapIntensity = 2.5
            child.material.needsUpdate = true
            child.castShadow = true
            child.receiveShadow = true
        }
    })
}

/**
 * Environment map
 */
const environmentMap = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg'
])
environmentMap.encoding = THREE.sRGBEncoding

scene.background = environmentMap
scene.environment = environmentMap

/**
 * Models
 */
gltfLoader.load(
    '/models/DamagedHelmet/glTF/DamagedHelmet.gltf',
    (gltf) =>
    {
        gltf.scene.scale.set(2, 2, 2)
        gltf.scene.rotation.y = Math.PI * 0.5
        scene.add(gltf.scene)

        updateAllMaterials()
    }
)

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.normalBias = 0.05
directionalLight.position.set(0.25, 3, - 2.25)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) 
    effectComposer.setSize(sizes.width, sizes.height)
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4, 1, - 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap
renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ReinhardToneMapping
renderer.toneMappingExposure = 1.5
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const renderTarget = new THREE.WebGLRenderTarget(800,600,
     {samples : renderer.getPixelRatio()==1?2:0}
    )
 
const effectComposer = new EffectComposer(renderer,renderTarget)
effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) 
effectComposer.setSize(sizes.width, sizes.height)


const renderPass = new RenderPass(scene,camera)
effectComposer.addPass(renderPass) 


//DotScreenPass
import {DotScreenPass} from 'three/examples/jsm/postprocessing/DotScreenPass' 
const dotScreenPass =new DotScreenPass()
dotScreenPass.enabled = false  //set to true
effectComposer.addPass(dotScreenPass)


//GlitchPass
import {GlitchPass} from 'three/examples/jsm/postprocessing/GlitchPass'
const glitchPass =new GlitchPass()
glitchPass.goWild = false //Warning for flashes
glitchPass.enabled = false  //set to true
effectComposer.addPass(glitchPass)


import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import {RGBShiftShader} from 'three/examples/jsm/Shaders/RGBShiftShader'

const rgbShiftpass = new ShaderPass(RGBShiftShader)
rgbShiftpass.enabled =false
effectComposer.addPass(rgbShiftpass)



import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'

const uBloomPass = new UnrealBloomPass()
uBloomPass.strength = 0.3
uBloomPass.radius = 1
uBloomPass.threshold = 0.6
uBloomPass.enabled = false
effectComposer.addPass(uBloomPass)


//Custom pass Tint

const TintShader ={
    uniforms :{
        tDiffuse : { value: null },
        uTint : {value : null}
     },
    vertexShader: `
    varying vec2 vuv;
    void main()
    {
        gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
        vuv = uv;
    }
    `,
    fragmentShader: `
    uniform sampler2D tDiffuse;
    varying vec2 vuv;
    uniform vec3 uTint; 
    void main()
    {
        vec4 color  = texture2D(tDiffuse,vuv);
        color.rgb += uTint;
        gl_FragColor = color ;
    }
    `
}


//Displacement
const DisplacementShader ={
    uniforms :{
        tDiffuse : { value: null },
        uTime : {value : null}
     },
    vertexShader: `
    varying vec2 vuv;
    void main()
    {
        gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
        vuv = uv;
    }
    `,
    fragmentShader: `
    uniform sampler2D tDiffuse;
    varying vec2 vuv;
    uniform float uTime;
    void main()
    {
        vec2 newUV = vec2(
            vuv.x,
            vuv.y +sin(vuv.x *10.0 +uTime) *0.1
        );
        newUV.y +=0.1;
        vec4 color  = texture2D(tDiffuse,newUV);
        
        gl_FragColor = color ;
    }
    `
}


const tintPass = new ShaderPass(TintShader)
tintPass.material.uniforms.uTint.value = new THREE.Vector3(0,0,0)
effectComposer.addPass(tintPass)

gui.add(tintPass.material.uniforms.uTint.value,'x',-1,1,0.001)
gui.add(tintPass.material.uniforms.uTint.value,'y',-1,1,0.001)
gui.add(tintPass.material.uniforms.uTint.value,'z',-1,1,0.001)

const dispPass = new ShaderPass(DisplacementShader)
dispPass.material.uniforms.uTime.value = 0
// effectComposer.addPass(dispPass)

//ScreenShader
const ScreenShader ={
    uniforms :{
        tDiffuse : { value: null },
        uNormalMap : {value : null},
     },
    vertexShader: `
    varying vec2 vuv;
    void main()
    {
        gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
        vuv = uv;
    }
    `,
    fragmentShader: `
    uniform sampler2D tDiffuse;
    varying vec2 vuv;
    uniform sampler2D uNormalMap;
    void main()
    {
        
        vec3 normalColor = texture2D(uNormalMap,vuv).xyz *2.0 -1.0;
        vec2 newUV = vuv + normalColor.xy *0.1 ;
        vec4 color  = texture2D(tDiffuse,newUV);
        vec3 lightDirection = normalize(vec3(-1.0,1.0,0.0));
        float lightness = clamp(dot(normalColor,lightDirection),0.0,1.0);
        color.rgb += lightness *2.0;
        gl_FragColor = color ;
    }
    `
}
const screenPass = new ShaderPass(ScreenShader)
screenPass.material.uniforms.uNormalMap.value = textureLoader.load('/textures/text.png')
effectComposer.addPass(screenPass)
// dispPass.material.uniforms.uTime.value = 0




//GammaCorrection

const gamaCorrectionPass = new ShaderPass(GammaCorrectionShader)
effectComposer.addPass(gamaCorrectionPass)


if(renderer.getPixelRatio()==1 && !renderer.capabilities.isWebGL2)
{
    const smaaPass = new SMAAPass()
    effectComposer.addPass(smaaPass)
}
















/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()
    dispPass.material.uniforms.uTime.value = elapsedTime
    // Render
    effectComposer.render()
    // renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()