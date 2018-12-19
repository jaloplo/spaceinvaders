const { dest, src, series } = require('gulp');
const eslint = require('gulp-eslint');
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

function compress() {
  return src(['src/*.js'])
    .pipe(uglyfly())
    .pipe(dest('dist'));
}
  
  exports.default = series(lint, compress);