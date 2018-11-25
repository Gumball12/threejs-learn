# Getting stared with WEBPACK
자꾸 까먹어서 적어노ㅓㅎ는다 [참고](https://webpack.js.org/guides/getting-started/)

## 메모
환경세팅하고 -> 모듈설치/사용해보고 -> HMR

css 사용하거나 뭐 기타 이런건 아직 안넣음.

## Basic Setup
프로젝트 만들고 설치하고 등

```sh
$ mkdir webpack-demo && cd webpack-demo

$ yarn init

$ yarn add webpack webpack-cli --dev
```

그담에 프로젝트에...

* /dist/index.html
* /src/index.js

만들어준다. index.js는 webpack 진입구간이 된단ㄷ

그리고 `/dist/index.html` 에는 대략 다음과 같이 들어감

```html
<!doctype html>
<html>
  <head>
    <title>Getting Started with WEBPACK</title>
  </head>
  <body>
    <script src="main.js"></script>
  </body>
</html>
```

그리고 package.json 수정하라는데... 하란대로하자.......

```json
{
  "name": "",
  "version": "",
  "description": "",
  "private": true, # +
  "main": "index.js", # -
  "scripts": {
    "test": ""
  },
  "keywords": [],
  "author": "",
  "license": "",
  "devDependencies": {
    "webpack": "",
    "webpack-cli": ""
  },
  "dependencies": {}
}
```

## Creating a Bundle
대충 만들어줬으면 모듈 불러와 사용해보자. THREE.JS를 예로 들어보겠다. ([npm](https://threejs.org/docs/index.html#manual/introduction/Import-via-modules))

```sh
$ yarn add three
```

위에서 만든 `/src/index.js`에는 다음과 같이 들어가겠다.

```js
import * as THREE from 'three' // import~ 어쩌ㅜㄱ구로 모듈불러오고

const scene = new THREE.Scene()

/* ... */
```

다 됐으면 다음으로 pack-ing 할 수 있다.

```sh
$ npx webpack
```

해보면 `/dist`에 `/dist/main.js`가 만들어지는걸 볼 수 있다.

## Using a Configuration
`/webpack.config.js` 설정. 파일 만들어주자.

```js
const path = require('path') // commonjs

module.exports = {
  entry: './src/index.js', // input path
  output: { // output info
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  }
}
```

다음 명령으로 새롭게 만든 config 파일을 이용하여 packing할 수 있다.

```sh
$ npx webpack --config webpack.config.js
```

## Use NPM Scripts
`/package.json`에서 뭐 건드는거

```json
{
  "name": "",
  "version": "",
  "description": "",
  "private": ,
  "main": "",
  "scripts": {
    "test": "",
    "build": "webpack" # +
  },
  "keywords": [],
  "author": "",
  "license": "",
  "devDependencies": {
    "webpack": "",
    "webpack-cli": ""
  },
  "dependencies": {}
}
```
이렇게 추가해주면 귀찮게 npx 어저구 하지 않아도 다음 명령으로 packing을 진행할 수 있다.

```sh
$ npm run build
$ yarn build
```
아마 대충 잘 될거임 자꾸 까먹는거 ㅈㅇ말 좆같네

## HMR
Hot Modu 어쩌구 설정하는거. 자꾸 yarn build 해주는거 귀찮으면 하고 ([Git](https://github.com/webpack/webpack-dev-server))

먼저 설치해준다.
```sh
$ yarn add webpack-dev-server --dev
```

그다음 `/webpack.config.js`에서 설정해줘야한다.

```js
const path = require('path')
const webpack = require('webpack') // +

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: { // +
    contentBase: './dist',
    hot: true
  },
  plugins: [ // +
    new webpack.HotModuleReplacementPlugin()
  ],
  mode: 'development' // +
}
```

마지막으로 사용하기 쉽도록 `/package.json`에서 _scripts_ 설정해주자.

```json
{
  "scripts": {
    "build": "",
    "dev": "webpack-dev-server" # +
  }
}
```

이제 다음 명령으로 실행하면 된다.
```sh
$ yarn dev
$ npm run dev
```

[http://localhost:8080/](http://localhost:8080/)으로 들어가면 된ㄷ.

## 정리하자면

```sh
$ mkdir webpack-demo && cd webpack-demo
$ yarn init
$ yarn add webpack webpack-cli webpack-dev-server --dev
```

설치하고 다음을 생성

* /dist/index.html
* /src/index.js
* /webpack.config.js

각각 다음과 같다.

```html
<!-- dist/index.html -->

<!doctype html>
<html>
  <head>
    <title>Getting Started with WEBPACK</title>
  </head>
  <body>
    <script src="main.js"></script>
  </body>
</html>
```

```js
// webpack.config.js

const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: './src/index.js', // input path
  output: { // output info
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    contentBase: './dist',
    hot: true
  },
  optimization: { // 난독화
    minimize: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  mode: 'development'
}
```

```json
# package.json

{
  # ...

  "private": true, # +
  " main": "index.js", # -
  "scripts": {
    "build": "webpack", # +
    "dev": "webpack-dev-server"
  },

  # ...
}
```