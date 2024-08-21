#!/bin/sh

CADDY_IP=$(getent hosts caddy | awk '{ print $1 }')

echo "$CADDY_IP api.zdnevnik.local" >> /etc/hosts

# Execute the original command
exec "$@"