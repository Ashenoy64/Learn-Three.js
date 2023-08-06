import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader'



/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const draco= new DRACOLoader()
draco.setDecoderPath('/draco/')
const modelLoader =new GLTFLoader()
modelLoader.setDRACOLoader(draco)


// modelLoader.load(
//     '/models/Duck/glTF/Duck.gltf',(gltf)=>{
//         // scene.add(gltf.scene.children[0])
//         console.log("done")
//     }
// )
// modelLoader.load(
//     "/models/FlightHelmet/glTF/FlightHelmet.gltf",
//     (gltf)=>{

//         const group=new THREE.Group()
//         while(gltf.scene.children.length)
//         group.add(gltf.scene.children[0])

//         scene.add(group)
//         group.position.x=2
        
//         // const children=[...gltf.scene.children]
//         // for(let mesh of children)
//         // {scene.add(mesh)}
//         // scene.add(gltf.scene)

//     }
// )

// modelLoader.load(
//     "/models/Duck/glTF-Draco/Duck.gltf",
//     (gltf)=>{
//         scene.add(gltf.scene.children[0])
//         console.log("done")

//     }
// )

let mixer;

modelLoader.load(
    '/models/Fox/glTF/Fox.gltf',(gltf)=>{
        gltf.scene.scale.set(0.025,0.025,0.025)
        mixer =new THREE.AnimationMixer(gltf.scene)
        
        let action=mixer.clipAction(gltf.animations[2])
        
        action.play()
        scene.add(gltf.scene)
        console.log("done")
    }
)





/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#444444',
        metalness: 0,
        roughness: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
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
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(2, 2, 2)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Update controls
    controls.update()
    if(mixer)
    {
        mixer.update(deltaTime)
    }
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()