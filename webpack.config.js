var _ = require('lodash');
var webpack = require('webpack');
var fsPath = require('path');
const NODE_MODULES_PATH = fsPath.join(__dirname, 'node_modules');


const settings = {
  resolveLoader: { fallback: NODE_MODULES_PATH },
  module: {
    loaders: [
      // ES6/JSX.
      { test: /\.js$/,  exclude: /(node_modules)/, loader: 'babel-loader' },
    ]
  }
};


const browser = _.merge(_.clone(settings), {
  entry: './src/client/browser-entry',
  output: {
    filename: 'browser.js',
    path: './dist'
  },
});


const docs = _.merge(_.clone(settings), {
  entry: './src/docs/browser-entry',
  output: {
    filename: 'docs.js',
    path: './dist'
  }
});


module.exports = {
  browser: browser,
  docs: docs
};
