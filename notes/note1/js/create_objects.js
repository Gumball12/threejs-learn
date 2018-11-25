import * as THREE from 'three'
import OrbitControls from 'three-orbitcontrols'

// init scene
const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
camera.position.set(0, 30, 50)
camera.lookAt(new THREE.Vector3(0, 15, 0))

const renderer = new THREE.WebGLRenderer({ antialias: true })

renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setClearColor(0xfff6e6)

document.body.appendChild(renderer.domElement)


// init objects

// plane object
const planeGeometry = new THREE.PlaneGeometry(5, 5, 5, 5)
const basicMaterial = new THREE.MeshBasicMaterial({ color: 0x393839, wireframe: true })

const plane = new THREE.Mesh(planeGeometry, basicMaterial)
plane.rotateX(Math.PI / 2)

scene.add(plane)

// octahedron object
/*
const octahedronGeometry = new THREE.OctahedronGeometry(10, 1)
const standardMaterial = new THREE.MeshStandardMaterial({
  color: 0xff0051,
  flatShading: THREE.FlatShading,
  metalness: 0,
  roughness: 1
})

const octahedron = new THREE.Mesh(octahedronGeometry, standardMaterial)
octahedron.position.y += 10

octahedron.castShadow = true
octahedron.receiveShadow = true

scene.add(octahedron)
*/

// combining
class Decoration extends THREE.Group {
  constructor () {
    super()

    const colors = ['#ff0051', '#f56762', '#a53c6c', '#f19fa0', '#72bdbf', '#47689b']

    const octahedronGeometry = new THREE.OctahedronGeometry(12 ,1)
    const cylinderGeometry = new THREE.CylinderGeometry(4, 6, 10, 6, 1)
    const torusGeometry = new THREE.TorusGeometry(2, 1, 6, 4, Math.PI)

    const standardMaterial = new THREE.MeshStandardMaterial({
      color: colors[Math.floor(Math.random() * colors.length)],
      flatShading: THREE.FlatShading,
      metalness: 0,
      roughness: 1
    })

    const bauble = new THREE.Mesh(octahedronGeometry, standardMaterial)
    bauble.castShadow = true
    bauble.receiveShadow = true
    bauble.rotateY(Math.random() * Math.PI * 2)
    bauble.rotateZ(Math.random() * Math.PI * 2)

    this.add(bauble) // method of [THREE.Group]

    const topShape1 = new THREE.Mesh(cylinderGeometry, standardMaterial)
    topShape1.position.y += 8
    topShape1.castShadow = true
    topShape1.receiveShadow = true

    this.add(topShape1)

    const topShape2 = new THREE.Mesh(torusGeometry, standardMaterial)
    topShape2.position.y += 13
    topShape2.castShadow = true
    topShape2.receiveShadow = true

    this.add(topShape2)

    // set instance variables
    this.rotationSpeed = Math.random() * 0.02 + 0.005
    this.rotationPosition = Math.random()
  }

  updatePosition () {
    this.rotationPosition += this.rotationSpeed
    this.rotation.y = Math.sin(this.rotationPosition)
  }
}

const decos = []

const deco1 = new Decoration()
deco1.position.y += 10
scene.add(deco1)

const deco2 = new Decoration()
deco2.position.set(20, 15, -10)
deco2.scale.set(0.8, 0.8, 0.8)
scene.add(deco2)

const deco3 = new Decoration()
deco3.position.set(-20, 20, -12)
scene.add(deco3)

decos.push(deco1)
decos.push(deco2)
decos.push(deco3)

// ground object
const boxGeometry = new THREE.BoxGeometry(100, 0.1, 100)
const shadowMaterial = new THREE.ShadowMaterial({ color: 0x333333 })
shadowMaterial.opacity = 0.8

const ground = new THREE.Mesh(boxGeometry, shadowMaterial)
ground.receiveShadow = true
scene.add(ground)

// init lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 1)
pointLight.position.set(25, 50, 25)

pointLight.castShadow = true
pointLight.shadow.mapSize.width = 1024
pointLight.shadow.mapSize.height = 1024

scene.add(pointLight)

// init control
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.5
controls.enableZoom = true
controls.maxPolarAngle = Math.PI / 2 - Math.PI / 16

// init animation loop
function render() {
  requestAnimationFrame(render)
  renderer.render(scene, camera)

  for (var i = 0; i < decos.length; i++) {
    decos[i].updatePosition()
  }
}
render()
