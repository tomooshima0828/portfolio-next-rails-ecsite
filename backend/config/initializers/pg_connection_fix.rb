# frozen_string_literal: true

# PostgreSQLのコネクションプール問題を解決するためのモンキーパッチ
if Rails.env.production? && defined?(ActiveRecord::ConnectionAdapters::PostgreSQLAdapter)
  module ActiveRecord
    module ConnectionAdapters
      class PostgreSQLAdapter
        # プリペアドステートメントのキャッシュをクリアするメソッドをオーバーライド
        def clear_cache!
          @lock.synchronize do
            @statements.each_value do |stmt|
              stmt[:stmt].close
            rescue StandardError
              nil
            end
            @statements.clear
          end
          @query_cache&.clear
          super
        end

        # トランザクション終了時に自動的にキャッシュをクリア
        def commit_db_transaction
          super
        ensure
          clear_cache!
        end

        def rollback_db_transaction
          super
        ensure
          clear_cache!
        end
      end
    end
  end

  # アプリケーション起動時に既存のプリペアドステートメントをクリア
  Rails.application.config.after_initialize do
    ActiveRecord::Base.connection.execute('DEALLOCATE ALL')
    Rails.logger.info 'Successfully deallocated all prepared statements'
  rescue StandardError => e
    Rails.logger.error "Failed to deallocate prepared statements: #{e.message}"
  end
end
