class CreateCompanies < ActiveRecord::Migration[6.0]
  def change
    create_table :companies do |t|
      t.string :code, null: false
      t.string :name, default: "", null: false
      t.boolean :hidden, null: false, default: false
      t.integer :section, limit: 1, null: false, default: 1

      t.timestamps
    end
    add_index :companies, :code, unique: true
  end
end
