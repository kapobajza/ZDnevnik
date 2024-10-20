#!/bin/sh

REVERSE_PROXY_IP=$(getent hosts reverse_proxy | awk '{ print $1 }')

echo "$REVERSE_PROXY_IP api.zdnevnik.local" >> /etc/hosts

# Execute the original command
exec "$@"