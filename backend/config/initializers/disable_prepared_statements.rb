# frozen_string_literal: true

# PostgreSQL Prepared Statement問題を軽減するためのイニシャライザ
# メインの設定はdatabase.ymlで prepared_statements: false として設定済み
if defined?(ActiveRecord::ConnectionAdapters::PostgreSQLAdapter)
  Rails.application.config.after_initialize do
    # アプリケーション起動時に既存のプリペアドステートメントをクリア

    ActiveRecord::Base.connection.execute('DEALLOCATE ALL')
    Rails.logger.info 'Cleared existing prepared statements on startup'
  rescue StandardError => e
    Rails.logger.warn "Could not clear prepared statements: #{e.message}"
  end
end
