class CreateUserDatedValues < ActiveRecord::Migration[6.0]
  def change
    create_table :user_dated_values do |t|
      t.references :user, null: false, foreign_key: true
      t.date :dated_on, null: false
      t.integer :code, limit: 1, null: false
      t.integer :value

      t.timestamps
    end
    add_index :user_dated_values, [:user_id, :dated_on, :code], unique: true
  end
end
