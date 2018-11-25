import * as THREE from 'three'
import Stats from 'stats.js'
import * as dat from 'dat.gui'

/*
* init
*/

let scene, camera, renderer

let cube

let stats, controls

function init () {
	createScene()
	createHelper()

	createLights()

	createPlane()
	createObjects()

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
		scaleX: 1,
		scaleY: 1,
		scaleZ: 1,

		positionX: 0,
		positionY: 4,
		positionZ: 0,

		rotationX: 0,
		rotationY: 0,
		rotationZ: 0,

		translateX: 0,
		translateY: 0,
		translateZ: 0,
		translate () {
			cube.translateX(controls.translateX)
			cube.translateY(controls.translateY)
			cube.translateZ(controls.translateZ)

			controls.positionX = cube.position.x
			controls.positionY = cube.position.y
			controls.positionZ = cube.position.z
		},

		visible: true
	}

	const gui = new dat.GUI()

	const guiScale = gui.addFolder('scale')
	guiScale.add(controls, 'scaleX', 0, 5)
	guiScale.add(controls, 'scaleY', 0, 5)
	guiScale.add(controls, 'scaleZ', 0, 5)

	const guiPosition = gui.addFolder('position')
	guiPosition.add(controls, 'positionX', -10, 10)
	const positionY = guiPosition.add(controls, 'positionY', -4, 20)
	const positionZ = guiPosition.add(controls, 'positionZ', -10, 10)

	/* 아래서 position.x = controls.positionX 로 구현됨
	positionX.listen()
	positionX.onChange(() => { cube.position.x = controls.positionX })
	*/

	positionY.listen()
	positionY.onChange(() => { cube.position.y = controls.positionY })

	positionZ.listen()
	positionZ.onChange(() => { cube.position.z = controls.positionZ })

	const guiRotation = gui.addFolder('rotation')
	guiRotation.add(controls, 'rotationX', -4, 4)
	guiRotation.add(controls, 'rotationY', -4, 4)
	guiRotation.add(controls, 'rotationZ', -4, 4)

	const guiTranslate = gui.addFolder('translate')
	guiTranslate.add(controls, 'translateX', -10, 10)
	guiTranslate.add(controls, 'translateY', -10, 10)
	guiTranslate.add(controls, 'translateZ', -10, 10)
	guiTranslate.add(controls, 'translate')

	gui.add(controls, 'visible')
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
	
	scene.add(plane)
}

function createObjects () {
	// create cube
	const material = new THREE.MeshLambertMaterial({ color: 0x44ff44 })
	const geometry = new THREE.BoxGeometry(3, 3, 3)
	cube = new THREE.Mesh(geometry, material)

	cube.position.y = 4
	cube.castShadow = true

	scene.add(cube)
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

	cube.visible = controls.visible

	cube.rotation.x = controls.rotationX
	cube.rotation.y = controls.rotationY
	cube.rotation.z = controls.rotationZ

	cube.position.x = controls.positionX

	/* 위에서 onChange() 로 구현됨
	cube.position.y = controls.positionY
	cube.position.z = controls.positionZ
	*/

	cube.scale.set(controls.scaleX, controls.scaleY, controls.scaleZ)
}
