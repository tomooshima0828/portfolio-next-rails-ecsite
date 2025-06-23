# frozen_string_literal: true

# ユーザーデータ
if User.count == 0
  User.create!(
    name: 'Test User1',
    email: 'test_user1@example.com',
    password: 'password',
    password_confirmation: 'password',
    address: '123 Main St',
    phone: '123-456-7890'
  )
end

# カテゴリデータ
if Category.count == 0
  categories = [
    { name: '電子機器', description: '最新のガジェットやテクノロジー製品' },
    { name: '衣類', description: 'トレンドの洋服やアクセサリー' },
    { name: '本・雑誌', description: '書籍、雑誌、電子書籍' },
    { name: 'ホーム・キッチン', description: '家庭用品やキッチン用品' },
    { name: 'スポーツ・アウトドア', description: 'スポーツ用品やアウトドア用品' }
  ]

  categories.each do |category_attrs|
    Category.create!(category_attrs)
  end
end

# 商品データ
if Product.count == 0
  electronics = Category.find_by(name: '電子機器')
  clothing = Category.find_by(name: '衣類')
  books = Category.find_by(name: '本・雑誌')
  home = Category.find_by(name: 'ホーム・キッチン')
  sports = Category.find_by(name: 'スポーツ・アウトドア')

  products = [
    {
      name: 'スマートフォン XYZ',
      description: '最新のスマートフォン。高性能カメラと長時間バッテリー搭載。',
      price: 89800,
      stock: 50,
      category: electronics
    },
    {
      name: 'ノートパソコン ABC',
      description: '軽量で持ち運びに便利なノートパソコン。高速プロセッサー搭載。',
      price: 128000,
      stock: 7,
      category: electronics
    },
    {
      name: 'ワイヤレスイヤホン',
      description: 'ノイズキャンセリング機能付きのワイヤレスイヤホン。',
      price: 19800,
      stock: 3,
      category: electronics
    },
    {
      name: 'メンズTシャツ',
      description: '快適な着心地のコットン100%Tシャツ。',
      price: 2980,
      stock: 0,
      category: clothing
    },
    {
      name: 'レディースジーンズ',
      description: 'スタイリッシュなデザインのストレッチジーンズ。',
      price: 5980,
      stock: 0,
      category: clothing
    },
    {
      name: 'プログラミング入門書',
      description: '初心者向けのプログラミング学習書。',
      price: 2800,
      stock: 5,
      category: books
    },
    {
      name: 'ビジネス戦略の本',
      description: '成功するビジネス戦略について解説した書籍。',
      price: 1800,
      stock: 7,
      category: books
    },
    {
      name: '電気ケトル',
      description: '素早くお湯を沸かせる電気ケトル。',
      price: 3980,
      stock: 10,
      category: home
    },
    {
      name: '調理器具セット',
      description: '料理に必要な基本的な調理器具のセット。',
      price: 12800,
      stock: 11,
      category: home
    },
    {
      name: 'ヨガマット',
      description: '滑りにくく快適なヨガマット。',
      price: 3500,
      stock: 5,
      category: sports
    },
    {
      name: 'ランニングシューズ',
      description: 'クッション性に優れたランニングシューズ。',
      price: 8900,
      stock: 0,
      category: sports
    },
    {
      name: 'スマートウォッチ',
      description: '健康管理機能付きのスマートウォッチ。',
      price: 24800,
      stock: 0,
      category: electronics
    }
  ]

  products.each do |product_attrs|
    Product.create!(product_attrs)
  end
end
