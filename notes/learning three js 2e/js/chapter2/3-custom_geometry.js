import * as THREE from 'three'
import Stats from 'stats.js'
import * as dat from 'dat.gui'

/*
* init
*/

let scene, camera, renderer

let stats, controlPoints

let controlObject

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
	function addControl (x, y, z) {
		return { x, y, z }
	}

	controlPoints = [] // GUI에서 조작될 vertices array
	let num = scene.children.length // number of objects

	const gui = new dat.GUI()

	gui.add({
		clone () {
			const clonedGeometry = controlObject.children[0].geometry.clone() // copy Geometry
			const materials = [ // for with 'wireframe'
				new THREE.MeshLambertMaterial({ opacity: 0.6, color: Math.random() * 0xffffff, transparent: true }),
				new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true })
			].map(el => {
				el.castShadow = true
				return el
			})

			const object = new THREE.Object3D() // group
			object.add(new THREE.Mesh(clonedGeometry, materials[0])) // [MeshLambertMaterial]
			object.add(new THREE.Mesh(clonedGeometry, materials[1])) // [MeshBasicMaterial] (wireframe)

			object.translateX(Math.random() * 20 - 10) // positioning
			object.translateZ(Math.random() * 20 - 10)
			object.name = `clone-${num}` // naming
	
			scene.add(object)

			num++ 
		}
	}, 'clone')

	gui.add({
		remove () {
			const last = scene.getObjectByName(`clone-${num - 1}`)

			if (/^clone-[\d]*$/.test(last.name)) { // iff last === clone object
				scene.remove(last)
				num--
			}
		}
	}, 'remove')

	controlPoints.push(addControl(3, 5, 3)) // for vertex group
	controlPoints.push(addControl(3, 5, 0))
	controlPoints.push(addControl(3, 0, 3))
	controlPoints.push(addControl(3, 0, 0))
	controlPoints.push(addControl(0, 5, 0))
	controlPoints.push(addControl(0, 5, 3))
	controlPoints.push(addControl(0, 0, 0))
	controlPoints.push(addControl(0, 0, 3))

	for (var i = 0; i < 8; i++) {
		const folder = gui.addFolder(`Vertices ${i}`) // dat.GUI folder
		folder.add(controlPoints[i], 'x', -10, 10) // append
		folder.add(controlPoints[i], 'y', -10, 10)
		folder.add(controlPoints[i], 'z', -10, 10)
	}
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
	const vertices = [
		new THREE.Vector3(1, 3, 1),
		new THREE.Vector3(1, 3, -1),
		new THREE.Vector3(1, -1, 1),
		new THREE.Vector3(1, -1, -1),
		new THREE.Vector3(-1, 3, -1),
		new THREE.Vector3(-1, 3, 1),
		new THREE.Vector3(-1, -1, -1),
		new THREE.Vector3(-1, -1, 1)
	]

	const faces = [
		new THREE.Face3(0,2,1),
		new THREE.Face3(2,3,1),
		new THREE.Face3(4,6,5),
		new THREE.Face3(6,7,5),
		new THREE.Face3(4,5,1),
		new THREE.Face3(5,0,1),
		new THREE.Face3(7,6,2),
		new THREE.Face3(6,3,2),
		new THREE.Face3(5,7,0),
		new THREE.Face3(7,2,0),
		new THREE.Face3(1,3,4),
		new THREE.Face3(3,6,4)
	]

	const geometry = new THREE.Geometry()

	geometry.vertices = vertices
	geometry.faces = faces
	geometry.computeFaceNormals()

	const materials = [
		new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff, opacity: 0.6, transparent: true }),
		new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true })
	].map(el => {
		el.castShadow = true
		return el
	})

	controlObject = new THREE.Object3D()
	controlObject.add(new THREE.Mesh(geometry, materials[0]))
	controlObject.add(new THREE.Mesh(geometry, materials[1]))

	scene.add(controlObject)
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

	const vertices = [] // for merge the 'controlPoints'
	for(var i = 0; i < controlPoints.length; i++) { // merge
		vertices.push(new THREE.Vector3(controlPoints[i].x, controlPoints[i].y, controlPoints[i].z))
	}

	scene.traverse(el => {
		if (/^clone-[\d]*$/.test(el.name)) { // iff element === cloned object
			for (var i = 0; i < 8; i++) { // modify vertices
				const v0 = el.children[0].geometry.vertices[i]
				const v1 = el.children[1].geometry.vertices[i] // wireframe

				v0.x = vertices[i].x
				v0.y = vertices[i].y
				v0.z = vertices[i].z
				
				v1.x = vertices[i].x
				v1.y = vertices[i].y
				v1.z = vertices[i].z
			}
			el.children[0].geometry.verticesNeedUpdate = true // inform vertices update to ThreeJs
			el.children[1].geometry.verticesNeedUpdate = true
		}
	})
}
