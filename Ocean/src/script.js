import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import waterVertex from './Shader/Water/vertex.glsl'
import waterFragment from './Shader/Water/fragment.glsl'

/**
 * Base
 */
// Debug
const gui = new dat.GUI({ width: 340 })

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneGeometry(2, 2, 512, 512)

// Material
const debugObject ={}
debugObject.depthColor = '#186691'  
debugObject.surfaceColor = '#9bd8ff'  


const waterMaterial = new THREE.ShaderMaterial({
    vertexShader : waterVertex,
    fragmentShader : waterFragment,
    uniforms:
    {   
        uTime :{value : 0 },
        uSpeed :{value : 0.75 },

        uBigWaveElevation : {value :  0.2},
        uBigWaveFrequency : {value :  new THREE.Vector2(4,1.5)},

        uDepthColor : { value :  new THREE.Color(debugObject.depthColor)},
        uSurfaceColor : { value :  new THREE.Color(debugObject.surfaceColor)},
        uColorOffset : { value : 0.08 },
        uColorMultiplier : { value : 5 },

        uSmallWaveElevation : {value :0.15},
        uSmallWaveFrequency : {value : 3},
        uSmallWaveSpeed : {value : 0.2},
        uSmallWaveIteration : {value : 4.0},
    }
})


gui.add(waterMaterial.uniforms.uBigWaveElevation,'value',0,1,0.001).name('Wave Height')
gui.add(waterMaterial.uniforms.uBigWaveFrequency.value,'x',0,10,0.001).name('Wave Frequency X')
gui.add(waterMaterial.uniforms.uBigWaveFrequency.value,'y',0,10,0.001).name('Wave Frequency Y')
gui.add(waterMaterial.uniforms.uSpeed,'value',0,10,0.001).name('Wave Speed')

gui.addColor(debugObject,'depthColor').name('Depth Color')
    .onChange(()=>{
        waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor)
})
gui.addColor(debugObject,'surfaceColor').name('Surface Color')
    .onChange(()=>{
        waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor)
})



gui.add(waterMaterial.uniforms.uColorMultiplier,'value',0,10,0.1).name('Color Offset')
gui.add(waterMaterial.uniforms.uColorOffset,'value',0,2,0.001).name('Color Multiplier')


gui.add(waterMaterial.uniforms.uSmallWaveElevation,'value',0,1,0.001).name('Small Wave Elevation')
gui.add(waterMaterial.uniforms.uSmallWaveFrequency,'value',0,30,0.001).name(' Small Wave Frequency ')
gui.add(waterMaterial.uniforms.uSmallWaveSpeed,'value',0,5,0.001).name(' Small Wave Speed ')
gui.add(waterMaterial.uniforms.uSmallWaveIteration,'value',0,4,1).name('Small Wave Iterations')







// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial)
water.rotation.x = - Math.PI * 0.5
scene.add(water)





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
camera.position.set(1, 1, 1)
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
    waterMaterial.uniforms.uTime.value = elapsedTime
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()