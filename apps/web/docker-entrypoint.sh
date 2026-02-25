#!/bin/sh
# Substitute only ${API_URL} so nginx's own $variables are left untouched
set -e
envsubst '${API_URL}' \
  < /etc/nginx/conf.d/nginx.conf.template \
  > /etc/nginx/conf.d/default.conf

exec nginx -g 'daemon off;'
