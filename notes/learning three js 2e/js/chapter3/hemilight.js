import * as THREE from 'three'
import Stats from 'stats.js'
import * as dat from 'dat.gui'

/*
* init
*/

let scene, camera, renderer

let stats, controls

let plane, cube, sphere

let hemiLight, directionalLight
let hemiLightHelper

function init () {
	createScene()
	createHelper()

	createPlane()
	createObjects()

	createLights()

	animate()
}
init()

function createScene () {
	// create Scene
	scene = new THREE.Scene()
	scene.fog = new THREE.Fog(0xeeeeee, 0.010, 200)

	// create Perspective Camera
	camera = new THREE.PerspectiveCamera(
		45, // fov
		window.innerWidth / window.innerHeight, // aspect
		0.1, // near reder limit
		1000 // far render limit
	)

	camera.position.x = 100 // camera positioning
	camera.position.y = 38
	camera.position.z = 100

	camera.lookAt(0, 0, 0)

	// create renderer
	renderer = new THREE.WebGLRenderer({
		antialias: true
	})

	renderer.setClearColor(0xEEEEEE) // renderer setup (background, HEX)
	renderer.setSize(window.innerWidth, window.innerHeight)
	
	renderer.render(scene, camera)

	renderer.shadowMap.enabled = true // enable 'shadow'
	renderer.shadowMap.type = THREE.PCFSoftShadowMap // soft shadow

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
		directionalLight: {
			visible: true
		},
		hemiLight: {
			intensity: 0.6,
			groundColor: 0xffd100,
			skyColor: 0x82de,
			visible: true,
		},
		camera: {
			lx: 14, ly: 0, lz: -10,
			px: -20, py: 13, pz: 30
		}
	}

	const gui = new dat.GUI()

	const directionalFolder = gui.addFolder('directional light')
	directionalFolder.add(controls.directionalLight, 'visible').onChange(v => { directionalLight.visible = v })

	const hemiFolder = gui.addFolder('heisphere light')
	hemiFolder.add(controls.hemiLight, 'intensity', 0, 1).onChange(val => { hemiLight.intensity = val })
	hemiFolder.addColor(controls.hemiLight, 'groundColor').onChange(c => { hemiLight.groundColor = new THREE.Color(c) })
	hemiFolder.addColor(controls.hemiLight, 'skyColor').onChange(c => { hemiLight.color = new THREE.Color(c) })
	hemiFolder.add(controls.hemiLight, 'visible').onChange(v => {
		hemiLight.visible = v
		hemiLightHelper.visible = v
	})

	const cameraFolder = gui.addFolder('camera')
	cameraFolder.add(controls.camera, 'lx', -100, 100)
	cameraFolder.add(controls.camera, 'ly', -100, 100)
	cameraFolder.add(controls.camera, 'lz', -100, 100)
	cameraFolder.add(controls.camera, 'px', -100, 100)
	cameraFolder.add(controls.camera, 'py', 0, 100)
	cameraFolder.add(controls.camera, 'pz', -100, 100)
}

/*
* objects
*/

function createPlane () {
	// create plane
	const planeGeometry = new THREE.PlaneGeometry(1000, 1000, 20, 20)
	const planeMaterial = new THREE.MeshPhongMaterial({ color: 0x7EC407 })
	
	plane = new THREE.Mesh(planeGeometry, planeMaterial)
	plane.rotation.x = -Math.PI / 2 // rotate 90 deg
	plane.position.x = 0
	plane.position.y = 0
	plane.position.z = 0

	plane.receiveShadow = true // set receive shadow
	
	scene.add(plane)
}

function createObjects () {
	// create cube
	cube = new THREE.Mesh(
		new THREE.BoxGeometry(4, 4, 4),
		new THREE.MeshLambertMaterial({ color: 0xff0000 })
	)
	cube.castShadow = true
	cube.position.set(-4, 3, 0)
	scene.add(cube)

	// create sphere
	sphere = new THREE.Mesh(
		new THREE.SphereGeometry(4, 20, 20),
		new THREE.MeshLambertMaterial({ color: 0x7777ff })
	)
	sphere.castShadow = true
	sphere.position.set(20, 0, 2)
	scene.add(sphere)
}

function createLights () {
	// create hemisphere light
	hemiLight = new THREE.HemisphereLight(0x82de, 0xffd100, 0.6) // skyColor, groundColor, intensity
	hemiLight.position.set(0, 10, 0)
	scene.add(hemiLight)

	hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 5)
	scene.add(hemiLightHelper)

	// create directional light
	directionalLight = new THREE.DirectionalLight(0xffffff)
	directionalLight.position.set(0, 30, 0)
	directionalLight.target = plane
	directionalLight.castShadow = true
	scene.add(directionalLight)
}

/*
* loops
*/

function animate (step) { // animation loop
	requestAnimationFrame(animate) // call 'animate' function by each frame(60hz)
	renderer.render(scene, camera) // renderer update

	stats.update() // stats.js

	// camera positioning
	camera.position.set(controls.camera.px, controls.camera.py, controls.camera.pz)
	camera.lookAt(controls.camera.lx, controls.camera.ly, controls.camera.lz)

	// update hemiLight helper for change the color(ground, sky)
	hemiLightHelper.update()
}
