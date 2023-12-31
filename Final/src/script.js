import './style.css'
import * as dat from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import fireFlieVertexShader  from './shaders/fireFlies/vertex.glsl'
import fireFlieFragment  from './shaders/fireFlies/fragment.glsl'

import portalVertexShader from './shaders/portal/vertex.glsl'
import portalFragmentShader from './shaders/portal/fragment.glsl'

// /**
//  * Spector JS
//  */
// const SPECTOR = require('spectorjs')
// const spector = new SPECTOR.Spector()
// spector.displayUI()

/**
 * Base
 */
// Debug

const debugObject = {}
const gui = new dat.GUI({
    width: 400
})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader()

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

/**
 * Textures
 */
const bakedTexture = textureLoader.load('baked.jpg')
bakedTexture.flipY = false
bakedTexture.encoding = THREE.sRGBEncoding

/**
 * Materials
 */
// Baked material
const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture })


debugObject.portalStart = '#000000'
debugObject.portalEnd = '#ffffff'

gui.addColor(debugObject,'portalStart').onChange(()=>{
    portalLightMaterial.uniforms.uStart.value.set(debugObject.portalStart)
})
gui.addColor(debugObject,'portalEnd').onChange(()=>{
    portalLightMaterial.uniforms.uEnd.value.set(debugObject.portalEnd)
})

// Portal light material
const portalLightMaterial = new THREE.ShaderMaterial({
    vertexShader:portalVertexShader,
    fragmentShader:portalFragmentShader,
    uniforms:{
        uTime : {value : 0},
        uStart:{value:new THREE.Color(debugObject.portalStart)},
        uEnd:{value:new THREE.Color(debugObject.portalEnd)}
    },
    // wireframe:true,
 })

// Pole light material
const poleLightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffe5 })

/**
 * Model
 */
gltfLoader.load(
    'portal.glb',
    (gltf) =>
    {
        const bakedMesh = gltf.scene.children.find(child => child.name === 'baked')
        const portalLightMesh = gltf.scene.children.find(child => child.name === 'portalLight')
        const poleLightAMesh = gltf.scene.children.find(child => child.name === 'poleLightA')
        const poleLightBMesh = gltf.scene.children.find(child => child.name === 'poleLightB')

        bakedMesh.material = bakedMaterial
        portalLightMesh.material = portalLightMaterial
        poleLightAMesh.material = poleLightMaterial
        poleLightBMesh.material = poleLightMaterial

        scene.add(gltf.scene)
    }
)

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
    fireFliesMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 4
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
*/


const fireFliesGeometry = new THREE.BufferGeometry()
const fireFliesCount =30

const positionArray = new Float32Array(fireFliesCount*3)
const scaleArray = new Float32Array(fireFliesCount)
for(let i=0;i<fireFliesCount;i++)
{
    positionArray[i*3+0] = (Math.random()-0.5 )* 4
    positionArray[i*3+1] = Math.random() * 1.5
    positionArray[i*3+2] = (Math.random()-0.5 )* 4

    scaleArray[i] =Math.random()
}

fireFliesGeometry.setAttribute('position',new THREE.BufferAttribute(positionArray,3))
fireFliesGeometry.setAttribute('aScale',new THREE.BufferAttribute(scaleArray,1))

const fireFliesMaterial = new THREE.ShaderMaterial({
    vertexShader:fireFlieVertexShader,
    fragmentShader:fireFlieFragment,
    uniforms:{
        uSize : {value : 50},
        uPixelRatio : {value : Math.min(window.devicePixelRatio,2)},
        uTime : {value : 0}
    },
    transparent:true,
    blending:THREE.AdditiveBlending,
    depthWrite:false,
})


gui.add(fireFliesMaterial.uniforms.uSize,"value",0,200).name("Fire Flies Size")
const fireFlies = new THREE.Points(fireFliesGeometry,fireFliesMaterial)

scene.add(fireFlies)

debugObject.clearColor = '#201919'



const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputEncoding = THREE.sRGBEncoding
renderer.setClearColor(debugObject.clearColor)

gui.addColor(debugObject,'clearColor').onChange(()=>{
    renderer.setClearColor(debugObject.clearColor)
})

/**
 * Animate
*/
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()
    fireFliesMaterial.uniforms.uTime.value = elapsedTime
    portalLightMaterial.uniforms.uTime.value = elapsedTime

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()