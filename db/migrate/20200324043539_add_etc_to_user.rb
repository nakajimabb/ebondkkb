class AddEtcToUser < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :code, :string, null: false, limit: 16
    add_column :users, :first_name, :string, null: false, default: '', limit: 32
    add_column :users, :last_name, :string, null: false, default: '', limit: 32
    add_column :users, :first_name_kana, :string, null: false, default: '', limit: 32
    add_column :users, :last_name_kana, :string, null: false, default: '', limit: 32
    add_column :users, :sex, :integer, limit: 1
    add_column :users, :birthday, :date
    add_column :users, :entered_on, :date
    add_column :users, :retired_on, :date
    add_column :users, :started_on, :date
    add_column :users, :finished_on, :date
    add_column :users, :shift_number1, :string, null: false, default: '', limit: 16
    add_column :users, :shift_number2, :string, null: false, default: '', limit: 16
    add_column :users, :section, :tinyint
    add_column :users, :expense_section, :tinyint
    add_column :users, :user_type, :tinyint, null: false, default: 1
    add_column :users, :sekisyo, :boolean, null: false, default: false
    add_column :users, :zip, :string, null: false, default: '', limit: 10
    add_column :users, :prefecture, :smallint
    add_column :users, :city, :string, null: false, default: '', limit: 16
    add_column :users, :street, :string, null: false, default: '', limit: 64
    add_column :users, :building, :string, null: false, default: '', limit: 64
    add_column :users, :tel, :string, null: false, default: '', limit: 16
    add_column :users, :mobile, :string, null: false, default: '', limit: 16
    add_column :users, :fax, :string, null: false, default: '', limit: 16
  end
end
