import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

function createCheckerboardTexture(w = 80, h = 16, flip = false) {
  const cellSize = 10

  const canvas = document.createElement('canvas');
  canvas.width = w * cellSize;
  canvas.height = h * cellSize;
  const context = canvas.getContext('2d');

  
  for (let x = 0; x < canvas.width; x += cellSize) {
    for (let y = 0; y < canvas.height; y += cellSize) {
      if ((x + y) % (2 * cellSize) === 0) { // even cell
        context.fillStyle = flip ? 'green' : 'red';
      } else {
        context.fillStyle = flip ? 'black' : 'black';
      }
      context.fillRect(x, y, cellSize, cellSize);
    }
  }

  const texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
  return texture;
}

const d = {
  torusRadius: 10,
  tubeRadius: 4,
  radialSegments: 20,
  tubularSegments: 80,
}

const geometry = new THREE.TorusGeometry(d.torusRadius, d.tubeRadius, d.radialSegments, d.tubularSegments ); 
const material = new THREE.MeshBasicMaterial({ map: createCheckerboardTexture(d.tubularSegments, d.radialSegments) }); 
// const material = new THREE.MeshToonMaterial( { color: 0x00ff00 } ); 

const torus = new THREE.Mesh( geometry, material );

// const wireframe = new THREE.WireframeGeometry( geometry );

// const torus = new THREE.LineSegments( wireframe );
torus.material.depthTest = false;
torus.material.opacity = 0.5;
torus.material.transparent = true;

scene.add( torus );

camera.position.z = 40;

let flip = false
const MAX_FPS = 4
const interval = 1000 / MAX_FPS;
let lastTimestamp = 0

function animate(timestamp) {
  renderer.render( scene, camera );

  torus.rotation.x += .01;
  torus.rotation.y += .01;

  if (timestamp - lastTimestamp >= interval) {
    flip = !flip
    torus.material.map = createCheckerboardTexture(d.tubularSegments, d.radialSegments, flip)
    lastTimestamp = timestamp;
  }
}

renderer.setAnimationLoop( animate );
