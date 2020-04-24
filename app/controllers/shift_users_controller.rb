class ShiftUsersController < ApplicationController
  def get_shift_users
    if params[:start_date] && params[:end_date] && (params[:job_type] || params[:user_id])
      start_date = Date.parse(params[:start_date])
      end_date = Date.parse(params[:end_date])

      @span = start_date..end_date
      if params[:job_type]
        job_type = params[:job_type]
        @users = User.active.with_dated_values(start_date, {job_type: job_type}).order(:shift_number2)
      elsif params[:user_id]
        @users = User.where(id: params[:user_id])
      end
      user_ids = @users.pluck(:id)
      @shift_users = {}
      @shift_users[:weekly] = ShiftUser.shift_users_weekly(@span, user_ids)
      @shift_users[:holiday] = ShiftUser.shift_users_holiday(@span, user_ids)
      @shift_users[:custom] = ShiftUser.where(proc_type: :custom, user_id: user_ids, dated_on: @span)
      @shift_users[:rest_week] = ShiftUser.where(proc_type: :rest_week, user_id: user_ids, dated_on: @span)
      @shift_users[:daily] = ShiftUser.where(proc_type: :daily, user_id: user_ids, dated_on: @span)

      if params[:dests]
        @dests = Dest.active.order(:shift_number2)
      end
      if params[:user_dated_values]
        user_dated_codes = [:job_type, :table_type, :employment, :suspend, :area_id, :company_id]
        @user_dated_values = UserDatedValue.where(code: user_dated_codes)
      end
      if params[:dest_dated_values]
        @dest_dated_values = DestDatedValue.all
      end
    end
  end

  def save_shift_users
    begin
      destroy_shift_users, modify_shift_users, _ = collect_shift_users
      ShiftUser.transaction do
        destroy_shift_users.each{ |s| s.update!(proc_type: nil) }
        modify_shift_users.each(&:save!)
      end
      render status: 200, json: {}
    rescue => e
      errors = collect_errors(modify_shift_users)
      errors << e.message if errors.blank?
      render status: 500, json: {errors: errors}
    end
  end

 private
  def collect_errors(records)
    errors = []
    records.each do |record|
      errors += record.errors.full_messages unless record.valid?
    end
    errors
  end

  def collect_shift_users
    destroy_shift_users = []
    modify_shift_users = []
    shift_users = []
    shift_users_params.map do |shift_user_param|
      shift_user = ShiftUser.find_or_initialize_by(id: shift_user_param[:id])
      shift_user.assign_attributes(shift_user_param.permit(ShiftUser::REGISTRABLE_ATTRIBUTES))
      if shift_user_param[:_destroy]
        destroy_shift_users << shift_user
      elsif shift_user_param[:_modify]
        modify_shift_users << shift_user
      else
        shift_users << shift_user
      end
    end
    [destroy_shift_users, modify_shift_users, shift_users]
  end

  def shift_users_params
    params.permit(shift_users: ShiftUser::REGISTRABLE_ATTRIBUTES + [:_modify, :_destroy])[:shift_users]
  end
end
