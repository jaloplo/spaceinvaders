const { dest, src, series } = require('gulp');

const concat = require('gulp-concat');
const eslint = require('gulp-eslint');
const del = require('del');
const uglyfly = require('gulp-uglyfly')

function lint() {
  return src(['src/*.js'])
    .pipe(eslint({
      allowInlineConfig: false,
      fix: true,
      rules: {
        camelcase: 1
      }
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
}

function cleanTmp() {
  return del(['./tmp']);
}

function cleanDist() {
  return del(['./dist']);
}

function compress() {
  return src(['./src/*.js'])
    .pipe(uglyfly())
    .pipe(dest('./tmp/'));
}

function concatTask() {
  return src(['./tmp/*.js'])
    .pipe(concat('spaceinvaders.js'))
    .pipe(dest('./dist/'));
}
  
  exports.default = series(cleanTmp, cleanDist, lint, compress, concatTask, cleanTmp);
  exports.clean = series(cleanTmp, cleanDist);