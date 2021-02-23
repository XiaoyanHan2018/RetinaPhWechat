const gulp = require("gulp");
const sass = require("gulp-sass");
const concat = require("gulp-concat");
const { series, parallel } = require("gulp");
const ts = require("gulp-typescript");
const tsProject = ts.createProject("tsconfig.json");
const minify = require("gulp-minify");

function clean(cb) {
    // body omitted
    cb();
}

function cssTranspile(cb) {
    return gulp.src(['src/css/*.scss'])
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('main.css'))
        .pipe(gulp.dest('dist/css'));
}

function cssMinify(cb) {
    return gulp.src(['dist/css/main.css'])
        .pipe(minify())
        .pipe(gulp.dest('dist/css'));
}

function tsTranspile(cb) {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(minify())
        .pipe(gulp.dest('dist'));
}

function componentTSTranspile(cb) {
    return gulp.src(['src/components/*.ts'])
        .pipe(tsProject())
        .pipe(concat('components.js'))
        .pipe(minify())
        .pipe(gulp.dest('dist/components'));
}

function jsMinify(cb) {
    cb();
}

exports.default = series(
    clean,
    parallel(
        cssTranspile,
        series(tsTranspile, componentTSTranspile)
    ),
    parallel(cssMinify, jsMinify)
);