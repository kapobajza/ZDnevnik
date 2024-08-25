FROM caddy:2.8.4 AS base

RUN mkdir -p /etc/caddy/sites-available
RUN mkdir -p /etc/caddy/sites-enabled

COPY ./caddy/sites-available /etc/caddy/sites-available

RUN ln -s /etc/caddy/sites-available/* /etc/caddy/sites-enabled

FROM base AS local
COPY ./caddy/Caddyfile.local /etc/caddy/Caddyfile

FROM base AS prod
COPY ./caddy/Caddyfile.prod /etc/caddy/Caddyfile
