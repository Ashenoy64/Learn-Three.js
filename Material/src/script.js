import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as GUI from 'lil-gui'
/**
 * Base
 */
// Canvas

const gui=new GUI.GUI()



const textureLoader=new THREE.TextureLoader()
const cubeTextureLoader=new THREE.CubeTextureLoader()

// 6 faced images 
//if you have an hdri convert it into cube maps using a website 
//https://matheowis.github.io/HDRI-to-CubeMap/
const environmentMap=cubeTextureLoader.load([
    '/textures/environmentMaps/1/px.jpg',
    '/textures/environmentMaps/1/nx.jpg',
    '/textures/environmentMaps/1/py.jpg',
    '/textures/environmentMaps/1/ny.jpg',
    '/textures/environmentMaps/1/pz.jpg',
    '/textures/environmentMaps/1/nz.jpg',
])



const doorColor=textureLoader.load('/textures/door/color.jpg')
const apha=textureLoader.load('/textures/door/alpha.jpg')
const ambientOcclusion=textureLoader.load('/textures/door/ambientOcclusion.jpg')
const height=textureLoader.load('/textures/door/height.jpg')
const normal=textureLoader.load('/textures/door/normal.jpg')
const metalness=textureLoader.load('/textures/door/metalness.jpg')
const roughness=textureLoader.load('/textures/door/roughness.jpg')



const matCap=textureLoader.load('/textures/matcaps/5.png')
const gradient=textureLoader.load('/textures/gradients/3.jpg')



const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * material
 */

// const material= new THREE.MeshBasicMaterial()
//// material.map=doorColor
// material.color=new THREE.Color()
// material.wireframe=true
// material.opacity=0.1
//// material.transparent=true
////material.alphaMap=apha
////material.side=THREE.DoubleSide //Backside


// const material=new THREE.MeshNormalMaterial()
// material.wireframe=true
// material.flatShading=true
// material.transparent=true


// const material=new THREE.MeshMatcapMaterial()
// material.matcap=matCap



// const material=new THREE.MeshDepthMaterial()


// const material=new THREE.MeshLambertMaterial() // strange patterns and no reflection 


// const material=new THREE.MeshPhongMaterial() //no strange patterns and reflection
// material.shininess=100 //reflectivity
// material.specular=new THREE.Color("0xff0f") //color


// const material=new THREE.MeshToonMaterial()//cartoonish 
// gradient.minFilter=THREE.NearestFilter
// gradient.magFilter=THREE.NearestFilter
// gradient.generateMipmaps=false
// material.gradientMap=gradient


// const material=new THREE.MeshStandardMaterial()
// // material.side=THREE.DoubleSide
// material.map=doorColor

// material.aoMap=ambientOcclusion
// material.aoMapIntensity=1


// material.displacementMap=height
// material.displacementScale=0.05


// material.metalnessMap=metalness
// material.metalness=0   //dont change the value when  map

// material.roughnessMap=roughness
// material.roughness=1  //dont change the value when  map


// material.normalMap=normal
// material.normalScale.set(2,1) //vector 2

// material.transparent=true
// material.alphaMap=apha

// gui.add(material,'metalness',0.0,1,0.01)
// gui.add(material,'displacementScale',0.0,1,0.01)
// gui.add(material,'aoMapIntensity',0.0,10,0.01)
// gui.add(material,'roughness',0.0,1,0.01)


const material=new THREE.MeshStandardMaterial()
material.metalness=0.7
material.roughness=0.2
gui.add(material,'metalness',0.0,1,0.01)
gui.add(material,'roughness',0.0,1,0.01)
material.envMap=environmentMap






const sphere =new THREE.Mesh(new THREE.SphereGeometry(0.5,64,64),material)
const plane=new THREE.Mesh(new THREE.PlaneGeometry(1,1,100,100),material)
const torus=new THREE.Mesh(new THREE.TorusGeometry(0.3,0.2,64,128),material)

sphere.position.x=-1.5
torus.position.x=1.5

// console.log(plane.geometry.attributes)


plane.geometry.setAttribute('uv2',new THREE.BufferAttribute(plane.geometry.attributes.uv.array,2))
sphere.geometry.setAttribute('uv2',new THREE.BufferAttribute(sphere.geometry.attributes.uv.array,2))
torus.geometry.setAttribute('uv2',new THREE.BufferAttribute(torus.geometry.attributes.uv.array,2))


scene.add(sphere,plane,torus)
/**
 * Sizes
 */

const ambientLight= new THREE.AmbientLight(0xffffff,0.5)
const pointLight= new THREE.PointLight(0xffffff,0.5)
pointLight.position.x=2
pointLight.position.y=3
pointLight.position.z=4
scene.add(ambientLight,pointLight)


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
    //

    // sphere.rotation.y=0.1*elapsedTime
    // plane.rotation.y=0.1*elapsedTime
    // torus.rotation.y=0.1*elapsedTime
    
    // sphere.rotation.x=0.1*elapsedTime
    // plane.rotation.x=0.1*elapsedTime
    // torus.rotation.x=0.1*elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()