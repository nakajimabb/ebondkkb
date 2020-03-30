class CreateRegions < ActiveRecord::Migration[6.0]
  def change
    create_table :regions do |t|
      t.string :code, limit: 16, null: false
      t.string :name, limit: 16, null: false, default: ''
      t.boolean :hidden, null: false, default: false
      t.integer :rank, null: false

      t.timestamps
    end
    add_index :regions, :code, unique: true
  end
end
