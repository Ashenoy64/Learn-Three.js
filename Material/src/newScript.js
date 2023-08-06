const cubeTextureLoader=new THREE.CubeTextureLoader()
const environmentMap=cubeTextureLoader.load([
    '/textures/environmentMaps/1/px.jpg',
    '/textures/environmentMaps/1/nx.jpg',
    '/textures/environmentMaps/1/py.jpg',
    '/textures/environmentMaps/1/ny.jpg',
    '/textures/environmentMaps/1/pz.jpg',
    '/textures/environmentMaps/1/nz.jpg',
])

const ambientLight= new THREE.AmbientLight(0xffffff,0.5)
const pointLight= new THREE.PointLight(0xffffff,0.5)
pointLight.position.x=2
pointLight.position.y=3
pointLight.position.z=4
scene.add(ambientLight,pointLight)



const doorColor=textureLoader.load('/textures/door/color.jpg')
const doorAlpha=textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusion=textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeight=textureLoader.load('/textures/door/height.jpg')
const doorNormal=textureLoader.load('/textures/door/normal.jpg')
const doorMetalness=textureLoader.load('/textures/door/metalness.jpg')
const doorRoughness=textureLoader.load('/textures/door/roughness.jpg')

const matCap=textureLoader.load('/textures/matcaps/5.png')
const gradient=textureLoader.load('/textures/gradients/3.jpg')


const mirrorMaterial=new THREE.MeshStandardMaterial()
mirrorMaterial.metalness=0.7
mirrorMaterial.roughness=0.2
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
doorMaterial.alphaMap=doorAplha


const door=new THREE.Mesh(new THREE.PlaneGeometry(1,1,100,100),doorMaterial)

const mirror =new THREE.Mesh(new THREE.SphereGeometry(0.5,64,64),mirrorMaterial)

door.geometry.setAttribute('uv2',new THREE.BufferAttribute(plane.geometry.attributes.uv.array,2))
mirror.geometry.setAttribute('uv2',new THREE.BufferAttribute(sphere.geometry.attributes.uv.array,2))

scene.add(door,mirror)