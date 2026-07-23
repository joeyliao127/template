# Cold Boot Record

首次部署實際遇到的問題與解法，供下次參考。

## VM 架構

| VM | IP | 服務 |
|---|---|---|
| PostgreSQL | 192.168.0.202 | postgres:16 |
| Redis | 192.168.0.204 | redis:7 |
| App | 192.168.0.206 | nuxt / springboot |

---

## 測試各基礎服務是否正常

### PostgreSQL（從 Mac 測試，不需安裝 psql）

```bash
docker run --rm -it postgres:16 psql \
  -h 192.168.0.202 -p 5432 -U <user> -d __PROJECT_NAME__
```

看到 `__PROJECT_NAME__=#` 即成功。

> PostgreSQL 用 Docker 跑時預設會監聽所有 IP，port 透過 `ports` 對外暴露，不需額外設定。

### Redis

```bash
docker run --rm -it redis:7 redis-cli \
  -h 192.168.0.204 -p 6379 -a <password> ping
```

回傳 `PONG` 即成功。

---

## 遇到的問題

### 1. Redis container 持續重啟

**症狀：** `docker ps` 顯示 `Restarting (1)`，container 無法維持運作。

**原因：** `docker-compose-redis.yaml` 的 command 為：
```yaml
command: redis-server --requirepass ${REDIS_PASSWORD}
```
`REDIS_PASSWORD` 為空字串時，Redis 不接受空密碼，啟動失敗。

**解法：** `.env.prod` 中務必填入 `REDIS_PASSWORD`，不可留空。

---

### 2. Nuxt Redis 連線設定錯誤

**症狀：** Production 環境 Nuxt 無法連到 Redis VM。

**原因：** `nuxt.config.ts` 的 Redis host 寫死為容器名稱 `"redis"`，且未帶入密碼：
```ts
storage: {
    redis: {
        driver: "redis",
        host: "redis",   // 寫死，production 無效
        port: redisPort,
        // 沒有 password
    }
}
```

**解法：** 改為讀取環境變數：
```ts
storage: {
    redis: {
        driver: "redis",
        host: redisHost,      // process.env.REDIS_HOST || "redis"
        port: redisPort,
        db: redisDb,
        username: redisUsername,
        password: redisPassword,
    }
}
```

本地 dev 環境 `REDIS_HOST` 未設定時 fallback 為 `"redis"`（容器名稱），行為不變。

---

## 啟動順序

1. **基礎服務 VM 先啟動**（PG → Redis）
2. **App VM 後啟動**（SpringBoot → Nuxt）

App 服務依賴基礎服務，順序錯誤會導致啟動失敗或連線錯誤。
