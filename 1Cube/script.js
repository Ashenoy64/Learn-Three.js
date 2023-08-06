// console.log(THREE)

const scene= new THREE.Scene()

const boxGeometry=new THREE.BoxGeometry(1,1,1)

const boxMaterial =new THREE.MeshBasicMaterial({ color:'yellowgreen'})

const boxMesh=new THREE.Mesh(boxGeometry,boxMaterial)

scene.add(boxMesh)

const sizes={width:800,
    height:600
}

const camera= new THREE.PerspectiveCamera(75,sizes.width/sizes.height)

camera.position.z=3
camera.position.y=1
camera.rotation.z=1

scene.add(camera)

const canvas= document.querySelector('.env')

const renderer= new THREE.WebGLRenderer({
    canvas: canvas,
})
 
renderer.setSize(sizes.width,sizes.height)

renderer.render(scene,camera)