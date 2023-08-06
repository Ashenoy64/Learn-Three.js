import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

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
 * Test cube
 */

let geometry=null
let material=null
let particles=null


const generateGalaxy=()=>{

    if(geometry){
        geometry.dispose()
        material.dispose()
        scene.remove(particles)
    }

    geometry=new THREE.BufferGeometry()
    const positions= new Float32Array(galaxyParams.particleCount*3)
    const colors= new Float32Array(galaxyParams.particleCount*3)

    const colorInside=new THREE.Color(galaxyParams.insideColor)
    const colorOutside=new THREE.Color(galaxyParams.outsideColor)
   

    for(let i=0;i<galaxyParams.particleCount;i++){
        const i3=i*3;

        const radius=Math.random()*galaxyParams.galaxyRadius

        const spinAngle =radius *galaxyParams.rotationSpeed

        const branchAngle = 2*Math.PI*(i % galaxyParams.galaxyBranches)/galaxyParams.galaxyBranches
        
        const randomX= Math.pow(Math.random(),galaxyParams.randomSkew) * (Math.random()<0.5 ? 1:-1)    //(Math.random()-0.5)*galaxyParams.randomness
        const randomY= Math.pow(Math.random(),galaxyParams.randomSkew) * (Math.random()<0.5 ? 1:-1)    //(Math.random()-0.5)*galaxyParams.randomness
        const randomZ= Math.pow(Math.random(),galaxyParams.randomSkew) * (Math.random()<0.5 ? 1:-1)    //(Math.random()-0.5)*galaxyParams.randomness

        positions[i3 +0]=(Math.cos(branchAngle+spinAngle)*radius)+randomX
        positions[i3 +1]=randomY //(Math.random()-0.5)*10
        positions[i3 +2]=(Math.sin(branchAngle+spinAngle)*radius)+randomZ
    
        const mixedColor= colorInside.clone()
        mixedColor.lerp(colorOutside,radius/galaxyParams.galaxyRadius)
        colors[i3+0]=mixedColor.r
        colors[i3+1]=mixedColor.g
        colors[i3+2]=mixedColor.b
    
    }

    geometry.setAttribute(
        'position',new THREE.BufferAttribute(positions,3)
    )

    geometry.setAttribute(
        'color',new THREE.BufferAttribute(colors,3)
    )

    material = new THREE.PointsMaterial({
        size:galaxyParams.particleSize,
        sizeAttenuation:galaxyParams.particleAttenuation,
        blending:THREE.AdditiveBlending,
        color:galaxyParams.color,
        vertexColors:true,
    })

    particles= new THREE.Points(geometry,material)
    scene.add(particles)
}

const galaxyParams={
    particleCount:10000,
    particleSize:0.01,
    particleAttenuation:true,
    galaxyRadius:5,
    galaxyBranches:3,
    rotationSpeed:1,
    randomness:0.2,
    randomSkew:3,
    insideColor:'#ff6030',
    outsideColor:'#1b3384',
}
gui.add(galaxyParams,'particleCount',100,100000,200).onFinishChange(generateGalaxy)
gui.add(galaxyParams,'particleSize',0,1).onFinishChange(generateGalaxy)
gui.add(galaxyParams,'particleAttenuation').onFinishChange(generateGalaxy)
gui.add(galaxyParams,'galaxyRadius',0.01,100).onFinishChange(generateGalaxy)
gui.add(galaxyParams,'galaxyBranches',2,20,1).onFinishChange(generateGalaxy)
gui.add(galaxyParams,'rotationSpeed',-3,3,0.01).onFinishChange(generateGalaxy)
gui.add(galaxyParams,'randomness',0,2,0.01).onFinishChange(generateGalaxy)
gui.add(galaxyParams,'randomSkew',-12,12,0.1).onFinishChange(generateGalaxy)
gui.addColor(galaxyParams,'insideColor').onFinishChange(generateGalaxy)
gui.addColor(galaxyParams,'outsideColor').onFinishChange(generateGalaxy)

generateGalaxy(galaxyParams)




const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial()
)
// scene.add(cube)

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
camera.position.x = 3
camera.position.y = 3
camera.position.z = 3
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