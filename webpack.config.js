'use strict';

const path = require('path');
const webpack = require('webpack');

 module.exports = {
  entry: './src/jsonfix.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'main.build.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
  ],
  stats: {
    colors: true
  },
  devtool: 'source-map'
 };
