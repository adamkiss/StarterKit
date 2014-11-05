#!/bin/sh

#
# List of dependencies
#
dependencies=(
  gulp
  gulp-plumber
  gulp-rename
  moment
  gulp-changed
  gulp-imagemin
  gulp-sass
  gulp-autoprefixer
  gulp-minify-css
  gulp-include
  gulp-uglify
  gulp-jshint
  jshint-stylish
  browser-sync
)

#
# Link them
#
for d in "${dependencies[@]}"
do
  echo ; echo \[$d\] ; npm link $d
done