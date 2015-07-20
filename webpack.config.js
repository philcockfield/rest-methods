var _ = require('lodash');
var webpack = require('webpack');
var fsPath = require('path');
const NODE_MODULES_PATH = fsPath.join(__dirname, 'node_modules');
function modulePath(path) { return fsPath.join(NODE_MODULES_PATH, path); };


const settings = {
  resolveLoader: { fallback: NODE_MODULES_PATH },
  resolve: {
    fallback: NODE_MODULES_PATH,
    extensions: ['', '.js', '.jsx'],
  },

  alias: {
    'react': modulePath('react'),
    'lodash': modulePath('lodash')
  },

  module: {
    loaders: [
      // ES6/JSX.
      { test: /\.js$/,  exclude: /(node_modules)/, loader: 'babel-loader' },
      { test: /\.jsx$/, exclude: /(node_modules)/, loader: 'babel-loader' }
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
