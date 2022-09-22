const gulp   = require('gulp'),
      uglify = require('gulp-uglify-es').default,
      rename = require('gulp-rename');


gulp.task('uglify', () => {
  return gulp.src('common-utils.js')
    .pipe(uglify())
    .pipe(rename('common-utils.min.js'))
    .pipe(gulp.dest('dist'));
});


gulp.task('default',  gulp.series(['uglify']));