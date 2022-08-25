const gulp   = require('gulp'),
      uglify = require('gulp-uglify-es').default,
      rename = require('gulp-rename');


gulp.task('uglify', () => {
  return gulp.src('date-utils.js')
    .pipe(uglify())
    .pipe(rename('date-utils.min.js'))
    .pipe(gulp.dest('dist'));
});


gulp.task('default',  gulp.series(['uglify']));