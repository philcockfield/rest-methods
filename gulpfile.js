'use strict'
var gulp = require('gulp');
var gutil = require("gulp-util");
var eslint = require('gulp-eslint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var webpack = require('webpack');
var webpackConfig = require('./webpack.config.js');
//   browser: require('./webpack-browser.config.js'),
//   docs: require('./webpack-docs.config.js')
// };


function minify(file) {
  return gulp.src('./dist/' + file + '.js')
    .pipe(concat(file + '.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
};
gulp.task('minify', ['minify:browser', 'minify:docs']);
gulp.task('minify:browser', function () { return minify('browser'); });
gulp.task('minify:docs', function () { return minify('docs'); });

// ----------------------------------------------------------------------------

function bundle(config, callback) {
  webpack(config, function(err, stats) {
      if(err) throw new gutil.PluginError("webpack", err);
      gutil.log("[webpack]", stats.toString({}));
      callback();
  });
};
gulp.task('bundle', ['bundle:browser', 'bundle:docs']);
gulp.task('bundle:browser', function(callback) { bundle(webpackConfig.browser, callback); });
gulp.task('bundle:docs', function(callback) { bundle(webpackConfig.docs, callback); });

gulp.task('build', ['bundle', 'minify']);


// ----------------------------------------------------------------------------

gulp.task('lint', function() {
  return gulp.src('./src/**/*.js')
    .pipe(eslint())
    .pipe(eslint.format());
});
gulp.task('default', ['lint']);
