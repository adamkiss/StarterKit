#!/bin/sh

# sshfs
sshfs -C -o cache=no,ServerAliveInterval=60 TARGET ~/Mounts/endpoint
# -C compression (its good, right?)
# cache=no Don't cache
# ServerAliveInterval

# example for ProcessWire
rsync -azv --delete --delete-excluded --delete-after \
  # force include
  --include ".htaccess"
  # Enviroment files
  --exclude "site/assets/WireTempDir/*" \
  --exclude "site/assets/cache/*" \
  --filter "P site/assets/logs/*.txt" \
  --filter "P logs/*.html" \
  --exclude "site/assets/logs/*" \
  --exclude "site/assets/sessions/*" \
  # Various temp files
  --exclude ".sass-cache" \
  --exclude ".DS_Store" \
  # Various build/shell/tool file
  --exclude "Database-*.*" \
  --exclude ".gitignore" \
  --exclude ".git" \
  --exclude ".dpl" \
  --exclude "site/assets/src" \
  # Install/info files
  --exclude "README.md"
  . \
  ~/Mounts/endpoint \

filter:
  'P': protect