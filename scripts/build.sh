#!/bin/bash

SERVICE_NAME=$1

docker build -t ghcr.io/kapobajza/$SERVICE_NAME:prod --platform linux/amd64 -f ./apps/api/Dockerfile .
docker push ghcr.io/kapobajza/$SERVICE_NAME:prod