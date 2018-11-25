import * as THREE from 'three'
import Stats from 'stats.js'
import * as dat from 'dat.gui'

/*
* init
*/

let scene, camera, renderer

let stats, controls

let spot

function init () {
	createScene()
	createHelper()

	createLights()

	createPlane()
	createObjects()
	createCameraLookAt()

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

	camera.position.x = -40 // camera positioning
	camera.position.y = 51
	camera.position.z = -62

	camera.lookAt(20, 20, 0)

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
		mode: 'perspective',
		switchCamera () {
			if (camera instanceof THREE.PerspectiveCamera) {
				camera = new THREE.OrthographicCamera(
					window.innerWidth / -16, // left
					window.innerWidth / 16, // right
					window.innerHeight / 16, // top
					window.innerHeight / -16, // bottom
					-200, 500 // near, fat
				)

				camera.position.x = -40 // camera positioning
				camera.position.y = 51
				camera.position.z = -62

				controls.mode = 'orthographic'
			} else {
				camera = new THREE.PerspectiveCamera(
					45,
					window.innerWidth / window.innerHeight,
					0.1,
					1000
				)

				camera.position.x = -40 // camera positioning
				camera.position.y = 51
				camera.position.z = -62

				controls.mode = 'perspective'
			}
		},
		lookAtX: 20,
		lookAtY: 20,
		lookAtZ: 0
	}

	const gui = new dat.GUI()
	gui.add(controls, 'switchCamera')
	gui.add(controls, 'lookAtX', -30, 30)
	gui.add(controls, 'lookAtY', -30, 30)
	gui.add(controls, 'lookAtZ', -30, 30)
	gui.add(controls, 'mode').listen()
}

/*
* objects
*/

function createPlane () {
	// create plane
	const planeGeometry = new THREE.PlaneGeometry(40, 40, 1, 1)
	const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFFFF })
	
	const plane = new THREE.Mesh(planeGeometry, planeMaterial)
	plane.rotation.x = -Math.PI / 2 // rotate 90 deg
	plane.position.x = 0
	plane.position.y = 0
	plane.position.z = 0

	plane.receiveShadow = true // set receive shadow
	
	// scene.add(plane)
}

function createObjects () {
	// create cube
	const material = new THREE.MeshLambertMaterial({ color: 'orange' })
	const geometry = new THREE.BoxGeometry(3, 3, 3)

	const col = 50
	const row = 30

	for (var i = 0, j = 0; i < col * row; i++) {
		const mesh = new THREE.Mesh(geometry, material)

		mesh.position.x = (i % col) * 3.5
		mesh.position.y = 2
		mesh.position.z = j * 3.5

		if ((i + 1) % col === 0) j++

		scene.add(mesh)
	}
}

function createCameraLookAt () {
	const material = new THREE.MeshBasicMaterial({ color: 'red' })
	const geometry = new THREE.SphereGeometry(0.5)
	spot = new THREE.Mesh(geometry, material)

	spot.position.set(20, 20, 0)

	scene.add(spot)
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

	camera.lookAt(controls.lookAtX, controls.lookAtY, controls.lookAtZ)
	spot.position.set(controls.lookAtX, controls.lookAtY, controls.lookAtZ)
}
