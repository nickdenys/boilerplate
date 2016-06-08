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

// Define path & files.
var path        = {};
path.assets     = './assets/';
path.dist       = './dist/';
var files       = {};
files.sass      = path.assets + 'scss/**/*.scss';
files.js        = path.assets + 'scripts/**/*.js';
files.vndr      = path.assets + 'scripts/vendor/**/*.js';
files.imgs      = path.assets + 'images/*.{jpg,png,svg,gif}';
files.css       = path.dist + 'css/**/*.css';
files.cssMin    = path.dist + 'css/**/*.min.css';
files.jsDist    = path.dist + 'scripts/**/*.js';
files.jsDistMin = path.dist + 'scripts/**/*.min.js';

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
gulp.task('clean', function(cb) {
  rimraf(path.dist, cb);
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

// Compile .scss files. Provide callback for min:css
gulp.task('sass', function() {
  return gulp.src(files.sass)
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(autoprefixer({
      browsers: [
        'last 2 versions',
        'android 4',
        'opera 12'
      ]
    }))
    .pipe(gulp.dest(path.dist + 'css'))
    .pipe(livereload());
});

// Minify files.
gulp.task('min', ['min:css', 'min:js']);
// Minify compiled CSS files, ignore already minified files.
gulp.task('min:css', ['sass'], function() {
  return gulp.src([files.css, '!' + files.cssMin])
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(path.dist + 'css'));
});
// Minify our own JS files, ignore vendor files.
gulp.task('min:js', ['jshint', 'vendor:js'], function() {
  return gulp.src([files.jsDist, '!' + files.jsDistMin, '!' + files.vndr])
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(path.dist + 'scripts'));
});

// Run JSHint on custom files and move these to the dist folder.
gulp.task('jshint', function() {
  return gulp.src([files.js, '!' + files.vndr])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(gulp.dest(path.dist + 'scripts'))
    .pipe(livereload());
});
// Move the vendor files to the dist folder.
gulp.task('vendor:js', function() {
  return gulp.src(files.vndr)
    .pipe(gulp.dest(path.dist + 'scripts/vendor'));
});

// Run lossless compression on all the images.
gulp.task('images', function() {
  return gulp.src(files.imgs)
    .pipe(imagemin({
      progressive: true,
      interlaced: true,
      svgoPlugins: [{removeUnknownsAndDefaults: false}, {cleanupIDs: false}]
    }))
    .pipe(gulp.dest(path.dist + 'images'));
});
