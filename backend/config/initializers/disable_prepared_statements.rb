# frozen_string_literal: true

# 本番環境でのPrepared Statement問題を解決するためのイニシャライザ
if Rails.env.production?
  Rails.application.config.after_initialize do
    # 既存のプリペアドステートメントをすべて解放
    begin
      ActiveRecord::Base.connection.execute("DEALLOCATE ALL")
      Rails.logger.info "Successfully deallocated all prepared statements"
    rescue => e
      Rails.logger.error "DEALLOCATE ALL failed: #{e.message}"
    end
    
    # 既存の接続を閉じる
    ActiveRecord::Base.connection_pool.disconnect!
    
    # Rails 7の方法で再接続
    begin
      config = ActiveRecord::Base.configurations.configs_for(env_name: Rails.env).configuration_hash
      config[:prepared_statements] = false
      ActiveRecord::Base.establish_connection(config)
      Rails.logger.info "Reconnected with prepared_statements: false"
    rescue => e
      Rails.logger.error "Failed to reconnect with new settings: #{e.message}"
    end
  end
end
