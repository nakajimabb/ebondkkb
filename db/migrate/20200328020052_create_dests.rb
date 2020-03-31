class CreateDests < ActiveRecord::Migration[6.0]
  def change
    create_table :dests do |t|
      t.references :company, null: false, foreign_key: true
      t.string :code, limit: 32, null: false
      t.string :name, limit: 32, default: "", null: false
      t.string :kana, limit: 32, default: "", null: false
      t.integer :dest_type, limit: 1, null: false, default: 1
      t.string :shift_number1, limit: 16, default: "", null: false
      t.string :shift_number2, limit: 16, default: "", null: false
      t.date :opened_on
      t.date :closed_on
      t.date :started_on
      t.date :finished_on
      t.string :zip, limit: 10, default: "", null: false
      t.integer :prefecture, limit: 2
      t.string :city, limit: 16, default: "", null: false
      t.string :street, limit: 64, default: "", null: false
      t.string :building, limit: 64, default: "", null: false
      t.boolean :provisional, null: false, default: false

      t.timestamps
    end
    add_index :dests, [:company_id, :code], unique: true
  end
end
