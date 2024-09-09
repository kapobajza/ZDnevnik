#!/bin/bash

sudo docker compose -f compose.yaml -f compose.prod.yaml -f ./server/compose.logging.yaml -f server/compose.secondary.yaml pull $1
sudo docker stack deploy -c compose.yaml -c compose.prod.yaml -c ./server/compose.logging.yaml -c server/compose.secondary.yaml $1
