class CreateRegionAreas < ActiveRecord::Migration[6.0]
  def change
    create_table :region_areas do |t|
      t.references :region, null: false, foreign_key: true
      t.references :area, null: false, foreign_key: true

      t.timestamps
    end
    add_index :region_areas, [:region_id, :area_id], unique: true
  end
end
