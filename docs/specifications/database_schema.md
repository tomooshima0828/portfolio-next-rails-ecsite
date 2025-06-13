# データベーススキーマ定義

## テーブル定義

### users
ユーザー情報を格納します。

| カラム名 | データ型 | 説明 |
| --- | --- | --- |
| id | bigint | 主キー |
| name | string | 氏名 |
| email | string | メールアドレス (ユニーク) |
| password_digest | string | ハッシュ化されたパスワード (Railsのhas_secure_password用) |
| address | string | 住所 |
| created_at | datetime | 作成日時 |
| updated_at | datetime | 更新日時 |

### products
商品情報を格納します。

| カラム名 | データ型 | 説明 |
| --- | --- | --- |
| id | bigint | 主キー |
| name | string | 商品名 |
| description | text | 商品説明 |
| price | integer | 価格 |
| stock | integer | 在庫数 |
| category_id | bigint | カテゴリID (外部キー) |
| created_at | datetime | 作成日時 |
| updated_at | datetime | 更新日時 |

### categories
商品カテゴリを格納します。

| カラム名 | データ型 | 説明 |
| --- | --- | --- |
| id | bigint | 主キー |
| name | string | カテゴリ名 (ユニーク) |
| created_at | datetime | 作成日時 |
| updated_at | datetime | 更新日時 |

### orders
注文のヘッダー情報を格納します。

| カラム名 | データ型 | 説明 |
| --- | --- | --- |
| id | bigint | 主キー |
| user_id | bigint | ユーザーID (外部キー) |
| total_price | integer | 合計金額 |
| status | integer | 注文ステータス (例: 0:入金待ち, 1:発送準備中, 2:発送済み) |
| shipping_address | string | 配送先住所 |
| created_at | datetime | 作成日時 |
| updated_at | datetime | 更新日時 |

### order_details
注文の明細情報を格納します。中間テーブルです。

| カラム名 | データ型 | 説明 |
| --- | --- | --- |
| id | bigint | 主キー |
| order_id | bigint | 注文ID (外部キー) |
| product_id | bigint | 商品ID (外部キー) |
| quantity | integer | 数量 |
| price_at_purchase | integer | 購入時の商品単価 |
| created_at | datetime | 作成日時 |
| updated_at | datetime | 更新日時 |

### cart_items
ショッピングカート内の商品情報を格納します。

| カラム名 | データ型 | 説明 |
| --- | --- | --- |
| id | bigint | 主キー |
| user_id | bigint | ユーザーID (外部キー) |
| product_id | bigint | 商品ID (外部キー) |
| quantity | integer | 数量 |
| created_at | datetime | 作成日時 |
| updated_at | datetime | 更新日時 |
