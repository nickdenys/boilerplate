// Globals
var gulp          = require('gulp');
var autoprefixer  = require('gulp-autoprefixer');
var concat        = require('gulp-concat');
var cssmin        = require('gulp-cssmin');
var imagemin      = require('gulp-imagemin');
var jshint        = require('gulp-jshint');
var livereload    = require('gulp-livereload');
var rename        = require('gulp-rename');
var sass          = require('gulp-sass');
var uglify        = require('gulp-uglify');
var util          = require('gulp-util');
var watch         = require('gulp-watch');
var rimraf        = require('rimraf');

// Define paths & files.
var paths       = {};
paths.assets    = './assets/';
paths.dist      = './dist/';
paths.js        = paths.assets + 'js/';
paths.sass      = paths.assets + 'scss/';
paths.css       = paths.dist + 'css/';
paths.distJs    = paths.dist + 'js/';
paths.distJsVendor = paths.dist + 'js/vendor/';
var files       = {};
files.css       = paths.dist + 'css/**/*.css';
files.minCss    = paths.dist + 'css/**/*.min.css';
files.sass      = paths.assets + 'scss/**/*.scss';
files.js        = paths.assets + 'js/**/*.js';
files.jsVendor  = paths.assets + 'js/vendor/**/*.js';
files.distJs    = paths.dist + 'js/**/*.js';
files.images    = paths.assets + 'images/*.{jpg,png,svg,gif}';

// Default task when calling Gulp.
gulp.task('default', ['build:dev']);
// Build the application (Development).
gulp.task('build:dev', ['sass', 'jshint'], function() {
  console.log(util.colors.yellow.bgBlue.bold(' App built (Development). '));
});
// Build the application (Production).
gulp.task('build', ['clean', 'min', 'images'], function() {
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
    .on('change', function(event) { cb(event); });
  gulp.watch(files.js, ['jshint'])
    .on('change', function(event) { cb(event); });

  function cb(e) {
    console.log(util.colors.red('File:') + ' ' + e.path + ' ' + util.colors.yellow(e.type));
  }
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

// Minify files.
gulp.task('min', ['min:css', 'min:js']);
// Minify compiled CSS files.
gulp.task('min:css', ['sass'], function() {
  gulp.src([files.css, '!' + files.minCss])
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(paths.css))
});
// Minify the JS files.
gulp.task('min:js', ['jshint', 'vendor:js'], function() {
  gulp.src([files.js, '!' + files.jsVendor])
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(paths.distJs))
});
// Run JSHint and move the files to the dist folder.
gulp.task('jshint', function() {
  return gulp.src([files.js, '!' + files.jsVendor])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(gulp.dest(paths.distJs));
});
// Move the vendor files to the dist folder.
gulp.task('vendor:js', function() {
  gulp.src(files.jsVendor)
    .pipe(gulp.dest(paths.distJsVendor));
});

// Run lossless compression on all the images.
gulp.task('images', function() {
  return gulp.src(files.images)
    .pipe(imagemin({
      progressive: true,
      interlaced: true,
      svgoPlugins: [{removeUnknownsAndDefaults: false}, {cleanupIDs: false}]
    }))
    .pipe(gulp.dest(paths.dist + 'images'));
});
