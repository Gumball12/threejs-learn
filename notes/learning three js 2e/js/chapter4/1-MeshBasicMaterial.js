import * as THREE from 'three'
import Stats from 'stats.js'
import * as dat from 'dat.gui'

/*
* init
*/

let scene, camera, renderer

let stats, controls

let plane, solid

window.addEventListener('load', init)
function init () {
	createScene()
	createHelper()

	createObjects()

	createLights()

	animate()
}

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
		color: 0x000000,
		opacity: 1,
		transparent: false,
		wireframe: false,
		visible: true,
		side: 'front'
	}

	const gui = new dat.GUI()
	gui.addColor(controls, 'color').onChange(c => { solid.material.color = new THREE.Color(c)	})
	gui.add(controls, 'opacity', 0, 1, 0.1).onChange(val => { solid.material.opacity = val })
	gui.add(controls, 'transparent').onChange(b => { solid.material.transparent = b })
	gui.add(controls, 'wireframe').onChange(b => { solid.material.wireframe = b })
	gui.add(controls, 'visible').onChange(b => { solid.visible = b })
	gui.add(controls, 'side', ['front', 'back', 'double']).onChange(val => {
		switch (val) {
			case 'front': {
				solid.material.side = THREE.FrontSide
				break
			}
			case 'back': {
				solid.material.side = THREE.BackSide
				break
			}
			case 'double': {
				solid.material.side = THREE.DoubleSide
				break
			}
		}
	})
}

/*
* objects
*/

function createPlane () {
	// create plane
	const planeGeometry = new THREE.PlaneGeometry(40, 40, 1, 1)
	const planeMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff })
	
	plane = new THREE.Mesh(planeGeometry, planeMaterial)
	plane.rotation.x = -Math.PI / 2 // rotate 90 deg
	plane.position.x = 0
	plane.position.y = 0
	plane.position.z = 0

	plane.receiveShadow = true // set receive shadow
	
	scene.add(plane)
}

function createObjects () {
	createPlane()

	const geometry = new THREE.BoxGeometry(5, 5, 5)

	const material = new THREE.MeshBasicMaterial({
		color: controls.color
	})

	solid = new THREE.Mesh(geometry, material)
	solid.position.y = 10

	scene.add(solid)
}

function createLights () {
	// create ambient light
	const ambientLight = new THREE.AmbientLight(0x484848)
	scene.add(ambientLight)

	// create point light
	const pointLight = new THREE.PointLight(0x5f5f5f)
	pointLight.distance = 100
	pointLight.castShadow = true
	pointLight.position.set(0, 10, 0)
	scene.add(pointLight)
}

/*
* loops
*/

function animate (step) { // animation loop
	requestAnimationFrame(animate) // call 'animate' function by each frame(60hz)
	renderer.render(scene, camera) // renderer update

	stats.update() // stats.js

	const ns = step / 1000 * 1 / 2
	solid.rotation.x = ns * 1.5
	solid.rotation.y = ns
	solid.rotation.z = ns * 0.5
}
