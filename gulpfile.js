const gulp = require("gulp");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const prettier = require("prettier");
const tailwindcss = require("tailwindcss");

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
