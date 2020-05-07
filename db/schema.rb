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

ActiveRecord::Schema.define(version: 2020_04_09_011422) do

  create_table "areas", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.string "code", limit: 16, null: false
    t.string "name", limit: 16, default: "", null: false
    t.string "short_name", limit: 16, default: "", null: false
    t.boolean "hidden", default: false, null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["code"], name: "index_areas_on_code", unique: true
  end

  create_table "companies", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.string "code", null: false
    t.string "name", default: "", null: false
    t.boolean "hidden", default: false, null: false
    t.integer "section", limit: 1, default: 1, null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["code"], name: "index_companies_on_code", unique: true
  end

  create_table "dest_dated_values", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.bigint "dest_id", null: false
    t.date "dated_on", null: false
    t.integer "code", limit: 1, null: false
    t.integer "value"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["dest_id", "code", "dated_on"], name: "index_dest_dated_values_on_dest_id_and_code_and_dated_on", unique: true
    t.index ["dest_id"], name: "index_dest_dated_values_on_dest_id"
  end

  create_table "dests", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.bigint "company_id", null: false
    t.string "code", limit: 32, null: false
    t.string "name", limit: 32, default: "", null: false
    t.string "kana", limit: 32, default: "", null: false
    t.integer "dest_type", limit: 1, default: 1, null: false
    t.string "shift_number1", limit: 16, default: "", null: false
    t.string "shift_number2", limit: 16, default: "", null: false
    t.date "opened_on"
    t.date "closed_on"
    t.date "started_on"
    t.date "finished_on"
    t.string "zip", limit: 10, default: "", null: false
    t.integer "prefecture", limit: 2
    t.string "city", limit: 16, default: "", null: false
    t.string "street", limit: 64, default: "", null: false
    t.string "building", limit: 64, default: "", null: false
    t.boolean "provisional", default: false, null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["company_id", "code"], name: "index_dests_on_company_id_and_code", unique: true
    t.index ["company_id"], name: "index_dests_on_company_id"
  end

  create_table "group_users", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.bigint "group_id", null: false
    t.bigint "user_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["group_id", "user_id"], name: "index_group_users_on_group_id_and_user_id", unique: true
    t.index ["group_id"], name: "index_group_users_on_group_id"
    t.index ["user_id"], name: "index_group_users_on_user_id"
  end

  create_table "groups", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.string "name", null: false
    t.string "code", null: false
    t.boolean "hidden", default: false, null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["code"], name: "index_groups_on_code", unique: true
  end

  create_table "kkb_categories", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.string "code", null: false
    t.string "name", null: false
    t.integer "rank"
    t.bigint "parent_id"
    t.bigint "created_by_id"
    t.bigint "updated_by_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["code"], name: "index_kkb_categories_on_code", unique: true
    t.index ["created_by_id"], name: "index_kkb_categories_on_created_by_id"
    t.index ["parent_id"], name: "index_kkb_categories_on_parent_id"
    t.index ["updated_by_id"], name: "index_kkb_categories_on_updated_by_id"
  end

  create_table "kkb_groups", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.bigint "kkb_id", null: false
    t.bigint "group_id", null: false
    t.integer "permission", limit: 1, null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["group_id"], name: "index_kkb_groups_on_group_id"
    t.index ["kkb_id", "group_id"], name: "index_kkb_groups_on_kkb_id_and_group_id", unique: true
    t.index ["kkb_id"], name: "index_kkb_groups_on_kkb_id"
  end

  create_table "kkb_users", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.bigint "kkb_id", null: false
    t.bigint "user_id", null: false
    t.integer "permission", limit: 1, null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["kkb_id", "user_id"], name: "index_kkb_users_on_kkb_id_and_user_id", unique: true
    t.index ["kkb_id"], name: "index_kkb_users_on_kkb_id"
    t.index ["user_id"], name: "index_kkb_users_on_user_id"
  end

  create_table "kkbs", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.integer "kkb_type", null: false
    t.bigint "kkb_category_id", null: false
    t.string "title"
    t.text "content"
    t.bigint "posted_by_id", null: false
    t.integer "status", limit: 1
    t.boolean "open", default: true, null: false
    t.datetime "checked_at"
    t.bigint "created_by_id"
    t.bigint "updated_by_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["created_by_id"], name: "index_kkbs_on_created_by_id"
    t.index ["kkb_category_id"], name: "index_kkbs_on_kkb_category_id"
    t.index ["posted_by_id"], name: "index_kkbs_on_posted_by_id"
    t.index ["updated_by_id"], name: "index_kkbs_on_updated_by_id"
  end

  create_table "region_areas", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.bigint "region_id", null: false
    t.bigint "area_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["area_id"], name: "index_region_areas_on_area_id"
    t.index ["region_id", "area_id"], name: "index_region_areas_on_region_id_and_area_id", unique: true
    t.index ["region_id"], name: "index_region_areas_on_region_id"
  end

  create_table "regions", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.string "code", limit: 16, null: false
    t.string "name", limit: 16, default: "", null: false
    t.boolean "hidden", default: false, null: false
    t.integer "rank", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["code"], name: "index_regions_on_code", unique: true
  end

  create_table "shift_users", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.date "dated_on", null: false
    t.bigint "user_id", null: false
    t.bigint "dest_id"
    t.integer "period_type", null: false
    t.integer "proc_type", null: false
    t.integer "roster_type", null: false
    t.integer "frame_type", default: 1, null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["dated_on", "user_id", "period_type", "proc_type"], name: "index_shift_user_date_user_period_proc", unique: true
    t.index ["dest_id"], name: "index_shift_users_on_dest_id"
    t.index ["user_id"], name: "index_shift_users_on_user_id"
  end

  create_table "user_dated_values", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.date "dated_on", null: false
    t.integer "code", limit: 1, null: false
    t.integer "value"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_id", "code", "dated_on"], name: "index_user_dated_values_on_user_id_and_code_and_dated_on", unique: true
    t.index ["user_id"], name: "index_user_dated_values_on_user_id"
  end

  create_table "users", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
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
    t.boolean "sekisyo", default: false, null: false
    t.boolean "shop", default: false, null: false
    t.string "zip", limit: 10, default: "", null: false
    t.integer "prefecture", limit: 2
    t.string "city", limit: 16, default: "", null: false
    t.string "street", limit: 64, default: "", null: false
    t.string "building", limit: 64, default: "", null: false
    t.string "tel", limit: 16, default: "", null: false
    t.string "mobile", limit: 16, default: "", null: false
    t.string "fax", limit: 16, default: "", null: false
    t.bigint "parent_id"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["parent_id"], name: "index_users_on_parent_id"
    t.index ["unlock_token"], name: "index_users_on_unlock_token", unique: true
  end

  add_foreign_key "dest_dated_values", "dests"
  add_foreign_key "dests", "companies"
  add_foreign_key "group_users", "groups"
  add_foreign_key "group_users", "users"
  add_foreign_key "kkb_categories", "kkb_categories", column: "parent_id"
  add_foreign_key "kkb_categories", "users", column: "created_by_id"
  add_foreign_key "kkb_categories", "users", column: "updated_by_id"
  add_foreign_key "kkb_groups", "groups"
  add_foreign_key "kkb_groups", "kkbs"
  add_foreign_key "kkb_users", "kkbs"
  add_foreign_key "kkb_users", "users"
  add_foreign_key "kkbs", "kkb_categories"
  add_foreign_key "kkbs", "users", column: "created_by_id"
  add_foreign_key "kkbs", "users", column: "posted_by_id"
  add_foreign_key "kkbs", "users", column: "updated_by_id"
  add_foreign_key "region_areas", "areas"
  add_foreign_key "region_areas", "regions"
  add_foreign_key "shift_users", "dests"
  add_foreign_key "shift_users", "users"
  add_foreign_key "user_dated_values", "users"
  add_foreign_key "users", "users", column: "parent_id"
end
