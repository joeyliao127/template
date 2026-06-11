#!/bin/bash
set -e

echo "🚀 初始化資料庫開始..."

docker exec -i __PROJECT_NAME___pg psql -U root -d __PROJECT_NAME__ < schema.sql

echo "✅ 初始化完成"
