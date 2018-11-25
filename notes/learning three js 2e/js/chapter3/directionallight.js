import * as THREE from 'three'
import Stats from 'stats.js'
import * as dat from 'dat.gui'

/*
* init
*/

let scene, camera, renderer

let stats, controls

let plane, cube, sphere

let ambientLight, spotLight, pointLight, directionalLight
let pointLightHelper, spotLightHelper, directionalLightHelper
let shadowSpotLightHelper, shadowDirectionalLightHelper

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
		ambientLight: {
			color: 0x484848,
			visible: true
		},
		spotLight: {
			color: 0xffffff,
			intensity: 1,
			distance: 100,
			angle: 0,
			penumbra: 0,
			target: 'cube',
			visible: true
		},
		pointLight: {
			color: 0x5f5f5f,
			distance: 100,
			visible: true
		},
		directionalLight: {
			color: 0xff5808,
			intensity: 1,
			target: 'cube',
			visible: true
		}
	}

	const gui = new dat.GUI()

	const ambientFolder = gui.addFolder('ambient light')
	ambientFolder.addColor(controls.ambientLight, 'color').onChange(c => { ambientLight.color = new THREE.Color(c) })
	ambientFolder.add(controls.ambientLight, 'visible').onChange(v => { ambientLight.visible = v })

	const spotFolder = gui.addFolder('spot light')
	spotFolder.addColor(controls.spotLight, 'color').onChange(c => { spotLight.color = new THREE.Color(c) })
	spotFolder.add(controls.spotLight, 'intensity', 0, 2).onChange(val => { spotLight.intensity = val })
	spotFolder.add(controls.spotLight, 'distance', 5, 200).onChange(val => { spotLight.distance = val })
	spotFolder.add(controls.spotLight, 'angle', 0, Math.PI / 3).onChange(val => { spotLight.angle = val })
	spotFolder.add(controls.spotLight, 'penumbra', 0, 1).onChange(val => { spotLight.penumbra = val })
	spotFolder.add(controls.spotLight, 'target', ['Cube', 'Sphere', 'Plane', 'PointLight']).onChange(el => {
		switch(el) {
			case 'Cube': {
				spotLight.target = cube
				break
			}
			case 'Sphere': {
				spotLight.target = sphere
				break
			}
			case 'Plane': {
				spotLight.target = plane
				break
			}
			case 'PointLight': {
				spotLight.target = pointLight
				break
			}
		}
	})	
	spotFolder.add(controls.spotLight, 'visible').onChange(v => {
		spotLight.visible = v
		spotLightHelper.visible = v
		shadowSpotLightHelper.visible = v
	})

	const pointFolder = gui.addFolder('point light')
	pointFolder.addColor(controls.pointLight, 'color').onChange(c => { pointLight.color = new THREE.Color(c) })
	pointFolder.add(controls.pointLight, 'distance', 0, 100).onChange(d => { pointLight.distance = d })
	pointFolder.add(controls.pointLight, 'visible').onChange(v => {
		pointLight.visible = v
		pointLightHelper.visible = v
	})

	const directionalFolder = gui.addFolder('directional light')
	directionalFolder.addColor(controls.directionalLight, 'color').onChange(c => { directionalLight.color = new THREE.Color(c) })
	directionalFolder.add(controls.directionalLight, 'intensity', 0, 2).onChange(i => { directionalLight.intensity = i })
	directionalFolder.add(controls.directionalLight, 'target', ['Cube', 'Sphere', 'Plane', 'Point Light']).onChange(t => {
		switch(t) {
			case 'Cube': {
				directionalLight.target = cube
				break
			}
			case 'Sphere': {
				directionalLight.target = sphere
				break
			}
			case 'Plane': {
				directionalLight.target = plane
				break
			}
			case 'Point Light': {
				directionalLight.target = pointLight
				break
			}
		}
	})
	directionalFolder.add(controls.directionalLight, 'visible').onChange(v => {
		directionalLight.visible = v
		directionalLightHelper.visible = v
		shadowDirectionalLightHelper.visible = v
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
	// create ambient light
	ambientLight = new THREE.AmbientLight(0x484848)
	scene.add(ambientLight)

	// create point light
	pointLight = new THREE.PointLight(0x5f5f5f)
	pointLight.distance = 100
	pointLight.castShadow = true
	scene.add(pointLight)

	pointLightHelper = new THREE.PointLightHelper(pointLight, 0.6, new THREE.Color(0x000000))
	scene.add(pointLightHelper)

	// create spot light
	spotLight = new THREE.SpotLight(0xffffff)
	spotLight.position.set(0, 10, 0)

	spotLight.castShadow = true // set cast shadow

	spotLight.shadow.mapSize.width = 2048 // set shadow pixel
	spotLight.shadow.mapSize.height = 2048

	spotLight.target = cube // set target
	// spotLight.lookAt(0, 0, 0) // 다른 targeting 방법들
	// spotLight.lookAt(new THREE.Vector3(1, 3, 0))
	
	spotLight.shadow.camera.near = 10 // constant
	spotLight.shadow.camera.far = 15
	spotLight.shadow.camera.fov = 30

	spotLight.distance = 0
	spotLight.angle = 0.4
	scene.add(spotLight)

	// create spot light helpers
	spotLightHelper = new THREE.SpotLightHelper(spotLight, new THREE.Color(0x000000)) // spotlight의 light Helper
	scene.add(spotLightHelper)

	shadowSpotLightHelper = new THREE.CameraHelper(spotLight.shadow.camera) // spotlight의 shadow Helper
	scene.add(shadowSpotLightHelper)

	// create directional light
	directionalLight = new THREE.DirectionalLight(0xff5808)
	directionalLight.position.set(0, 10, 0)
	directionalLight.castShadow = true

	directionalLight.target = cube // set target

	directionalLight.shadow.camera.near = 2 // constant
	directionalLight.shadow.camera.far = 200
	directionalLight.shadow.camera.left = -10
	directionalLight.shadow.camera.right = 10
	directionalLight.shadow.camera.top = 10
	directionalLight.shadow.camera.bottom = -10

	directionalLight.intensity = 0.5
	directionalLight.shadow.mapSize.height = 2048
	directionalLight.shadow.mapSize.width = 2048

	scene.add(directionalLight)

	// create directional light helpers
	directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5)
	scene.add(directionalLightHelper)
	shadowDirectionalLightHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
	scene.add(shadowDirectionalLightHelper)
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

	// animate spot light
	spotLight.position.y = Math.sin(Math.ceil(step) * 0.001) * 5 + 10

	// spot light helper
	spotLightHelper.update()
	shadowSpotLightHelper.update()

	// directional light Helper
	directionalLightHelper.update()
}
