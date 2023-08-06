import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import CANNON from 'cannon'



const hitBound =new Audio('/sounds/hit.mp3')


const playHitSound=(e)=>{
    if(e.contact.getImpactVelocityAlongNormal()>2){
        hitBound.volume =Math.random()
        hitBound.currentTime=0
        hitBound.play()

    }
}
// hitBound.play()
/**
 * Debug
 */
const gui = new dat.GUI()
const debugObject={}
const world =new CANNON.World()

debugObject.createSphere=()=>{
    createSphere(Math.random()*0.5,
        {
            x:(Math.random()-0.5)*3,
            y:3,
            z:(Math.random()-0.5)*3
        })

}
gui.add(debugObject,"createSphere")


debugObject.createBox=()=>{
    createBox(
        Math.random(),
        Math.random(),
        Math.random(),{
            x:(Math.random()-0.5)*3,
            y:3,
            z:(Math.random()-0.5)*3
        }
    )
}
gui.add(debugObject,"createBox")


debugObject.reset=()=>{
    for(const object of array){
        object.body.removeEventListener('collide',playHitSound)
        world.removeBody(object.body)
        scene.remove(object.mesh)
    }
    array.splice(0,array.length)
}

gui.add(debugObject,'reset')

world.broadphase =new CANNON.SAPBroadphase(world)
world.allowSleep =true
world.gravity.set(0,-9.82,0)

const concreteMaterial =new CANNON.Material('concrete')
const plasticMaterial =new CANNON.Material('plastic')

const defaultMaterial=new CANNON.Material('default')
const defaultMaterialContact=new CANNON.ContactMaterial(
    defaultMaterial,defaultMaterial,{
        friction:0.1,
        restitution:0.5,
    }
)


const concretePlasticContactMatrial= new CANNON.ContactMaterial(
    concreteMaterial,
    plasticMaterial,{
        friction:0.6,
        restitution:0.5
    }
)
world.addContactMaterial(concretePlasticContactMatrial)
world.addContactMaterial(defaultMaterialContact)


world.defaultContactMaterial=defaultMaterialContact




const floorShape= new CANNON.Plane()
const floorBody =new CANNON.Body()
// floorBody.material=defaultMaterial//concreteMaterial
floorBody.mass=0
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1,0,0),Math.PI*0.5)
floorBody.addShape(floorShape)

world.addBody(floorBody)


// sphereBody.applyLocalForce(new CANNON.Vec3(150,0,0),new CANNON.Vec3(0,0,0))

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.png',
    '/textures/environmentMaps/0/nx.png',
    '/textures/environmentMaps/0/py.png',
    '/textures/environmentMaps/0/ny.png',
    '/textures/environmentMaps/0/pz.png',
    '/textures/environmentMaps/0/nz.png'
])

/**
 * Test sphere
 */

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
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
camera.position.set(- 3, 3, 3)
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
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

const array=[]
const sphereMaterial =new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5
}) 

const sphereGeometry=new THREE.SphereGeometry(1, 32, 32)

const createSphere =(radius,position)=>{
    const sphere = new THREE.Mesh(sphereGeometry,sphereMaterial)
    sphere.scale.set(radius,radius,radius)
    sphere.castShadow = true
    sphere.position.copy(position)
    scene.add(sphere)

    const sphereShape =new CANNON.Sphere(radius)
    const sphereBody= new CANNON.Body({ 
    mass : 1,
    position:position,
    shape:sphereShape,
    // material:defaultMaterial//plasticMaterial
})
world.addBody(sphereBody)
    array.push({
        mesh:sphere,
        body:sphereBody
    })
}
createSphere(0.5,{x:0,y:3,z:0})


const boxGeometry=new THREE.BoxBufferGeometry(1, 1,1)
const boxMaterial =new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5
}) 

const createBox=(width,height,depth,position)=>{
    const box = new THREE.Mesh(boxGeometry,boxMaterial)
    box.scale.set(width,height,depth)
    box.castShadow = true
    box.position.copy(position)
    scene.add(box)


    const boxShape =new CANNON.Box(new CANNON.Vec3(width*0.5,height*0.5,depth*0.5))
    const boxBody= new CANNON.Body({ 
    mass : 1,
    position:position,
    shape:boxShape,
})
    boxBody.addEventListener('collide',playHitSound)
    world.addBody(boxBody)
        array.push({
            mesh:box,
            body:boxBody
        })
}
// createBox(1,1,1,{x:0,y:3,z:0})









const clock = new THREE.Clock()
let previousTime =0;
const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime =elapsedTime -previousTime
    previousTime=elapsedTime


    // Update controls
    controls.update()
    for(const objects of array){
        objects.mesh.position.copy(objects.body.position)
        objects.mesh.quaternion.copy(objects.body.quaternion)
    }
    // sphereBody.applyForce(new CANNON.Vec3(-0.05,0,0),sphereBody.position)
    world.step(1/60,deltaTime,3)
    // sphere.position.copy(sphereBody.position)
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()