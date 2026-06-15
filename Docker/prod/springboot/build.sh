#!/bin/bash
cd "$(dirname "$0")/../../.."

docker buildx build --platform linux/amd64 \
    --no-cache \
    --progress=plain \
    -f BE/Dockerfile.prod \
    -t ghcr.io/joeyliao127/yanduoerp/springboot:latest \
    --push \
    ./BE
