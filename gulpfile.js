"use strict"
var gulp = require("gulp");
var plumber = require("gulp-plumber");
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

gulp.task("copy-assets", function(){
  gulp.src(["./src/**/*.styl", "./src/**/*.ico"], { base: "./src" })
    .pipe(gulp.dest("./lib"));
});

// Tanspile the ES6 source to ES5 (lib).
gulp.task("babel", function() {
  return gulp.src(SOURCE_PATH)
             .pipe(plumber()) // Keep task alive on build errors.
             .pipe(babel({ stage: 1 }))
             .pipe(gulp.dest("lib"));
});


// ----------------------------------------------------------------------------


gulp.task("watch", function(callback) { gulp.watch("./src/**/*", ["build"]) });
gulp.task("watch-babel", function(callback) { gulp.watch("./src/**/*", ["babel"]) });
gulp.task("build", ["babel", "copy-assets", "webpack"]);
gulp.task("prepublish", ["babel", "copy-assets", "webpack:minified"]);


// ----------------------------------------------------------------------------


gulp.task("lint", function() {
  return gulp.src(SOURCE_PATH)
    .pipe(eslint())
    .pipe(eslint.format());
});
gulp.task("default", ["babel", "watch-babel"]);
