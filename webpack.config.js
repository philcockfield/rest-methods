var _ = require("lodash");
var webpack = require("webpack");
var fsPath = require("path");
const NODE_MODULES_PATH = fsPath.join(__dirname, "node_modules");
function modulePath(path) { return fsPath.join(NODE_MODULES_PATH, path); };



const SETTINGS = {
  resolveLoader: { fallback: NODE_MODULES_PATH },
  resolve: {
    fallback: NODE_MODULES_PATH,
    extensions: ["", ".js", ".jsx", "json"],
    alias: {
      "react": modulePath("react"),
      "lodash": modulePath("lodash")
    }
  },

  module: {
    loaders: [
      // ES6/JSX.
      { test: /\.js$/,  exclude: /(node_modules)/, loader: "babel-loader" },
      { test: /\.jsx$/, exclude: /(node_modules)/, loader: "babel-loader" },
      { test: /\.json$/, loader: "json-loader" },
    ]
  }
};


const BROWSER = {
  entry: "./src/client/browser-entry",
  output: {
    filename: "browser.js",
    path: "./.build"
  }
};


const DOCS = {
  entry: "./src/docs/browser-entry",
  output: {
    filename: "docs.js",
    path: "./.build"
  }
};


// ----------------------------------------------------------------------------


const getConfiguration = function(config, options) {
  options = options || {};
  config = _.merge(_.clone(SETTINGS), _.clone(config));
  if (options.minify) {
    config.plugins = [ new webpack.optimize.UglifyJsPlugin({ minimize: true }) ];
  }
  return config;
};


module.exports = {
  browser: function(options) { return getConfiguration(BROWSER, options) },
  docs: function(options) { return getConfiguration(DOCS, options) }
};
