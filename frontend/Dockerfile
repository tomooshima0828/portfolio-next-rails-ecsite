# 開発環境用
FROM node:20-alpine

WORKDIR /app

## 依存関係をインストール
COPY package.json package-lock.json ./
RUN npm ci

# アプリケーションコードをコピー
COPY . .

# 開発サーバーを起動
CMD ["npm", "run", "dev"]
