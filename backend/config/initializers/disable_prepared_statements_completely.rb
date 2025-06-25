# frozen_string_literal: true

# PostgreSQLのPrepared Statement問題を根本的に解決するためのモンキーパッチ
if Rails.env.production? && defined?(ActiveRecord::ConnectionAdapters::PostgreSQLAdapter)
  Rails.application.config.to_prepare do
    ActiveRecord::ConnectionAdapters::PostgreSQLAdapter.class_eval do
      # プリペアドステートメントを完全に無効化するためのオーバーライド
      def prepare_statement(sql, binds)
        sql
      end

      # execute_and_clearメソッドをオーバーライドして、プリペアドステートメントを使わないようにする
      def execute_and_clear(sql, name = nil, binds = [])
        execute(sql, name)
      end

      # exec_preparedメソッドをオーバーライドして、通常のexecuteを使うようにする
      def exec_prepared(statement_name, binds = [])
        sql = @statements[statement_name][:sql]
        execute(sql, statement_name)
      end

      # プリペアドステートメントのキャッシュをクリアするメソッドをオーバーライド
      def clear_cache!
        @statements.clear if @statements
        @query_cache.clear if @query_cache
      end
    end
  end

  # アプリケーション起動時に既存のプリペアドステートメントをクリア
  Rails.application.config.after_initialize do
    begin
      ActiveRecord::Base.connection.execute("DEALLOCATE ALL")
      Rails.logger.info "Successfully deallocated all prepared statements on startup"
    rescue => e
      Rails.logger.error "Failed to deallocate prepared statements: #{e.message}"
    end
  end
end
