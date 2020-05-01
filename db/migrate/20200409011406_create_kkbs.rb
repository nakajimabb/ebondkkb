class CreateKkbs < ActiveRecord::Migration[6.0]
  def change
    create_table :kkbs do |t|
      t.integer :kkb_type, null: false
      t.references :kkb_category, null: false, foreign_key: true
      t.string :title
      t.text :content
      t.references :posted_by, null: false, foreign_key: { to_table: :users }
      t.integer :status, limit: 1
      t.boolean :open, default: true, null: false
      t.datetime :checked_at
      t.references :created_by, foreign_key: { to_table: :users }
      t.references :updated_by, foreign_key: { to_table: :users }

      t.timestamps
    end
  end
end
