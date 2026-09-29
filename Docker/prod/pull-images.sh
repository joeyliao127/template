#!/bin/bash
set -e

docker pull ghcr.io/joeyliao127/__PROJECT_NAME__/springboot:latest
docker pull ghcr.io/joeyliao127/__PROJECT_NAME__/nuxt:latest

echo "All images pulled successfully."
