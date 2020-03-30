class DestsController < ApplicationController
  before_action :set_dest, only: [:show, :edit, :update, :destroy]

  # GET /dests
  # GET /dests.json
  def index
    @dests = Dest.all
    if params[:search].present?
      @dests = @dests.search(params[:search])
    end
    if params[:closed] != 'true'
      @dests = @dests.non_closed
    end
    if params[:dest_type].present?
      @dests = @dests.where(dest_type: params[:dest_type])
    end
    case params[:provisional]&.to_sym
      when :exclude
        @dests = @dests.where(provisional: false)
      when :only
        @dests = @dests.where(provisional: true)
    end
    if params[:prefecture].present?
      @dests = @dests.where(prefecture: params[:prefecture])
    end
    @dests = @dests.page(params[:page])
  end

  # GET /dests/1
  # GET /dests/1.json
  def show
  end

  # GET /dests/new
  def new
    @dest = Dest.new
  end

  # GET /dests/1/edit
  def edit
  end

  # POST /dests
  # POST /dests.json
  def create
    @dest = Dest.new(dest_params)

    respond_to do |format|
      if @dest.save
        format.html { redirect_to dests_path, notice: 'Dest was successfully created.' }
        format.json { render :show, status: :created, location: @dest }
      else
        format.html { render :new }
        format.json { render json: @dest.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /dests/1
  # PATCH/PUT /dests/1.json
  def update
    respond_to do |format|
      if @dest.update(dest_params)
        format.html { redirect_to dests_path, notice: 'Dest was successfully updated.' }
        format.json { render :show, status: :ok, location: @dest }
      else
        format.html { render :edit }
        format.json { render json: @dest.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /dests/1
  # DELETE /dests/1.json
  def destroy
    @dest.destroy
    respond_to do |format|
      format.html { redirect_to dests_url, notice: 'Dest was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_dest
    @dest = Dest.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def dest_params
    params.require(:dest).permit(Dest::REGISTRABLE_ATTRIBUTES)
  end
end
