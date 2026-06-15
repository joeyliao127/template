#!/bin/bash
cd "$(dirname "$0")/../../.."

docker buildx build --platform linux/amd64 \
  -f FE/Dockerfile.prod \
  -t ghcr.io/joeyliao127/yanduoerp/nuxt:latest \
  --push \
  ./FE
