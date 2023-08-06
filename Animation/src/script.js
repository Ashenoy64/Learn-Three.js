import './style.css'
import * as THREE from 'three' 
import gsap from 'gsap'
// console.log(THREE)

const scene= new THREE.Scene()



const boxGeometry=new THREE.BoxGeometry(1,1,1)

const boxMaterial =new THREE.MeshBasicMaterial({ color:'yellowgreen'})

const boxMesh=new THREE.Mesh(boxGeometry,boxMaterial)

const cube1=new THREE.Mesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshBasicMaterial({color:0xff0000}))
const cube2=new THREE.Mesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshBasicMaterial({color:0xff0}))

// const vetor=new THREE.Vector3(0,0,0)
// console.log("HI",boxMesh.position.length()==boxMesh.position.distanceTo(vetor))


const sizes={width:800,
    height:600
}

const camera= new THREE.PerspectiveCamera(75,sizes.width/sizes.height)

camera.position.z=3

scene.add(camera)

const canvas= document.querySelector('.env')

const renderer= new THREE.WebGLRenderer({
    canvas: canvas,
})


const group= new THREE.Group()
scene.add(group)

group.add(cube1)
cube2.position.x=-2
group.add(cube2)
boxMesh.position.x=2
group.add(boxMesh)

group.position.y=1

group.rotation.z=1

group.scale.x=0.4
group.scale.y=0.4
group.scale.z=0.4


// const axisHelper= new THREE.AxesHelper(5) 
// scene.add(axisHelper)
 
renderer.setSize(sizes.width,sizes.height)

renderer.render(scene,camera)

var move_x=0.05;
var move_y=-0.05
var move_z=0.05

var scale_x=0.0001
var scale_y=-0.0001
var scale_z=0.0001

var rot_x=0.01
var rot_y=0.01
var rot_z=0.25

let time=Date.now()

// const clock= new THREE.Clock()

// gsap.to(group.position,{x:2,duration: 1, delay:1})

// gsap.to(group.position,{x:0,duration: 1, delay:2})


// gsap.to(group.position,{x:-2,duration: 1, delay:3})

let ro_x=0.055
let ro_y=0.02
let ro_z=0.07

function tick(){
    // const curtime=Date.now()

    // const deltaTime=curtime-time 
    // time=curtime
    const deltaTime=1

    // const deltaTime=clock.getElapsedTime()

    // window.requestAnimationFrame(tick)
    // group.rotation.z=(group.rotation.z+0.1)%(2*Math.PI)
    // group.position.x=group.position.x+move_x
    if(group.position.x>2.5)
    {
        move_x=move_x*-1;
    }
    else if(group.position.x<-2.5)
    {
        move_x=move_x*-1
    }

    if(group.position.y>2)
    {
        move_y=move_y*-1;
    }
    else if(group.position.y<-2)
    {
        move_y=move_y*-1
    }

    if(group.position.z>0)
    {
        move_z=move_z*-1;
    }
    else if(group.position.z<-2.5)
    {
        move_z=move_z*-1
    }

    if(group.scale.x>1)
    {
        scale_x=scale_x*-1;
    }
    else if(group.scale.x<0)
    {
        scale_x=scale_x*-1
    }

    if(group.scale.y>1)
    {
        scale_y=scale_y*-1;
    }
    else if(group.scale.y<0)
    {
        scale_y=scale_y*-1
    }

    if(group.scale.z>1)
    {
        scale_z=scale_z*-1;
    }
    else if(group.scale.z<0)    {
        scale_z=scale_z*-1
    }
    

    group.position.x+=move_x*deltaTime
    group.position.y+=move_y*deltaTime
    group.position.z+=move_z*deltaTime

    group.rotation.x=(group.rotation.x+(rot_x))%(Math.PI*2)
    group.rotation.y=(group.rotation.y-(rot_y))%(Math.PI*2)
    group.rotation.z=(group.rotation.z+(rot_z))%(Math.PI*2)
    
    boxMesh.rotation.x=(boxMesh.rotation.x+(ro_x))%(Math.PI*2)
    cube1.rotation.x=(cube1.rotation.x+(ro_x))%(Math.PI*2)
    cube2.rotation.x=(cube2.rotation.x-(ro_x))%(Math.PI*2)

    boxMesh.rotation.y=(boxMesh.rotation.y-(ro_y))%(Math.PI*2)
    cube1.rotation.y=(cube1.rotation.y+(ro_y))%(Math.PI*2)
    cube2.rotation.y=(cube2.rotation.y+(ro_y))%(Math.PI*2)

    boxMesh.rotation.z=(boxMesh.rotation.z+(ro_z))%(Math.PI*2)
    cube1.rotation.z=(cube1.rotation.z-(ro_z))%(Math.PI*2)
    cube2.rotation.z=(cube2.rotation.z+(ro_z))%(Math.PI*2)

    group.scale.x+=scale_x*deltaTime
    group.scale.y+=scale_y*deltaTime
    group.scale.z+=scale_z*deltaTime

    // camera.lookAt(group.position)
    //circle motion
    // group.position.x=Math.sin(deltaTime)
    // group.position.y=Math.cos(deltaTime)


    renderer.render(scene,camera)
    window.requestAnimationFrame(tick)

}

tick()