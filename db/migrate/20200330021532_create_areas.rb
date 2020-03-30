class CreateAreas < ActiveRecord::Migration[6.0]
  def change
    create_table :areas do |t|
      t.string :code, limit: 16, null: false
      t.string :name, limit: 16, null: false, default: ''
      t.string :short_name, limit: 16, null: false, default: ''
      t.boolean :hidden, null: false, default: false

      t.timestamps
    end
    add_index :areas, :code, unique: true
  end
end
