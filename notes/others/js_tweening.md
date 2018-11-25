# JS Tweening
VanilaJS로도 Tweening이 가능하다. [원문](https://codepen.io/rachsmith/post/css-transitions-and-javascript-tweens)을 참고하여 작성하는 글임.

CSS Transform과 JS를 이용하여 Animation을 만들어 보겠다.

## CSS Transitions
먼저, 비교를 위해 잠시 [CSS Animation](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations)에 대한 구현을 보도록 하자. CSS의 `transition` 속성을 이용하여 _State A -> State B_ 로의 이동을 정의할 수 있다.

[CodePen](https://codepen.io/rachsmith/pen/EjRRxz)

```css
#box {
  /* ... */
  transition: transform 500ms linear;
  /* ... */
}
```
다른건 다 제쳐두고 이것만 보면 된다. 대충 눈치챘긴 했을텐데, `transform` 속성 대상으로 값이 변경될 경우 500ms 동안 animating 하며, linear 하게 변화한다.

### Easing
linear 말고도 다른 여러가지 방식으로 `transition` 지정이 가능하다. [참고](https://easings.net/en)

[CodePen](https://codepen.io/rachsmith/pen/WvyybM)

참고로 여기에 나온 JS는 보면 알겠지만 그냥 click을 위한 것이다. 별 의미 없음.

CSS Transition은 이렇게 간단히 animating을 할 수 있다는 장점이 있지만, 이건 가장 큰 단점이기도 하다. 바로 animating을 어떻게 control할 수 없다는 것. 그냥 browser가 animating 해주는 것을 따르는 것 밖에 없다.

## JS Tweens
예전에는 _setInterval_ 로 종종 JS animating을 구현하곤 했는데, 요즘은 _requestAnimationFrame_ 을 사용한다고 한다. 더 최적화된 퍼포먼스를 제공한다고 함. 다음과 같이 사용이 가능하다.

```js
function animation_loop () {
  // each frame

  requestAnimationFrame(animation_loop)
}

animation_loop()
```
각 frame마다 _animation\_loop_ 함수가 호출된다. 이걸 이용해 Tween을 정의해 사용하면 된다.

### Introduction to JS Tween
예를 하나 볼까. 위에서 CSS Transition으로 정의된 Easing-animation을 JS Tween으로 구현해보자면 다음과 같다.

[CodePen](https://codepen.io/rachsmith/pen/Nqzzqy)

대체로 주석이 필요한 곳에 잘 달려있다고 생각하지만... 덧붙이자면...

```js
/* ... */
window.addEventListener('click', toggle)
window.addEventListener('touchstart', toggle)

var left = true // 방향을 나타내기 위함

var tween = {
  startTime: 0, // 객체가 어디에 위치해야 하는지 계산을 위함
  startX: 0,
  endX: 0,
  duration: 0 // 언제 animating이 끝나야 하는지 계산을 위함
}

var easeOutQuart = function (t, b, c, d) {
  // 말 그대로 easing function이다. X가 어디에 위치해야 하는지는 반환한다.
  // 내용을 변경하며 실행해보자.

  /* ... */
}

function loop () {
  var t = Date.now() - tween.startTime // 글자 그대로. animating이 시작된 지 얼마나 시간이 흘렀는지 계산하는 것이다.

  /* ... */
}

function toggle () {
  // 코드 맨 위에서 볼 수 있듯이 event dispatch 시 호출된다.
  // 호출 시 각 위치에 따른 tweening에 대한 정보를 입력?한다.

  /* ... */
}
```
사실 그냥 주루룩 읽어보면 뭐... 그리고 중간에 있는 easing function(_easeOutQuart()_)은 굳이 우리가 구현할 필요는 없다. [Velocity.js](http://velocityjs.org/) 또는 [Greensock Tweenlite](https://greensock.com/tweenlite)와 같은 라이브러리를 이용하면 된다.

* [Velocity.js Codepen example](https://codepen.io/rachsmith/pen/LVrrbG)
* [Greensock Tweenlite Codepen example](https://codepen.io/rachsmith/pen/xGzzqb)

장점?이라고 할 수는 없는데... 뭐 CSS를 작성하지 않아도 된다는 점이 있다. 이를 이용한 [transit.js](http://ricostacruz.com/jquery.transit/)라는 lib도 있다. (페이지가 굉장히 깔끔하게 작성됨...)

#### So, What I do?
지금까지 하던 대로 CSS Transition을 사용해도 되고, JS Tween을 사용해도 되고, 두 개를 섞어서 사용해도 된다.

* CSS Transition은 정말 간단히 사용할 수 있으나, frame 단위로 조작을 할 수 없고
* JS Tween은 frame 단위로 조작이 가능하나, 구현에 어려움이 있을 수 있다.

필요에 따라 원하는 것을 사용하자. 끝.
