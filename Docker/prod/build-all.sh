#!/bin/bash
set -e
cd "$(dirname "$0")/../.."

docker buildx build --platform linux/amd64 \
  -f BE/Dockerfile.prod \
  -t ghcr.io/joeyliao127/__PROJECT_NAME__/springboot:latest \
  --push \
  ./BE

docker buildx build --platform linux/amd64 \
  -f FE/Dockerfile.prod \
  -t ghcr.io/joeyliao127/__PROJECT_NAME__/nuxt:latest \
  --push \
  ./FE
