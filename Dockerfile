FROM nginx:alpine

COPY docker/nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --chmod=755 docker/nginx/40-generate-config.sh /docker-entrypoint.d/40-generate-config.sh
COPY index.html manifest.json /usr/share/nginx/html/
COPY css /usr/share/nginx/html/css
COPY js/ui.js js/mqtt.js js/config.template.js /usr/share/nginx/html/js/
COPY img /usr/share/nginx/html/img
