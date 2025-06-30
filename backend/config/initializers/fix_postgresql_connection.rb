# frozen_string_literal: true

# PostgreSQL接続の問題を解決するための包括的な対策
if Rails.env.production?
  # アプリケーション起動時に実行
  Rails.application.config.after_initialize do
    # 既存のプリペアドステートメントをクリア

    ActiveRecord::Base.connection.execute('DEALLOCATE ALL')
    Rails.logger.info 'Successfully deallocated all prepared statements on startup'
  rescue StandardError => e
    Rails.logger.error "Failed to deallocate prepared statements: #{e.message}"
  end

  # PostgreSQLアダプタを修正
  if defined?(ActiveRecord::ConnectionAdapters::PostgreSQLAdapter)
    module PostgreSQLPreparedStatementsFix
      def prepare_statement(sql, _binds)
        sql
      end

      def exec_no_cache(sql, name, binds)
        log(sql, name, binds) do
          with_raw_connection do |conn|
            result = conn.async_exec(sql)
            ActiveRecord::Result.new(result.fields, result.values)
          end
        end
      end
    end

    # モンキーパッチを適用
    ActiveSupport.on_load(:active_record) do
      ActiveSupport.on_load(:active_record_postgresqladapter) { prepend PostgreSQLPreparedStatementsFix }
    end
  end

  # コネクションプールの設定を調整
  ActiveSupport.on_load(:active_record) do
    # 接続設定を取得
    config = ActiveRecord::Base.connection_db_config.configuration_hash.dup

    # Prepared Statementを無効化
    config[:prepared_statements] = false
    config[:statement_limit] = 0

    # 接続プールを最適化
    config[:pool] = 3
    config[:idle_timeout] = 60
    config[:reconnect] = true

    # 既存の接続を閉じて再接続
    begin
      ActiveRecord::Base.connection_pool.disconnect!
      ActiveRecord::Base.establish_connection(config)
      Rails.logger.info 'Successfully reconfigured database connection'
    rescue StandardError => e
      Rails.logger.error "Failed to reconfigure database connection: #{e.message}"
    end
  end
end
