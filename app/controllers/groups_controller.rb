class GroupsController < ApplicationController
  before_action :set_group, only: [:show, :edit, :update, :destroy]

  # GET /groups
  # GET /groups.json
  def index
    @groups = Group.eager_load(:users).page(params[:page])
  end

  # GET /groups/1
  # GET /groups/1.json
  def show
  end

  # GET /groups/new
  def new
    @group = Group.new
    @group_users = GroupUser.none
  end

  # GET /groups/1/edit
  def edit
    @group_users = group_users(@group, true)
  end

  # POST /groups
  # POST /groups.json
  def create
    @group = Group.new(group_params)

    respond_to do |format|
      if @group.save
        format.html { redirect_to groups_path, notice: 'Group was successfully created.' }
        format.json { render :show, status: :created, location: @group }
      else
        @group_users = group_users(@group, false)
        format.html { render :new }
        format.json { render json: @group.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /groups/1
  # PATCH/PUT /groups/1.json
  def update
    respond_to do |format|
      if @group.update(group_params)
        format.html { redirect_to groups_path, notice: 'Group was successfully updated.' }
        format.json { render :show, status: :ok, location: @group }
      else
        @group_users = group_users(@group, false)
        format.html { render :edit }
        format.json { render json: @group.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /groups/1
  # DELETE /groups/1.json
  def destroy
    @group.destroy
    respond_to do |format|
      format.html { redirect_to groups_url, notice: 'Group was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    def group_users(group, eager_load)
      result = group.group_users
      result = result.eager_load(:user) if eager_load
      result.map do |gu|
        {
          id: gu.id,
          user_id: gu.user_id,
          _destroy: gu._destroy,
          user_name: gu.user&.name_with_code,
          error: gu.errors.full_messages.join(',')
        }
      end
    end

    # Use callbacks to share common setup or constraints between actions.
    def set_group
      @group = Group.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def group_params
      params.require(:group).permit(Group::REGISTRABLE_ATTRIBUTES +
                                   [group_users_attributes: GroupUser::REGISTRABLE_ATTRIBUTES])
    end
end
