class ShiftUser < ApplicationRecord
  REGISTRABLE_ATTRIBUTES = %i(id dated_on user_id dest_id roster_type period_type proc_type frame_type)

  belongs_to :user
  belongs_to :dest, optional: true

  enum roster_type: {at_work: 1, legal_holiday: 2, paid_holiday: 3}
  enum frame_type: {frame_normal: 1, frame_k: 3, frame_p: 4, frame_x: 5, frame_f: 6, frame_c: 7}
  enum period_type: {full: 0, am: 1, pm: 2, night: 3}
  # weekly: 基本設計, holiday: 基本設計(祝日), custom: カスタム, rest_week: 祝日処理, daily: 日別, waiting: 許可待(日別)
  enum proc_type: {weekly: 1, holiday: 2, custom: 3, rest_week: 4, daily: 5, waiting: 6}

  validates :dated_on, presence: true
  validates :user_id, presence: true
  validates :period_type, uniqueness: { scope: [:dated_on, :user_id, :period_type, :proc_type]  }

  # user_id で絞り込んだほうが高速なので基本使用しない
  scope :with_dated_values, -> (params, date=nil, suspend=false) do
    params = params.dup
    # TODO: user_dated_value に suspend がない場合も考慮する必要がある
    params[:suspend] = suspend if !suspend.nil? && !params.has_key?(:suspend)
    shift_users = all
    params.each do |code, value|
      joined = "dated_values_#{code}"
      value = UserDatedValue.enum_value(code, value)
      code = UserDatedValue.codes[code]
      shift_users = shift_users.joins("join user_dated_values #{joined} on shift_users.user_id = #{joined}.user_id")
      if date
        shift_users = shift_users.where("#{joined}.dated_on = (select max(user_dated_values.dated_on) from user_dated_values where user_dated_values.dated_on <= ? and user_id = shift_users.user_id and code = ?)", date, code)
      else
        shift_users = shift_users.where("#{joined}.dated_on = (select max(user_dated_values.dated_on) from user_dated_values where user_dated_values.dated_on <= shift_users.dated_on and user_id = shift_users.user_id and code = ?)", code)
      end
      shift_users = shift_users.where(joined => {code: code, value: value})
      shift_users
    end
    shift_users.group(:id)
  end

  def dest_name
    dest&.name.to_s
  end

  def dest_name_with_code
    dest&.name_with_code.to_s
  end

  def self.shift_users_weekly(span, user_id=nil, dated_params=nil)
    results = {}
    span.each do |date|
      proc_type = ShiftUser.proc_types[:weekly]
      cond = "proc_type = ? and s.user_id = shift_users.user_id and dayofweek(s.dated_on) = dayofweek(?) and s.dated_on <= ?"
      sub_q = "(select max(s.dated_on) from shift_users s where #{cond})"
      shift_users = ShiftUser.where(proc_type: proc_type)
      shift_users = shift_users.where("shift_users.dated_on >= #{sub_q}", proc_type, date, date)
      shift_users = shift_users.where("shift_users.dated_on <= ?", span.max)
      shift_users = shift_users.where('dayofweek(shift_users.dated_on) = dayofweek(?)', date)
      shift_users = shift_users.where(user_id: user_id) if user_id
      shift_users = shift_users.with_dated_values(dated_params, date) if dated_params
      results[date.wday] = shift_users
    end
    results
  end

  def self.shift_users_holiday(span)
    proc_type = ShiftUser.proc_types[:holiday]
    cond = "proc_type = ? and s.user_id = shift_users.user_id and s.dated_on <= ?"
    sub_q = "(select max(s.dated_on) from shift_users s where #{cond})"
    shift_users = ShiftUser.where(proc_type: proc_type)
    shift_users = shift_users.where("shift_users.dated_on >= #{sub_q}", proc_type, span.min)
    shift_users = shift_users.where("shift_users.dated_on <= ?", span.max)
    shift_users
  end
end
