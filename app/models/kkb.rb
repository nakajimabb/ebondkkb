class Kkb < ApplicationRecord
  belongs_to :kkb_category
  belongs_to :posted_by, class_name: 'User', foreign_key: :posted_by_id
  has_many :kkb_users, dependent: :destroy
  has_many :users, through: :kkb_users
  has_many :kkb_groups, dependent: :destroy
  has_many :groups, through: :kkb_groups
  belongs_to :created_by, class_name: 'User', foreign_key: :created_by_id, optional: true
  belongs_to :updated_by, class_name: 'User', foreign_key: :updated_by_id, optional: true

  enum kkb_type: {bbs: 1, task: 2, shift_haken: 12, shift_haken_month: 13, file_list: 101, file_project: 102,
                  check_list: 103, questionnaire: 111, misc_exp: 201, misc_exp_alert: 202, business_report: 211,
                  commuting_exp: 221, commuting_exp_alert: 222, report_fixed_count: 241, routine_task_submit: 301,
                  routine_task_check: 302, routine_task_confirm: 303, doc: 331, pdf_image: 10098, guide: 10099,
                  rule: 10100, priority_task: 10200, shift_user: 10220, shift_dest: 10230, paid_holidays_list: 10300,
                  shift_users_haken: 10400, shift_users_haken_month: 10410, personnel_change: 10500,
                  user_edit_self: 10600, department_edit_self: 10610, recruit_pharmacist_info: 10700,
                  off_hours_report: 10800, accident_report: 10810, internal_history: 10900}
  enum status: {denial: 0, waiting: 1, active: 2, pending: 3, closed: 4, draft: 5}

  REGISTRABLE_ATTRIBUTES = %i(kkb_type kkb_category_id title content posted_by_id status open created_by_id updated_by_id)

  def set_created_or_updated_by(user_id)
    if new_record?
      self.created_by_id = user_id
    else
      self.updated_by_id = user_id
    end
  end
end
