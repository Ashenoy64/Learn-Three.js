import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper'
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
 * Lights
 */


const ambientLight= new THREE.AmbientLight(0xffffff,0.5) //uniform light all over the body and scene can be used for light bouncing
scene.add(ambientLight)

// gui.add(ambientLight,'intensity',0.0,1,0.01)

const directionalLight = new THREE.DirectionalLight(0xffcc,0.3 )
directionalLight.position.set(1,0.25,0)
scene.add(directionalLight)


const hemisphereLight =new THREE.HemisphereLight(0xffc00c,0x000fff,0.5)
scene.add(hemisphereLight)


const pointLight=new THREE.PointLight(0xffccee,1,2,3)
scene.add(pointLight)

const rectAreaLight= new THREE.RectAreaLight(0xff103f,5,1,1)
rectAreaLight.position.set(-1.5,0.25,1.5)
rectAreaLight.lookAt(new THREE.Vector3())
scene.add(rectAreaLight)


const spotLigth=new THREE.SpotLight(0xf534ff,1,10,Math.PI*0.1,0.25,1)
spotLigth.position.set(0,2,3)
scene.add(spotLigth.target)
spotLigth.target.position.x=-1.75
scene.add(spotLigth)


//LIGHT HWLPER
const hemisphereLightHelper=new THREE.HemisphereLightHelper(hemisphereLight,0.2)
scene.add(hemisphereLightHelper)
 
const directionLightHelper=new THREE.DirectionalLightHelper(directionalLight,0.2)
scene.add(directionLightHelper)

const pointLightHelper=new THREE.PointLightHelper(pointLight,1)
scene.add(pointLightHelper)
 

const spotLigthHelper =new THREE.SpotLightHelper(spotLigth)
scene.add(spotLigthHelper)

window.requestAnimationFrame(()=>{
    spotLigthHelper.update()
})

const rectLigthHelper =new RectAreaLightHelper(rectAreaLight)
scene.add(rectLigthHelper)
/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

// Objects
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.position.x = - 1.5

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65

scene.add(sphere, cube, torus, plane)

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
camera.position.z = 2
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

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    cube.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()