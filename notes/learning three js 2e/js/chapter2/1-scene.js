import * as THREE from 'three'
import Stats from 'stats.js'
import * as dat from 'dat.gui'

/*
* init
*/

let scene, camera, renderer

let stats, controls

let plane

function init () {
	createScene()
	createHelper()

	createLights()

	createPlane()

	animate()
}
init()

function createScene () {
	// create Scene
	scene = new THREE.Scene()

	// create Perspective Camera
	camera = new THREE.PerspectiveCamera(
		45, // fov
		window.innerWidth / window.innerHeight, // aspect
		0.1, // near reder limit
		1000 // far render limit
	)

	camera.position.x = -30 // camera positioning
	camera.position.y = 40
	camera.position.z = 30

	camera.lookAt(scene.position) // look at the Scene(0, 0, 0)

	// create renderer
	renderer = new THREE.WebGLRenderer({
		antialias: true
	})

	renderer.setClearColor(0xEEEEEE) // renderer setup (background, HEX)
	renderer.setSize(window.innerWidth, window.innerHeight)
	
	renderer.render(scene, camera)

	renderer.shadowMap.enabled = true // enable 'shadow'

	document.body.appendChild(renderer.domElement) // insert <canvas> element

	// create axes helper (not 'axis')
	const axes = new THREE.AxesHelper(20) // 20 = length
	scene.add(axes) // added scene

	scene.fog = new THREE.Fog(0xffffff, 0.015, 100) // fog

	scene.overrideMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff })

	// handle resize
	window.addEventListener('resize', handleResize)
	function handleResize () {
		camera.aspect = window.innerWidth / window.innerHeight
		camera.updateProjectionMatrix()
		renderer.setSize(window.innerWidth, window.innerHeight)
	}
}

function createHelper () {
	// stats.js
	stats = new Stats()
	stats.setMode(0)
	stats.domElement.style.position = 'absolute'
	stats.domElement.style.left = '0px'
	stats.domElement.style.top = '0px'
	document.body.appendChild(stats.domElement)

	// dat.GUI
	controls = {
		rotationSpeed: 0.02,
		numberOfObjects: scene.children.length,

		removeCube () {
			const childrens = scene.children
			const lastObj = childrens[childrens.length - 1]

			if (lastObj instanceof THREE.Mesh) {
				scene.remove(lastObj) // remove object
				this.numberOfObjects = scene.children.length
			}
		},

		addCube () {
			const size = Math.ceil(Math.random() * 3)
			const geometry = new THREE.BoxGeometry(size, size, size)
			const material = new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff })
			const cube = new THREE.Mesh(geometry, material)

			cube.castShadow = true
			cube.name = `cube-${scene.children.length}` // mesh naming
			cube.position.x = -30 + Math.round(Math.random() * 60)
			cube.position.y = Math.round(Math.random() * 5)
			cube.position.z = -20 + Math.round(Math.random() * 40)

			scene.add(cube)
			this.numberOfObjects = scene.children.length
		},

		outputObjects () {
			console.log(scene.children)
		}
	}

	const gui = new dat.GUI()
	gui.add(controls, 'rotationSpeed', 0, 0.5)
	gui.add(controls, 'addCube')
	gui.add(controls, 'removeCube')
	gui.add(controls, 'outputObjects')
	gui.add(controls, 'numberOfObjects').listen()
}

/*
* objects
*/

function createPlane () {
	// create plane
	const planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1)
	const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFFFF })
	
	plane = new THREE.Mesh(planeGeometry, planeMaterial)
	plane.rotation.x = -Math.PI / 2 // rotate 90 deg
	plane.position.x = 0
	plane.position.y = 0
	plane.position.z = 0

	plane.receiveShadow = true // set receive shadow
	
	scene.add(plane)
}

function createLights () {
	// create spot-light
	const spotLight = new THREE.SpotLight(0xffffff)
	spotLight.position.set(-40, 60, -10)

	spotLight.castShadow = true // set cast shadow
	spotLight.shadow.mapSize.width = 2048 // set shadow pixel
	spotLight.shadow.mapSize.height = 2048

	scene.add(spotLight)

	const ambientLight = new THREE.AmbientLight(0x0c0c0c)
	scene.add(ambientLight)
}

/*
* loops
*/

function animate () { // animation loop
	requestAnimationFrame(animate) // call 'animate' function by each frame(60hz)
	renderer.render(scene, camera) // renderer update

	stats.update() // stats.js
	
	scene.traverse(el => { // iterate all objects
		if (el instanceof THREE.Mesh && el != plane) {
			el.rotation.x += controls.rotationSpeed
			el.rotation.y += controls.rotationSpeed
			el.rotation.z += controls.rotationSpeed
		}
	})
}
