'use strict'
var gulp = require('gulp');
var eslint = require('gulp-eslint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');


gulp.task('minify', function () {
  return gulp.src('./dist/browser.js')
    .pipe(concat('browser.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});


gulp.task('lint', function() {
  return gulp.src('./src/**/*.js')
    .pipe(eslint())
    .pipe(eslint.format());
});


// ----------------------------------------------------------------------------
gulp.task('default', ['lint']);
