import * as THREE from 'three';
import GameOfLife from './life';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

function createMap(gameOfLife: GameOfLife) {
  const cellSize = 8

  const canvas = document.createElement('canvas')
  canvas.width = gameOfLife.w * cellSize
  canvas.height = gameOfLife.h * cellSize
  const context = canvas.getContext('2d') as CanvasRenderingContext2D

  gameOfLife.state.forEach((row, rowIndex) => {
    row.forEach((col, colIndex) => {
      const x = colIndex * cellSize
      const y = rowIndex * cellSize

      if (col) {
        context.fillStyle = '#00ffff'
        context.fillRect(x, y, cellSize, cellSize)
      }
    })
  });



  const texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
  return texture;
}

const d = {
  torusRadius: 10,
  tubeRadius: 4,
  radialSegments: 40,
  tubularSegments: 160,
}

const gameOfLife = new GameOfLife(d.tubularSegments, d.radialSegments)

const geometry = new THREE.TorusGeometry(d.torusRadius, d.tubeRadius, d.radialSegments, d.tubularSegments)
const material = new THREE.MeshBasicMaterial({ map: createMap(gameOfLife) })

const torus = new THREE.Mesh(geometry, material)

torus.material.depthTest = false;
torus.material.transparent = true;

scene.add( torus );

camera.position.z = 40;

const MAX_FPS = 8
const interval = 1000 / MAX_FPS;
let lastTimestamp = 0

function animate(timestamp: number) {
  renderer.render( scene, camera );

  torus.rotation.x += .005;
  torus.rotation.y += .005;

  if (timestamp - lastTimestamp >= interval) {
    gameOfLife.next()
    torus.material.map = createMap(gameOfLife)
    lastTimestamp = timestamp;
  }
}

renderer.setAnimationLoop( animate );
