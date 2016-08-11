var gulp = require('gulp');
var concat = require('gulp-concat');

var concatFileNameLocal = 'leaves_local.js'
var concatFileNameLocalDepartment = 'leaves_local_department.js'
var filesNamesLocal = [
    './Leaves_futur/send_result.js',
    './Common_file/day_diff.js',
    './Common_file/check_is_in.js',
    './Common_file/request.js',
    './Common_file/local.js',
    './Common_file/date.js',
    './Common_file/leaves.js'
];
var filesNamesLocalDepartment = [
    './Leaves_futur_department/send_result.js',
    './Common_file/day_diff.js',
    './Common_file/check_is_in.js',
    './Common_file/request.js',
    './Common_file/local.js',
    './Common_file/date.js',
    './Common_file/leaves.js'
];

gulp.task('build-local', function () {
    gulp.src(filesNamesLocal)
        .pipe(concat(concatFileNameLocal))
        .pipe(gulp.dest('./dist/'));
    gulp.src(filesNamesLocalDepartment)
        .pipe(concat(concatFileNameLocalDepartment))
        .pipe(gulp.dest('./dist/'));
});

var concatFileNameZapier = 'leaves_zapier.js'
var concatFileNameZapierDepartment = 'leaves_zapier_department.js'
var filesNamesZapier = [
    './Leaves_futur/send_result.js',
    './Common_file/day_diff.js',
    './Common_file/check_is_in.js',
    './Common_file/request.js',
    './Common_file/date.js',
    './Common_file/leaves.js'
];
var filesNamesZapierDepartment = [
    './Leaves_futur_department/send_result.js',
    './Common_file/day_diff.js',
    './Common_file/check_is_in.js',
    './Common_file/request.js',
    './Common_file/date.js',
    './Common_file/leaves.js'
];

gulp.task('build-zapier', function () {
    gulp.src(filesNamesZapier)
        .pipe(concat(concatFileNameZapier))
        .pipe(gulp.dest('./dist/'));
    gulp.src(filesNamesZapierDepartment)
        .pipe(concat(concatFileNameZapierDepartment))
        .pipe(gulp.dest('./dist/'));
});