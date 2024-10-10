#!/bin/bash

SCALE_ARGUMENT=""

if [ $1 == "api" ]; then
  SCALE_ARGUMENT="--scale $1=3"
fi

sudo docker compose -f compose.yaml -f compose.main.yaml -f compose.logging.yaml -f compose.main.logging.yaml pull $1
sudo docker compose -f compose.yaml -f compose.main.yaml -f compose.logging.yaml -f compose.main.logging.yaml up $1 -d $SCALE_ARGUMENT
