'use strict'
var gulp = require('gulp');
var eslint = require('gulp-eslint');
var concat = require('gulp-concat');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');


gulp.task('build', function () {
  return gulp.src('./src/client/**/*.js')
    .pipe(babel())
    .pipe(concat('client.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});


gulp.task('lint', function() {
  return gulp.src('./src/**/*.js')
    .pipe(eslint())
    .pipe(eslint.format());
});


// ----------------------------------------------------------------------------
gulp.task('default', ['build']);
