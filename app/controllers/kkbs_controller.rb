class KkbsController < ApplicationController
  before_action :set_kkb, only: [:show, :edit, :update, :destroy]

  def index
    base_query = Kkb.eager_load(:users).eager_load(groups: :users)
    kkbs = base_query.where(open: true)
    kkbs = kkbs.or(base_query.where(posted_by_id: current_user.id))
    kkbs = kkbs.or(base_query.where(users: {id: current_user.id}))
    kkbs = kkbs.or(base_query.where(groups: {group_users: {user_id: current_user.id}}))

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

    respond_to do |format|
      if @kkb.save
        format.html { redirect_to kkbs_path, notice: 'Kkb was successfully created.' }
        format.json { render :show, status: :created, location: @kkb }
      else
        @kkb_users = kkb_users(@kkb, false)
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

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_kkb
    @kkb = Kkb.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def kkb_params
    params.require(:kkb).permit(Kkb::REGISTRABLE_ATTRIBUTES)
  end
end
