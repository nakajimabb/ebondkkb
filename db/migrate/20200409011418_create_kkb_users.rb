class CreateKkbUsers < ActiveRecord::Migration[6.0]
  def change
    create_table :kkb_users do |t|
      t.references :kkb, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.integer :permission, limit: 1, null: false

      t.timestamps
    end
    add_index :kkb_users, [:kkb_id, :user_id], unique: true
  end
end
