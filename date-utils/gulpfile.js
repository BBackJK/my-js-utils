const gulp   = require('gulp'),
      uglify = require('gulp-uglify-es').default;


gulp.task('uglify', () => {
  return gulp.src('date-utils.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});


gulp.task('default',  gulp.series(['uglify']));