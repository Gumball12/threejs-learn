import * as THREE from 'three'
// import OrbitControls from 'three-orbitcontrols'

/*
* init
*/

const colors = {
	red: 0xf25346,
	white: 0xd8d0d1,
	brown: 0x59332e,
	pink: 0xF5986E,
	brownDark: 0x23190f,
	blue: 0x68c3c0
}

window.addEventListener('load', init)

function init () {
	createScene()

	createLights()

	createPlane()
	createSky()
	createSea()

	animateLoop()

	document.addEventListener('mousemove', handleMouseMove)
}

/* 
* scene
*/

let scene, camera, renderer, container
let cameraSettings, rendererSettings

function createScene () {

  // settings
  rendererSettings = {
    HEIGHT: window.innerHeight,
    WIDTH: window.innerWidth
  }
  cameraSettings = {
    aspectRatio: rendererSettings.WIDTH / rendererSettings.HEIGHT,
    fov: 60,
    nearPlane: 1,
    farPlane: 10000
  }

	// create Scene

  scene = new THREE.Scene()
	scene.fog = new THREE.Fog(0xf7d9aa, 100, 950) // Add a fog

  // create Camera
  camera = new THREE.PerspectiveCamera(
    cameraSettings.fov,
    cameraSettings.aspectRatio,
    cameraSettings.nearPlane,
    cameraSettings.farPlane
  )
  camera.position.x = 0 // camera positioning
  camera.position.y = 100
  camera.position.z = 200

  // create Renderer
  renderer = new THREE.WebGLRenderer({
    alpha: true, // transparency backgrond (you can use CSS)
    antialias: true
  })
  renderer.setSize(rendererSettings.WIDTH, rendererSettings.HEIGHT)
	renderer.shadowMap.enabled = true // enable shadow
	
	renderer.render(scene, camera)

  // define container
	// container = document.getElementById('world') // Global하게 사용할 수 있도록 그냥 body 안에 넣음
	container = document.body
	container.appendChild(renderer.domElement)

	document.querySelector('canvas').style = 'background:linear-gradient(#e4e0ba, #f7d9aa)'

  // listen resize event
  window.addEventListener('resize', handleResize)
  function handleResize () { // update settings
    rendererSettings.HEIGHT = window.innerHeight
    rendererSettings.WIDTH = window.innerWidth
    renderer.setSize(rendererSettings.WIDTH, rendererSettings.HEIGHT)

    camera.aspect = rendererSettings.WIDTH / rendererSettings.HEIGHT
    camera.updateProjectionMatrix()
  }
}

/*
* Lights
*/

let hemisphereLight, shadowLight, ambientLight

function createLights () {
	// create Lights
	hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.9)
	shadowLight = new THREE.DirectionalLight(0xffffff, 0.9)

	/* added (part 2) */
	ambientLight = new THREE.AmbientLight(0xdc8874, 0.5)
	/* */

	// positioning
	shadowLight.position.set(150, 350, 350)
	shadowLight.castShadow = true

	shadowLight.shadow.camera.left = -400
	shadowLight.shadow.camera.right = 400
	shadowLight.shadow.camera.top = 400
	shadowLight.shadow.camera.bottom = -400
	shadowLight.shadow.camera.near = 1
	shadowLight.shadow.camera.far = 1000

	shadowLight.shadow.mapSize.width = 2048
	shadowLight.shadow.mapSize.height = 2048

	// add to Scene
	scene.add(hemisphereLight)
	scene.add(shadowLight)

	/* added (part 2) */
	scene.add(ambientLight)
	/* */
}

/*
* Objects
*/

class Sea extends THREE.Group {
	constructor () {
		super()

		const geometry = new THREE.CylinderGeometry(600, 600, 800, 40, 10)
		geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2))

		/* added (part 2) */

		// vertices를 merging하여 연속적인 waves를 갖도록 한다. 근데 별 차이는 없는 듯?
		geometry.mergeVertices()

		this.waves = [] // 각 wave vertice에 대해 arbitrary vertices를 부여하기 위한 배열
		for (var i = 0; i < geometry.vertices.length; i++) {
			const v = geometry.vertices[i]

			this.waves.push({ // moveWaves() 에서 사용한다.
				y: v.y, x: v.x, z: v.z,
				ang: Math.random() * Math.PI * 2,
				dist: 5 + Math.random() * 15,
				speed: 0.016 + Math.random() * 0.032
			})
		}

		/* */

		const material = new THREE.MeshPhongMaterial({
			color: colors.blue,
			transparent: true,
			opacity: 0.6,
			flatShading: THREE.FlatShading
		})

		/* modified (part 2) */
		// moveWaves() 에서 mesh를 참조하기 위해 instance varaible로 정의해줌

		this.mesh = new THREE.Mesh(geometry, material)
		this.mesh.receiveShadow = true

		this.add(this.mesh)

		/* */
	}

	/* added (part 2) */

	moveWaves () {
		// 꿀렁거리는 모션을 담당하는 메서드

		const vertices = this.mesh.geometry.vertices

		for (var i = 0; i < vertices.length; i++) {
			const v = vertices[i]
			const wave = this.waves[i]

			// 그냥 각각의 vertice를 재지정?하는것임
			v.x = wave.x + Math.cos(wave.ang) * wave.dist
			v.y = wave.y + Math.sin(wave.ang) * wave.dist

			// 이것과 바로 위의 코드로 인해 꿀렁거리게 된다.
			wave.ang += wave.speed + 0.05
		}

		this.mesh.geometry.verticesNeedUpdate = true
		// threeJS에 해당 geometry의 vertices가 changed 될 것이라고 말해준다.
		// 이 코드를 넣지 않게 되면 threeJS는 geometry를 caching 하기 때문에
		// vertices 값이 변하지 않는다. 즉, 꿀렁거리지 않는다.

		this.rotation.z += 0.005
	}

	/* */
}

class Cloud extends THREE.Group {
	constructor () {
		super()

		// this.mesh = new THREE.Object3D() // 이걸 THREE.Group으로 할 수 있지 않을까?

		const geometry = new THREE.BoxGeometry(20, 20, 20)
		const material = new THREE.MeshPhongMaterial({
			color: colors.white
		})

		const blockNum = 3 + Math.floor(Math.random() * 3)
		for (var i = 0; i < blockNum; i++) {

			const cloud = new THREE.Mesh(geometry, material)

			// random positioning (for block)
			cloud.position.x = i * 15
			cloud.position.y = Math.random() * 10
			cloud.position.z = Math.random() * 10

			cloud.rotation.y = Math.random() * Math.PI * 2
			cloud.rotation.z = Math.random() * Math.PI * 2

			const size = 0.1 + Math.random() * 0.9

			cloud.scale.set(size, size, size)

			cloud.castShadow = true
			cloud.receiveShadow = true

			// this.mesh.add(cloud)
			this.add(cloud)
		}
	}
}

class Sky extends THREE.Group {
	constructor () {
		super()

		// this.mesh = new THREE.Object3D() // grouping
		this.cloudNum = 20 // a number of clouds

		const stepAngle = Math.PI * 2 / this.cloudNum

		for (var i = 0; i < this.cloudNum; i++) {

			const cloud = new Cloud()

			const angle = stepAngle * i // angle of the cloud
			const dist = 750 + Math.random() * 200 // x, y axis로부터 떨어진 거리

			// 그냥 뭐 randomize하게 positioning 한다고 생각하면 된다.
			// 대충 어떤 모양이 나올지는 감이 잡힐 것이다. 아님 말고...
			cloud.position.y = Math.sin(angle) * dist
			cloud.position.x = Math.cos(angle) * dist

			// cloud 갯수만큼 각각 같은 거리에 위치하도록 위치잡아준다 (초기값)
			cloud.rotation.z = angle + Math.PI / 2
			
			cloud.position.z = -400 - Math.random() * 400 // random depth (to ground)

			const size = 1 + Math.random() * 2
			cloud.scale.set(size, size, size)

			this.add(cloud)
		}
	}
}

class Airplane extends THREE.Group {
	constructor () {
		super()

		// create cockpit
		const cockpitGeometry = new THREE.BoxGeometry(60, 50, 50, 1, 1, 1)
		cockpitGeometry.vertices[4].y -= 10
		cockpitGeometry.vertices[4].z += 20
		cockpitGeometry.vertices[5].y -= 10
		cockpitGeometry.vertices[5].z -= 20
		cockpitGeometry.vertices[6].y += 30
		cockpitGeometry.vertices[6].z += 20
		cockpitGeometry.vertices[7].y += 30
		cockpitGeometry.vertices[7].z -= 20

		const cockpit = new THREE.Mesh(
			cockpitGeometry,
			new THREE.MeshPhongMaterial({ color: colors.red, flatShading: THREE.FlatShading })
		)
		cockpit.castShadow = true
		cockpit.receiveShadow = true
		
		this.add(cockpit)

		// create engine
		const engine = new THREE.Mesh(
			new THREE.BoxGeometry(20, 50, 50, 1, 1, 1),
			new THREE.MeshPhongMaterial({ color: colors.white, flatShading: THREE.FlatShading })
		)
		engine.position.x = 40
		engine.castShadow = true
		engine.receiveShadow = true

		this.add(engine)

		// create tail
		const tail = new THREE.Mesh(
			new THREE.BoxGeometry(15, 20, 5, 1, 1, 1),
			new THREE.MeshPhongMaterial({ color: colors.red, flatShading: THREE.FlatShading })
		)
		tail.position.set(-35, 25, 0)
		tail.castShadow = true
		tail.receiveShadow = true

		this.add(tail)

		// create wing
		const wing = new THREE.Mesh(
			new THREE.BoxGeometry(40, 8, 150, 1, 1, 1),
			new THREE.MeshPhongMaterial({ color: colors.red, flatShading: THREE.FlatShading })
		)
		wing.castShadow = true
		wing.receiveShadow = true

		this.add(wing)

		// create propeller
		// 왜 instance variable인지는 하다보면 나오겠지
		this.propeller = new THREE.Mesh(
			new THREE.BoxGeometry(20, 10, 10, 1, 1, 1),
			new THREE.MeshPhongMaterial({ color: colors.brown, flatShading: THREE.FlatShading })
		)
		this.propeller.castShadow = true
		this.propeller.receiveShadow = true

		// blades
		const blade = new THREE.Mesh(
			new THREE.BoxGeometry(1, 100, 20, 1, 1, 1),
			new THREE.MeshPhongMaterial({ color: colors.brownDark, flatShading: THREE.FlatShading })
		)
		blade.position.set(8, 0, 0)
		blade.castShadow = true
		blade.receiveShadow = true

		this.propeller.add(blade) // 그냥 이렇게 Mesh에 추가하는것도 가능한 듯
		this.propeller.position.set(50, 0, 0)
		
		this.add(this.propeller)

		this.pilot = new Pilot()
		this.pilot.position.set(-10, 27, 0)
		this.add(this.pilot)
	}
}

class Pilot extends THREE.Group {
	constructor () {
		super()

		this.angleHairs = 0

		// create body
		const body = new THREE.Mesh(
			new THREE.BoxGeometry(15, 15, 15),
			new THREE.MeshPhongMaterial({ color: colors.brown, flatShading: THREE.FlatShading })
		)
		body.position.set(2, -12, 0)

		this.add(body)

		// create face
		// 좀 아래에 있는 ear 만들때도 쓰인다.
		const faceMaterial = new THREE.MeshLambertMaterial({ color: colors.pink })

		const face = new THREE.Mesh(
			new THREE.BoxGeometry(10, 10, 10),
			faceMaterial
		)
		
		this.add(face)

		// create hair
		// hair Object를 여러개 조합해 hairs를 구현한다.
		const hairMaterial = new THREE.MeshLambertMaterial({ color: colors.brown })
		// 진행하다보면 알겠지만, 여러곳에서 material을 사용하니...

		const hair = new THREE.Mesh(
			new THREE.BoxGeometry(4, 4, 4),
			hairMaterial
		)
		hair.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 2, 0))

		// hairs는 모든 머리카락에 대해 참조
		const hairs = new THREE.Object3D()

		// hairsTop을 instance variable로 정의한 이유는
		// 당연히 animate에 사용하기 위함
		this.hairsTop = new THREE.Object3D()

		for (var i = 0; i < 12; i++) {
			const h = hair.clone() // clone 메서드로 복제가 가능

			const col = i % 3
			const row = Math.floor(i / 3)
			const startPosZ = -4
			const startPosX = -4

			h.position.set(startPosX + row * 4, 0, startPosZ + col * 4)
			this.hairsTop.add(h)
		}

		hairs.add(this.hairsTop)

		const hairSide = new THREE.Mesh(
			new THREE.BoxGeometry(12, 4, 2),
			hairMaterial
		)
		
		hairSide.applyMatrix(new THREE.Matrix4().makeTranslation(-6, 0, 0))

		const hairSideRight = hairSide.clone()
		const hairSideLeft = hairSide.clone()
		hairSideRight.position.set(8, -2, 6)
		hairSideLeft.position.set(8, -2, -6)

		hairs.add(hairSideRight)
		hairs.add(hairSideLeft)

		const hairBack = new THREE.Mesh(
			new THREE.BoxGeometry(2, 8, 10),
			hairMaterial
		)
		hairBack.position.set(-1, -4, 0)
		
		hairs.add(hairBack)
		hairs.position.set(-5, 5, 0)

		this.add(hairs)

		// create glass
		const glassMaterial = new THREE.MeshLambertMaterial({ color: colors.brown })

		const glass = new THREE.Object3D()

		const glassRight = new THREE.Mesh(
			new THREE.BoxGeometry(5, 5, 5),
			glassMaterial
		)
		glassRight.position.set(6, 0, 3)

		const glassLeft = glassRight.clone()
		glassLeft.position.z = -glassRight.position.z

		const glassA = new THREE.Mesh(
			new THREE.BoxGeometry(11, 1, 11),
			glassMaterial
		)

		glass.add(glassRight)
		glass.add(glassLeft)
		glass.add(glassA)

		this.add(glass)

		// create ear
		const ears = new THREE.Object3D()

		const earRight = new THREE.Mesh(
			new THREE.BoxGeometry(2, 3, 2),
			faceMaterial
		)
		earRight.position.set(0, 0, 6)

		const earLeft = earRight.clone()
		earLeft.position.set(0, 0, -6)

		ears.add(earRight)
		ears.add(earLeft)

		this.add(ears)
	}

	updateHairs () {
		const hairs = this.hairsTop.children

		for (var i = 0; i < hairs.length; i++) {
			const hair = hairs[i]

			hair.scale.y = 0.75 + Math.cos(this.angleHairs + i / 3) * 0.25
		}

		this.angleHairs += 0.16
	}
}

let sea, sky, airplane

function createSea () {
	sea = new Sea()
	sea.position.y = -600
	scene.add(sea)
}

function createSky () {
	sky = new Sky()
	sky.position.y = -600
	scene.add(sky)
}

function createPlane () {
	airplane = new Airplane()
	airplane.scale.set(0.25, 0.25, 0.25)
	airplane.position.y = 100

	scene.add(airplane)
}

/*
* event handler
*/

let mousePos = { x: 0, y: 0 }

function handleMouseMove (evt) {
	// 화면 중앙 기준에서 얼마나 떨어져있는지 계산
	// 굳이 설명하자면, 마우스 위치를 화면의 크기로 나누니 전체 길이를 1로 잡았을 때
	// 마우스 위치로 환산된다. 이에 2를 곱하면 전체 길이를 2로 잡았을 때 마우스 위치가 되고,
	// 여기에 각각 1을 조합해 중앙 기준으로 마우스를 나타낸 것이다.

	// ty는 -1을 곱해주었는데, 이는 곱하지 않은 경우 중앙 기준
	// left 위치가 negative value가 되는데, y축은 아래쪽. 즉 right 위치가 negative
	// value를 가져야 하기 때문에 -1 을 곱해준 것이다.

	const tx = -1 + (evt.clientX / rendererSettings.WIDTH) * 2
	const ty = -(-1 + (evt.clientY / rendererSettings.HEIGHT) * 2)
	mousePos = { x: tx, y: ty }
}

/*
* animate
*/

function animateLoop () {
	requestAnimationFrame(animateLoop)
	renderer.render(scene, camera)

	airplane.propeller.rotation.x += 1.3
	sea.rotation.z += 0.005
	sky.rotation.z += 0.01

	updatePlane()

	airplane.pilot.updateHairs()
	sea.moveWaves()
}

function normalize (v, vm, vM, tm, tM) {
	// 마우스 좌표 normalization
	// v = mouseposition
	// vm = mouse weight minima
	// vM = mouse weight Maxima
	// tm = plane position minima
	// tM = plane position Maxima

	const nv = Math.max(Math.min(v, vM), vm)
	// [-1, 1] 사이 값을 뱉음 (normalize mousepos value (nv))
	// 그냥 mousepos value 그대로 뱉는다고 생각하면 된다.

	const dv = vM - vm
	// 보이는 그대로 vM과 vm 사이의 distance 'v'
	// 전체 비율값이라고 생각하면 된다. (= 2)

	const pc = (nv - vm) / dv
	// distance 'v'에 비례한 nv와 vm 사이의 distance
	// 화면 전체 길이를 1로 놓았을 때 마우스의 위치를 나타낸다.

	const dt = tM - tm
	// tM과 tm 사이의 distace 't'

	const tv = tm + (pc * dt)
	// 화면 중앙은 position '0' 의 값을 갖는다.
	// 이 때문에 이렇게 position을 구현하는 것.

	return tv

	// 정리하자면, 그냥 minima position value와 maxima position value 사이로 plane을 위치시키며,
	// 화면 위의 마우스 위치에 비례해 plane을 위치시킨다.
}

function updatePlane () {
	const targetX = normalize(mousePos.x, -1, 1, -100, 100)
	const targetY = normalize(mousePos.y, -1, 1, 25, 175)

	/*
	airplane.position.y = targetY
	airplane.position.x = targetX
	*/

	/* added (part 2) */
	airplane.position.y += (targetY - airplane.position.y) * 0.1
	airplane.position.x += (targetX - airplane.position.x) * 0.1

	airplane.rotation.y = (targetX - airplane.position.x) * 0.01
	airplane.rotation.z = (targetY - airplane.position.y) * 0.01
	/* */
}
