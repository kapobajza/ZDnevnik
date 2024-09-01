#!/bin/sh
set -e

echo "Starting Promtail..."
echo "LOKI_URL: $LOKI_URL"

# Replace the Loki URL if LOKI_URL is set
if [ -n "$LOKI_URL" ]; then
    sed "s|__LOKI_URL__|$LOKI_URL|g" /etc/promtail/config.yml > /tmp/promtail-config.yml
    CONFIG_FILE="/tmp/promtail-config.yml"
else
    CONFIG_FILE="/etc/promtail/config.yml"
fi

# Start Promtail
exec /usr/bin/promtail -config.file="$CONFIG_FILE"