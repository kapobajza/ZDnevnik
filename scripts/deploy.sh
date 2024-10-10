#!/bin/bash

sudo docker compose -f compose.yaml -f compose.main.yaml -f compose.logging.yaml -f compose.main.logging.yaml pull $1
sudo docker compose -f compose.yaml -f compose.main.yaml -f compose.logging.yaml -f compose.main.logging.yaml up $1 -d --scale $1=3
