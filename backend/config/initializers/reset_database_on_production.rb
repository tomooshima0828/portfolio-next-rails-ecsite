# frozen_string_literal: true

# ポートフォリオ用のデモアプリケーションなので、本番環境でもデータベースをリセットして
# シードデータを毎回投入するための設定です。
# 注意: 実際の本番アプリケーションでこの設定を使用することは推奨されません。

if Rails.env.production? && ENV['ENABLE_DB_RESET'] == 'true'
  Rails.application.config.after_initialize do
    Rails.logger.info 'Resetting database for portfolio demo purposes...'
    begin
      # データベース接続を取得
      connection = ActiveRecord::Base.connection
      
      # データベース内の全テーブル名を取得
      tables = connection.tables
      
      # 外部キー制約を無効化
      connection.execute('SET CONSTRAINTS ALL DEFERRED')
      
      # 全テーブルのデータを削除
      tables.each do |table|
        next if table == 'schema_migrations' || table == 'ar_internal_metadata'
        Rails.logger.info "Truncating table: #{table}"
        connection.execute("TRUNCATE TABLE #{table} CASCADE")
      end
      
      # 外部キー制約を再度有効化
      connection.execute('SET CONSTRAINTS ALL IMMEDIATE')
      
      # シードデータの投入
      Rails.logger.info 'Running db:seed...'
      load Rails.root.join('db', 'seeds.rb')
      
      Rails.logger.info 'Database reset and seed completed successfully!'
    rescue => e
      Rails.logger.error "Database reset failed: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
    end
  end
end
