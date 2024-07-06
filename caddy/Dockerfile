FROM caddy:latest

RUN mkdir -p /etc/caddy/sites-available
RUN mkdir -p /etc/caddy/sites-enabled

COPY ./caddy/sites-available /etc/caddy/sites-available

RUN ln -s /etc/caddy/sites-available/* /etc/caddy/sites-enabled

ARG ENVIRONMENT=local
COPY ./caddy/Caddyfile.${ENVIRONMENT} /etc/caddy/Caddyfile
