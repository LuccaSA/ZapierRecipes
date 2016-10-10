var gulp = require('gulp');
var concat = require('gulp-concat');

var files = [
    './src/create.js',
    './src/send.js',
    './src/main.js'
]

gulp.task('dev', function() {
  return gulp.src(files)
    .pipe(concat('index.js'))
    .pipe(gulp.dest('./dist/'));
});