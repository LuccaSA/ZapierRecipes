var gulp = require('gulp');
var concat = require('gulp-concat');

var concatFileNameLocal = 'leaves_local.js'
var filesNamesLocal = [
    './day_diff.js',
    './check_is_in.js',
    './request.js',
    './local.js',
    './date.js',
    './leaves.js'
];

gulp.task('build-local', function () {
    return gulp.src(filesNamesLocal)
        .pipe(concat(concatFileNameLocal))
        .pipe(gulp.dest('./dist/'));
});

var concatFileNameZapier = 'leaves_zapier.js'
var filesNamesZapier = [
    './day_diff.js',
    './check_is_in.js',
    './request.js',
    './date.js',
    './leaves.js'
];

gulp.task('build-zapier', function () {
    return gulp.src(filesNamesZapier)
        .pipe(concat(concatFileNameZapier))
        .pipe(gulp.dest('./dist/'));
});