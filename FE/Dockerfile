FROM node:24-slim

WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate

# container 啟動後再執行，避免 volume 尚未掛載就執行 pnpm install
CMD ["sh", "-c", "pnpm install && pnpm dev"]