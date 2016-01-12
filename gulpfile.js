'use strict';
// Define plugins.
var gulp  = require("gulp"),
  gutil   = require("gulp-util"),
  concat  = require("gulp-concat"),
  cssmin  = require("gulp-cssmin"),
  uglify  = require("gulp-uglify"),
  sass    = require("gulp-sass"),
  rename  = require('gulp-rename'),
  watch   = require('gulp-watch'),
  livereload = require('gulp-livereload'),
  rimraf  = require('rimraf');

// Define paths & files.
var paths = {};
paths.assets = "./assets/";
paths.js = paths.assets + "js/";
paths.css = paths.assets + "css/";
paths.sass = paths.assets + "scss/";
var files = {};
files.css = paths.assets + "css/**/*.css";
files.minCss = paths.assets + "css/**/*.min.css";
files.minJs = paths.assets + "js/**/*.min.js";
files.sass = paths.assets + "scss/*.scss";
files.js = paths.assets + "js/**/*.js";
files.jsVendor = paths.assets + "js/vendor/**/*.js";




// Default task when calling Gulp.
gulp.task('default', ['build:dev']);

  // Build the application (Development).
  gulp.task('build:dev', ['compile', 'watch'], function() {
    console.log(gutil.colors.yellow.bgBlue.bold(' App built (Development). '));
  });

  // Build the application (Production).
  gulp.task('build', ['min'], function() {
     console.log(gutil.colors.yellow.bgRed.bold(' App built (Production). '));
  });




// Watch and compile changed .scss files.
gulp.task('watch', function() {
  livereload.listen();
  gulp.watch(paths.sass + "**/*.scss", ['sass'])
    .on('change', function(event){
      console.log('Event Type: ' + event.type);
      console.log('Event Type: ' + event.path);
    });
});




// Compile everything.
gulp.task('compile', ["sass"]);

  // Compile .scss files.
  gulp.task('sass', function(done) {
    gulp.src(files.sass)
      .pipe(sass())
      .on('error', sass.logError)
      .pipe(gulp.dest(paths.css))
      .pipe(livereload())
      .on('end', done);
  });

// Concatinate files.
gulp.task("concat", ["concat:js"]);

  // Clean js/dist folder.
  gulp.task('clean:js', function(done) {
    rimraf(paths.js + "dist", done)
  });
  // Concatinate JS files.
  gulp.task('concat:js', ['clean:js'], function(done) {
    gulp.src([files.js, "!" + files.jsVendor])
      .pipe(concat('all.js'))
      .pipe(gulp.dest(paths.js + "dist"))
      .on('end', done);
  });

// Minify files.
gulp.task("min", ["min:css", "min:js"]);

  // Minify compiled CSS files.
  gulp.task("min:css", ['sass'], function() {
      gulp.src([files.css, "!" + files.minCss])
          .pipe(cssmin())
          .pipe(rename({suffix: '.min'}))
          .pipe(gulp.dest(paths.css))
  });

  // Minify the concatinated JS file.
  gulp.task("min:js", ['concat:js'], function() {
      gulp.src([paths.js + "dist/*.js", "!" + files.minJs])
          .pipe(uglify())
          .pipe(rename({suffix: '.min'}))
          .pipe(gulp.dest(paths.js + "dist"))
  });
