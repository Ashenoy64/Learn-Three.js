import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as lil from 'lil-gui'
import * as dat from 'dat.gui'
// import gsap from 'gsap'

const gui= new lil.GUI({closed:true,width:500})
gui.hide()
gui.show()

// const parameter={
//     color:0xff0000
//}

// gui.addColor(parameter,'color').onChange(()=>{
// material.color.set(parameter.color)
//})

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
// const geometry = new THREE.BoxGeometry(1, 1, 1,2,4,2)



//multiple ui controls availabel
/*
lil.GUI (used)
control-panel
ControlKit
Guify
Oui
*/





const count=20
const positionsArray=new Float32Array(count*3*3)


for(let i=0;i<count*3*3;i++)
{
    positionsArray[i]=10*(Math.random()-0.5)
}

const positionAttribute=new THREE.BufferAttribute(positionsArray,3)
const geometry= new THREE.BufferGeometry()

geometry.setAttribute('position',positionAttribute )

const material = new THREE.MeshBasicMaterial({ color: 0xff0000,wireframe:true })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Sizes
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

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


gui.add(mesh.position,'x',-3,3,0.1) //range
gui.add(mesh.position,'y')
    .min(-3)
    .max(3)
    .step(0.01)
    .name('Cube')
 //range
gui.add(mesh.position,'z',-3,3,0.1) //range


gui.add(mesh,'visible' )//checkbox

gui.add(material,'wireframe')//checkbox


console.log(mesh)



const parameter={ //setting user objects
    rotate:true,
    animation:()=>{
        // gsap.to(mesh.rotation,{duration:1,y:mesh.rotation.y+10})
    }
}


// Animate
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    if(parameter.rotate)
    mesh.rotation.y=elapsedTime*6
    controls.update()

    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}
renderer.render(scene, camera)
tick()

gui.addColor(material,'color')
gui.add(parameter,'animation')
gui.add(parameter,'rotate')