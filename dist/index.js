import * as THREE from 'https://unpkg.com/three@0.127.0/build/three.module.js'
import { OrbitControls } from 'https://unpkg.com/three@0.120.1/examples/jsm/controls/OrbitControls.js'
import { StereoEffect } from './StereoEffect.js'
import { GLTFLoader } from 'https://unpkg.com/three@0.120.1/examples/jsm/loaders/GLTFLoader'
import { DeviceOrientationControls } from 'https://unpkg.com/three@0.120.1/examples/jsm/controls/DeviceOrientationControls.js'

let permissionGranted = false;

function requestAccess() {
  DeviceOrientationEvent.requestPermission().then(response => {
    if(response == 'granted'){
      permissionGranted = true;
      document.getElementById("gyro").remove();
    }
  })
  .catch(console.error);
}

document.getElementById("gyro").onclick = function() {requestAccess()};

// document.getElementById("foo").innerHTML = window.innerWidth;
// document.getElementById("foo2").innerHTML = window.innerHeight;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerHeight / window.innerWidth, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
});

const element = renderer.domElement;

camera.position.set( 100, 0, 100 );
const controls = new OrbitControls(camera, element);
// controls.addEventListener('change', renderer);
controls.target.set(-100,0,-100);
controls.enableZoom = false;
controls.minDistance = 1;
controls.maxDistance = 1;

controls.update();

const effect = new StereoEffect( renderer );
effect.setSize( window.innerHeight, window.innerWidth );
effect.render( scene, camera );

// Loading images into VR environment
let materialArray = [];
let texture_ft = new THREE.TextureLoader().load( 'meadow_ft.JPG');
let texture_bk = new THREE.TextureLoader().load( 'meadow_bk.JPG');
let texture_up = new THREE.TextureLoader().load( 'meadow_up.JPG');
let texture_dn = new THREE.TextureLoader().load( 'meadow_dn.JPG');
let texture_rt = new THREE.TextureLoader().load( 'meadow_rt.JPG');
let texture_lf = new THREE.TextureLoader().load( 'meadow_lf.JPG');

//Overlapping mesh objects with textures  
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_ft }));
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_bk }));
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_up }));
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_dn }));
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_rt }));
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_lf }));
   
for (let i = 0; i < 6; i++)
  materialArray[i].side = THREE.BackSide;
   
let skyboxGeo = new THREE.BoxGeometry( 1000, 1000, 1000);
let skybox = new THREE.Mesh( skyboxGeo, materialArray );
scene.add( skybox );

function moveCamera() {
  window.addEventListener('deviceorientation', function(event) {
    const t = document.body.getBoundingClientRect().top;

    
    
    let beta =  THREE.Math.degToRad( event.beta );
    let gamma = -THREE.Math.degToRad( event.gamma );
    let alpha = THREE.Math.degToRad( event.alpha );

 
      camera.rotation.z = beta;
      camera.rotation.x = gamma;
      camera.rotation.y = alpha;


    // else{
    //   camera.rotation.y = alpha-Math.PI;
    //   camera.rotation.z = Math.PI-beta;

    // }
    


    console.log("gamma: ", ( event.gamma ), "beta: ",( event.beta ), "alpha :", ( event.alpha ));
    
  });
  
}

moveCamera();
  

function animate(){


  
  requestAnimationFrame(animate);
  // hoverSpheres();
  effect.render(scene, camera);
    
}
  
animate();