#!/bin/bash
set -e

echo "🚀 初始化資料庫開始..."

docker exec -i pg psql -U root -d Sample < sample.sql

echo "✅ 初始化完成"