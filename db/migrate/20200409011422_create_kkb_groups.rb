class CreateKkbGroups < ActiveRecord::Migration[6.0]
  def change
    create_table :kkb_groups do |t|
      t.references :kkb, null: false, foreign_key: true
      t.references :group, null: false, foreign_key: true
      t.integer :permission, limit: 1, null: false

      t.timestamps
    end
    add_index :kkb_groups, [:kkb_id, :group_id], unique: true
  end
end
