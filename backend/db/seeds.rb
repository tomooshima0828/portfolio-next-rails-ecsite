# frozen_string_literal: true

require 'open-uri'

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
    { name: 'Electronics', description: 'Latest gadgets and technology products' },
    { name: 'Clothing', description: 'Trendy clothes and accessories' },
    { name: 'Books', description: 'Books, magazines, and e-books' },
    { name: 'Home & Kitchen', description: 'Household and kitchen items' },
    { name: 'Sports & Outdoors', description: 'Sports equipment and outdoor gear' }
  ]

  categories.each do |category_attrs|
    Category.create!(category_attrs)
  end
end

# 商品データ
if Product.count == 0
  electronics = Category.find_by(name: 'Electronics')
  clothing = Category.find_by(name: 'Clothing')
  books = Category.find_by(name: 'Books')
  home = Category.find_by(name: 'Home & Kitchen')
  sports = Category.find_by(name: 'Sports & Outdoors')

  products = [
    {
      name: 'Smartphone XYZ',
      description: 'Latest smartphone with high-performance camera and long-lasting battery.',
      price: 89800,
      stock: 50,
      category: electronics,
      image_keyword: 'smartphone'
    },
    {
      name: 'Laptop ABC',
      description: 'Lightweight and portable laptop with high-speed processor.',
      price: 128000,
      stock: 7,
      category: electronics,
      image_keyword: 'laptop'
    },
    {
      name: 'Wireless Earphones',
      description: 'Wireless earphones with noise cancellation feature.',
      price: 19800,
      stock: 3,
      category: electronics,
      image_keyword: 'wireless+earphones'
    },
    {
      name: 'Men\'s T-shirt',
      description: 'Comfortable 100% cotton T-shirt.',
      price: 2980,
      stock: 0,
      category: clothing,
      image_keyword: 'mens+tshirt'
    },
    {
      name: 'Women\'s Jeans',
      description: 'Stylish design stretch jeans.',
      price: 5980,
      stock: 0,
      category: clothing,
      image_keyword: 'womens+jeans'
    },
    {
      name: 'Programming for Beginners',
      description: 'Introductory programming learning book for beginners.',
      price: 2800,
      stock: 5,
      category: books,
      image_keyword: 'programming+book'
    },
    {
      name: 'Business Strategy Guide',
      description: 'Book explaining successful business strategies.',
      price: 1800,
      stock: 7,
      category: books,
      image_keyword: 'business+book'
    },
    {
      name: 'Electric Kettle',
      description: 'Fast-boiling electric kettle.',
      price: 3980,
      stock: 10,
      category: home,
      image_keyword: 'electric+kettle'
    },
    {
      name: 'Cooking Utensils Set',
      description: 'Set of essential cooking utensils for your kitchen.',
      price: 12800,
      stock: 11,
      category: home,
      image_keyword: 'cooking+utensils'
    },
    {
      name: 'Yoga Mat',
      description: 'Non-slip comfortable yoga mat.',
      price: 3500,
      stock: 5,
      category: sports,
      image_keyword: 'yoga+mat'
    },
    {
      name: 'Running Shoes',
      description: 'Running shoes with excellent cushioning.',
      price: 8900,
      stock: 0,
      category: sports,
      image_keyword: 'running+shoes'
    },
    {
      name: 'Smartwatch',
      description: 'Smartwatch with health monitoring features.',
      price: 24800,
      stock: 0,
      category: electronics,
      image_keyword: 'smartwatch'
    }
  ]

  products.each do |product_attrs|
    # image_keywordを取り出して、product_attrsから削除
    image_keyword = product_attrs.delete(:image_keyword)
    
    # 商品を作成
    product = Product.create!(product_attrs)
    
    # 画像をアタッチ
    max_attempts = 5
    attempts = 0
    success = false

    while !success && attempts < max_attempts
      begin
        attempts += 1
        
        # 画像の取得方法を選択
        # 方法１：確実に存在する画像を使用
        safe_ids = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200]
        image_id = safe_ids.sample
        
        # 商品のカテゴリに基づいて画像を選択
        category_name = product.category.name
        
        case category_name
        when 'Electronics'
          image_url = "https://picsum.photos/id/#{image_id}/800/600"
        when 'Clothing'
          image_url = "https://picsum.photos/id/#{image_id + 1}/800/600"
        when 'Books'
          image_url = "https://picsum.photos/id/#{image_id + 2}/800/600"
        when 'Home & Kitchen'
          image_url = "https://picsum.photos/id/#{image_id + 3}/800/600"
        when 'Sports & Outdoors'
          image_url = "https://picsum.photos/id/#{image_id + 4}/800/600"
        else
          image_url = "https://picsum.photos/id/#{image_id}/800/600"
        end
        
        # 画像をダウンロードしてアタッチ
        file = URI.open(image_url)
        
        # ファイル名を確実に設定し、統一感を持たせる
        # カテゴリ名のマッピング
        category_mapping = {
          'Electronics' => 'electronics',
          'Clothing' => 'clothing',
          'Books' => 'books',
          'Home & Kitchen' => 'home-kitchen',
          'Sports & Outdoors' => 'sports-outdoor'
        }
        
        # カテゴリ名をスラッグ化
        category_name = product.category.name
        category_slug = category_mapping[category_name] || category_name.parameterize
        
        # 商品名から商品タイプを抽出
        product_name = product.name
        product_type = case product_name
          when /Smartphone/ then 'smartphone'
          when /Laptop/ then 'laptop'
          when /Earphones/ then 'earphones'
          when /T-shirt/ then 'tshirt'
          when /Jeans/ then 'jeans'
          when /Programming/ then 'programming-book'
          when /Business/ then 'business-book'
          when /Kettle/ then 'kettle'
          when /Cooking/ then 'cooking-utensils'
          when /Yoga/ then 'yoga-mat'
          when /Running/ then 'running-shoes'
          when /Smartwatch/ then 'smartwatch'
          else product_name.parameterize.presence || 'item'
        end
        
        # 商品IDを使用してユニークなファイル名を生成
        product_slug = "#{category_slug}-#{product_type}-#{product.id}"
        
        safe_filename = "#{product_slug}.jpg"
        
        product.main_image.attach(
          io: file,
          filename: safe_filename,
          content_type: 'image/jpeg'
        )
        
        puts "An image has been created: #{product.name} (#{attempts} time attempt)"
        success = true
      rescue OpenURI::HTTPError => e
        if attempts < max_attempts
          puts "Failed to create an image: #{product.name}, error: #{e.message}"
        else
          puts "Failed to create an image: #{product.name}, error: #{e.message}"
        end
      rescue => e
        puts "Failed to create an image: #{product.name}, error: #{e.message}"
        break
      end
    end
  end
end
