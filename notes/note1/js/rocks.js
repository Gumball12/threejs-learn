import * as THREE from 'three'
import TWEEN from '@tweenjs/tween.js'

// init scene
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({ alpha: false })
renderer.setSize(window.innerWidth, window.innerHeight)

document.body.appendChild(renderer.domElement)

// rocks
const rocks = []
let material = null

const textureLoader = new THREE.TextureLoader()
textureLoader.crossOrigin = true
textureLoader.load('https://s3-us-west-2.amazonaws.com/s.cdpn.io/53148/rock-texture.jpg', t => {
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.repeat.set(2, 2)
  
  material = new THREE.MeshLambertMaterial({ map: t })
  
  for (var i = 0; i < 100; i++) {
    const r = new Rock()
    rocks.push(r)
  }
})

class Rock {
  constructor () {
    const size = 10 + Math.random() * 10
    const geometry = new THREE.IcosahedronGeometry(size, 0)
    const icosahedron = new THREE.Mesh(geometry, material)

    for (var i = 0; i < geometry.vertices.length; i++) {
      const g = geometry.vertices[i]

      g.x += size * -0.25 + Math.random() * size * 0.5
      g.y += size * -0.25 + Math.random() * size * 0.5
    }

    const variance = 0.01
    this.vr = {
      x: -variance + Math.random() * variance * 2,
      y: -variance + Math.random() * variance * 2
    }

    const field = 300
    icosahedron.position.x = -field + Math.random() * field * 2
    icosahedron.position.y = -field + Math.random() * field * 2
    icosahedron.position.z = -field + Math.random() * field * 2

    this.mesh = icosahedron

    scene.add(icosahedron)
  }
}

// moving camera
function updateCamera (up) {
  const c = { angle: up? 1: 0 }

  new TWEEN.Tween(c)
    .to({ angle: up? 0: 1 }, 1000)
    .easing(TWEEN.Easing.Exponential.InOut)
    .onUpdate(() => {
      const z = 100 * Math.cos(c.angle)
      const y = 100 * Math.sin(c.angle)

      camera.position.z = z
      camera.position.y = y
    
      camera.rotation.x = z * 0.02
    })
    .onComplete(() => updateCamera(!up))
    .start()
}
updateCamera(false)

// init light
const light1 = new THREE.PointLight(0xffffff)
const light2 = new THREE.PointLight(0xffffff)

light1.position.set(300, 300, 0)
light2.position.set(0, 300, 300)

scene.add(light1)
scene.add(light2)

function animate (time) {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)

  TWEEN.update(time)
}
animate()
