import * as THREE from "three"
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GameOfLife from "./life"
import Controls from "./controls"

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 )

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

function getColor (name: string) {
  const color = new THREE.Color(name)

  const r = Math.floor( color.r * 255 )
  const g = Math.floor( color.g * 255 )
  const b = Math.floor( color.b * 255 )
  const a = 255

  return { r, g, b, a }
}

function createMap(gameOfLife: GameOfLife) {
  const width = gameOfLife.w
  const height = gameOfLife.h
  
  const size = width * height
  const data = new Uint8Array(size * 4)
  const bg = getColor("#0E314D")
  const fg = getColor("#DB4448")

  gameOfLife.state.forEach((row, rowIndex) => {
    row.forEach((col, colIndex) => {
      const index = colIndex + row.length * rowIndex
      const stride = index * 4

      if (col) {
        data[stride] = fg.r
        data[stride + 1] = fg.g
        data[stride + 2] = fg.b
        data[stride + 3] = fg.a
      } else {
        data[stride] = bg.r
        data[stride + 1] = bg.g
        data[stride + 2] = bg.b
        data[stride + 3] = bg.a
      }
    })
  })
  
  const texture = new THREE.DataTexture(data, width, height)
  texture.needsUpdate = true
  return texture
}

const d = {
  torusRadius: 10,
  tubeRadius: 4,
  radialSegments: 40,
  tubularSegments: 120,
}

let gameOfLife = new GameOfLife(d.tubularSegments, d.radialSegments)

const geometry = new THREE.TorusGeometry(d.torusRadius, d.tubeRadius, d.radialSegments, d.tubularSegments)
const material = new THREE.MeshStandardMaterial({ map: createMap(gameOfLife) })

const torus = new THREE.Mesh(geometry, material)

scene.background = new THREE.Color("#EDC5D0")
scene.add( torus )

const ambientLight = new THREE.AmbientLight( 0x404040, 70 );
scene.add( ambientLight );

const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
scene.add( directionalLight );

// const helper = new THREE.DirectionalLightHelper( directionalLight, 5 );
// scene.add( helper );

camera.position.z = 40

const orbitControls = new OrbitControls(camera, renderer.domElement)

const MAX_FPS = 8
const interval = 1000 / MAX_FPS
let lastTimestamp = 0

torus.rotation.x += 2.3
torus.rotation.y += .5

function animate(timestamp: number) {
  renderer.render( scene, camera )


  orbitControls.update()

  if (timestamp - lastTimestamp >= interval) {
    gameOfLife.next()
    torus.material.map = createMap(gameOfLife)
    lastTimestamp = timestamp
  }
}

renderer.setAnimationLoop(animate)

const controls = new Controls({
  onDecrease: () => {
    if (d.radialSegments > 10) {
      d.radialSegments -= 10
      d.tubularSegments = d.radialSegments * 3
  
      gameOfLife = new GameOfLife(d.tubularSegments, d.radialSegments)
    }
  },
  onIncrease: () => {
    d.radialSegments += 10
    d.tubularSegments = d.radialSegments * 3

    gameOfLife = new GameOfLife(d.tubularSegments, d.radialSegments)
  },
})

document.body.appendChild(controls.domElement)