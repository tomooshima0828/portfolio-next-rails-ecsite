# frozen_string_literal: true

class ApplicationRecord < ActiveRecord::Base
  primary_abstract_class
  
  # 本番環境でのPrepared Statementの問題を解決するための設定
  if Rails.env.production?
    begin
      self.connection.execute("DEALLOCATE ALL") rescue nil
    rescue => e
      Rails.logger.error "Failed to deallocate statements: #{e.message}"
    end
  end
end
