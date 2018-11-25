import * as THREE from 'three'
import Stats from 'stats.js'
import * as dat from 'dat.gui'

/*
* init
*/

let scene, camera, renderer

let stats, controls

let ambientLight, spotLight, pointLight
let pointLightHelper

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

	camera.position.x = -25 // camera positioning
	camera.position.y = 30
	camera.position.z = 25

	camera.lookAt(0, 0, 0)

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
		ambientLight: {
			color: 0x0c0c0c,
			visible: true
		},
		spotLight: {
			visible: true
		},
		pointLight: {
			color: 0x000000,
			intensity: 1,
			distance: 100,
			visible: true
		}
	}

	const gui = new dat.GUI()

	const ambientFolder = gui.addFolder('ambient light')
	ambientFolder.addColor(controls.ambientLight, 'color').onChange(c => { ambientLight.color = new THREE.Color(c) })
	ambientFolder.add(controls.ambientLight, 'visible').onChange(v => { ambientLight.visible = v })

	const spotFolder = gui.addFolder('spot light')
	spotFolder.add(controls.spotLight, 'visible').onChange(v => { spotLight.visible = v })

	const pointFolder = gui.addFolder('point light')
	pointFolder.addColor(controls.pointLight, 'color').onChange(c => { pointLight.color = new THREE.Color(c) })
	pointFolder.add(controls.pointLight, 'intensity', 0, 3).onChange(i => { pointLight.intensity = i })
	pointFolder.add(controls.pointLight, 'distance', 0, 100).onChange(d => { pointLight.distance = d })
	pointFolder.add(controls.pointLight, 'visible').onChange(v => {
		pointLight.visible = v
		pointLightHelper.visible = v
	})
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
	const cube = new THREE.Mesh(
		new THREE.BoxGeometry(4, 4, 4),
		new THREE.MeshLambertMaterial({ color: 0xff0000 })
	)
	cube.castShadow = true
	cube.position.set(-4, 3, 0)
	scene.add(cube)

	// create sphere
	const sphere = new THREE.Mesh(
		new THREE.SphereGeometry(4, 20, 20),
		new THREE.MeshLambertMaterial({ color: 0x7777ff })
	)
	sphere.castShadow = true
	sphere.position.set(20, 0, 2)
	scene.add(sphere)
}

function createLights () {
	// create ambient light
	ambientLight = new THREE.AmbientLight(0x0c0c0c)
	scene.add(ambientLight)

	// create spot light
	spotLight = new THREE.SpotLight(0xffffff)
	spotLight.position.set(-40, 60, -10)

	spotLight.castShadow = true // set cast shadow
	spotLight.shadow.mapSize.width = 2048 // set shadow pixel
	spotLight.shadow.mapSize.height = 2048

	scene.add(spotLight)

	// create point light
	pointLight = new THREE.PointLight(0x000000)
	pointLight.distance = 100
	pointLight.castShadow = true
	scene.add(pointLight)

	pointLightHelper = new THREE.PointLightHelper(pointLight, 0.6)
	scene.add(pointLightHelper)
}

/*
* loops
*/

function animate (step) { // animation loop
	requestAnimationFrame(animate) // call 'animate' function by each frame(60hz)
	renderer.render(scene, camera) // renderer update

	stats.update() // stats.js

	// animate pointlgiht
	pointLight.position.y = Math.sin(Math.ceil(step) * 0.001) * 5 + 10
	pointLight.position.x = Math.cos(Math.ceil(step) * 0.001) * 5
	pointLight.position.z = Math.sin(Math.ceil(step) * 0.001) * 5
}
