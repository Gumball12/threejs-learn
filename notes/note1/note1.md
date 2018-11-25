# Learning ThreeJS
원래는 [ThreeJS 문서](https://threejs.org/docs/index.html#manual/introduction/Creating-a-scene)로 진행하려 했으나 그렇게 좋은 방법은 아닌 것 같아 다른 가이드들을 참고하면서 진행함

참고 가이드 목록: [ThreeJS Useful links](https://threejs.org/docs/#manual/introduction/Useful-links)

## Terms
용어들

* #: subject
* ##: section
* ###: page

## Before to Start
JS(ES6)에 대한 기본적인 이해가 필요하며, NPM으로 threejs 모듈을 설치하는데 까지 기본적으로 모두 되어있다 가정함.

# Beginning with 3D WebGL
[문서](https://codepen.io/rachsmith/post/beginning-with-3d-webgl-pt-1-the-scene)

ThreeJS를 사용하여 3D WebGL을 입문하도록 도와주는 가이드

## Part 1. The Scene
뭐라 ThreeJS에 대한 글이 나오는데 그닥 쓸모없으므로 생략.

### The Scene
3D 공간인 Scene에는 여러 Objects와 Cameras 그리고 조명(Lightning)이 들어간다고 한다. 다음의 코드로 만들 수 있다고 함.

```js
import * as THREE from 'three'

// create Scene
const scene = new THREE.Scene()
```

### The Camera
Scene을 입체적으로 비춰주는? Camera 시뮬레이터가 구현되어있음. 다음의 arguments가 들어간다.

* __FOV(Field Of View)__: 시야각을 의미함. Vertical 값을 넣음
* __aspect__: 화면비. Vertical 기준으로 Horizontal의 크기를 결정함.
* __near__: 카메라가 시작하는? 위치. 그러니까, 이 값보다 작은 거리에 있는 Objects는 보이지 않음
* __far__: 카메라가 끝나는? 위치. 이 값보다 먼 거리에 있는 Objects는 보이지 않음

그림을 보면 이해가 좀 더 수월할 것이다.

![perspective camera arguments](https://s3-us-west-2.amazonaws.com/s.cdpn.io/53148/frustum.svg)


ThreeJS에서는 위의 카메라를 [PerspectiveCamera] 객체로 구현하였으며, 다음과 같이 생성이 가능하다.

```js
/* ... scene code */

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

camera.position.z = 100
```

#### Renderer
카메라만 만들어서는 뭘 할 수가 없다. ThreeJS의 렌더를 담당하는 Renderer를 구현해야 한다. 이는 [WebGLRenderer] 객체로 구현되어있다.

```js
/* ... camera code */

const renderer = new THREE.WebGLRenderer()

renderer.setSize(window.innerWidth, window.innerHeight)

document.body.appendChild(renderer.domElement)
```
마지막으로 dom에 ThreeJS를 삽입한다.

### Lighting
반드시 필요한 조명. 이게 없으면 입체감이고 뭐고 없을 것이다. 조명에는 여러 종류가 있는데, 대략 설명하자면 다음과 같다.

* __Directional Lights__: 모든 곳에서 강하게 비추는 조명
* __Ambient Lights__: 모든 곳에서 좀 더 부드럽게 비추는 조명
* __Point Lights__: 어느 한 부분만을 비추는 조명. 전구를 생각하면 되겠다.
* __Spot Lights__: 말 그대로 스포트라이트
* __Hemisphere Lights__: 반구 형태로 비추는 조명. 

여기서는 Point Light를 사용해 보겠다. ThreeJS에서는 [PointLight] 객체로 구현되어있다.

```js
/* ... renderer code */

// Cube를 만드는건 아직 안배운 것이 맞음. 이건 진행하며 볼 예정이다. 조명으로 인해 만들어 준 것 뿐임.
const geometry = new THREE.BoxGeometry(20, 20, 20)
const material = new THREE.MeshLambertMaterial({ color: 0xfd59d7 })
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

// lighting
const light = new THREE.PointLight(0xFFFF00)

light.position.set(10, 0, 25)
scene.add(light)
```
geometry...어쩌구는 신경쓰지 말자. 나중에 볼 애들이고, 조명 구현 부분(light)이나 그냥 직접 한 번 적어보고 실행해보자.

#### animation loop
사실... 저렇게만 적어서는 실행되지 않는다. 다음의 코드를 맨 아래 붙여넣어주자.

```js
const animate = function () {
  requestAnimationFrame(animate)

  /* cube rotate */
  cube.rotation.x += 0.1
  cube.rotation.y += 0.1
  camera.updateProjectionMatrix()

  renderer.render(scene, camera)
}
animate()
```
나중에 따로 볼 수 있을지도 모르겠는데, 일단 아는거 적어놓는다.

위의 코드는 animation loop를 진행하는 코드이다. 뭔 말이냐면, ThreeJS는 약 60hz로 애니메이션을 렌더하는데, 이 때 1hz마다 위의 코드가 실행된다고 생각하면 되겠다.

### result
지금까지 본 것들

```js
import * as THREE from 'three'

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, innerWidth / window.innerHeight, 0.1, 1000)

camera.position.z = 100

const renderer = new THREE.WebGLRenderer()

renderer.setSize(window.innerWidth, window.innerHeight)

document.body.appendChild(renderer.domElement)

const geometry = new THREE.BoxGeometry(20, 20, 20)
const material = new THREE.MeshLambertMaterial({ color: 0xfd59d7 })
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

const light = new THREE.PointLight(0xFFFF00)

light.position.set(10, 0, 25)
scene.add(light)

const animate = function () {
  requestAnimationFrame(animate)

  cube.rotation.x += 0.1
  cube.rotation.y += 0.1
  camera.updateProjectionMatrix()

  renderer.render(scene, camera)
}
animate()
```

## Part 2. Geometry
앞에서 조명을 보여주기 위해 Cube를 생성했었다.

### Geometry
설명을 진행하기 전에, 3D modelling에 대해 잠시 보고 넘어가자. 설명에 반드시 필요한 부분이다. 정육면체를 생각하면 연상하기 쉬울 것이다.

* __Vertice__: 3개의 모서리(Edge)가 만나는 꼭지점
* __Edge__: 2개의 면이 만나는 모서리(line)
* __Face__: Object를 구성하는... [Polygon](https://en.wikipedia.org/wiki/Polygon)들을 의미함

![Elements of the 3D model](https://s3-us-west-2.amazonaws.com/s.cdpn.io/53148/geometry.png)

여기서 'Face'라는게 좀 헛갈릴 수 있는데, 그냥 3D Object를 구성하는 Polygons라고 생각하면 된다. 진행하다 보면 이게 뭔지 대충 감이 잡힐 것.

뭐 일단 하나 만들어보자면...

```js
/* ... renderer code */

const geometry = new THREE.BoxGeometry(20, 20, 20)

// 이 아래 것들은 나중에 볼 것임
const material = new THREE.MeshNormalMaterial()
const cube = new THREE.Mesh(geometry, material)

scene.add(cube)

// light
const light = new THREE.PointLight(0XFFFF00)
light.position.set(10, 0, 25)
scene.add(light)

// animation loop
const animate = function () {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}
animate
```
[CodePen](https://codepen.io/rachsmith/pen/qbgBNo)

Scene에 Cube 하나를 추가했다. 보면 그냥 사각형 하나 댕그라니 놓여 있는데, 회전을 시켜주지 않아서 그렇다.

```js
/* ... cube code */

const animate = function () {
  requestAnimationFrame(animate)

  cube.rotation.x += 0.01
  cube.rotation.y -= 0.01
  
  renderer.render(scene, camera)
}
```
뭔 말인지는 이해하리라 믿고, 실행해보자. 정육면체로 보이는 애가 가운데서 회전하고 있을 것이다.


참고로 ThreeJS는 여러가지가 구현되어 있기 때문에, 다음과 같이 좀... 멋지게? 만들수도 있다.

* [CodePen](https://codepen.io/rachsmith/pen/Rrvwpv)
  * 똑같은 Cube인데, [IcosahedronGeometry] 라는 Geometry를 사용하여 생성했다는 차이가 있다.
  * 직접 실행해보면 색이 부드럽게 넘어가지 않는데... 이유는 아직 잘 모르겠다....

### Modifying Geometry Vertices
정육면체... 그러니까 Cube 모양 말고도 원하는 모양. 어떤 모양이든지 만들 수 있다.

Geometry의 Vertices Array를 수정하여 가능하다. 예를 하나 보자면...

```js
/* ... scene add(cube) */

for (var i = 0; i < geometry.vertices.length; i++) {
  geometry.vertices[i].x += -10 + Math.random() * 20
  geometry.vertices[i].y += -10 + Math.random() * 20
}

/* const light = new THREE.PointLight(0xFFFF00) ... */
```
[CodePen](https://codepen.io/rachsmith/pen/adXbqG)

아니... 뭐 이러고 끝이다. 어쩌자는건지 모르겠다. 그냥 전체적으로 한 번 둘러보는 것 같음. 정 원한다면 `geometry.vertices`에 대해 로그찍어보고 여러가지 값을 바꿔보든가 해보자.

참고로 ThreeJS GUI 에디터가 따로 있다. [ThreeJS Editor](http://threejs.org/editor/)

### result
여기서 본 것들

```js
import * as THREE from 'three'

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, innerWidth / window.innerHeight, 0.1, 1000)

camera.position.z = 100

const renderer = new THREE.WebGLRenderer()

renderer.setSize(window.innerWidth, window.innerHeight)

document.body.appendChild(renderer.domElement)

const geometry = new THREE.BoxGeometry(20, 20, 20)
const material = new THREE.MeshNormalMaterial()
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

for (var i = 0; i < geometry.vertices.length; i++) {
  geometry.vertices[i].x += -10 + Math.random() * 20
  geometry.vertices[i].y += -10 + Math.random() * 20
}

const light = new THREE.PointLight(0xFFFF00)

light.position.set(10, 0, 25)
scene.add(light)

const animate = function () {
  requestAnimationFrame(animate)

  cube.rotation.x += 0.01
  cube.rotation.y -= -0.01

  renderer.render(scene, camera)
}
animate()
```

## Part 3. Materials
Material을 빼 놓고 WebGL을 얘기할 수 없다. 암튼 매우 중요한... 그런거임...

문서에는 Object를 표현하는 애라고 나와있다. 색이나, 텍스쳐 또는 조명 뭐 이런거 다 통틀어서.

### Materials
종류는 다음이 있다.

#### [MeshNormalMaterial]
위에서 사용했던 Material. 위치에 따라 무지개 색으로 Obhject의 한 면을 표현하기 때문에 그냥 저냥 평범히 사용된다고 한다.

참고로 조명의 영향을 받지는 않음.

```js
const material = new THREE.MeshNormalMaterial()
```
[CodePen](https://codepen.io/rachsmith/pen/OMKEvV?editors=0010)

#### [MeshLambertMaterial]
빛나지 않는... 그러니까 '무광(matte-finish)'을 생각하면 된다. 물론 텍스쳐나 색을 입힐 수 있음.

참고로 색(Color)은 다음과 같이 입힐 수 있다. [Color]로 구현되어있음.

```js
const color = new THREE.Color() // white(default)

const color_hex_string = new THREE.Color('#6f4171') // hex(string)
const color_hex = new THREE.Color(0x6f4171) // hex

const color_rgb = new THREE.Color(1, 0, 0) // rgb
const color_rgb_string = new THREE.Color('rgb(255, 0, 0)') // rgb(string)
const color_rgb_percentage = new THREE.Color('rgb(100%, 0%, 100%)') // rgb(percentage)
const color_rgba = new THREE.Color('rgba(188, 141, 190, 1)') // rgba

const color_colorname = new THREE.Color('skyblue') // colorname(X11 Color Name)

const color_hsl = new THREE.Color('hsl(0, 100%, 50%)') // hsl

const hex = color.getHex() // Hex값으로 가져오기. Color 입력할 때 쓰임
```
이외 자세한건 [문서](https://threejs.org/docs/#api/math/Color) 참고

뭐 아무튼 위를 이용해 다음과 같이 만들 수 있다.

```js
const color = new THREE.Color('orange')
const material = new THREE.MeshLambertMaterial({ color: color.getHex() })
```
앞 Section의 코드에서 Color를 추가해주고, Material 부분을 [MeshLambertMaterial]로 바꿔 구현해주기만 하면 된다.

[CodePen](https://codepen.io/rachsmith/pen/EKYyeB)

다른 여러가지 구현을 보자면...

* [More Lighting(CodePen)](https://codepen.io/rachsmith/pen/bpbePv)
  * renderer 생성 시 `{ alpha: true }` 옵션을 주어 생성
  * [OctahedronGeometry] 객체로 Geometry 생성
  * [DirectionalLight] 객체로 Light 생성 + 여러개의 조명을 구현
* [Wireframe(CodePen)](https://codepen.io/rachsmith/pen/vGBWog)
  * material 생성 시 `{ color: color.getHex(), wireframe: true }`과 같이 wireframe 옵션을 추가적으로 주어 생성
* [Image(CodePen)](https://codepen.io/rachsmith/pen/GZKjqO)
  * 이미지로 Material을 구현하였다.
  * 코드에 여러가지 변경사항이 있으니 잘 보도록 하자.
    * CORS, [TextureLoader] Callback 그리고 animate loop의 동작이 좀 다르게 정의되었다.

#### [MeshPhongMaterial]
'유광'이 구현된 Material이다. 나와있듯이 [MeshLamberMaterial]으로 구현되어 있고, [MeshLambertMaterial]과 굉장히 유사한 코드로 사용이 가능하다. (다시 말하지만, [MeshLambertMaterial]은 '무광'을 구현한 객체이다.)

[MeshLambertMaterial]을 그냥 단순히 [MeshPhongMaterial]로 바꿔주기만 해도 적용된다.

```js
// const material = new THREE.MeshLambertMaterial({ color: color.getHex() })
const material = new THREE.MeshPhongMaterial({ color: color.getHex() })
```

[CodePen](https://codepen.io/rachsmith/pen/ONLRQo)

광채의 색이나 빛나는 정도를 설정할 수 있다.

```js
const specular = 0x009900
const shinyness = 20

const material = new THREE.MeshPhongMaterial({ color: color.getHex(), specular, shinyness })
```

옵션을 줄 때 `bumpMap`속성을 이용해 입체적인 Texture를 입힐수도 있다. [bump map wiki](https://ko.wikipedia.org/wiki/%EB%B2%94%ED%94%84_%EB%A7%A4%ED%95%91)

```js
textureLoader.load('https://s3-us-west-2.amazonaws.com/s.cdpn.io/53148/4268-bump.jpg', texture => {
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(2, 1)

  const material = new THREE.MeshPhongMaterial({ bumpMap: texture , specular, shinyness })

  mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)

  animate()
})
```
[CodePen](https://codepen.io/rachsmith/pen/aNomGB). 개신기함.

참고로 [MeshPhongMaterial]의 광채는 [BoxGeometry]처럼 면 수가 많지 않은 경우, 부자연스럽게 나올 수 있다(한 면 전체에 광채가 뿌려지는 등). 이 점을 유의하도록 하자.

## Part 4. Animation
지금까지 다음의 것들을 배웠다. 적어도 보기라도 했다.

* Mesh's Position, rotation, material
* Mesh vertices position
* camera positon, rotation
* lighting

이것들을 종합해 이제 3D Animation을 구현해보도록 하자.

### Base
모든 Animating은 _animation loop_ 안에서 정의된다. 그러니까...

```js
function animate () {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}
```
이것을 말한다.

### Animation Example 1: Tweening an icosahedron's vertices
vanilaJS의 [tweening](https://codepen.io/rachsmith/post/css-transitions-and-javascript-tweens)을 이용해 animating을 해 보도록 한다.

먼저 vanilaJS로 tween을 하는 방법을 알아야 하기 때문에, 위의 링크를 통해 선행하고 오자. 적어도 어떻게 돌아가는지는 알아두는게 좋다.

#### Create icosahedron
지금까지 배웠던 것을 이용해 정20면체를 먼저 만들어보도록 한다...

[Codepen](https://codepen.io/rachsmith/pen/KzrarL)

사실 만드는게 이해가 안가는게 당연하다. 아직 ThreeJS API가 무엇이 있는지도 모르고, 지금까지 그저 따라하기만(적어도 나의 경우는) 했으니 말이다.

그냥 코드 보고 따라치기만이라도 하자.

```js
import * as THREE from 'three'
import './test.png'

// init scene
const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(30, innerWidth / window.innerHeight, 0.1, 1000)

const renderer = new THREE.WebGLRenderer({ alpha: false })
renderer.setSize(window.innerWidth, window.innerHeight)

document.body.appendChild(renderer.domElement)

camera.position.z = 200

// init geometry
const geometry = new THREE.IcosahedronGeometry(20)

const colors = [0x05A8AA, 0xB8D5B8, 0xD7B49E, 0xDC602E, 0xBC412B, 0xF19C79, 0xCBDFBD, 0xF6F4D2, 0xD4E09B, 0xFFA8A9, 0xF786AA, 0xA14A76, 0xBC412B, 0x63A375, 0xD57A66, 0x731A33, 0xCBD2DC, 0xDBD48E, 0x5E5E5E]
for (var i = 0; i < geometry.faces.length; i++) {
  const f = geometry.faces[i]
  f.color.setHex(colors[i])
}

const material = new THREE.MeshBasicMaterial({ vertexColors: THREE.FaceColors })

const mesh = new THREE.Mesh(geometry, material)

scene.add(mesh)

// init light
const light1 = new THREE.DirectionalLight(0xffffff, 1)
light1.position.set(0, 1, 0)
scene.add(light1)

const light2 = new THREE.DirectionalLight(0xffffff, 1)
light2.position.set(0, -1, 0)
scene.add(light2)

// animation loop
const animate = function () {
  requestAnimationFrame(animate)

  renderer.render(scene, camera)
}
animate()
```
뭐암튼 만든다. 이제 꼭짓점에 Tweening을 적용해서 역동적으로 Animating되는 Icosahedron을 만들어 볼 것이다.

#### Tweening Object
우리는 앞서 Geometry 볼 때 꼭짓점을 랜덤으로 생성해 도형을 만들었었다. 그걸 그대로 가져와 적용해보자면...

```js
const verticePositions = [] // 꼭짓점 위치를 저장하기 위해 생성한다.

for (var i = 0; i < geometry.vertices.length; i++) {
  const g = geometry.vertices[i]

  verticePositions.push({ x: g.x, y: g.y })
}
```
`verticePositions`에 각각의 꼭짓점들을 저장한다. 이걸 이용하면 간단히 꼭짓점을 변경할 수 있겠지.

해서, 여기에 tweening을 해보자. 다음과 같이 가능할 것이다. 참고로 나는 [TweenJS](https://github.com/tweenjs/tween.js/)를 사용해 구현해보았다.

```js
function getNewVertices () {
  const newVertices = []

  for (var i = 0; i < geometry.vertices.length; i++) {
    const v = verticePositions[i]

    newVertices.push({
      x: v.x - 5 + Math.random() * 10,
      y: v.y - 5 + Math.random() * 10
    })
  }

  return newVertices
}

function tweening () {
  const newVerticePositions = getNewVertices()

  for (var i = 0; i < geometry.vertices.length; i++) {
    tweenVertice(i, newVerticePositions)
  }
}

function tweenVertice(ind, newVerticePositions) {
  const v = geometry.vertices[ind]
  const nv = newVerticePositions[ind]
  
  new TWEEN.Tween(v)
    .to({ x: nv.x, y: nv.y }, 1000)
    .easing(TWEEN.Easing.Exponential.InOut) // easing function
    .onComplete(() => {
      if (ind === 0) tweening()
    })
    .start()
}

tweening()

const animate = function (time) {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)

  TWEEN.update(time)
  geometry.verticesNeedUpdate = true // 이 설정이 없으면 안움직인다...
}
animate()
```
중간의 Easing function 부분을 여러 다른 함수로 바꿔보자. 신기하다. [TweenJS Easing function graph](https://sole.github.io/tween.js/examples/03_graphs.html)

지금도 신기하긴 한데, 입체적이지가 않다. 조금 응용하면 어렵지 않게 입체적으로 돌아가도록 할 수 있다. 위에서 Mesh를 이용해 객체의 위치를 변경했었다. 이를 이용하자.

```js
function tweening () {
  const newVerticePositions = getNewVertices()

  for (var i = 0; i < geometry.vertices.length; i++) {
    tweenVertice(i, newVerticePositions)
  }

  /* add */
  const rotation = {
    x: Math.random() * 3,
    y: Math.random() * 3,
    z: Math.random() * 3
  }

  new TWEEN.Tween(mesh.rotation)
    .to({ x: rotation.x, y: rotation.y, z:rotation.z }, 1000)
    .easing(TWEEN.Easing.Exponential.InOut)
    .start()
  /* add */
}
```
끝! 매우간단하다. Object의 face나 tween animation 등을 수정/응용하여 여러가지를 할 수 있을 것이다.

#### Result

```js
import TWEEN from '@tweenjs/tween.js'
import * as THREE from 'three'

import './test.png'

// init scene
const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(30, innerWidth / window.innerHeight, 0.1, 1000)

const renderer = new THREE.WebGLRenderer({ alpha: false })
renderer.setSize(window.innerWidth, window.innerHeight)

document.body.appendChild(renderer.domElement)

camera.position.z = 200

// init geometry
const geometry = new THREE.IcosahedronGeometry(20)

const colors = [0x05A8AA, 0xB8D5B8, 0xD7B49E, 0xDC602E, 0xBC412B, 0xF19C79, 0xCBDFBD, 0xF6F4D2, 0xD4E09B, 0xFFA8A9, 0xF786AA, 0xA14A76, 0xBC412B, 0x63A375, 0xD57A66, 0x731A33, 0xCBD2DC, 0xDBD48E, 0x5E5E5E]
for (var i = 0; i < geometry.faces.length; i++) {
  const f = geometry.faces[i]
  f.color.setHex(colors[i])
}

const material = new THREE.MeshLambertMaterial({ vertexColors: THREE.FaceColors })

const mesh = new THREE.Mesh(geometry, material)

scene.add(mesh)

// init light
const light1 = new THREE.DirectionalLight(0xffffff, 0.8)
light1.position.set(0, 0, 0)
scene.add(light1)

const light2 = new THREE.DirectionalLight(0xffffff, 0.8)
light2.position.set(0, -1, 0)
scene.add(light2)

const light3 = new THREE.DirectionalLight(0xffffff, 0.8)
light2.position.set(0, 0, 1)
scene.add(light3)

// tweening
const verticePositions = []
for (var i = 0; i < geometry.vertices.length; i++) {
  const g = geometry.vertices[i]
  verticePositions.push({ x: g.x, y: g.y })
}

function getNewVertices () {
  const newVertices = []

  for (var i = 0; i < geometry.vertices.length; i++) {
    const v = verticePositions[i]
    newVertices.push({
      x: v.x - 5 + Math.random() * 10,
      y: v.y - 5 + Math.random() * 10
    })
  }

  return newVertices
}

function tweening () {
  const newVerticePositions = getNewVertices()

  for (var i = 0; i < geometry.vertices.length; i++) {
    tweenVertice(i, newVerticePositions)
  }

  const rotation = {
    x: Math.random() * 3,
    y: Math.random() * 3,
    z: Math.random() * 3
  }

  new TWEEN.Tween(mesh.rotation)
    .to({ x: rotation.x, y: rotation.y, z:rotation.z }, 1000)
    .easing(TWEEN.Easing.Exponential.InOut)
    .start()
}

function tweenVertice(ind, newVerticePositions) {
  const v = geometry.vertices[ind]
  const nv = newVerticePositions[ind]

  new TWEEN.Tween(v)
    .to({ x: nv.x, y: nv.y }, 1000)
    .easing(TWEEN.Easing.Exponential.InOut)
    .onComplete(() => {
      if (ind === 0) tweening()
    })
    .start()
}

tweening()

// animation loop
const animate = function (time) {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)

  TWEEN.update(time)
  geometry.verticesNeedUpdate = true
}
animate()
```

### Animation Example 2: Animating the Camera
이제 Camera를 움직여 보도록 하자. Object보다 훨 간단하다.

#### Create Space
먼저 우주 공간을 만들어보도록 한다. [CodePen](https://codepen.io/rachsmith/pen/jqQBdM)

```js
import * as THREE from 'three'

// init scene
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({ alpha: false })
renderer.setSize(window.innerWidth, window.innerHeight)

document.body.appendChild(renderer.domElement)

// rocks
const rocks = []
let material = null

const textureLoader = new THREE.TextureLoader()
textureLoader.crossOrigin = true
textureLoader.load('https://s3-us-west-2.amazonaws.com/s.cdpn.io/53148/rock-texture.jpg', t => {
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.repeat.set(2, 2)
  
  material = new THREE.MeshLambertMaterial({ map: t })
  
  for (var i = 0; i < 100; i++) {
    const r = new Rock()
    rocks.push(r)
  }
})

class Rock {
  constructor () {
    const size = 10 + Math.random() * 10
    const geometry = new THREE.IcosahedronGeometry(size, 0)
    const icosahedron = new THREE.Mesh(geometry, material)

    for (var i = 0; i < geometry.vertices.length; i++) {
      const g = geometry.vertices[i]

      g.x += size * -0.25 + Math.random() * size * 0.5
      g.y += size * -0.25 + Math.random() * size * 0.5
    }

    const variance = 0.01
    this.vr = {
      x: -variance + Math.random() * variance * 2,
      y: -variance + Math.random() * variance * 2
    }

    const field = 300
    icosahedron.position.x = -field + Math.random() * field * 2
    icosahedron.position.y = -field + Math.random() * field * 2
    icosahedron.position.z = -field + Math.random() * field * 2

    this.mesh = icosahedron

    scene.add(icosahedron)
  }
}

// init light
const light1 = new THREE.PointLight(0xffffff)
const light2 = new THREE.PointLight(0xffffff)

light1.position.set(300, 300, 0)
light2.position.set(0, 300, 300)

scene.add(light1)
scene.add(light2)

function animate () {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}
animate()
```
그냥 따라했다. 그래도 뭔가 감이 잡히는 듯 하다.

#### Moving Camera
카메라가 움직이지 않으니 답답하다. 이제 카메라를 움직여 보도록 하겠다.

```js
let angle = 0
function updateCamera () {
  angle += 0.005
  const z = 100 * Math.cos(angle)
  const y = 100 * Math.sin(angle)

  camera.position.z = z
  camera.position.y = y
  
  camera.rotation.x = z * 0.02
}

function animate () {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)

  updateCamera()
}
animate()
```
그냥 카메라의 positon과 rotation만 움직이도록 하면 되기에, 간단히 구현되었다. 원한다면 위에서 본 tweening을 적용해도 된다.

#### result
Tweening을 적용한 코드를 적어놓겠다.

```js
import * as THREE from 'three'
import TWEEN from '@tweenjs/tween.js'

// init scene
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({ alpha: false })
renderer.setSize(window.innerWidth, window.innerHeight)

document.body.appendChild(renderer.domElement)

// rocks
const rocks = []
let material = null

const textureLoader = new THREE.TextureLoader()
textureLoader.crossOrigin = true
textureLoader.load('https://s3-us-west-2.amazonaws.com/s.cdpn.io/53148/rock-texture.jpg', t => {
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.repeat.set(2, 2)
  
  material = new THREE.MeshLambertMaterial({ map: t })
  
  for (var i = 0; i < 100; i++) {
    const r = new Rock()
    rocks.push(r)
  }
})

class Rock {
  constructor () {
    const size = 10 + Math.random() * 10
    const geometry = new THREE.IcosahedronGeometry(size, 0)
    const icosahedron = new THREE.Mesh(geometry, material)

    for (var i = 0; i < geometry.vertices.length; i++) {
      const g = geometry.vertices[i]

      g.x += size * -0.25 + Math.random() * size * 0.5
      g.y += size * -0.25 + Math.random() * size * 0.5
    }

    const variance = 0.01
    this.vr = {
      x: -variance + Math.random() * variance * 2,
      y: -variance + Math.random() * variance * 2
    }

    const field = 300
    icosahedron.position.x = -field + Math.random() * field * 2
    icosahedron.position.y = -field + Math.random() * field * 2
    icosahedron.position.z = -field + Math.random() * field * 2

    this.mesh = icosahedron

    scene.add(icosahedron)
  }
}

// moving camera
function updateCamera (up) {
  const c = { angle: up? 1: 0 }

  new TWEEN.Tween(c)
    .to({ angle: up? 0: 1 }, 1000)
    .easing(TWEEN.Easing.Exponential.InOut)
    .onUpdate(() => {
      const z = 100 * Math.cos(c.angle)
      const y = 100 * Math.sin(c.angle)

      camera.position.z = z
      camera.position.y = y
    
      camera.rotation.x = z * 0.02
    })
    .onComplete(() => updateCamera(!up))
    .start()
}
updateCamera(false)

// init light
const light1 = new THREE.PointLight(0xffffff)
const light2 = new THREE.PointLight(0xffffff)

light1.position.set(300, 300, 0)
light2.position.set(0, 300, 300)

scene.add(light1)
scene.add(light2)

function animate (time) {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)

  TWEEN.update(time)
}
animate()
```
이해안되면 그냥 한 번 따라적어보자. 끝.

# Animating Scenes with WebGL + ThreeJS
[포스트](https://www.august.com.au/blog/animating-scenes-with-webgl-three-js/)를 보고 작성한 글임.

다른 플러그인 없이 VanilaJS만으로 구현가능한 WebGL 어쩌구

## First up, What is WebGL?
언급했듯이, 다른 plugins 없이 VanilaJS만으로 browser 위에서 3D Graphics를 표현하기 위해 구현된 기술이다. 대부분의 브라우저에서 스펙을 구현하였으며, 이는 desktop 뿐만 아니라 mobile 에서도 마찬가지다.

&lt;canvas&gt; 이용하며, GPU 사용한다고 한다. [MDN](https://developer.mozilla.org/ko/docs/Learn/WebGL)

원하는 Object 대부분 구현가능하다. 3D, 360-degree content 등, 다 가능하다. 대신 진입장벽이 좀 있다. ThreeJS는 이러한 진입장벽을 많이 낮춰준다.

기초적인 코드(이해)만으로도 간단한 객체를 만들 수 있다. 일단 시작해보자.

## Basic Renderer, Scene and Camera
[CodePen](https://codepen.io/agar/pen/KNywyN)

### Scene
Render될 Objects가 있는 공간. 여기서 Objects 뿐만 아니라 Lights, Cameras가 위치할 수 있겠지.

다음의 코드로 만들 수 있다.

```js
const scene = new THREE.Scene()
```

### Camera
이제 Scene을 비출 Camera를 만들어보자. 여기서는 [PerspectiveCamera] 객체로 Camera를 구현한다. 물론 다른 종류도 있다.

```js
const camera = new THREE.PerspectiveCamera(
  75, // FOV
  window.innerWidth / window.innerHeight, // Aspect ratio
  0.1, // Near clipping pane
  1000 // Far clipping pane
)

// Reposition the Camera
camera.position.set(5, 5, 0)

// Point the Camera at a given coordinate
camera.lookAt(new THREE.Vector3(0, 0, 0))
```
나와있는 것과 같이 Camera는 Position과 View Point?를 지정할 수 있다.

### Renderer
마지막으로, 위에서 구현했던 Scene과 Camera를 handling할 Renderer 객체를 구현하도록 하자. 마찬가지로, 여러가지 구현 객체가 있으나, 가장 Standard한 [WebGLRenderer] 객체로 Renderer를 구현하도록 하겠다.

```js
const renderer = new THREE.WebGLRenderer({ antialias: true })

renderer.setSize(window.innerWidth, windoe.innerHeight)
renderer.setClearColor(0xfff6e6) // default: black

// DOM Element로 출력
document.body.appendChild(renderer.domElement)

// Render the Scene and Camera
renderer.render(scene, camera)
```
명시적이어서 별로 뭐 설명할 거리도 없다... 참고로 당연히 지금 보이는 것은 아무것도 없다.

### Geometry
간단한 Plane Object라도 하나 만들어주자. 다음과 같이 가능하다.

```js
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(5, 5, 5, 5), // geometry
  new THREE.MeshBasicMaterial({ color: 0x393839, wireframe: true }) // mesh
)

plane.rotateX(Math.PI / 2)
scene.add(plane)
```
이 역시 따로 뭐 설명은 필요없을 듯 하다. 안할 것은 아니고, 진행하면서 다룰 것이다.

### animation loop and OrbitControls
어... 그렇지만 여전히 아무것도 나오지 않는다.(문서에서는 좀 뒤에서 설명하려고 했던 듯 함)

이는 animation loop를 정의해주지 않아서 발생되는 이슈이다. 각 프레임마다 render 하게 해 줘야 화면에 출력이 될 것이다. 다음은 이를 정의한 코드이다.

```js
function render() {
  requestAnimationFrame(render) // call the 'render' function by each frame
  renderer.render(scene, camera) // rendering
}
render() // 처음에 한 번 call 해줘야 저게 실행되겠지
```

이제 보이기는 한데 움직이지 않으니 너무 심심하다. 다음과 같은 코드로 매우 간단히 마우스 입력을 받을 수 있다.

```sh
$ yarn add three-orbitcontrols
```
먼저 관련 모듈을 받아야 한다. THREE 자체적으로 구현되어 있지는 않음. 물론 직접 구현할 수도 있는데, 이게 많이 편하다. [three-orbitcontrols Github](https://github.com/fibo/three-orbitcontrols)

```js
import OrbitControls from 'three-orbitcontrols'

/* ... */

// implement orbit control
const controls = new OrbitControls(camera, renderer.domElement)

// orbit control conf
controls.enableDamping = true
controls.dampingFactor = 0.5
controls.enableZoom = true
```
참고로 코드의 위치는 보통 상관없기는 한데... 굳이 필요할 경우를 위해 아래에 적어놓도록 하겠다.

아무튼 다 하고 실행해보자. 평면 판이 보이고, 마우스로 이를 움직일 수 있을 것이다.

다음과 비슷하게 렌더가 된다. 마우스로 움직여보고 휠로 Zoom-in/out도 해보자. [codepen](https://codepen.io/agar/pen/KNywyN) [문서](https://threejs.org/docs/#examples/controls/OrbitControls)

### Result

```js
import * as THREE from 'three'
import OrbitControls from 'three-orbitcontrols'

// init scene
const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
camera.position.set(5, 5, 0)
camera.lookAt(new THREE.Vector3(0, 0, 0))

const renderer = new THREE.WebGLRenderer({ antialias: true })

renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setClearColor(0xfff6e6)

document.body.appendChild(renderer.domElement)

renderer.render(scene, camera)

// init object
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(5, 5, 5, 5),
  new THREE.MeshBasicMaterial({ color: 0x393839, wireframe: true })
)
plane.rotateX(Math.PI / 2)

scene.add(plane)

// init control
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.5
controls.enableZoom = true

// init animation loop
function render() {
  requestAnimationFrame(render)
  renderer.render(scene, camera)
}
render()
```

## Adding some low poly geometry with flat shading
대충 Objets들을 만들어보도록 하자. 지금의 목표는 [CodePen](https://codepen.io/agar/pen/rWZxmr) 이거다.

### Geometry
모든 Object는 Geometry와 Material로 이루어져 있다. 이 중 가장 먼저 볼 것은 Object의 모든 점, 선, 면에 대한 정보를 가지고 있는 __Geometry__ 이다. 

Object는 여러가지 모양?이 있기 때문에, ThreeJS에서는 각각의 모양?별로 Geometry를 구현하고 있다.

가장 먼저 Octahedron. 팔면체를 구현하도록 하자. [OctahedronGeometry](https://threejs.org/docs/#api/geometries/OctahedronGeometry)로 구현되어있다.

```js
const octahedronGeometry = new THREE.OctahedronGeometry(10, 1)
```

### Material
다음으로 볼 것은 __Material__ 이다. 얘는 단어 그대로 Object의 질감? 뭐 그런걸 구현한다. 마찬가지로 질감도 여러가지가 있기 때문에, ThreeJS에서는 각각의 질감별로 Material을 구현하고 있다.

가장 Standard한 Material로 구현해보도록 하자. [MeshStandardMaterial]로 구현되어있다.

```js
const standardMaterial = new THREE.MeshStandardMaterial({
  color: 0xff0051,
  flatShading: THREE.FlatShading,
  metalness: 0,
  roughness: 1
})
```

### Mesh
이렇게 Geometry와 Material을 구현해 주었으면, __Mesh__ 로 이 둘을 조합해 Object를 만들 수 있다. [Mesh]로 구현되어있고, 다음과 같이 가능하다.

```js
const octahedron = new THREE.Mesh(octahedronGeometry, standardMaterial)

octahedron.position.y += 10

scene.add(octahedron)
```
참고로 존나 커서 마우스 휠로 축소 좀 해줘야 한다.

### Lights
만들어 줬는데, 도형이 모두 거멓다. '깜깜하다' 라는 표현이 더 맞는걸까? 바로 Lights를 구현해주지 않아서 생긴 이슈이다. 보통 다음 두 개의 Lights로 구현하곤 한다.

* ambient; 태양처럼 모든 면을 비추는 조명
* point; 어느 한 곳을 비추는 조명

각각은 다음과 같이 구현이 가능하다.

```js
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5) // color, power

scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 1) // color, power
pointLight.position.set(25, 50, 25) // point lights의 경우는 위치를 지정해줘야 할 것이다.

scene.add(pointLight)
```
얘네 말고도 다른 조명도 있긴 한데, 굳이 그것까지 필요는 없다고 함. 두 개 구현하면서 서로의 차이점을 확인해보자.

### Casting shadows
이제 Object도 만들고 Lights도 구현했겠다, Shadow도 구현해보도록 하자. Shadow Render를 위해서는 다음이 필요하다.

* Shadow를 rendering하도록 Renderer와 Lights를 설정
* Shadow를 적용할 Object를 설정

하나하나 해보도록 하자. 먼저 Shadow를 redering할 수 있도록 Renderer와 Lights를 설정하도록 하겠다. 참고로 Point Light에 대해서만 설정할 것인데, Ambient Light는 모든 방면에서 빛을 비추기 때문.

```js
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftshadowMap

/* ... */

pointLight.castShadow = true
pointLight.shadow.mapSize.width = 1024
pointLight.shadow.mapSize.height = 1024
```
참고로... 뭐... 코드의 위치는 상관없기는 한데 비슷한 것 끼리 한데 있으면 보기에 좋을 것 같다고 생각한다...

다음은 이제 Shadow를 적용할 Object에 대한 설정을 진행하도록 하자.

```js
octahedron.castShadow = true // shadow 뿌림
octahedron.receiveShadow = true // shadow 받음
```
그런데 그림자는 커녕, 뭐 변한게 하나 없어 보인다. 원래 우리의 목적을 다시 보면([CodePen](https://codepen.io/agar/pen/rWZxmr)) 땅바닥이 있고, 그 위에 그림자가 뿌려지고 있다. 그렇다. 우리는 Ground를 새로 구현해줘야 한다.

```js
const boxGeometry = new THREE.BoxGeometry(100, 0.1, 100)
const shadowMaterial = new THREE.ShadowMaterial({ color: 0xeeeeee })
shadowMaterial.opacity = 0.8

const ground = new THREE.Mesh(boxGeometry, shadowMaterial)
ground.receiveShadow = true // shadow 받음
scene.add(ground)
```
여기서 'shadow 받음/뿌림'이 무슨 의미냐면... 말 그대로 shadow가 생성되고, 표면에 렌더되는지 여부이다.

아무튼 해 보면 codepen 예제와 매우 비슷하게 나온다.

### Result
정의가 좀 바뀌었다. 그냥 좀 더 명확하게 변수명을 잡아주었음.

```js
import * as THREE from 'three'
import OrbitControls from 'three-orbitcontrols'

// init scene
const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
camera.position.set(5, 5, 0)
camera.lookAt(new THREE.Vector3(0, 0, 0))

const renderer = new THREE.WebGLRenderer({ antialias: true })

renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setClearColor(0xfff6e6)

document.body.appendChild(renderer.domElement)

renderer.render(scene, camera)

// init object

// plane object
const planeGeometry = new THREE.PlaneGeometry(5, 5, 5, 5)
const basicMaterial = new THREE.MeshBasicMaterial({ color: 0x393839, wireframe: true })

const plane = new THREE.Mesh(planeGeometry, basicMaterial)
plane.rotateX(Math.PI / 2)

scene.add(plane)

// octahedron object
const octahedronGeometry = new THREE.OctahedronGeometry(10, 1)
const standardMaterial = new THREE.MeshStandardMaterial({
  color: 0xff0051,
  flatShading: THREE.FlatShading,
  metalness: 0,
  roughness: 1
})

const octahedron = new THREE.Mesh(octahedronGeometry, standardMaterial)
octahedron.position.y += 10

octahedron.castShadow = true
octahedron.receiveShadow = true

scene.add(octahedron)

// ground object
const boxGeometry = new THREE.BoxGeometry(100, 0.1, 100)
const shadowMaterial = new THREE.ShadowMaterial({ color: 0xeeeeee })
shadowMaterial.opacity = 0.8

const ground = new THREE.Mesh(boxGeometry, shadowMaterial)
ground.receiveShadow = true
scene.add(ground)

// init lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 1)
pointLight.position.set(25, 50, 25)
scene.add(pointLight)

pointLight.castShadow = true
pointLight.shadow.mapSize.width = 1024
pointLight.shadow.mapSize.height = 1024

// init control
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.5
controls.enableZoom = true

// init animation loop
function render() {
  requestAnimationFrame(render)
  renderer.render(scene, camera)
}
render()
```

## Building complexity with simple elements
Object를 만들어 봤다. 이제 여러개를 만들어 볼 것인데, 좀 복잡하다는 느낌이 들 것이다. 이는 _re-usable_ 하게 Elements를 사용하면 간단히 구현을 할 수 있다.

여기서 구현할 예제는 다음과 같다. [CodePen](https://codepen.io/agar/pen/dOqGWx)

### Combining
먼저 Object 하나를 만들어보자. 이런 Complex한 Object들은 어떻게 만들 수 있을까? 바로 여러 low-poly Objects를 조합해서 할 수 있다. [THREE.Group]을 이용하면 되겠다.

코드부터 보자면 다음과 같다. 참고로 문서와는 다르게 여기서는 ES6 class를 이용해 구현해놓았는데, 이게 이해가 안된다거나 서로 Convert를 할 수 없다면 일단 JS부터 다시 배우고 오자.

```js
class Decoration extends THREE.Group {
  constructor () {
    super()

    const colors = ['#ff0051', '#f56762', '#a53c6c', '#f19fa0', '#72bdbf', '#47689b']

    // init elements of mesh
    const octahedronGeometry = new THREE.OctahedronGeometry(12, 1)
    const cylinderGeometry = new THREE.CylinderGeometry(4, 6, 10, 6, 1)
    const torusGeometry = new THREE.TorusGeometry(2, 1, 6, 4, Math.PI)
    
    const standardMaterial = new THREE.MeshStandardMaterial({
      color: colors[Math.floor(Math.random() * colors.length)],
      flatShading: THREE.FlatShading,
      metalness: 0,
      roughness: 1
    })

    // init object
    const bauble = new THREE.Mesh(octahedronGeometry, standardMaterial)
    bauble.castShadow = true
    bauble.receiveShadow = true
    bauble.rotateY(Math.random() * Math.PI * 2)
    bauble.rotateZ(Math.random() * Math.PI * 2)

    this.add(bauble) // [THREE.Group]의 method

    const topShape1 = new THREE.Mesh(cylinderGeometry, standardMaterial)
    topShape1.position.y += 8
    topShape1.castShadow = true
    topShape1.receiveShadow = true

    this.add(topShape1)

    const topShape2 = new THREE.Mesh(torusGeometry, standardMaterial)
    topShape2.position.y += 13
    topShape2.castShadow = true
    topShape2.receiveShadow = true

    this.add(topShape2)
  }
}
```
참고로 문서에는 _addNoise()_ 라고 Geometry를 랜덤하게 위아래로 흔들어주는 함수를 추가적으로 구현해줬는데, 혼동의 여지만 높아지는 것 같아 그냥 제외시켰다. CodePen 보면 알 것임.

또한 Material을 그냥 정의해버렸기에 하나의 Object는 하나의 색만을 갖게 된다. 예제에는 자물쇠가 노란색으로 나와있으나, 여기서는 모두 같은 색이 된다는건 이 것 때문.

중간에 나오는 _this.add()_ 메서드는 주석에도 나와있듯이 [THREE.Group]의 메서드이며, 글자 그대로 Group에 added 하는 것이다.

이것 말고는 뭐 더 설명한 것이 없다. 새로이 보이는 [CylinderGeometry], [TorusGeometry]는 위에서 언급했듯이 그냥 다른 모양의 Geometry를 구현한 class들이며, 그냥 가져다 쓰면 된다. 정 궁금하면 ThreeJS 문서를 참고하자. ([CylinderGeometry](https://threejs.org/docs/#api/geometries/CylinderGeometry), [TorusGeometry](https://threejs.org/docs/#api/geometries/TorusGeometry))

위와같이 Class를 구현해주었다. 이제 가져다 써 보도록 하자.

```js
const deco1 = new Decoration()
deco1.position.y += 10 // 그냥 일반적은 Mesh처럼 다룰 수 있다.
scene.add(deco1)

const deco2 = new Decoration()
deco2.position.set(20, 15, -10)
deco2.scale.set(0.8, 0.8, 0.8)
scene.add(deco2)

const deco3 = new Decoration()
deco3.position.set(-20, 20, -12)
scene.add(deco3)
```
[THREE.Group]과 class를 이용해 re-usable하게 구현하였기에 매우 간단히 객체를 생성하였다. 또한 이 객체는 일반적인 Mesh와 다를게 없기 때문에 지금까지 Mesh에 사용했던 properties들을 동일하게 사용할 수 있다.

### Result

```js
import * as THREE from 'three'
import OrbitControls from 'three-orbitcontrols'

// init scene
const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
camera.position.set(0, 30, 50)
camera.lookAt(new THREE.Vector3(0, 15, 0))

const renderer = new THREE.WebGLRenderer({ antialias: true })

renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setClearColor(0xfff6e6)

document.body.appendChild(renderer.domElement)


// init objects

// plane object
const planeGeometry = new THREE.PlaneGeometry(5, 5, 5, 5)
const basicMaterial = new THREE.MeshBasicMaterial({ color: 0x393839, wireframe: true })

const plane = new THREE.Mesh(planeGeometry, basicMaterial)
plane.rotateX(Math.PI / 2)

scene.add(plane)

// octahedron object
/*
const octahedronGeometry = new THREE.OctahedronGeometry(10, 1)
const standardMaterial = new THREE.MeshStandardMaterial({
  color: 0xff0051,
  flatShading: THREE.FlatShading,
  metalness: 0,
  roughness: 1
})

const octahedron = new THREE.Mesh(octahedronGeometry, standardMaterial)
octahedron.position.y += 10

octahedron.castShadow = true
octahedron.receiveShadow = true

scene.add(octahedron)
*/

// combining
class Decoration extends THREE.Group {
  constructor () {
    super()

    const colors = ['#ff0051', '#f56762', '#a53c6c', '#f19fa0', '#72bdbf', '#47689b']

    const octahedronGeometry = new THREE.OctahedronGeometry(12 ,1)
    const cylinderGeometry = new THREE.CylinderGeometry(4, 6, 10, 6, 1)
    const torusGeometry = new THREE.TorusGeometry(2, 1, 6, 4, Math.PI)

    const standardMaterial = new THREE.MeshStandardMaterial({
      color: colors[Math.floor(Math.random() * colors.length)],
      flatShading: THREE.FlatShading,
      metalness: 0,
      roughness: 1
    })

    const bauble = new THREE.Mesh(octahedronGeometry, standardMaterial)
    bauble.castShadow = true
    bauble.receiveShadow = true
    bauble.rotateY(Math.random() * Math.PI * 2)
    bauble.rotateZ(Math.random() * Math.PI * 2)

    this.add(bauble) // method of [THREE.Group]

    const topShape1 = new THREE.Mesh(cylinderGeometry, standardMaterial)
    topShape1.position.y += 8
    topShape1.castShadow = true
    topShape1.receiveShadow = true

    this.add(topShape1)

    const topShape2 = new THREE.Mesh(torusGeometry, standardMaterial)
    topShape2.position.y += 13
    topShape2.castShadow = true
    topShape2.receiveShadow = true

    this.add(topShape2)
  }
}

const deco1 = new Decoration()
deco1.position.y += 10
scene.add(deco1)

const deco2 = new Decoration()
deco2.position.set(20, 15, -10)
deco2.scale.set(0.8, 0.8, 0.8)
scene.add(deco2)

const deco3 = new Decoration()
deco3.position.set(-20, 20, -12)
scene.add(deco3)

// ground object
const boxGeometry = new THREE.BoxGeometry(100, 0.1, 100)
const shadowMaterial = new THREE.ShadowMaterial({ color: 0x333333 })
shadowMaterial.opacity = 0.8

const ground = new THREE.Mesh(boxGeometry, shadowMaterial)
ground.receiveShadow = true
scene.add(ground)

// init lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 1)
pointLight.position.set(25, 50, 25)

pointLight.castShadow = true
pointLight.shadow.mapSize.width = 1024
pointLight.shadow.mapSize.height = 1024

scene.add(pointLight)

// init control
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.5
controls.enableZoom = true

// init animation loop
function render() {
  requestAnimationFrame(render)
  renderer.render(scene, camera)
}
render()
```

## Making movements
이제 위의 Objects를 움직여 보도록 하자 [Codepen](https://codepen.io/agar/pen/GNXoEo)

위에서 봤었던 animation loop를 이용한다. Render loop라고도 하는듯.

### The Render Loop
다음과 같이 구현했었다. 바로 위 Result에도 나옴.

```js
function render () {
  requestAnimationFrame(render)
  renderer.render(scene, camera)

  // insert code
}
render()
```
render() 함수는 보통 60hz로 calling 된다. 즉, 저곳에 animating 코드를 넣으면 된다는 말.

### Updating Elements over Time
별거 없다. Trigonometric Function(sin)을 이용해 yoyo loop를 구현해보도록 하겠다. 방법은 다음과 같다.

* 각 객체에 대해 animation을 적용해야 하기 때문에, Class 안에 Method를 만들어 각 animation frame을 구현한다.
* 이 Method를 render loop 안에서 호출함으로써 Animating을 진행한다.

```js
class Decoration extends THREE.Group {
  constructor () {
    super()

    /* ... */

    this.rotationSpeed = Math.random() * 0.02 + 0.005
    this.rotationPosition = Math.random()
  }

  updatePosition () {
    this.rotationPosition += this.rotationSpeed
    this.rotation.y = Math.sin(this.rotationPosition)
  }
}

const decos = []

/* ... */

decos.push(deco1)
decos.push(deco2)
decos.push(deco3)

/* ... */

function render () {
  requestAnimationFrame(render)
  renderer.render(scene, camera)

  for (var i = 0; i < decos.length; i++) {
    decos[i].updatePosition()
  }
}
render()
```
굳이 해석하자면, each frame마다 obejct의 position을 update하는 메서드 _updatePosition()_ 이 호출된다. 이 메서드는 호출 시마다 _rotationSpeed_ 만큼 초기 방향값(_rotationPosition_)에 값을 더하는데, _rotationPosition_ 을 그냥 객체의 rotation(y)에 집어넣어버리면 그냥 한 방향으로만 돌아버리니 Sin을 이용해 와리가리하게 구현한 것이다.

글이 너무 병신같기 때문에 그냥 코드를 보고 이해하자

### Result

```js
import * as THREE from 'three'
import OrbitControls from 'three-orbitcontrols'

// init scene
const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
camera.position.set(0, 30, 50)
camera.lookAt(new THREE.Vector3(0, 15, 0))

const renderer = new THREE.WebGLRenderer({ antialias: true })

renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setClearColor(0xfff6e6)

document.body.appendChild(renderer.domElement)


// init objects

// plane object
const planeGeometry = new THREE.PlaneGeometry(5, 5, 5, 5)
const basicMaterial = new THREE.MeshBasicMaterial({ color: 0x393839, wireframe: true })

const plane = new THREE.Mesh(planeGeometry, basicMaterial)
plane.rotateX(Math.PI / 2)

scene.add(plane)

// octahedron object
/*
const octahedronGeometry = new THREE.OctahedronGeometry(10, 1)
const standardMaterial = new THREE.MeshStandardMaterial({
  color: 0xff0051,
  flatShading: THREE.FlatShading,
  metalness: 0,
  roughness: 1
})

const octahedron = new THREE.Mesh(octahedronGeometry, standardMaterial)
octahedron.position.y += 10

octahedron.castShadow = true
octahedron.receiveShadow = true

scene.add(octahedron)
*/

// combining
class Decoration extends THREE.Group {
  constructor () {
    super()

    const colors = ['#ff0051', '#f56762', '#a53c6c', '#f19fa0', '#72bdbf', '#47689b']

    const octahedronGeometry = new THREE.OctahedronGeometry(12 ,1)
    const cylinderGeometry = new THREE.CylinderGeometry(4, 6, 10, 6, 1)
    const torusGeometry = new THREE.TorusGeometry(2, 1, 6, 4, Math.PI)

    const standardMaterial = new THREE.MeshStandardMaterial({
      color: colors[Math.floor(Math.random() * colors.length)],
      flatShading: THREE.FlatShading,
      metalness: 0,
      roughness: 1
    })

    const bauble = new THREE.Mesh(octahedronGeometry, standardMaterial)
    bauble.castShadow = true
    bauble.receiveShadow = true
    bauble.rotateY(Math.random() * Math.PI * 2)
    bauble.rotateZ(Math.random() * Math.PI * 2)

    this.add(bauble) // method of [THREE.Group]

    const topShape1 = new THREE.Mesh(cylinderGeometry, standardMaterial)
    topShape1.position.y += 8
    topShape1.castShadow = true
    topShape1.receiveShadow = true

    this.add(topShape1)

    const topShape2 = new THREE.Mesh(torusGeometry, standardMaterial)
    topShape2.position.y += 13
    topShape2.castShadow = true
    topShape2.receiveShadow = true

    this.add(topShape2)

    // set instance variables
    this.rotationSpeed = Math.random() * 0.02 + 0.005
    this.rotationPosition = Math.random()
  }

  updatePosition () {
    this.rotationPosition += this.rotationSpeed
    this.rotation.y = Math.sin(this.rotationPosition)
  }
}

const decos = []

const deco1 = new Decoration()
deco1.position.y += 10
scene.add(deco1)

const deco2 = new Decoration()
deco2.position.set(20, 15, -10)
deco2.scale.set(0.8, 0.8, 0.8)
scene.add(deco2)

const deco3 = new Decoration()
deco3.position.set(-20, 20, -12)
scene.add(deco3)

decos.push(deco1)
decos.push(deco2)
decos.push(deco3)

// ground object
const boxGeometry = new THREE.BoxGeometry(100, 0.1, 100)
const shadowMaterial = new THREE.ShadowMaterial({ color: 0x333333 })
shadowMaterial.opacity = 0.8

const ground = new THREE.Mesh(boxGeometry, shadowMaterial)
ground.receiveShadow = true
scene.add(ground)

// init lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 1)
pointLight.position.set(25, 50, 25)

pointLight.castShadow = true
pointLight.shadow.mapSize.width = 1024
pointLight.shadow.mapSize.height = 1024

scene.add(pointLight)

// init control
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.5
controls.enableZoom = true

// init animation loop
function render() {
  requestAnimationFrame(render)
  renderer.render(scene, camera)

  for (var i = 0; i < decos.length; i++) {
    decos[i].updatePosition()
  }
}
render()
```

### before end...
지금까지 배운 것들을 이용해 [이것](https://codepen.io/agar/pen/pNOgwp?editors=0010)과 같은 복잡한 객체를 만들어낼 수 있다고 한다. 한 번 보고 따라해보면 많은 도움이 될 것 같다.

근데 진짜 매우 많아서 나는 하다가 말았다. 여러가지 Object를 만드는데 많은 도움이 되긴 할 것 같음.

## end
끝으로, 문서에서 다음의 링크들을 주었다. 참고하도록 하자.

* [DatGui](https://workshop.chromeexperiments.com/examples/gui/#1--Basic-Usage): ThreeJS에서 정의되는 여러 variable들을 Interface를 통해 나타내줌. 보면 안다. 몇 번 보았을 것.
* [Stats.js](https://github.com/mrdoob/stats.js/): 각종 Status를 보여준다.
* [The Aviator](https://tympanus.net/codrops/2016/04/26/the-aviator-animating-basic-3d-scene-threejs/): 다음 강좌로 적절할 듯. 마우스의 움직임과 Objects간의 통신?, Variable 등을 이용해 Game을 만들어 본다. 많은 것을 배울 수 있을 것 같다.
* [Codepen from Karim Maaloul](https://codepen.io/Yakudoo/): 많은 예제들이 있다고 한다.

자. 이제 어느정도 감이 오지 않았는가? 다음 단계로 넘어가도록 하자.

