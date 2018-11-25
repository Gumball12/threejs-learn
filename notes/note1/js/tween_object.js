import TWEEN from '@tweenjs/tween.js'
import * as THREE from 'three'

import './test.png'

// init scene
const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(30, innerWidth / window.innerHeight, 0.1, 1000)

const renderer = new THREE.WebGLRenderer({ alpha: false })
renderer.setSize(window.innerWidth, window.innerHeight)

document.body.appendChild(renderer.domElement)

camera.position.z = 200

// init geometry
const geometry = new THREE.IcosahedronGeometry(20)

const colors = [0x05A8AA, 0xB8D5B8, 0xD7B49E, 0xDC602E, 0xBC412B, 0xF19C79, 0xCBDFBD, 0xF6F4D2, 0xD4E09B, 0xFFA8A9, 0xF786AA, 0xA14A76, 0xBC412B, 0x63A375, 0xD57A66, 0x731A33, 0xCBD2DC, 0xDBD48E, 0x5E5E5E]
for (var i = 0; i < geometry.faces.length; i++) {
  const f = geometry.faces[i]
  f.color.setHex(colors[i])
}

const material = new THREE.MeshLambertMaterial({ vertexColors: THREE.FaceColors })

const mesh = new THREE.Mesh(geometry, material)

scene.add(mesh)

// init light
const light1 = new THREE.DirectionalLight(0xffffff, 0.8)
light1.position.set(0, 0, 0)
scene.add(light1)

const light2 = new THREE.DirectionalLight(0xffffff, 0.8)
light2.position.set(0, -1, 0)
scene.add(light2)

const light3 = new THREE.DirectionalLight(0xffffff, 0.8)
light2.position.set(0, 0, 1)
scene.add(light3)

// tweening
const verticePositions = []
for (var i = 0; i < geometry.vertices.length; i++) {
  const g = geometry.vertices[i]
  verticePositions.push({ x: g.x, y: g.y })
}

function getNewVertices () {
  const newVertices = []

  for (var i = 0; i < geometry.vertices.length; i++) {
    const v = verticePositions[i]
    newVertices.push({
      x: v.x - 5 + Math.random() * 10,
      y: v.y - 5 + Math.random() * 10
    })
  }

  return newVertices
}

function tweening () {
  const newVerticePositions = getNewVertices()

  for (var i = 0; i < geometry.vertices.length; i++) {
    tweenVertice(i, newVerticePositions)
  }

  const rotation = {
    x: Math.random() * 3,
    y: Math.random() * 3,
    z: Math.random() * 3
  }

  new TWEEN.Tween(mesh.rotation)
    .to({ x: rotation.x, y: rotation.y, z:rotation.z }, 1000)
    .easing(TWEEN.Easing.Exponential.InOut)
    .start()
}

function tweenVertice(ind, newVerticePositions) {
  const v = geometry.vertices[ind]
  const nv = newVerticePositions[ind]

  new TWEEN.Tween(v)
    .to({ x: nv.x, y: nv.y }, 1000)
    .easing(TWEEN.Easing.Exponential.InOut)
    .onComplete(() => {
      if (ind === 0) tweening()
    })
    .start()
}

tweening()

// animation loop
const animate = function (time) {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)

  TWEEN.update(time)
  geometry.verticesNeedUpdate = true
}
animate()
