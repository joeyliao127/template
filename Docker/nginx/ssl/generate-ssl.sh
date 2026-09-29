#!/bin/bash
set -e

# 定義憑證路徑與名稱
DOMAIN="__PROJECT_NAME__.local.com"
SSL_DIR="$(cd "$(dirname "$0")" && pwd)"
KEY_FILE="$SSL_DIR/$DOMAIN-key.pem"
CERT_FILE="$SSL_DIR/$DOMAIN.pem"

if ! command -v mkcert >/dev/null 2>&1; then
  echo "❌ 找不到 mkcert，請先安裝（macOS: brew install mkcert nss）並執行 mkcert -install 後再試。"
  exit 1
fi

echo "正在生成 $DOMAIN 的自簽章 SSL 憑證..."

# 明確指定輸出路徑，避免 mkcert 寫到當前工作目錄而非 SSL_DIR
mkcert -cert-file "$CERT_FILE" -key-file "$KEY_FILE" "$DOMAIN"

echo "--------------------------------------------------"
echo "成功！憑證已生成於："
echo "Key:  $KEY_FILE"
echo "Cert: $CERT_FILE"
echo "--------------------------------------------------"
echo "請確保您的 /etc/hosts 檔案中包含以下內容："
echo "127.0.0.1 $DOMAIN"
