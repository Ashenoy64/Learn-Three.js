import './style.css'
import * as THREE from 'three'
import * as dat from 'lil-gui'
// import gasp from 'gasp'
/**
 * Debug
 */
const gui = new dat.GUI()


const cursor={
    x:0,
    y:0
}

const textureLoader =new THREE.TextureLoader()

const gradient = textureLoader.load('textures/gradients/5.jpg')
gradient.magFilter=THREE.NearestFilter
const parameters = {
    materialColor: '#ffeded'
}


const particleCount =2000
const positions= new Float32Array(particleCount*3)

gui.addColor(parameters, 'materialColor').onChange(()=>{
        material.color.set(parameters.materialColor)
    })

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')
const objectDistance=4
// Scene
const scene = new THREE.Scene()

/**
 * Test cube
 */

for(let i=0;i<particleCount;++i)
{
    positions[i*3+0]=(Math.random()-0.5)*10
    positions[i*3+1]=objectDistance*0.4-Math.random()*objectDistance*3
    positions[i*3+2]=(Math.random()-0.5)*10
}

const particleGeometry =new THREE.BufferGeometry()
particleGeometry.setAttribute('position',new THREE.BufferAttribute(positions,3,))

const particleMaterial =new THREE.PointsMaterial({
    color:parameters.materialColor,
    sizeAttenuation:true,
    size:0.02
})

const particles= new THREE.Points(particleGeometry,particleMaterial)
scene.add(particles)
const material = new THREE.MeshToonMaterial({color:parameters.materialColor,
    gradientMap: gradient,
})



const mesh1= new THREE.Mesh(
    new THREE.TorusGeometry(1,0.4,16,60),
    material
)

const mesh2= new THREE.Mesh(
    new THREE.ConeGeometry(1,2,32),
    material
)

const mesh3= new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8,0.35,100,16),
    material
)

mesh1.position.y=-objectDistance * 0
mesh1.position.x=2

mesh2.position.y=-objectDistance * 1
mesh2.position.x=-2
mesh3.position.y=-objectDistance * 2
mesh3.position.x=2

scene.add(mesh1,mesh2,mesh3)
const meshes= [mesh1, mesh2, mesh3]

const directionalLight =new THREE.DirectionalLight('#fff',1)

directionalLight.position.set(1,1,0)
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
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha:true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

let sY=window.scrollY
let currentSection=0
window.addEventListener('scroll',()=>{
    sY=window.scrollY
    const newSection =Math.round(sY/sizes.height)
    if(currentSection!=newSection)
        {
            currentSection=newSection
            // gsap.to(meshes[currentSection].rotation,{
            //     duration :1.5,
            //     ease: 'power2.inOut',
            //     x:'+=6',
            //     y:'+=3'
            // })
        }
})

window.addEventListener('mousemove',(event)=>{
    cursor.x=event.clientX/sizes.width -0.5
    cursor.y=event.clientY/sizes.height -0.5
})


/**
 * Animate
 */
const clock = new THREE.Clock()


let previousTime=0;

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime =elapsedTime-previousTime
    previousTime=elapsedTime
    camera.position.y=-sY/sizes.height *objectDistance

    const parallaxX =cursor.x
    const parallaxY =-cursor.y

    cameraGroup.position.x=(parallaxX-cameraGroup.position.x)*deltaTime*5
    cameraGroup.position.y=(parallaxY-cameraGroup.position.y)*deltaTime*5


    for(const mesh of meshes)
    {
        mesh.rotation.x+=deltaTime*0.1
        mesh.rotation.y+=deltaTime*0.12
    }
    // Render
    
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()