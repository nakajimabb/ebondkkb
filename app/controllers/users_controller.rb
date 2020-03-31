class UsersController < ApplicationController
  before_action :set_user, only: [:show, :edit, :update, :destroy]

  # GET /users
  # GET /users.json
  def index
    @current_date = Date.today
    dated_params = {}
    @users = User.all
    if params[:search].present?
      @users = @users.search(params[:search])
    end
    if params[:retired] != 'true'
      @users = @users.non_retired(nil, false)
    end
    if params[:shop] != 'true'
      @users = @users.where(shop: false)
    end
    if params[:child] == 'true'
      @users = @users.where.not(parent_id: nil)
    end
    if params[:prefecture].present?
      @users = @users.where(prefecture: params[:prefecture])
    end
    if params[:job_type].present?
      dated_params[:job_type] = params[:job_type]
    end
    if params[:employment].present?
      dated_params[:employment] = params[:employment]
    end
    if params[:company_id].present?
      dated_params[:company_id] = params[:company_id]
    end
    if params[:area_id].present?
      dated_params[:area_id] = params[:area_id]
    end
    # @users = @users.eager_load(:user_dated_values)
    suspend = (params[:suspend] == 'true') ? nil : false
    @users = @users.with_dated_values(@current_date, dated_params, suspend) if dated_params.present?
    @users = @users.page(params[:page])
  end

  # GET /users/1
  # GET /users/1.json
  def show
  end

  # GET /users/new
  def new
    @user = User.new
  end

  # GET /users/1/edit
  def edit
  end

  # POST /users
  # POST /users.json
  def create
    @user = User.new(user_params)

    respond_to do |format|
      if @user.save
        format.html { redirect_to users_path, notice: 'User was successfully created.' }
        format.json { render :show, status: :created, location: @user }
      else
        format.html { render :new }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /users/1
  # PATCH/PUT /users/1.json
  def update
    respond_to do |format|
      user_p = user_params
      if user_p[:password].blank? && user_p[:password_confirmation].blank?
        user_p.delete(:password)
        user_p.delete(:password_confirmation)
      end
      if @user.update(user_p)
        format.html { redirect_to users_path, notice: 'User was successfully updated.' }
        format.json { render :show, status: :ok, location: @user }
      else
        format.html { render :edit }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /users/1
  # DELETE /users/1.json
  def destroy
    @user.destroy
    respond_to do |format|
      format.html { redirect_to users_url, notice: 'User was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_user
    @user = User.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def user_params
    params.require(:user).permit(User::REGISTRABLE_ATTRIBUTES)
  end
end
