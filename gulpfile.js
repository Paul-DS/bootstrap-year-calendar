const gulp = require('gulp');
const ts = require('gulp-typescript');
const babel = require('gulp-babel');
const less = require('gulp-less');
const uglify = require('gulp-uglify');
const cleanCss = require('gulp-clean-css');
const rename = require('gulp-rename');

const compileTS = function() {
    const tsProject = ts.createProject('tsconfig.json');
    // Use to generate the definition type
    return gulp.src('src/ts/**/*.ts')
        .pipe(tsProject())
        .dts
        .pipe(gulp.dest('dist'));
}

const exportJS = function() {
    return gulp.src('src/ts/js-year-calendar.ts')
        .pipe(babel())
        .pipe(gulp.dest('dist'));
}

const minifyJS = function() {
    return gulp.src('dist/js-year-calendar.js')
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
}

const scripts = gulp.series(compileTS, exportJS, minifyJS);

const styles = function() {
    return gulp.src('src/less/js-year-calendar.less')
        .pipe(less())
        .pipe(gulp.dest('dist'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(cleanCss())
        .pipe(gulp.dest('dist'));
}

gulp.task('build', gulp.series(scripts, styles));

gulp.task('watch', function () {
    gulp.watch('src/ts/**/*.ts', scripts);
    gulp.watch('src/less/**/*.less', styles);
});