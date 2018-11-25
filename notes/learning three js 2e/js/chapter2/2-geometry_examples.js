import * as THREE from 'three'
import Stats from 'stats.js'

/*
* init
*/

let scene, camera, renderer

let stats

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
}

/*
* objects
*/

function createPlane () {
	// create plane
	const planeGeometry = new THREE.PlaneGeometry(80, 40, 1, 1)
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
	const geos = []

	geos.push(new THREE.CylinderGeometry(1, 4, 4))

	geos.push(new THREE.BoxGeometry(2, 2, 2))

	geos.push(new THREE.SphereGeometry(2))

	geos.push(new THREE.IcosahedronGeometry(4))

	const pts = []
	const detail = 0.1
	const radius = 3
	for (var angle = 0.0; angle < Math.PI; angle += detail) {
		pts.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius))
	}
	geos.push(new THREE.LatheGeometry(pts, 12))

	geos.push(new THREE.OctahedronGeometry(3))

	geos.push(new THREE.TetrahedronGeometry(3))

	geos.push(new THREE.TorusGeometry(3, 1, 10, 10))

	geos.push(new THREE.TorusKnotGeometry(3, 0.5, 50, 20))

	for (var i = 0, j = 0; i < geos.length; i++) {
		const material = new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff })
		const mesh = new THREE.Mesh(geos[i], material)
		mesh.castShadow = true

		mesh.position.x = -24 + (i % 5 * 12)
		mesh.position.y = 4
		mesh.position.z = -8 + (j * 12)

		if((i + 1) % 5 === 0) j++

		scene.add(mesh)
	}
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
}
