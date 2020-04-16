class CreateShiftUsers < ActiveRecord::Migration[6.0]
  def change
    create_table :shift_users do |t|
      t.date :dated_on, null: false
      t.references :user, null: false, foreign_key: true
      t.references :dest, foreign_key: true
      t.integer :period_type, null: false
      t.integer :proc_type, null: false
      t.integer :roster_type, null: false
      t.integer :frame_type, null: false, default: 1

      t.timestamps
    end
    add_index :shift_users, [:dated_on, :user_id, :period_type, :proc_type], unique: true, name: 'index_shift_user_date_user_period_proc'
  end
end
