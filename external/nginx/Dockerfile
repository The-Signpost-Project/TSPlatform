FROM nginx:stable-alpine3.20-perl

ARG cfg_file

COPY nginx.conf /etc/nginx/nginx.conf
COPY ${cfg_file} /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]