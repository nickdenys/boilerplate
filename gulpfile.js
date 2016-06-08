// Define plugins.
var gulp          = require("gulp");
var autoprefixer  = require("gulp-autoprefixer");
var concat        = require("gulp-concat");
var cssmin        = require("gulp-cssmin");
var jshint        = require("gulp-jshint");
var livereload    = require('gulp-livereload');
var rename        = require('gulp-rename');
var sass          = require("gulp-sass");
var uglify        = require("gulp-uglify");
var util          = require("gulp-util");
var watch         = require('gulp-watch');
var rimraf        = require('rimraf');

// Define paths & files.
var paths       = {};
paths.assets    = "./assets/";
paths.dist      = "./dist/";
paths.js        = paths.assets + "js/";
paths.sass      = paths.assets + "scss/";
paths.css       = paths.dist + "css/";
paths.distJs    = paths.dist + "js/";
paths.distJsVendor = paths.dist + "js/vendor/";
var files       = {};
files.css       = paths.dist + "css/**/*.css";
files.minCss    = paths.dist + "css/**/*.min.css";
files.minJs     = paths.dist + "js/**/*.min.js";
files.sass      = paths.assets + "scss/**/*.scss";
files.js        = paths.assets + "js/**/*.js";
files.jsVendor  = paths.assets + "js/vendor/**/*.js";
files.distJs    = paths.dist + "js/**/*.js";

// Default task when calling Gulp.
gulp.task('default', ['build:dev']);
// Build the application (Development).
gulp.task('build:dev', ['sass', 'min:js'], function() {
  console.log(util.colors.yellow.bgBlue.bold(' App built (Development). '));
});
// Build the application (Production).
gulp.task('build', ['clean', 'min'], function() {
   console.log(util.colors.yellow.bgRed.bold(' App built (Production). '));
});

// Deletes the build folder entirely.
gulp.task('clean', function(done) {
  rimraf(paths.dist, done);
});

// Watch and compile changed .scss files.
gulp.task('watch', function() {
  livereload.listen();
  gulp.watch(files.sass, ['sass'])
    .on('change', function(event){
      console.log(util.colors.red('File:') + ' ' + event.path + ' ' + util.colors.yellow(event.type));
    });
});

// Compile .scss files.
gulp.task('sass', function(done) {
  gulp.src(files.sass)
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(autoprefixer({
      browsers: [
        'last 2 versions',
        'android 4',
        'opera 12'
      ]
    }))
    .pipe(gulp.dest(paths.css))
    .pipe(livereload())
    .on('end', done);
});

// Concatinate files.
gulp.task("concat", ['concat:js']);
// Concatinate JS files.
gulp.task('concat:js', function(done) {
  gulp.src([files.js, "!" + files.jsVendor])
    .pipe(concat('all.js'))
    .pipe(gulp.dest(paths.js + "dist"))
    .on('end', done);
});

// Minify files.
gulp.task('min', ['min:css', 'min:js']);
// Minify compiled CSS files.
gulp.task('min:css', ['sass'], function() {
  gulp.src([files.css, "!" + files.minCss])
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(paths.css))
});
// Minify the concatinated JS file.
gulp.task('min:js', ['vendor:js'], function() {
  gulp.src([files.js, "!" + files.jsVendor])
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(paths.distJs))
});
gulp.task('vendor:js', function() {
  gulp.src(files.jsVendor)
    .pipe(gulp.dest(paths.distJsVendor))
});
