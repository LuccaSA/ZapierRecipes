var gulp = require('gulp');
var concat = require('gulp-concat');

// Liste des sources
var srcs = [
  'src/getAbsentOnLuccaFormDate.js',
  'src/answerToSlackUser.js',
  'src/index.js'
];

// Permet de concaténer les différents fichiers *.js
gulp.task('dev', function() {
  return gulp.src(srcs)
    .pipe(concat('build.js'))
    .pipe(gulp.dest('./dist/'))
});
