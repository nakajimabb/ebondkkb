class CreateKkbCategories < ActiveRecord::Migration[6.0]
  def change
    create_table :kkb_categories do |t|
      t.string :code, null: false
      t.string :name, null: false
      t.integer :rank
      t.references :parent, foreign_key: { to_table: :kkb_categories }
      t.references :created_by, foreign_key: { to_table: :users }
      t.references :updated_by, foreign_key: { to_table: :users }

      t.timestamps
    end
    add_index :kkb_categories, :code, unique: true
  end
end
