#!/bin/sh

# Calls sass2scss on all files in directory

for fsass in partials-sass/*.sass
do
  export fscss=`echo "$fsass" | sed -e "s/^partials-sass/partials/g" | sed -e "s/sass$/scss/g"`
  sass2scss -p -p -k < $fsass > $fscss
  echo "$fsass -> $fscss"
done