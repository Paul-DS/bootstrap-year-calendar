const gulp = require('gulp');
const babel = require('gulp-babel');
const watch = require('gulp-watch');

// task
gulp.task('build', function () {
	return gulp.src('js/js-year-calendar.js')
        .pipe(babel())
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', function () {
    return watch('js/**/*.js', function () {
        return gulp.src('js/js-year-calendar.js')
            .pipe(babel())
            .pipe(gulp.dest('dist'));
    });
});