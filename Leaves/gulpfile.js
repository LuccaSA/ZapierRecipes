var gulp = require('gulp');
var concat = require('gulp-concat');

var concatFileName = 'leaves.js'
var filesNames = [
    './leaves.js',
    './request.js',
    './date.js'
];

gulp.task('build', function() {
  return gulp.src(filesNames)
    .pipe(concat(concatFileName))
    .pipe(gulp.dest('./dist/'));
});