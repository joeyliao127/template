#!/bin/bash
set -e
cd "$(dirname "$0")"

# 載入 .env 取得 PROJECT_NAME / POSTGRES_* 等
if [ ! -f .env ]; then
    echo "❌ 找不到 .env，請先 cp .template.env .env 並填好設定"
    exit 1
fi
set -a; . ./.env; set +a

echo "🐳 啟動基礎服務（PostgreSQL、Redis）..."
docker-compose -f docker-compose-services.yaml up -d

# 等 PG 對外就緒。首次啟動時 PG 會先跑 /docker-entrypoint-initdb.d 的
# schema.sql / data.sql，初始化完成後才開放 TCP；用 127.0.0.1 強制走 TCP
# 確保「TCP 通」=「schema/data 已匯入」，避免 springboot 比 DB 先連上而失敗。
echo "⏳ 等待 PostgreSQL 就緒（首次會自動匯入 schema.sql / data.sql）..."
tries=0
until docker exec "${PROJECT_NAME}_pg" pg_isready -h 127.0.0.1 -p "${POSTGRES_PORT}" -U "${POSTGRES_USER}" >/dev/null 2>&1; do
    tries=$((tries + 1))
    if [ "$tries" -ge 60 ]; then
        echo "❌ 等待 PostgreSQL 逾時，請檢查 docker logs ${PROJECT_NAME}_pg"
        exit 1
    fi
    sleep 1
done
echo "✅ PostgreSQL 就緒"

echo "🐳 啟動應用（Spring Boot、Nuxt、Nginx）..."
# 加 --build 確保 image 永遠對應當前原始碼（避免沿用舊 image 導致找不到 jar）。
# 未改動時有 layer cache，幾乎瞬間完成。
docker-compose -f docker-compose-app.yaml up -d --build
echo "✅ 全部啟動完成"
