function eslint() {
  const { src } = require('gulp');
  const eslint = require('gulp-eslint');

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
  
  exports.default = eslint