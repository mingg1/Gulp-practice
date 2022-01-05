import del from "del";
import gulp from "gulp";
import gpug from "gulp-pug";
import ws from "gulp-webserver";
import image from "gulp-image";
import autoPrefixer from "gulp-autoprefixer";
import miniCSS from 'gulp-csso';

const sass = require("gulp-sass")(require("node-sass"));

const routes = {
  pug: {
    watch: "src/**/*.pug",
    src: "src/*.pug",
    dest: "build",
  },
  img: {
    src: "src/img/*",
    dest: "build/img",
  },
  scss: {
    watch: "src/scss/**/*.scss",
    src: "src/scss/style.scss",
    dest: "build/css",
  },
};

const pug = () => {
  return gulp.src(routes.pug.src).pipe(gpug()).pipe(gulp.dest(routes.pug.dest));
};
const styles = () =>
  gulp
    .src(routes.scss.src)
    .pipe(sass().on("error", sass.logError)).pipe(autoPrefixer()).pipe(miniCSS())
    .pipe(gulp.dest(routes.scss.dest));

const img = () =>
  gulp.src(routes.img.src).pipe(image()).pipe(gulp.dest(routes.img.dest));

const clean = () => del(["build"]);

const webserver = () =>
  gulp.src("build").pipe(ws({ livereload: true, open: true }));

// tasks are when they are updated
const watch = () => {
  gulp.watch(routes.pug.watch, pug);
  gulp.watch(routes.img.src, img);
  gulp.watch(routes.scss.watch, styles);
};

const prepare = gulp.series([clean, img]);
const assets = gulp.series([pug, styles]);
const postDev = gulp.parallel([webserver, watch]);

export const dev = gulp.series([prepare, assets, postDev]);
