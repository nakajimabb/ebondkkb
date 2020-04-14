class ShiftUsersController < ApplicationController
  def shift_table
    if params[:start_date] && params[:end_date] && params[:job_type]
      start_date = Date.parse(params[:start_date])
      end_date = Date.parse(params[:end_date])
      job_type = params[:job_type]

      @span = start_date..end_date
      @users = User.active.with_dated_values(start_date, {job_type: job_type}).order(:shift_number2)
      @users = @users.where(id: params[:user_id]) if params[:user_id].present?
      user_ids = @users.pluck(:id)
      @dests = Dest.active.order(:shift_number2)
      @shift_users = {}
      @shift_users[:weekly] = ShiftUser.shift_users_weekly(@span, user_ids)
      @shift_users[:holiday] = ShiftUser.shift_users_holiday(@span, user_ids)
      @shift_users[:custom] = ShiftUser.where(proc_type: :custom, user_id: user_ids, dated_on: @span)
      @shift_users[:rest_week] = ShiftUser.where(proc_type: :rest_week, user_id: user_ids, dated_on: @span)
      @shift_users[:daily] = ShiftUser.where(proc_type: :daily, user_id: user_ids, dated_on: @span)

      user_dated_codes = [:job_type, :table_type, :employment, :suspend, :area_id, :company_id]
      @user_dated_values = UserDatedValue.where(code: user_dated_codes)
      @dest_dated_values = DestDatedValue.all
    end
  end
end
