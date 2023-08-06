import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'


/**
 * Base
 */
// Debug
const gui = new dat.GUI()
const debugObject ={}
const loader= new GLTFLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()
const environmentMaps = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg']
)
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

environmentMaps.encoding=THREE.sRGBEncoding
scene.background =environmentMaps
scene.environment=environmentMaps



/**
 * Test sphere
 */
const testSphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshStandardMaterial()
)
// scene.add(testSphere)

const directionalLight =new THREE.DirectionalLight('#ffff',1)
directionalLight.position.set(0.25,3,-2.25)
directionalLight.castShadow =true
directionalLight.shadow.camera.far=15
// const directionalLightHelper =new THREE.CameraHelper(directionalLight.shadow.camera)

directionalLight.shadow.mapSize.set(1024,1024)
directionalLight.shadow.normalBias =0.05
scene.add(directionalLight)

gui.add(directionalLight,'intensity').min(0).max(10).step(0.01)
gui.add(directionalLight.position,'x').min(-5).max(5).step(0.01)
gui.add(directionalLight.position,'y').min(-5).max(5).step(0.01)
gui.add(directionalLight.position,'z').min(-5).max(5).step(0.01)


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
debugObject.mapIntensity =5
gui.add(debugObject,'mapIntensity',0,10,0.01).onChange(()=>{
    updateAllMaterials()
})

// loader.load(
//     '/models/FlightHelmet/glTF/FlightHelmet.gltf',(gltf)=>{
//         gltf.scene.scale.set(10,10,10)
//         gltf.scene.position.set(0,-4,0)
//         gltf.scene.rotation.y=Math.PI*0.5
//         scene.add(gltf.scene)
//         gui.add(gltf.scene.rotation,'y').min(-Math.PI).max(Math.PI).step(0.01)
//         updateAllMaterials()
//     }
// )

loader.load(
    '/models/hamburger.glb',(gltf)=>{
        gltf.scene.scale.set(0.3,0.3,0.3)
        gltf.scene.position.set(0,-1,0)
        gltf.scene.rotation.y=Math.PI*0.5
        scene.add(gltf.scene)
        gui.add(gltf.scene.rotation,'y').min(-Math.PI).max(Math.PI).step(0.01)
        updateAllMaterials()
    }
)

const updateAllMaterials = () =>{
    scene.traverse((child)=>{
        if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial){
            // child.material.envMap =environmentMaps
            child.material.envMapIntensity = debugObject.mapIntensity
            child.material.needsUpdate=true
            child.castShadow=true
            child.receiveShadow=true
        }
    })
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
    antialias:true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.physicallyCorrectLights =true
renderer.outputEncoding =THREE.sRGBEncoding
renderer.toneMapping =THREE.ReinhardToneMapping
gui.add(renderer,'toneMapping',{
    No:THREE.NoToneMapping,
    Linear:THREE.LinearToneMapping,
    Reinhard:THREE.ReinhardToneMapping,
    Cineon:THREE.CineonToneMapping,
    ACESF:THREE.ACESFilmicToneMapping,
})
renderer.toneMappingExposure =3
gui.add(renderer,'toneMappingExposure',0,10,1)


renderer.shadowMap.enabled =true
renderer.shadowMap.type= THREE.PCFShadowMap
/**
 * Animate
 */
const tick = () =>
{
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()