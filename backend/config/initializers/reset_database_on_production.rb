# frozen_string_literal: true

# ポートフォリオ用のデモアプリケーションなので、本番環境でもデータベースをリセットして
# シードデータを毎回投入するための設定です。
# 注意: 実際の本番アプリケーションでこの設定を使用することは推奨されません。

# Rakeライブラリを明示的に読み込む
require 'rake'

if Rails.env.production? && ENV['ENABLE_DB_RESET'] == 'true'
  Rails.application.config.after_initialize do
    Rails.logger.info 'Resetting database for portfolio demo purposes...'
    begin
      # 本番環境でのデータベース操作を許可する環境変数を設定
      ENV['DISABLE_DATABASE_ENVIRONMENT_CHECK'] = '1'
      
      # Rakeアプリケーションを読み込む
      Rake.application.load_rakefile
      
      # データベースのリセットとシードデータの投入
      Rake::Task['db:migrate:reset'].invoke
      Rake::Task['db:seed'].invoke
      Rails.logger.info 'Database reset and seed completed successfully!'
    rescue => e
      Rails.logger.error "Database reset failed: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
    end
  end
end
