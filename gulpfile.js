const gulp = require('gulp');
const babel = require('gulp-babel');
const less = require('gulp-less');

function scripts() {
	return gulp.src('src/js/js-year-calendar.js')
        .pipe(babel())
        .pipe(gulp.dest('dist'));
}

function styles() {
	return gulp.src('src/less/js-year-calendar.less')
        .pipe(less())
        .pipe(gulp.dest('dist'));
}

gulp.task('build', gulp.series(scripts, styles));

gulp.task('watch', function () {
    gulp.watch('src/js/**/*.js', scripts);
    gulp.watch('src/less/**/*.less', styles);
});