import * as THREE from 'three'
import Stats from 'stats.js'
import * as dat from 'dat.gui'

/*
* init
*/

let scene, camera, renderer

let stats, controls

let cube, sphere

function init () {
	createScene()
	createHelper()

	createLights()

	createPlane()
	createCube()
	createSphere()

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
		cubeAnimationSpeed: 0.02,
		sphereAnimationSpeed: 0.05
	}

	const gui = new dat.GUI()
	gui.add(controls, 'cubeAnimationSpeed', 0, 0.5) // 0: min, 0.5: max
	gui.add(controls, 'sphereAnimationSpeed', 0, 0.5)
}

/*
* objects
*/

function createPlane () {
	// create plane
	const planeGeometry = new THREE.PlaneGeometry(60, 20, 1, 1)
	const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFFFF })
	
	const plane = new THREE.Mesh(planeGeometry, planeMaterial)
	plane.rotation.x = -Math.PI / 2 // rotate 90 deg
	plane.position.x = 15
	plane.position.y = 0
	plane.position.z = 0

	plane.receiveShadow = true // set receive shadow
	
	scene.add(plane)
}

function createCube () {
	// create cube
	const cubeGeometry = new THREE.BoxGeometry(10, 4, 12)
	const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xFF0000 })
	
	cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
	cube.position.x = -4
	cube.position.y = 3
	cube.position.z = 0

	cube.castShadow = true // set cast shadow
	
	scene.add(cube)
}

function createSphere () {
	// create sphere
	const sphereGeometry = new THREE.SphereGeometry(4, 20, 20)
	const sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x7777FF })
	
	sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
	sphere.position.x = 20
	sphere.position.y = 4
	sphere.position.z = 2

	sphere.castShadow = true // set cast shadow
	
	scene.add(sphere)
}

function createLights () {
	// create spot-light
	const spotLight = new THREE.SpotLight(0xffffff, 0.9)
	spotLight.position.set(-40, 60, -10)

	spotLight.castShadow = true // set cast shadow
	spotLight.shadow.mapSize.width = 2048 // set shadow pixel
	spotLight.shadow.mapSize.height = 2048

	scene.add(spotLight)
}

/*
* loops
*/

var step = 0

function animate () { // animation loop
	requestAnimationFrame(animate) // call 'animate' function by each frame(60hz)
	renderer.render(scene, camera) // renderer update

	stats.update() // stats.js

	// animate cube	
	cube.rotation.x += controls.cubeAnimationSpeed
	cube.rotation.y += controls.cubeAnimationSpeed
	cube.rotation.z += controls.cubeAnimationSpeed

	// animate sphere
	sphere.position.y = 5 + Math.sin(step * 2)
	sphere.position.x = 15 + Math.sin(step) + Math.sin(step) * 5

	step += controls.sphereAnimationSpeed
}
