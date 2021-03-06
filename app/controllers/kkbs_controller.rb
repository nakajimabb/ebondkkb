class KkbsController < ApplicationController
  before_action :set_kkb, only: [:show, :edit, :update, :destroy, :kkb_users]

  def index
    base_query = Kkb.all
    if params[:kkb_category_id].present?
      base_query = base_query.where(kkb_category_id: params[:kkb_category_id])
    end
    kkbs = base_query.where(open: true)
    kkbs = kkbs.or(base_query.where(posted_by_id: current_user.id))
    kkb_users = KkbUser.where(user_id: current_user.id).select(:kkb_id).distinct
    kkb_groups = KkbGroup.eager_load(group: :users).where(group: {users: {id: current_user.id}}).select(:kkb_id).distinct
    kkb_ids = (kkb_users.pluck(:kkb_id) + kkb_groups.pluck(:kkb_id)).uniq
    kkbs = kkbs.or(base_query.where(id: kkb_ids))

    @kkbs = kkbs.order(updated_at: :desc).page(params[:page]).per(60)
  end

  def show
  end

  # GET /kkbs/new
  def new
    @kkb = Kkb.new
  end

  # GET /kkbs/1/edit
  def edit
  end

  # POST /kkbs
  # POST /kkbs.json
  def create
    @kkb = Kkb.new(kkb_params)
    #TODO
    @kkb.kkb_type = :bbs
    @kkb.posted_by_id = current_user.id

    respond_to do |format|
      if @kkb.save
        format.html { redirect_to kkbs_path, notice: 'Kkb was successfully created.' }
        format.json { head :created }
      else
        format.html { render :new }
        format.json { render json: @kkb.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /kkbs/1
  # PATCH/PUT /kkbs/1.json
  def update
    respond_to do |format|
      if @kkb.update(kkb_params)
        format.html { redirect_to kkbs_path, notice: 'Kkb was successfully updated.' }
        format.json { render :show, status: :ok, location: @kkb }
      else
        format.html { render :edit }
        format.json { render json: @kkb.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /kkbs/1
  # DELETE /kkbs/1.json
  def destroy
    @kkb.destroy
    respond_to do |format|
      format.html { redirect_to kkbs_url, notice: 'Kkb was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  def kkb_users
    result = @kkb.users.map do |kkb_user|
      {
          id: kkb_user.id,
          user_id: kkb_user.user_id,
          permission: kkb_user.permission,
          _destroy: kkb_user._destroy,
          _modify: kkb_user.changed?,
          user_name: kkb_user.user&.name_with_code,
          error: kkb_user.errors.full_messages.join(',')
      }
    end
    render json: result
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_kkb
    @kkb = Kkb.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def kkb_params
    params.require(:kkb).permit(Kkb::REGISTRABLE_ATTRIBUTES + [kkb_users_attributes: KkbUser::REGISTRABLE_ATTRIBUTES])
  end
end
