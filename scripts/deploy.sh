#!/bin/bash

sudo docker compose -f compose.yaml -f compose.prod.yaml -f ./server/compose.logging.yaml -f server/compose.secondary.yaml pull $1
sudo docker compose -f compose.yaml -f compose.prod.yaml -f ./server/compose.logging.yaml -f server/compose.secondary.yaml up $1 -d --scale $1=3
