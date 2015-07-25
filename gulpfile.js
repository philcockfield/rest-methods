"use strict"
var gulp = require("gulp");
var gulpUtil = require("gulp-util");
var babel = require("gulp-babel");
var eslint = require("gulp-eslint");
var webpack = require("webpack");
var webpackConfig = require("./webpack.config.js");
var SOURCE_PATH = ["./src/**/*.js", "./src/**/*.jsx"];


// ----------------------------------------------------------------------------

// Bundle the code that is sent to the browser.
function bundle(config, callback) {
  return webpack(config, function(err, stats) {
      if(err) throw new gulpUtil.PluginError("webpack", err);
      gulpUtil.log("[webpack]", stats.toString({}));
  });
};
gulp.task("webpack", function() {
  bundle(webpackConfig.browser());
  bundle(webpackConfig.docs());
});
gulp.task("webpack:minified", function() {
  bundle(webpackConfig.browser({ minify:true }));
  bundle(webpackConfig.docs({ minify:true }));
});

gulp.task("copy-css", function(){
  gulp.src('./src/**/*.styl', { base: './src' })
    .pipe(gulp.dest('./lib'));
});

// Tanspile the ES6 source to ES5.
gulp.task("transpile-source", function() {
  return gulp.src(SOURCE_PATH)
    .pipe(babel())
    .pipe(gulp.dest("lib"));
});


// ----------------------------------------------------------------------------


gulp.task("watch", function(callback) { gulp.watch("./src/**/*", ["build"]) });
gulp.task("build", ["transpile-source", "copy-css", "webpack"]);
gulp.task("prepublish", ["transpile-source", "copy-css", "webpack:minified"]);


// ----------------------------------------------------------------------------


gulp.task("lint", function() {
  return gulp.src(SOURCE_PATH)
    .pipe(eslint())
    .pipe(eslint.format());
});
gulp.task("default", ["build", "watch"]);
