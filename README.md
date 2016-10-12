# Boilerplate

This is a personal boilerplate intended for internal projects.

## Gulp

All code is run through [Gulp](http://gulpjs.com/) for an automated workflow.
Options:
* `gulp` : runs the `gulp build:dev` task
* `gulp build` : builds and compiles your Sass and JavaScript files **for Production**
* `gulp build:dev` : builds and compiles your Sass and JavaScript files **for Development**
* `gulp watch` : watches your Sass and JavaScript files for any changes and compiles them automatically

## LiveReload

When watching files with Gulp, new code will automatically be injected to your browser via the [LiveReload](http://livereload.com/) browser [extension](http://livereload.com/extensions/).

## Sass

The Sass structure is based on the [sass-boilerplate](https://github.com/HugoGiraudel/sass-boilerplate) by Hugo Giraudel. It uses the [7-1 architecture pattern](http://sass-guidelin.es/#architecture) and sticks to [Sass Guidelines](http://sass-guidelin.es) writing conventions.

### Grid
The grid is a custom adaptation of the flexbox-based grid by [Pintsize](http://pintsize.io/).

### Autoprefixer
All newer CSS that still need prefixes are generated automatically by [autoprefixer](https://www.npmjs.com/package/gulp-autoprefixer) through Gulp.

## JavaScript

Every JavaScript file is checked through a linter and minified. New files will be created in the `dist/scripts` folder.

## Images

Any images contained in the `assets/images` folder will be run through a lossless compression for optimal file size.

