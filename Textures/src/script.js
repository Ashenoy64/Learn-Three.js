import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import imageSource from '../static/textures/door/color.jpg'



const loadingManger=new THREE.LoadingManager()

loadingManger.onStart=()=>{
    console.log("Loading Started")
}

loadingManger.onLoad=()=>{
    console.log('Loaded')
}

loadingManger.onProgress=()=>{
    console.log('Progress')
}

loadingManger.onError=(err)=>{
    console.log("error",err)
}


const textureLoader=new THREE.TextureLoader(loadingManger)
// const colorTextures=textureLoader.load('/textures/door/color.jpg')
// const colorTextures=textureLoader.load('/textures/checkerboard-1024x1024.png')
// const colorTextures=textureLoader.load('/textures/checkerboard-8x8.png')
const colorTextures=textureLoader.load('/textures/minecraft.png')
const alphaTextures=textureLoader.load('/textures/door/alpha.jpg')
const heightTextures=textureLoader.load('/textures/door/height.jpg')
const normalTextures=textureLoader.load('/textures/door/normal.jpg')
const ambientOcclusionTextures=textureLoader.load('/textures/door/ambientOcclusion.jpg')
const metalnessTextures=textureLoader.load('/textures/door/metalness.jpg')
const roughnessTextures=textureLoader.load('/textures/door/roughness.jpg')


// colorTextures.repeat.x=2
// colorTextures.repeat.y=3
// colorTextures.wrapS=THREE.RepeatWrapping
// colorTextures.wrapT=THREE.RepeatWrapping
// colorTextures.wrapS=THREE.MirroredRepeatWrapping//THREE.RepeatWrapping
// colorTextures.wrapT=THREE.MirroredRepeatWrapping//THREE.RepeatWrapping

// colorTextures.center.x=0.5//default point is 0,0 pivot point for rotation 
// colorTextures.center.y=0.5

// colorTextures.offset.x=0.5
// colorTextures.offset.y=0.5

colorTextures.generateMipmaps=false

// colorTextures.minFilter=THREE.NearestFilter// big texture to small
colorTextures.magFilter=THREE.NearestFilter  //small texture to large
// colorTextures.rotation= 

//,()=>{
//     console.log('Load')
// },()=>{
//     console.log("Progress")
// },(err)=>{
//     console.log("Error ",err)
// })  




/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ map:colorTextures })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

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
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 1
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()