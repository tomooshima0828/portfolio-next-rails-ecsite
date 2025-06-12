FROM node:18-alpine

# 作業ディレクトリの設定
WORKDIR /app

# パッケージ関連ファイルをコピー
COPY package*.json ./
COPY yarn.lock ./

# 依存関係のインストール
RUN yarn install

# アプリケーションのコピー
COPY . .

# ビルドと起動コマンド
CMD ["yarn", "dev"]

# ポートの公開
EXPOSE 3000
