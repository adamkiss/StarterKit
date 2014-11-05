"use strict";

// Require modules & config
var gulp = require('gulp'),
    // utils
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename'),
    fs = require('fs'),
    moment = require('moment'),
    // images
    changed = require('gulp-changed'),
    imagemin = require('gulp-imagemin'),
    // styles
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minify_css = require('gulp-minify-css'),
    // scripts
    include = require('gulp-include'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    jshint_stylish = require('jshint-stylish'),
    // browser sync
    browser_sync = require('browser-sync'),
    reload = browser_sync.reload,

    // config: version file, paths, jshint
    cfg = {
      project: {
        assets_build_output : '../../site/snippets/header.php',
        browser_sync_proxy : 'local.dev',
        autoprefixer: ['last 2 versions', 'ie 8', 'ios 7', 'android 4'],
        jshint: {
          "node": true, "esnext": true, "bitwise": true, "curly": true,
          "immed": true, "newcap": true, "noarg": true, "undef": true, "unused": "vars"
        },
        imagemin: { progressive: true }
      },
      dist: {
        root :   '../dist',
        images : '../dist/images',
        fonts :  '../dist/fonts'
      },
      src: {
        images: 'images/**/*.?(jpg|jpeg|png|gif|svg)',
        styles: 'styles/*.?(scss|css)',
        scripts: ['scripts/*.js', '!scripts/_*.js'], // exclude _*.js files
        scripts_vendor: 'scripts/vendor/*.js', // minified 'copy only' vendor files
        fonts: 'styles/fonts/*.*'
      },
      watch: {
        images: 'images/**/*.?(jpg|jpeg|png|gif|svg)',
        styles: 'styles/**/*.?(scss|css)',
        scripts: 'scripts/**/*.js',
        content: ['../../content/**/*.*', '../../site/**/*.*']
      }
    };

// browser sync start
gulp.task('bs:start', function () {
  browser_sync({ proxy: cfg.project.browser_sync_proxy });
});

//browser sync reload
gulp.task('bs:reload', function () {
  browser_sync.reload();
});

// fonts (copy src => dist)
gulp.task('utils:fonts', function () {
  return gulp.src( cfg.src.fonts )
    .pipe( changed( cfg.dist.fonts ))
    .pipe( gulp.dest( cfg.dist.fonts ));
});

// write assets build version to site
gulp.task('utils:build:version', function () {
  var build_info = "$asset_build_version = '" + moment().format('YYYYMMDD-HHmm') + "';";

  fs.readFile( cfg.project.assets_build_output, 'utf8', function (e, file) {
    if (e) { return console.log(e); }
    var updated_file = file.replace(/\$asset_build_version = \'[0-9-]*?\';/g, build_info);
    fs.writeFile( cfg.project.assets_build_output, updated_file, function (e) {
      if (e) { return console.log(e); }
    });
    console.log('Version was written to file: ' + cfg.project.assets_build_output);
  });
});

// styles (sass) compiling
gulp.task('styles', function () {
  return gulp.src( cfg.src.styles )
    .pipe( plumber() )
      .pipe( sass({
        sourceComments: 'none',
        errLogToConsole: true
      }) )
      .pipe( autoprefixer( cfg.project.autoprefixer ))
    .pipe( rename({ suffix: '.min' }))
      .pipe( minify_css() )
    .pipe( gulp.dest( cfg.dist.root ))
});

// scripts compiling
gulp.task('scripts', function () {
  return gulp.src( cfg.src.scripts )
    .pipe( plumber() )
      .pipe( include() )
      .pipe( jshint( cfg.project.jshint ))
      .pipe( jshint.reporter( 'jshint-stylish' ) )
    .pipe( rename({ suffix:'.min' }) )
      .pipe( uglify() )
    .pipe( gulp.dest( cfg.dist.root ));
});

// images optimizing
gulp.task('images', function () {
  return gulp.src( cfg.src.images )
    .pipe( plumber() )
    .pipe( changed( cfg.dist.images ))
      .pipe( imagemin( cfg.project.imagemin ))
    .pipe( gulp.dest( cfg.dist.images ));
});

// watch the files
gulp.task('watch', function () {
  gulp.watch(cfg.watch.styles,  ['styles' , browser_sync.reload]);
  gulp.watch(cfg.watch.scripts, ['scripts', browser_sync.reload]);
  gulp.watch(cfg.watch.images,  ['images' , browser_sync.reload]);
  gulp.watch(cfg.watch.content, ['bs:reload']);
});

//groups
gulp.task('all', [ 'styles', 'utils:fonts', 'scripts', 'images' ])
gulp.task('build', [ 'all', 'utils:build:version' ]);
gulp.task('serve', [ 'all', 'bs:start', 'watch' ])

//default
gulp.task('default', ['serve']);
