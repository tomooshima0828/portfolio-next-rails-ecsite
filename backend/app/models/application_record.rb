# frozen_string_literal: true

class ApplicationRecord < ActiveRecord::Base
  primary_abstract_class
  
  # 本番環境でのPrepared Statementの問題を解決するための設定
  if Rails.env.production?
    self.connection.execute("DEALLOCATE ALL")
    self.connection_config[:prepared_statements] = false
  end
end
