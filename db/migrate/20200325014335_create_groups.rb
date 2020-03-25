class CreateGroups < ActiveRecord::Migration[6.0]
  def change
    create_table :groups do |t|
      t.string :name, null: false
      t.string :code, null: false
      t.boolean :hidden, null: false, default: false

      t.timestamps
    end
    add_index :groups, :code, unique: true
  end
end
