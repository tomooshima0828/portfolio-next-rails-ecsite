class CreateOrders < ActiveRecord::Migration[7.1]
  def change
    create_table :orders do |t|
      t.references :user, null: false, foreign_key: true
      t.decimal :total_amount, precision: 10, scale: 2, null: false
      t.string :status, null: false, default: 'pending'
      t.string :stripe_payment_intent_id, index: { unique: true }

      t.timestamps
    end

    add_index :orders, :status
  end
end
