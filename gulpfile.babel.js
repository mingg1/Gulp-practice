import del from "del";
import gulp from "gulp";
import gpug from "gulp-pug";
import ws from "gulp-webserver";
import image from "gulp-image";
import autoPrefixer from "gulp-autoprefixer";
import miniCSS from "gulp-csso";
import bro from "gulp-bro";
import babelify from "babelify";
import ghPages from "gulp-gh-pages";

// gulp sass compiler
const sass = require("gulp-sass")(require("node-sass"));

// routes for tasks
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
  js: {
    watch: "src/js/**/*.js",
    src: "src/js/main.js",
    dest: "build/js",
  },
};

// pug task to convert pug files into html format
const pug = () => {
  return gulp.src(routes.pug.src).pipe(gpug()).pipe(gulp.dest(routes.pug.dest));
};

// convert scss file into css format
const styles = () =>
  gulp
    .src(routes.scss.src)
    .pipe(sass().on("error", sass.logError))
    .pipe(autoPrefixer())
    .pipe(miniCSS())
    .pipe(gulp.dest(routes.scss.dest));

// image optimization task
const img = () =>
  gulp.src(routes.img.src).pipe(image()).pipe(gulp.dest(routes.img.dest));

// delete files in build and .publish folder before running tasks
const clean = () => del(["build", ".publish"]);

// task to open web server, enabled live reloading
const webserver = () =>
  gulp.src("build").pipe(ws({ livereload: true, open: true }));

// babel support task
const js = () =>
  gulp
    .src(routes.js.src)
    .pipe(
      bro({
        transform: [
          babelify.configure({ presets: ["@babel/preset-env"] }),
          ["uglifyify", { global: true }],
        ],
      })
    )
    .pipe(gulp.dest(routes.js.dest));

// task to deploy every files in build folder to Github pages
const ghDeploy = () => gulp.src("build/**/*").pipe(ghPages());

// tasks are executed every time when the files in specific updated
const watch = () => {
  gulp.watch(routes.pug.watch, pug);
  gulp.watch(routes.img.src, img);
  gulp.watch(routes.scss.watch, styles);
  gulp.watch(routes.js.watch, js);
};

// series of tasks for build preparation
const prepare = gulp.series([clean, img]);
// series of tasks for handling asset files
const assets = gulp.series([pug, styles, js]);
// series of tasks for live web server
const live = gulp.parallel([webserver, watch]);

export const build = gulp.series([prepare, assets]);
export const dev = gulp.series([build, live]);
export const deploy = gulp.series([build, ghDeploy, clean]);
