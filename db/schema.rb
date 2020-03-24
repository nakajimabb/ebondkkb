# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_03_24_043539) do

  create_table "users", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string "current_sign_in_ip"
    t.string "last_sign_in_ip"
    t.integer "failed_attempts", default: 0, null: false
    t.string "unlock_token"
    t.datetime "locked_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "code", limit: 16, null: false
    t.string "first_name", limit: 32, default: "", null: false
    t.string "last_name", limit: 32, default: "", null: false
    t.string "first_name_kana", limit: 32, default: "", null: false
    t.string "last_name_kana", limit: 32, default: "", null: false
    t.integer "sex", limit: 1
    t.date "birthday"
    t.date "entered_on"
    t.date "retired_on"
    t.date "started_on"
    t.date "finished_on"
    t.string "shift_number1", limit: 16, default: "", null: false
    t.string "shift_number2", limit: 16, default: "", null: false
    t.integer "section", limit: 1
    t.integer "expense_section", limit: 1
    t.integer "user_type", limit: 1, default: 1, null: false
    t.boolean "sekisyo", default: false, null: false
    t.string "zip", limit: 10, default: "", null: false
    t.integer "prefecture", limit: 2
    t.string "city", limit: 16, default: "", null: false
    t.string "street", limit: 64, default: "", null: false
    t.string "building", limit: 64, default: "", null: false
    t.string "tel", limit: 16, default: "", null: false
    t.string "mobile", limit: 16, default: "", null: false
    t.string "fax", limit: 16, default: "", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["unlock_token"], name: "index_users_on_unlock_token", unique: true
  end

end
