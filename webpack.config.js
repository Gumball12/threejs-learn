const path = require('path')
const webpack = require('webpack')
const ThreeWebpackPlugin = require('@wildpeaks/three-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    contentBase: './dist',
    hot: true
  },
  module: {
    rules: [{
      test: /\.(png|jpg|gif|svg)$/,
      use: {
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]',
          publicPath: './dist'
        }
      }
    }]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ThreeWebpackPlugin()
  ],
  mode: 'development'
}
