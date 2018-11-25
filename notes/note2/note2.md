# The Avaitor
이제 Game을 만들어 보도록 하겠다. '[출처 문서](https://tympanus.net/codrops/2016/04/26/the-aviator-animating-basic-3d-scene-threejs/)'를 참고. 이 강의는 두 개의 part로 구분된다.

* part 1: Basic of ThreeJS and how to set up the very simple Scene
* part 2: how to refine the shapes and better movements to the different elements

예제는 [여기](https://tympanus.net/Tutorials/TheAviator/part1.html)서 볼 수 있다. 지금 볼 때는 진자멋져보임

이제 번역? 비스무리한걸 진행하는데, 진행에 있어 필요없다고 생각되는 부분(HTML, JS 등)은 제외하고 넘어가도록 하겠다.

## Initiate
기본적인 것들

### Color Palette
여기서는 다음의 색상들을 사용한다고 한다. 때문에, 미리 정의한다.

![Color Palette](https://codropspz-tympanus.netdna-ssl.com/codrops/wp-content/uploads/2016/04/Animated3DScene_palette.png)

```js
const colors = {
	red:0xf25346,
	white:0xd8d0d1,
	brown:0x59332e,
	pink:0xF5986E,
	brownDark:0x23190f,
	blue:0x68c3c0
}
```

### The Structure of the Code
다음과 같은 기본 골격을 세우고 진행할 것이다.

```js
window.addEventListener('load', init)

function init () {
  createScene()

  createLights()

  createPlane()
  createSea()
  createSky()

  animateLoop()
}
```
뭐... 개인 스타일일수도 있기는 한데, 이렇게 해 주는게 솔직히 좀 더 명확하고 보기에 좋다. 서로 나누기도 쉽고 뭐...

## Part1; Setting up
기본적인 뼈대를 갖춰보도록 한다. 여기서는 전체적으로 겉만 핥는다.

### Setting up the Scene
좀 질리겠지만, ThreeJS에서 Scene은 다음과 같은 구조를 가지고 있다.

![ThreeJS Scene](https://codropspz-tympanus.netdna-ssl.com/codrops/wp-content/uploads/2016/04/Animated3DScene_three-components.png)

* Scene: 모든 Objects가 render되는곳
* Camera: 말 그대로 Objects를 비추는 '카메라'이다. 여기선 [PerspectiveCamera]를 사용한다고 한다.
* Renderer: WebGL 사용해 Rendering하는 객체
* Object: Geometry와 Mesh로 구성된... 여기서는 Plane과 Sea 그리고 Sky를 만들어 보도록 하겠다.
* Lights: 조명.

이들은 _createScene()_ 에서 만들도록 하겠다.

```js
let scene, camera, renderer, container

function createScene () {
  let cameraSettings, rendererSettings

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

  // define container
  container = document.getElementById('world')
	container.appendChild(renderer.domElement)
	
	document.querySelector('canvas').style = 'background:linear-gradient(#e4e0ba, #f7d9aa)'
	// renderer 생성할 때 background를 alpha로 설정했기 떄문에, background의 색상은 css로 지정한다

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
```
별다르게 설명이 필요하다고 생각되지는 않는다...

* [THREE.Scene](https://threejs.org/docs/#api/scenes/Scene)
* [THREE.Fog](https://threejs.org/docs/#api/scenes/Fog)
* [THREE.PerspectiveCamera](https://threejs.org/docs/#api/cameras/PerspectiveCamera)
* [THREE.WebGLRenderer](https://threejs.org/docs/#api/renderers/WebGLRenderer)

솔직히 이 글은 모두 엉망진창이고 제대로 설명하지도 않는 글이라서 그냥 레퍼런스 보고 이해하자. 이게 가장 쉽고 빠른 방법이기도 하다.

### Setting up the Lights
조명은 Scene의 꽃이라고 한다. 뭐 아무튼... 여기서는 [HemisphereLight]와 [DirectionalLight]를 사용하여 구현하고, 다음과 같이 가능하다.

```js
let hemisphereLight, shadowLight

function createLights () {
	// create Lights
	hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.9)
	shadowLight = new THREE.DirectionalLight(0xfffff, 0.9)

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
}
```
설명은 다 적었다고 생각한다.

* [THREE.HemisphereLight](https://threejs.org/docs/#api/lights/HemisphereLight)
* [THREE.DirectionalLight](https://threejs.org/docs/#api/lights/DirectionalLight)

### Setting up the Objects
3D 모델링 툴을 다룰줄 안다면, 거기서 만들어 ThreeJS에 import할 수 있다고 한다. 여기서 다루지는 않는다고 함

ThreeJS에서는 아주 간단하게 Cube, Sphere, Torus, Cylinder, Plane을 만들 수 있게 구현해놓았다고 한다. 실제로도 그러함. 이러한 것들을 이용해 복잡한 도형들을 만들어보고 해보자.

#### A Simple Cylinder for the Sea
가장 간단한 Sea부터 만들어보자. 파란색으로 만들어 아래쪽에 배치한다고 한다. 지금은 간단히 만들어보고 나중에 좀 더 detail하게 꾸며보도록 한다.

re-usable하게 구현하기 위해 각각의 객체를 Class로 만들 것이다. 다음과 같이 말이다.

```js
class Sea {
  constructor () {
    // Geometry는 Object의 점, 선, 면을 나타낸다.
    const geometry = new THREE.CylinderGeometry(600, 600, 800, 40, 10)
    geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2)) // X축을 조금 돌림

    // Material은 Object의 표면을 나타낸다.
    const material = new THREE.MeshPhongMaterial({
      color: colors.blue,
      transparent: true,
      opacity: 0.6,
      flatShading: THREE.FlatShading
    })

    // Mesh는 Geometry와 Material을 합쳐 Object를 만든다.
    this.mesh = new THREE.Mesh(geometry, material)
    this.mesh.receiveShadow = true // 그림자를 주도록 설정
  }
}
```
이렇게 만든 [Sea]는 다음과 같이 사용할 수 있다.

```js
let sea

function createSea () {
  
  sea = new Sea()

  // positioning (그냥 대입해도 되는듯)
  sea.mesh.position.y = 600
  
  // add to scene
  scene.add(sea.mesh)
}
```
보면 알겠지만, Object는 다음의 기본적으로 순서로 생성된다.

1. Create a Geometry
1. Create a Material
1. Pass then into a Mesh
1. Add to our Scene

말했듯이 이건 기본적인 순서에 불과할 뿐. 다른 여러가지 구현 방법도 많다. 아무튼 이렇게 만든 Object를 서로 조합하여 좀 더 복잡한 Object를 만들 수 있다고 한다.

#### Combining Simple Cubes to Create a Complex Shape
이번엔 구름을 만들어보기로 한다. 여러 Object를 조합해서 만들 것인데, 그림으로 보자면 다음과 같다.

![A Cloud](https://codropspz-tympanus.netdna-ssl.com/codrops/wp-content/uploads/2016/04/Animated3DScene_clouds.png)

마찬가지로 Class로 만들 것이다.

```js
class Cloud {
  constructor () {
    this.mesh = new THREE.Object3D() // grouping
    
    const geometry = new THREE.BoxGeometry(20, 20, 20)
    const material = new THREE.MeshPhongMaterial({
      color: colors.white
    })

    // 하나의 cloud는 여러개의 blocks로 되어있으니...
    const blockNum = 3 + Math.floor(Math.random() * 3)
    for (var i = 0; i < blockNum; i++) {
      
      const cloud = new Three.Mesh(geometry, material)

      cloud.position.x = i * 15
      cloud.position.y = Math.random() * 10
      cloud.position.z = Math.random() * 10
      
      cloud.rotation.y = Math.random() * Math.PI * 2
      cloud.rotation.z = Math.random() * Math.PI * 2
      
      const size = 0.1 + Math.random() * 0.9

      cloud.scale.set(size, size, size)

      cloud.castShadow = true
      cloud.receiveShadow = true

      this.mesh.add(cloud) // into the group
    }
  }
}
```
윗부분에 있는 [THREE.Object3D]를 [THREE.Group]으로 할 수 있지 않을까 잠깐 생각하기는 했는데... 일단 강좌를 따라가도록 한다. 가능한 경우 끝(Result)에서 설명하고 바꾼 코드를 게시하도록 하겠다.

일단 진행하자. 다음으로 [Cloud]들을 포함할 [Sky]를 만들어보도록 한다.

```js
class Sky {
	constructor () {
		this.mesh = new THREE.Object3D() // grouping
		this.cloudNum = 20 // a number of clouds

		const stepAngle = Math.PI * 2 / this.cloudNum

		for (var i = 0; i < this.cloudNum; i++) {

			const cloud = new Cloud() // use [Cloud]

			const angle = stepAngle * i // angle of the cloud
			const dist = 750 + Math.random() * 200 // x, y axis로부터 떨어진 거리

			// 그냥 뭐 randomize하게 positioning 한다고 생각하면 된다.
			// 대충 어떤 모양이 나올지는 감이 잡힐 것이다. 아님 말고...
			cloud.mesh.position.y = Math.sin(angle) * dist
			cloud.mesh.position.x = Math.cos(angle) * dist

			// cloud 갯수만큼 각각 같은 거리에 위치하도록 위치잡아준다 (초기값)
			cloud.mesh.rotation.z = angle + Math.PI / 2
			
			cloud.mesh.position.z = -400 - Math.random() * 400 // random depth (to ground)

			const size = 1 + Math.random() * 2
			cloud.mesh.scale.set(size, size, size)

			this.mesh.add(cloud.mesh)
		}
	}
}
```
마찬가지로 [THREE.Object3D]가 사용되었는데, 이는 뒤에서 다루도록 하겠다. 이렇게 만든 [Sky]는 [Cloud]를 사용하며, 다음과 같이 사용가능하다.

```js
let sky

function createSky () {
	sky = new Sky()
	sky.mesh.position.y = -600
	scene.add(sky.mesh)
}
```
별다른 설명은 필요없어보인다.

#### Even More Complex Object; Creating the Airplane
이제 비행기를 만들어 보도록 하겠다. 바로 위에서 만들었던 [Cloud]는 그냥 [BoxGeometry] 여러개 붙여놓은것에 반해 이 [Airplane]은 좀 더 모양이 복잡한데, 뭐... 그게 끝이다. 좀 더 귀찮을 뿐이다.

![Creating the Airplane](https://codropspz-tympanus.netdna-ssl.com/codrops/wp-content/uploads/2016/04/Animated3DScene_plane-of-cubes.png)

위에서 배운 그대로 해주면 된다. 참고로 문서에서는 [AirPlane]으로, 'P'가 upper case이지만, 여기서는 [Airplane]으로, 'p'가 lower case라는것을 주의하자.

```js
class Airplane {
	constructor () {
		this.mesh = new THREE.Object3D()

		// create cockpit
		const cockpit = new THREE.Mesh(
			new THREE.BoxGeometry(60, 50, 50, 1, 1, 1),
			new THREE.MeshPhongMaterial({ color: colors.red, flatShading: THREE.FlatShading })
		)
		cockpit.castShadow = true
		cockpit.receiveShadow = true
		
		this.mesh.add(cockpit)

		// create engine
		const engine = new THREE.Mesh(
			new THREE.BoxGeometry(20, 50, 50, 1, 1, 1),
			new THREE.MeshPhongMaterial({ color: colors.white, flatShading: THREE.FlatShading })
		)
		engine.position.x = 40
		engine.castShadow = true
		engine.receiveShadow = true

		this.mesh.add(engine)

		// create tail
		const tail = new THREE.Mesh(
			new THREE.BoxGeometry(15, 20, 5, 1, 1, 1),
			new THREE.MeshPhongMaterial({ color: colors.red, flatShading: THREE.FlatShading })
		)
		tail.position.set(-35, 25, 0)
		tail.castShadow = true
		tail.receiveShadow = true

		this.mesh.add(tail)

		// create wing
		const wing = new THREE.Mesh(
			new THREE.BoxGeometry(40, 8, 150, 1, 1, 1),
			new THREE.MeshPhongMaterial({ color: colors.red, flatShading: THREE.FlatShading })
		)
		wing.castShadow = true
		wing.receiveShadow = true

		this.mesh.add(wing)

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
		
		this.mesh.add(this.propeller)
	}
}
```
좀 길기는 한데... 거의 뭐 copy-paste 수준이다. 여기서 `propeller`를 instance variable로 정의했는데, 아마 돌아가는 animation을 적용하기 위해서 그렇게 한 것으로 보인다. 아마 뒤에서 나오겠지.

아무튼 이렇게 만든 [Airplane]은 마찬가지로 다음과 같이 사용이 가능하다.

```js
let airplane

function createPlane () {
  airplane = new Airplane()
  airplane.mesh.scale.set(0.25, 0.25, 0.25)
  airplane.mesh.position.y = 100

  scene.add(airplane.mesh)
}
```

### Rendering
Scene과 Objects를 만들었으니, 이제 Rendering을 할 차례이다.

```js
function createScene () {
  /* ... create Renderer ... */

  renderer.render(scene, camera)

  /* ... define container ... */
}
```
대충 이정도 위치에 있으면 된다. `createScene()` 안의 renderer 정의 이후에만 실행되면 됨

### Animation Loop
아직 뭐 화면이 보인다거나 하지는 않을텐데, 이는 animation loop를 정의해주지 않아서 그렇다. 다음과 같이 정의가 가능하다.

```js
function animateLoop () {
  requestAnimationFrame(animate) // frame마다 animate function 호출
  renderer.render(scene, camera) // frame마다 화면 업데이트

  // animation objects
  airplane.propeller.rotation.x += 0.3
  sea.rotation.z += 0.005
  sky.rotation.z += 0.01
}
```
자 이제 실행해보자. 가운데에 프로펠러가 돌아가는 비행기와, 구름이 보일 것이다. 근데 이게 끝이다. 참고로, 위에서 `propeller`를 instance variable로 설정해주었기에 animation loop에서 프로펠러에 대한 animate를 할 수 있었다.

어... 근데 나는 아직 이상하게 [Sea]로 구혀된 바다 부분이 나오지 않는다. 이는 나중에 한 번 다루도록 하겠다.

### Follow the Mouse
따로 뭐 추가로 lib 설치하는 것 없이 그냥 구현해보도록 하겠다. 먼저 mouse가 움직였을 때의 이벤트(mousemove)를 handling하도록 하자

```js
function init (evt) {
  /* ... */

  document.addEventListener('mousemove', handleMouseMove)
}
```
그냥 뭐... 이렇게 해주면 되겠다. 핸들러는 다음과 같이 작성하겠다.

```js
let mousePos = { x: 0, y: 0 }

function handleMouseMove (evt) {
	const tx = -1 + (evt.clintX / rendererSettings.WIDTH) * 2
	const ty = 1 - (evt.clientY / rendererSettings.HEIGTH) * 2
	mousePos = { x: tx, y: ty }
}
```
여기서 tx, ty는 그냥 화면 중앙 기준 마우스 위치에 따른 가중치(weight)라고 생각하면 된다((-1, 1)).

굳이 설명하자면...
* _mouse position / screen size = mouse weight_
	* 마우스 위치를 화면의 크기로 나누니 이는
	* 화면의 길이를 1로 잡았을 때 마우스 위치로 환산된다.
* _mouse weight \* 2_
	* 여기에 2를 곱하게 되면 전체 길이를 2로 잡았을 때 마우스 위치가 된다.
	* 헛갈리지 말아야 할 것이, denominator에 2를 곱하는 경우는 전체 길이를 0.5로 잡았을 때의 길이라는 것이다.
* _-1 + mouse weight \* 2_
	* 마지막으로 -1을 더함으로서 중앙 기준으로 마우스 위치를 나타내도록 한다.
	* 추가적으로, 'ty'의 경우 -1을 곱해주었는데, 이는 그냥 아래쪽이 negative value를 갖게 하도록 하기 위해 해 준 것이다.

정 궁금하면 log 찍어보자. 이렇게 생성한 값을 이용해 [Airplane]을 움직여 보도록 하겠다.

```js
function animationLoop () {
  /* ... */

  updatePlane() // 그냥 분리한 것
}

function normalize (v, vm, vM, tm, tM) {
	// result에 해석 적어놓겠다.
	
	const nv = Math.max(Math.min(v, vM), vm)
	const dv = vM - vm
	const pc = (nv - vm) / dv
	const dt = tM - tm
	const tv = tm + (pc * dt)

	return tv
}

function updatePlane () {
	const targetX = normalize(mousePos.x, -1, 1, -100, 100)
	const targetY = normalize(mousePos.y, -1, 1, 25, 175)

	airplane.position.x = targetX
	airplane.position.y = targetY
}
```
이해가 좀 어려울 수도 있겠지만... 일단 적어보면 _noremalize()_ 는 화면 위 마우스 위치에 비례해 position value를 반환하는 함수다. _updatePlane()_ 은 각 frame마다 실행되며, _normalize()_ 에서 받은 값으로 [Airplane]의 position을 설정하는 함수이다.

_normalize()_ 에 대해 좀 더 자세한 설명이 필요한 경우 글 아래의 code result에 적어놓았으니, 이를 참고한다.

### Result
part1에서의 모든 코드. 참고로 해보니까 [THREE.Group]으로도 구현이 가능하였으므로, 다음과 같이 구현하도록 하겠다.

```js
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

let hemisphereLight, shadowLight

function createLights () {
	// create Lights
	hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.9)
	shadowLight = new THREE.DirectionalLight(0xffffff, 0.9)

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
}

/*
* Objects
*/

class Sea extends THREE.Group {
	constructor () {
		super()

		const geometry = new THREE.CylinderGeometry(600, 600, 800, 40, 10)
		geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2))

		const material = new THREE.MeshPhongMaterial({
			color: colors.blue,
			transparent: true,
			opacity: 0.6,
			flatShading: THREE.FlatShading
		})

		const mesh = new THREE.Mesh(geometry, material)
		mesh.receiveShadow = true

		this.add(mesh)
	}
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
		const cockpit = new THREE.Mesh(
			new THREE.BoxGeometry(60, 50, 50, 1, 1, 1),
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

	airplane.propeller.rotation.x += 0.3
	sea.rotation.z += 0.005
	sky.rotation.z += 0.01

	updatePlane()
}

function normalize (v, vm, vM, tm, tM) {
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

	airplane.position.x = targetX
	airplane.position.y = targetY
}
```

## Part2; Little more
그냥 좀 더 디테일하게 꾸며?보는 것이다.

### A Coolor Airplane!
다음과 같이 Object의 Vertices를 조작해보도록 하겠다.

![Vertices of Object](https://codropspz-tympanus.netdna-ssl.com/codrops/wp-content/uploads/2016/04/Animated3DScene_geometry-manipulation.png)

Cockpit Vertices를 조작해보도록 하겠다.

```js
class Ariplane extends THREE.Group {
	constructor () {
		/* ... */

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

		/* ... */
	}
}
```
그냥 cockpit object의 vertices를 수정한 것이다. 실행해보면 알겠지만, 비행기 후미가 위의 그림과 같이 줄어들었다. 이처럼 입맛에 맞게 도형을 주무룰?수 있다.

### Adding a Pilot
이제 비행기 조종사를 구현해보자. 여기서 볼 것은 좀 더 Complex한 Object와 Animation이다. 어렵지는 않고, 그냥 코드 무더기니까 잘 보고 따라해보자.

![Adding a Pilot](https://codropspz-tympanus.netdna-ssl.com/codrops/wp-content/uploads/2016/04/Animated3DScene_hairstyle.png)

이 그림에서 보이는 Pilot Object와 파일럿의 머리카락에 대한 animation을 구현해보겠다.

```js
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
		
		// 강좌부분과 좀 다른데 될까?
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
```

* [Matrix4](https://threejs.org/docs/#api/math/Matrix4): [(4x4) matrix](https://en.wikipedia.org/wiki/Matrix_(mathematics))를 표현

이렇게 만들어 준 것을 [Airplane]에 추가한다. Airplane과 함께 다니기? 위함.

```js
class Airplane extends THREE.Group {
	constructor () {
		/* ... */

		this.pilot = new Pilot()
		this.pilot.position.set(-10, 27, 0)
		this.add(this.pilot)
	}
}
```

마지막으로 animation loop에서 [Pilot]의 _updateHairs()_ 를 실행해줌으로써 머리카락이 움직이도록 해준다.

```js
function animationLoop () {
	/* ... */

	airplane.pilot.updateHairs()
}
```

### Making Waves of Sea
앞에서 구현한 [Sea]는 그냥 딱딱한 기둥 모양이었다. 여기에 바로 위에서 본 Vertices 조작을 적용해 꿀렁거리게 만들어보자. 앞에서 사용했던 두 가지 기술을 이용한다.

* Cockpit 만들었을 때 사용했던 'Manipulating the vertices of a Geometry'
* [Pilot]의 _updateHairs()_ 에서 사용했던 'Applying a cyclic movement to each vertex'

![Making Waves of Sea](https://codropspz-tympanus.netdna-ssl.com/codrops/wp-content/uploads/2016/04/Animated3DScene_sea_manipulation.png)

각각의 vertices에 대해 cyclic movement를 적용하겠다 이 말이다.

```js
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
```

마찬가지로, animate loop에서 [Sea]의 _moveWaves()_ 를 호출해줌으로써 animation을 진행한다.

```js
function animateLoop () {
	/* ... */

	sea.moveWaves()
}
```

### Refining the Lighting of the Scene
조명과 그림자를 좀 더 부드럽게 해 주자. 이 때 [THREE.AmbientLight] 를 사용하면 좋다고 한다.

```js
let hemisphereLight, shadowLight, ambientLight // added

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
```
뭐... 색이나 강도를 조절할 때 그냥 마음가는대로 해 봐도 된다. 조명은 정말 큰 영향을 미치기 때문에... 아무튼...

### A Smoother Flight
마지막으로, 비행기의 움직임을 좀 부드럽게 해 주자. 마우스 움직이는 족족 따라다니면 좀 현실성이 떨어지니까... 다음의 formula를 이용한다.

> currentPosition += (finalPosition - currentPosition) * fraction

* currentPosition: 현재 비행기의 좌표
* finalPosition: 최종 좌표
* fraction: 움직이는 비율

보이는 그대로 뭐... 멀리 떨어져있으면 빠른 속도로. 그리고 가까이 있으면 느린 속도로 finalPosition에 currentPosition이 다가갈 것이다. 잘 이해가 안가면 코드를 보자. 뭔 말인지 알게 될 것이다.

```js
function updatePlane () {
	// 이 곳에서 plane의 위치를 update 했으니까...

	/* ... */

	/* 원래는 그냥 마우스를 따라다녔기에, 좀 어색했다.
	airplane.position.y = targetY
	airplane.position.x = targetX
	*/

	/* added (part 2) */
	airplane.position.y += (targetY - airplane.position.y) * 0.1
	airplane.position.x += (targetX - airplane.position.x) * 0.1
	
	airplane.rotation.y = (targetX - airplane.position.x) * 0.01
	airplane.rotation.z = (targetY - airplane.position.y) * 0.01
	// 대충 어림짐작 가겠지만, Plane이 떨어져 있는 만큼 rotation을 적용하는 것이다.
	/* */
}
```
간간히 언급하는데, 코드를 비교해보면 문서?의 내용과는 좀 다를 것이다. 지극히 주관적인 생각으로 필요없다고 생각되는 부분을 배제한 것이기 때문. 돌아가는것은 문제 없다.

실제로 해 보면 잘 된다. 또한 단순이 붙여넣지만 말고, 여러가지 변형을 가해보기도 해 보자. 상당히 흥미롭다.

## Result
정상적으로 동작하는 코드 전체 부분이다.

```js
import * as THREE from 'three'

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
	scene.fog = new THREE.Fog(0xf7d9aa, 100, 950)

  // create Camera
  camera = new THREE.PerspectiveCamera(
    cameraSettings.fov,
    cameraSettings.aspectRatio,
    cameraSettings.nearPlane,
    cameraSettings.farPlane
  )
  camera.position.x = 0
  camera.position.y = 100
  camera.position.z = 200

  // create Renderer
  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  })
  renderer.setSize(rendererSettings.WIDTH, rendererSettings.HEIGHT)
	renderer.shadowMap.enabled = true
	
	renderer.render(scene, camera)

  // define container
	container = document.body
	container.appendChild(renderer.domElement)

	document.querySelector('canvas').style = 'background:linear-gradient(#e4e0ba, #f7d9aa)'

  // listen resize event
  window.addEventListener('resize', handleResize)
  function handleResize () {
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
	ambientLight = new THREE.AmbientLight(0xdc8874, 0.5)

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
	scene.add(ambientLight)
}

/*
* Objects
*/

class Sea extends THREE.Group {
	constructor () {
		super()

		const geometry = new THREE.CylinderGeometry(600, 600, 800, 40, 10)
		geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2))

		geometry.mergeVertices()

		this.waves = []

		for (var i = 0; i < geometry.vertices.length; i++) {
			const v = geometry.vertices[i]

			this.waves.push({
				y: v.y, x: v.x, z: v.z,
				ang: Math.random() * Math.PI * 2,
				dist: 5 + Math.random() * 15,
				speed: 0.016 + Math.random() * 0.032
			})
		}

		const material = new THREE.MeshPhongMaterial({
			color: colors.blue,
			transparent: true,
			opacity: 0.6,
			flatShading: THREE.FlatShading
		})

		this.mesh = new THREE.Mesh(geometry, material)
		this.mesh.receiveShadow = true

		this.add(this.mesh)

	}

	moveWaves () {
		const vertices = this.mesh.geometry.vertices

		for (var i = 0; i < vertices.length; i++) {
			const v = vertices[i]
			const wave = this.waves[i]

			v.x = wave.x + Math.cos(wave.ang) * wave.dist
			v.y = wave.y + Math.sin(wave.ang) * wave.dist

			wave.ang += wave.speed + 0.05
		}

		this.mesh.geometry.verticesNeedUpdate = true
		this.rotation.z += 0.005
	}
}

class Cloud extends THREE.Group {
	constructor () {
		super()

		const geometry = new THREE.BoxGeometry(20, 20, 20)
		const material = new THREE.MeshPhongMaterial({
			color: colors.white
		})

		const blockNum = 3 + Math.floor(Math.random() * 3)
		for (var i = 0; i < blockNum; i++) {

			const cloud = new THREE.Mesh(geometry, material)

			cloud.position.x = i * 15
			cloud.position.y = Math.random() * 10
			cloud.position.z = Math.random() * 10

			cloud.rotation.y = Math.random() * Math.PI * 2
			cloud.rotation.z = Math.random() * Math.PI * 2

			const size = 0.1 + Math.random() * 0.9

			cloud.scale.set(size, size, size)

			cloud.castShadow = true
			cloud.receiveShadow = true

			this.add(cloud)
		}
	}
}

class Sky extends THREE.Group {
	constructor () {
		super()

		this.cloudNum = 20 

		const stepAngle = Math.PI * 2 / this.cloudNum

		for (var i = 0; i < this.cloudNum; i++) {

			const cloud = new Cloud()

			const angle = stepAngle * i
			const dist = 750 + Math.random() * 200

			cloud.position.y = Math.sin(angle) * dist
			cloud.position.x = Math.cos(angle) * dist

			cloud.rotation.z = angle + Math.PI / 2
			
			cloud.position.z = -400 - Math.random() * 400

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

		this.propeller.add(blade)
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
		const faceMaterial = new THREE.MeshLambertMaterial({ color: colors.pink })

		const face = new THREE.Mesh(
			new THREE.BoxGeometry(10, 10, 10),
			faceMaterial
		)
		
		this.add(face)

		// create hair
		const hairMaterial = new THREE.MeshLambertMaterial({ color: colors.brown })

		const hair = new THREE.Mesh(
			new THREE.BoxGeometry(4, 4, 4),
			hairMaterial
		)
		hair.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 2, 0))

		const hairs = new THREE.Object3D()

		this.hairsTop = new THREE.Object3D()

		for (var i = 0; i < 12; i++) {
			const h = hair.clone() 

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
	const dv = vM - vm
	const pc = (nv - vm) / dv
	const dt = tM - tm
	const tv = tm + (pc * dt)

	return tv
}

function updatePlane () {
	const targetX = normalize(mousePos.x, -1, 1, -100, 100)
	const targetY = normalize(mousePos.y, -1, 1, 25, 175)

	airplane.position.y += (targetY - airplane.position.y) * 0.1
	airplane.position.x += (targetX - airplane.position.x) * 0.1

	airplane.rotation.y = (targetX - airplane.position.x) * 0.01
	airplane.rotation.z = (targetY - airplane.position.y) * 0.01
}
```
