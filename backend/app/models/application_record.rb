# frozen_string_literal: true

class ApplicationRecord < ActiveRecord::Base
  primary_abstract_class

  # NOTE: PostgreSQL Prepared Statement対策は以下のファイルで一元管理されています:
  # - config/database.yml で prepared_statements: false 設定
  # - config/initializers/disable_prepared_statements.rb で起動時クリア
end
