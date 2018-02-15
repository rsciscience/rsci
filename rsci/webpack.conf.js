'use strict'
const path = require('path');

const vueLoaderConfig = {
  cssSourceMap: true,
  transformToRequire: {
    video: 'src',
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  }
};
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

const workingPath = path.resolve(__dirname, '../experiments/');

module.exports = {
  context: workingPath,
  entry: () => './ui.vue',
  output: {
    path:'//',
    filename: 'packed.js'
  },
  resolve: {
    extensions: ['.vue', '.js'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src')
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      } 
  
    ]
  }
}
