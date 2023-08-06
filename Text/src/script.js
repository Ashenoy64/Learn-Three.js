console.time('star')
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader'
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry'


const canvas = document.querySelector('canvas.webgl')
const textureLoader=new THREE.TextureLoader()
const fontLoader=new FontLoader();
const cubeTextureLoader=new THREE.CubeTextureLoader()


const colorTextures=textureLoader.load('/textures/minecraft.png')
const doorColor=textureLoader.load('/textures/door/color.jpg')
const doorAlpha=textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusion=textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeight=textureLoader.load('/textures/door/height.jpg')
const doorNormal=textureLoader.load('/textures/door/normal.jpg')
const doorMetalness=textureLoader.load('/textures/door/metalness.jpg')
const doorRoughness=textureLoader.load('/textures/door/roughness.jpg')


const matcap=textureLoader.load('/textures/matcaps/3.png')
const donutcap=textureLoader.load('/textures/matcaps/1.png')
const environmentMap=cubeTextureLoader.load([
    '/textures/environmentMaps/1/px.jpg',
    '/textures/environmentMaps/1/nx.jpg',
    '/textures/environmentMaps/1/py.jpg',
    '/textures/environmentMaps/1/ny.jpg',
    '/textures/environmentMaps/1/pz.jpg',
    '/textures/environmentMaps/1/nz.jpg',
])

const scene = new THREE.Scene()
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

let text=new THREE.Mesh()
fontLoader.load('/fonts/helvetiker_regular.typeface.json',(font)=>{
    const textGeometry=new TextGeometry('Hey there its Avanish!',{
        font:font,
        size:0.5,
        height:0.2,
        curveSegments:5,
        bevelEnabled:true,
        bevelThickness:0.03,
        bevelSize:0.02,
        bevelOffset:0,
        bevelSegments:4,
    })

    textGeometry.center()
    const material= new THREE.MeshMatcapMaterial()
    material.matcap=matcap
    text=new THREE.Mesh(textGeometry,material)
    text.rotation.z=Math.PI*0.025
    scene.add(text)

    const donutMat=new THREE.MeshMatcapMaterial({matcap:donutcap})
    const donutGeo=new THREE.TorusGeometry(0.3,0.2,20,45)
    
    for(let i=0;i<100;i++)
    {
        
        const donut=new THREE.Mesh(donutGeo,donutMat)
        
        donut.position.x=(Math.random()-0.5)*20
        donut.position.y=(Math.random()-0.5)*20
        donut.position.z=(Math.random()-0.5)*20
        

        donut.rotation.x=Math.random()*Math.PI
        donut.rotation.y=Math.random()*Math.PI

        const scale=Math.random()
        donut.scale.x=scale
        donut.scale.y=scale
        donut.scale.z=scale
        scene.add(donut)
    }

    
})

window.addEventListener('resize', () =>
{
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})



colorTextures.generateMipmaps=false
colorTextures.magFilter=THREE.NearestFilter
const diamondGeometry = new THREE.BoxGeometry(1, 1, 1)
const diamondMaterial = new THREE.MeshBasicMaterial({ map:colorTextures })
const diamondMesh = new THREE.Mesh(diamondGeometry, diamondMaterial)


const ambientLight= new THREE.AmbientLight(0xffffff,0.5)
const pointLight= new THREE.PointLight(0xffffff,0.5)
pointLight.position.x=2
pointLight.position.y=3
pointLight.position.z=4



const mirrorMaterial=new THREE.MeshStandardMaterial()
mirrorMaterial.metalness=1
mirrorMaterial.roughness=0.0
mirrorMaterial.envMap=environmentMap


const doorMaterial=new THREE.MeshStandardMaterial()
doorMaterial.side=THREE.DoubleSide
doorMaterial.map=doorColor

doorMaterial.aoMap=doorAmbientOcclusion
doorMaterial.aoMapIntensity=1


doorMaterial.displacementMap=doorHeight
doorMaterial.displacementScale=0.05


doorMaterial.metalnessMap=doorMetalness
doorMaterial.metalness=0   //dont change the value when  map

doorMaterial.roughnessMap=doorRoughness
doorMaterial.roughness=1  //dont change the value when  map


doorMaterial.normalMap=doorNormal
doorMaterial.normalScale.set(2,1) //vector 2

doorMaterial.transparent=true
doorMaterial.alphaMap=doorAlpha


const door=new THREE.Mesh(new THREE.PlaneGeometry(5,5,100,100),doorMaterial)
const mirror =new THREE.Mesh(new THREE.SphereGeometry(1,64,64),mirrorMaterial)
const globe=new THREE.MeshBasicMaterial({wireframe:true,color:0xf0ff})
const sphere=new THREE.Mesh(new THREE.SphereGeometry(30,16,16),globe)
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)



door.geometry.setAttribute('uv2',new THREE.BufferAttribute(door.geometry.attributes.uv.array,2))
mirror.geometry.setAttribute('uv2',new THREE.BufferAttribute(mirror.geometry.attributes.uv.array,2))
door.position.x=-3
door.position.y=3
door.rotation.z=Math.PI*0.025
diamondMesh.position.x=3
diamondMesh.position.y=3
mirror.position.y=-2
camera.position.x = 0
camera.position.y = 1
camera.position.z = 6
scene.add(ambientLight,pointLight,diamondMesh,door,mirror,camera,sphere)
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
const clock = new THREE.Clock()


const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    controls.update()
    sphere.rotation.y=elapsedTime/10
    door.rotation.y=elapsedTime/10
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}
console.timeEnd('star')
tick()