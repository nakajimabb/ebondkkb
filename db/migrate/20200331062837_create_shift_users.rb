class CreateShiftUsers < ActiveRecord::Migration[6.0]
  def change
    create_table :shift_users do |t|
      t.date :dated_on
      t.references :user, null: false, foreign_key: true
      t.references :dest, foreign_key: true
      t.integer :period_type
      t.integer :proc_type
      t.integer :roster_type
      t.integer :frame_type

      t.timestamps
    end
    add_index :shift_users, [:dated_on, :user_id, :period_type, :proc_type], unique: true, name: 'index_shift_user_date_user_period_proc'
  end
end
