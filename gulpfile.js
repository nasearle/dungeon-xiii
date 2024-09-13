const { series, parallel, src, dest } = require('gulp');
const del = require('del');
const uglify = require('gulp-uglify');
const htmlmin = require('gulp-htmlmin');
const cssmin = require('gulp-clean-css');
const zip = require('gulp-zip');

const paths = {
    root: '.',
    src: {
        base: 'dist',
        html: `dist/*.html`,
        css: `dist/*.css`,
        js: `dist/*.js`,
        img: `dist/*.png`
    },
    dist: {
        base: 'public',
        dir: `public`,
        all: `public/**/*`
    },
    zip: `public.zip`
};

const htmlOptions = { collapseWhitespace: true }

function cleanTask() {
    return del([paths.dist.dir, paths.zip]);
}

function buildJsTask() {
    return src(paths.src.js)
        // .pipe(uglify())
        .pipe(dest(paths.dist.dir));
}

function buildHtmlTask() {
    return src(paths.src.html)
        .pipe(htmlmin(htmlOptions))
        .pipe(dest(paths.dist.dir));
}

function buildCssTask() {
    return src(paths.src.css)
        .pipe(cssmin())
        .pipe(dest(paths.dist.dir));
}

function copyImages() {
    return src(paths.src.img)
        .pipe(dest(paths.dist.dir));
}

function zipTask() {
    return src(paths.dist.all)
        .pipe(zip(paths.zip))
        .pipe(dest(paths.root))
}

exports.build = series(
    cleanTask,
    parallel(buildJsTask, buildHtmlTask, buildCssTask, copyImages),
    zipTask
);
