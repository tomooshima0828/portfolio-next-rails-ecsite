# PostgreSQL Prepared Statements and DEALLOCATE ALL
# PostgreSQL プリペアードステートメントとDEALLOCATE ALL

This document explains the concept of Prepared Statements in PostgreSQL and the purpose of the `DEALLOCATE ALL` command found in the ApplicationRecord.
このドキュメントでは、PostgreSQLのPrepared Statements（プリペアードステートメント）の概念と、ApplicationRecordに記述されている`DEALLOCATE ALL`コマンドの目的について解説します。

## Location and Purpose in This Project
## このプロジェクトでの配置場所と目的

### File Location
### ファイル配置場所

**File:** `backend/app/models/application_record.rb`
**ファイル:** `backend/app/models/application_record.rb`

```ruby
class ApplicationRecord < ActiveRecord::Base
  # Base class for all models
  # すべてのモデルの基底クラス
  # Common database connection processing
  # データベース接続の共通処理を定義
  
  # PostgreSQL connection stabilization process
  # PostgreSQL接続の安定化処理
  begin
    begin
      connection.execute('DEALLOCATE ALL')
    rescue StandardError
      nil
    end
  end
end
```

### Purpose
### 目的

This code is **a workaround to solve PostgreSQL-specific technical problems**. It serves as a practical solution to prevent memory leaks and performance issues caused by the accumulation of prepared statements in Rails applications.

このコードは**PostgreSQL特有の技術的問題を解決するためのワークアラウンド**です。Railsアプリケーションでプリペアードステートメントの蓄積によるメモリリークやパフォーマンス問題を防ぐ、実用的な解決策として実装されています。

### Related Configuration Files
### 関連する設定ファイル

This project has other PostgreSQL-related fix files:
このプロジェクトには他にもPostgreSQL関連の修正ファイルがあります：

```ruby
# backend/config/initializers/disable_prepared_statements.rb
# backend/config/initializers/pg_connection_fix.rb
# backend/config/initializers/fix_postgresql_connection.rb
```

## 1. What are Prepared Statements?
## 1. Prepared Statements（プリペアードステートメント）とは？

### 1.1. Basic Concept
### 1.1. 基本概念

**Normal SQL Query Execution:**
**通常のSQLクエリ実行:**
```sql
-- Each query requires parsing, execution planning, and execution
-- 毎回SQLを解析・実行計画作成・実行
SELECT * FROM users WHERE id = 1;
SELECT * FROM users WHERE id = 2;
SELECT * FROM users WHERE id = 3;
```

**Prepared Statement:**
**プリペアードステートメント:**
```sql
-- 1. Prepare SQL template in advance (PREPARE)
-- 1. SQLテンプレートを事前準備（PREPARE）
PREPARE get_user(int) AS SELECT * FROM users WHERE id = $1;

-- 2. Execute quickly with different parameters (EXECUTE)
-- 2. パラメータを変えて高速実行（EXECUTE）
EXECUTE get_user(1);
EXECUTE get_user(2);
EXECUTE get_user(3);
```

### 1.2. Performance Benefits Diagram
### 1.2. パフォーマンス向上の仕組み

```
Normal SQL Execution:
通常のSQL実行:
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│Parse    │ -> │Plan     │ -> │Optimize │ -> │Execute  │
│SQL解析  │    │実行計画 │    │最適化   │    │実行     │
│(Every)  │    │(Every)  │    │(Every)  │    │         │
│(毎回)   │    │(毎回)   │    │(毎回)   │    │         │
└─────────┘    └─────────┘    └─────────┘    └─────────┘

Prepared Statement:
プリペアードステートメント:
┌─────────┐    ┌─────────┐    ┌─────────┐    
│Parse    │ -> │Plan     │ -> │Optimize │ (Once only)
│SQL解析  │    │実行計画 │    │最適化   │ (1回だけ)
│(Once)   │    │(Once)   │    │(Once)   │    
└─────────┘    └─────────┘    └─────────┘    
                                  ↓
                            ┌─────────┐
                            │Fast     │ (Multiple times)
                            │Execute  │ (何回でも)
                            │高速実行 │
                            └─────────┘
```

### 1.3. Concrete Example: User Search
### 1.3. 具体例: ユーザー検索

#### Normal Method (Slow)
#### 通常の方法（遅い）
```sql
-- Query 1: Parse→Plan→Execute (100ms)
-- クエリ1: 解析→計画→実行 (100ms)
SELECT * FROM users WHERE name = 'Alice' AND age > 25;

-- Query 2: Parse→Plan→Execute again (100ms)
-- クエリ2: また解析→計画→実行 (100ms)  
SELECT * FROM users WHERE name = 'Bob' AND age > 25;

-- Query 3: Parse→Plan→Execute again (100ms)
-- クエリ3: また解析→計画→実行 (100ms)
SELECT * FROM users WHERE name = 'Charlie' AND age > 25;

-- Total: 300ms
-- 合計: 300ms
```

#### Prepared Statement (Fast)
#### プリペアードステートメント（速い）
```sql
-- Preparation phase: Parse→Plan→Optimize (100ms, only once)
-- 準備フェーズ: 解析→計画→最適化 (100ms、1回だけ)
PREPARE find_user(text, int) AS 
SELECT * FROM users WHERE name = $1 AND age > $2;

-- Execution phase: Fast execution (10ms×3 times)
-- 実行フェーズ: 高速実行 (10ms×3回)
EXECUTE find_user('Alice', 25);    -- 10ms
EXECUTE find_user('Bob', 25);      -- 10ms  
EXECUTE find_user('Charlie', 25);  -- 10ms

-- Total: 130ms vs 300ms (57% faster!)
-- 合計: 130ms vs 300ms (57%高速化!)
```

## 2. What is DEALLOCATE ALL?
## 2. DEALLOCATE ALL とは？

### 2.1. Basic Function
### 2.1. 基本機能

```sql
-- Delete all prepared statements created in the current session
-- 現在のセッションで作成されたすべてのPrepared Statementを削除
DEALLOCATE ALL;
```

### 2.2. Individual vs Bulk Deletion
### 2.2. 個別削除 vs 一括削除

```sql
-- Individual deletion
-- 個別削除
PREPARE stmt1(int) AS SELECT * FROM users WHERE id = $1;
PREPARE stmt2(text) AS SELECT * FROM products WHERE name = $1;

DEALLOCATE stmt1;      -- Delete only stmt1 / stmt1のみ削除
DEALLOCATE stmt2;      -- Delete only stmt2 / stmt2のみ削除

-- Bulk deletion
-- 一括削除
DEALLOCATE ALL;        -- Delete all / すべて削除
```

### 2.3. Memory Status Comparison
### 2.3. メモリ状況の比較

#### Before DEALLOCATE
#### DEALLOCATE前
```
PostgreSQL Memory:
PostgreSQLメモリ:
┌─────────────────────────────────────┐
│ stmt1: SELECT * FROM users...       │ (In use / 占有中)
│ stmt2: SELECT * FROM products...    │ (In use / 占有中)  
│ stmt3: SELECT * FROM orders...      │ (In use / 占有中)
│ stmt4: UPDATE users SET...          │ (In use / 占有中)
│ ...                                 │
│ stmt999: DELETE FROM logs...        │ (In use / 占有中)
└─────────────────────────────────────┘
Memory Usage: High / メモリ使用量: 高い
```

#### After DEALLOCATE
#### DEALLOCATE後
```
PostgreSQL Memory:
PostgreSQLメモリ:
┌─────────────────────────────────────┐
│ (Free space / 空き領域)             │
│ (Free space / 空き領域)             │
│ (Free space / 空き領域)             │
└─────────────────────────────────────┘
Memory Usage: Released / メモリ使用量: 解放済み
```

## 3. Why Do Problems Occur?
## 3. なぜ問題になるのか？

### 3.1. Automatic Prepared Statements in Rails
### 3.1. Rails での自動Prepared Statement

Rails automatically creates prepared statements for Active Record queries:
RailsはActive Recordクエリに対して自動的にプリペアードステートメントを作成します：

```ruby
# Rails internal processing
# Railsが内部的に実行している処理
User.find(1)
# ↓ PostgreSQL automatically executes:
# ↓ PostgreSQLでは自動的に以下が実行される:
# PREPARE a1(int) AS SELECT * FROM users WHERE id = $1;
# EXECUTE a1(1);

User.where(name: 'Alice')  
# ↓
# PREPARE a2(text) AS SELECT * FROM users WHERE name = $1;
# EXECUTE a2('Alice');

Product.where('price > ?', 1000)
# ↓  
# PREPARE a3(int) AS SELECT * FROM products WHERE price > $1;
# EXECUTE a3(1000);
```

### 3.2. Problem Scenarios
### 3.2. 問題のシナリオ

#### Typical Flow in Development Environment
#### 開発環境での典型的な流れ
```
1. Start rails server
   rails server 起動
2. Access pages in browser
   ブラウザでページアクセス
   -> 10 prepared statements created
   -> 10個のPrepared Statement作成
3. Modify code and reload  
   コード修正してリロード
   -> Another 10 prepared statements created
   -> さらに10個のPrepared Statement作成
4. Repeat...
   繰り返し...
   -> 1000 prepared statements accumulated
   -> 1000個のPrepared Statement蓄積
5. Error occurs!
   エラー発生!
```

#### Actual Error Examples
#### 実際のエラー例
```
ActiveRecord::StatementInvalid: 
PG::DuplicatePstatement: ERROR: prepared statement "a1" already exists

Or:
または:

PG::TooManyConnections: FATAL: too many connections for role "myapp"
```

### 3.3. Impact in Production Environment
### 3.3. 本番環境での影響

```ruby
# Production environment running for 24 hours
# 本番環境で24時間運用
# 100 prepared statements created per hour
# 1時間に100個のPrepared Statement作成
# After 24 hours: 2400 prepared statements
# 24時間後: 2400個のPrepared Statement

# PostgreSQL server memory usage increases
# PostgreSQLサーバーのメモリ使用量増加
# Performance degradation
# パフォーマンス低下
# In worst case, connection refusal
# 最悪の場合、接続拒否
```

## 4. Solution Approaches
## 4. 解決策の比較

### 4.1. DEALLOCATE ALL (Current Code)
### 4.1. DEALLOCATE ALL（今回のコード）

```ruby
# Pros: Reliable cleanup, simple
# Cons: Full deletion may be slightly inefficient
# メリット: 確実にクリア、シンプル
# デメリット: 全削除のため効率面でやや劣る
begin
  begin
    connection.execute('DEALLOCATE ALL')
  rescue StandardError
    nil
  end
end
```

### 4.2. Disable Prepared Statements
### 4.2. Prepared Statement無効化

```yaml
# config/database.yml
production:
  prepared_statements: false

# Pros: Fundamental solution
# Cons: Also loses performance benefits
# メリット: 根本的解決
# デメリット: パフォーマンスのメリットも失う
```

### 4.3. Set Limits
### 4.3. 制限設定

```yaml
# config/database.yml  
production:
  prepared_statements: true
  statement_limit: 1000

# Pros: Good balance
# Cons: Only available in Rails 6.1+
# メリット: バランスが良い
# デメリット: Rails 6.1以降のみ
```

## 5. Practical Operation Examples
## 5. 実際の運用例

### 5.1. Development Environment Experience
### 5.1. 開発環境での体験

```bash
# Common error during development
# よくある開発中のエラー
$ rails console
> User.first
=> ActiveRecord::StatementInvalid: prepared statement "a1" already exists

# After executing DEALLOCATE ALL
# DEALLOCATE ALL実行後
> User.first  
=> #<User id: 1, name: "Alice", ...>  # Normal operation / 正常動作
```

### 5.2. Production Environment Monitoring
### 5.2. 本番環境での監視

```sql
-- Check current number of prepared statements
-- 現在のPrepared Statement数確認
SELECT name, statement FROM pg_prepared_statements;

-- Check memory usage
-- メモリ使用量確認  
SELECT pg_size_pretty(pg_total_relation_size('pg_prepared_statements'));
```

## 6. Double begin-rescue Structure Analysis
## 6. 二重 begin-rescue 構造の解析

### 6.1. Double begin-rescue Structure
### 6.1. 二重 begin-rescue 構造

```ruby
begin                    # Outer: Overall exception handling
                        # 外側: 全体の例外処理
  begin                  # Inner: DEALLOCATE execution
                        # 内側: DEALLOCATE実行
    connection.execute('DEALLOCATE ALL')
  rescue StandardError   # Inner: Ignore errors
                        # 内側: エラーを無視
    nil
  end
end                      # Outer: Additional processing may have been intended
                        # 外側: 追加の処理があった可能性
```

## 7. Modern Best Practices
## 7. 最新のベストプラクティス

### 7.1. Recommended Settings for Rails 7.x
### 7.1. Rails 7.x での推奨設定

```yaml
# config/database.yml
production:
  prepared_statements: false
  # Or:
  # または:
  statement_limit: 1000
```

### 7.2. Safer Implementation
### 7.2. より安全な実装

```ruby
class ApplicationRecord < ActiveRecord::Base
  # Hook-based implementation
  # フック形式での実装
  after_initialize :cleanup_prepared_statements, if: :should_cleanup?

  private

  def cleanup_prepared_statements
    return unless connection.adapter_name == 'PostgreSQL'
    
    connection.execute('DEALLOCATE ALL')
  rescue ActiveRecord::StatementInvalid, PG::Error
    # Log and continue
    # ログ出力して継続
    Rails.logger.warn "Failed to deallocate prepared statements"
  end

  def should_cleanup?
    # Execute only under specific conditions
    # 特定条件でのみ実行
    Rails.env.development? || 
    connection.prepared_statements_count > 100
  end
end
```

## 8. Summary
## 8. まとめ

The `DEALLOCATE ALL` code is **a workaround to solve PostgreSQL-specific technical problems**. It serves as a practical solution to prevent memory leaks and performance issues caused by the accumulation of prepared statements.

この`DEALLOCATE ALL`のコードは**PostgreSQL特有の技術的問題を解決するためのワークアラウンド**です。プリペアードステートメントの蓄積によるメモリリークやパフォーマンス問題を防ぐ、実用的な解決策として実装されています。

While modern Rails applications recommend more sophisticated approaches (such as configuration file controls), this implementation is also an effective approach that reliably solves the problem.

現代的なRailsアプリケーションでは、より洗練された方法（設定ファイルでの制御など）が推奨されますが、この実装も確実に問題を解決する有効なアプローチです。

**DEALLOCATE ALL** acts like a "reset button" that solves these problems in bulk. It's a practical solution that balances development efficiency and stability.

**DEALLOCATE ALL**は、これらの問題を一括で解決する「リセットボタン」のような役割を果たしています。開発効率と安定性を両立させる実用的な解決策です。