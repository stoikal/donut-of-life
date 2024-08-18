import * as THREE from "three"
import GameOfLife from "./life"

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 )

const renderer = new THREE.WebGLRenderer()
renderer.setSize( window.innerWidth, window.innerHeight )
document.body.appendChild( renderer.domElement )

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
  const bg = getColor("midnightblue")
  const fg = getColor("tomato")

  gameOfLife.state.forEach((row, rowIndex) => {
    row.forEach((col, colIndex) => {
      const index = colIndex + row.length * rowIndex
      const stride = index * 4

      if (col) {
        data[ stride ] = fg.r
        data[ stride + 1 ] = fg.g
        data[ stride + 2 ] = fg.b
        data[ stride + 3 ] = fg.a
      } else {
        data[ stride ] = bg.r
        data[ stride + 1 ] = bg.g
        data[ stride + 2 ] = bg.b
        data[ stride + 3 ] = bg.a
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
  radialSegments: 80,
  tubularSegments: 240,
}

const gameOfLife = new GameOfLife(d.tubularSegments, d.radialSegments)

const geometry = new THREE.TorusGeometry(d.torusRadius, d.tubeRadius, d.radialSegments, d.tubularSegments)
const material = new THREE.MeshBasicMaterial({ map: createMap(gameOfLife) })

const torus = new THREE.Mesh(geometry, material)

// torus.material.depthTest = false
// torus.material.transparent = true

scene.background = new THREE.Color("lightpink")
scene.add( torus )

camera.position.z = 40

const MAX_FPS = 8
const interval = 1000 / MAX_FPS
let lastTimestamp = 0

function animate(timestamp: number) {
  renderer.render( scene, camera )

  torus.rotation.x += .005
  torus.rotation.y += .005

  if (timestamp - lastTimestamp >= interval) {
    gameOfLife.next()
    torus.material.map = createMap(gameOfLife)
    lastTimestamp = timestamp
  }
}

renderer.setAnimationLoop( animate )
