const gulp = require('gulp');
const babel = require('gulp-babel');
const less = require('gulp-less');
const uglify = require('gulp-uglify');
const cleanCss = require('gulp-clean-css');
const rename = require('gulp-rename');

function scripts() {
	return gulp.src('src/js/js-year-calendar.js')
        .pipe(babel())
        .pipe(gulp.dest('dist'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
}

function styles() {
	return gulp.src('src/less/js-year-calendar.less')
        .pipe(less())
        .pipe(gulp.dest('dist'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(cleanCss())
        .pipe(gulp.dest('dist'));
}

gulp.task('build', gulp.series(scripts, styles));

gulp.task('watch', function () {
    gulp.watch('src/js/**/*.js', scripts);
    gulp.watch('src/less/**/*.less', styles);
});