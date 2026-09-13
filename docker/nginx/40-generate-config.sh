#!/bin/sh
set -e
sed -e "s/__APP_USER__/$APP_USER/g" \
    -e "s/__APP_PASS__/$APP_PASS/g" \
    /usr/share/nginx/html/js/config.template.js > /usr/share/nginx/html/js/config.js
