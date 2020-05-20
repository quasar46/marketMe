"use strict";

var gulp = require("gulp");
var pug = require("gulp-pug");
var plumber = require("gulp-plumber");
var sourcemaps = require("gulp-sourcemaps");
var rename = require("gulp-rename");
var server = require("browser-sync").create();
var sass = require("gulp-sass");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var csso = require("gulp-csso");
var imagemin = require("gulp-imagemin");
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var del = require("del");
var htmlmin = require('gulp-htmlmin');
var uglify = require('gulp-uglify-es').default;

gulp.task("pug", function () {
    return gulp.src("src/pug/*.pug")
        .pipe(pug())
        .pipe(gulp.dest("build"));
})


gulp.task("css", function () {
    return gulp.src("src/scss/main.scss")
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(postcss([
            autoprefixer()
        ]))
        .pipe(csso())
        .pipe(rename("main.min.css"))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("build/css"));
});

gulp.task('vendor', function () {
    return gulp.src("src/scss/vendor/*.*")
        // .pipe(sourcemaps.init())
        // .pipe(csso())
        // .pipe(sourcemaps.write())
        .pipe(gulp.dest("build/css"))
});

gulp.task("html", function () {
    return gulp.src("src/*.html")
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(posthtml([
            include()
        ]))
        .pipe(gulp.dest("build"));
});

gulp.task("js", function () {
    return gulp.src("src/js/*.js")
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        // .pipe(rename("main.min.js"))
        .pipe(gulp.dest("build/js"));
});

gulp.task("images", function () {
    console.log(imagemin);
    return gulp.src("src/images/**/*.*")
        .pipe(imagemin([
            imagemin.gifsicle({
                interlaced: true
            }),
            imagemin.mozjpeg({
                quality: 75,
                progressive: true
            }),
            imagemin.optipng({
                optimizationLevel: 5
            }),
            imagemin.svgo({
                plugins: [{
                    removeViewBox: true
                },
                {
                    cleanupIDs: false
                }
                ]
            })
        ]))
        .pipe(gulp.dest("build/images"));
});

gulp.task("img", function () {
    console.log(imagemin);
    return gulp.src("src/img/*.*")
        .pipe(imagemin([
            imagemin.gifsicle({
                interlaced: true
            }),
            imagemin.mozjpeg({
                quality: 75,
                progressive: true
            }),
            imagemin.optipng({
                optimizationLevel: 5
            }),
            imagemin.svgo({
                plugins: [{
                    removeViewBox: true
                },
                {
                    cleanupIDs: false
                }
                ]
            })
        ]))
        .pipe(gulp.dest("build/img"));
});

gulp.task('fonts', function () {
    gulp.src("src/fonts/**/*.*")
        .pipe(gulp.dest("build/fonts")) //выгружаем в build
});

gulp.task("server", function () {
    server.init({
        server: "build/",
        notify: false,
        open: true,
        cors: true,
        ui: false
    });
    gulp.watch("src/scss/**/*.scss", gulp.series("css", "refresh"));
    gulp.watch("src/pug/**/*.pug", gulp.series("pug", "refresh"));
    gulp.watch("src/js/*.js", gulp.series("js", "refresh"));
    gulp.watch("src/images/**/*.*", gulp.series("images", "refresh"));
    gulp.watch("src/scss/vendor/*.*", gulp.series("vendor", "refresh"));
});

gulp.task("refresh", function (done) {
    server.reload();
    done();
});

gulp.task("copy", function () {
    return gulp.src([
        "src/fonts/**/*.{woff,woff2}",
        // "src/img/**",
        // "src/js/**",
        // "src/*.ico"
    ], {
        base: "src"
    })
        .pipe(gulp.dest("build"));
});

gulp.task("clean", function () {
    return del("build");
});

gulp.task("build", gulp.series("clean", "copy", "css", "images", "vendor", "pug", "js"));
gulp.task("start", gulp.series("build", "server"));