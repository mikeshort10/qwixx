const gulp = require("gulp");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const prettier = require("prettier");
const tailwindcss = require("tailwindcss");
const ts = require("gulp-typescript");
const tsConfig = require("./tsconfig.json");

console.log(tsConfig);

gulp.task("css", function() {
  const preprocessors = [autoprefixer, tailwindcss];
  return gulp
    .src("./public/css/*.css")
    .pipe(postcss(preprocessors))
    .pipe(gulp.dest("./public/css/build"));
});

gulp.task("watch", function() {
  gulp.watch("./public/css/*.css", gulp.series("css"));
  gulp.watch("./tailwind.config.js", gulp.series("css"));
});

const tsProject = ts.createProject("tsconfig.json", { target: "es3" });

gulp.task("tsc_server", function() {
  return gulp
    .src("./server/**/*.ts")
    .pipe(tsProject())
    .js.pipe(gulp.dest("./server/build"));
});

gulp.task("watch_server", function() {
  gulp.watch("./server/**/*.ts", gulp.series("tsc_server"));
});
