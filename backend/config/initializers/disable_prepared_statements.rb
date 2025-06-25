# frozen_string_literal: true

# 本番環境でのPrepared Statement問題を解決するためのイニシャライザ
if Rails.env.production?
  Rails.application.config.after_initialize do
    ActiveRecord::Base.connection.execute("DEALLOCATE ALL") rescue nil
    
    # 既存の接続を閉じる
    ActiveRecord::Base.connection_pool.disconnect!
    
    # 新しい設定で再接続
    ActiveRecord::Base.establish_connection(
      ActiveRecord::Base.connection_config.merge(prepared_statements: false)
    ) rescue nil
    
    # Rails 7以降の方法
    config = ActiveRecord::Base.configurations.configs_for(env_name: Rails.env).configuration_hash
    config[:prepared_statements] = false
    ActiveRecord::Base.establish_connection(config) rescue nil
  end
end
