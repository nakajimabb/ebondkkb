class CreateDestDatedValues < ActiveRecord::Migration[6.0]
  def change
    create_table :dest_dated_values do |t|
      t.references :dest, null: false, foreign_key: true
      t.date :dated_on, null: false
      t.integer :code, limit: 1, null: false
      t.integer :value

      t.timestamps
    end
    add_index :dest_dated_values, [:dest_id, :dated_on, :code], unique: true
  end
end
