class RegionsController < ApplicationController
  before_action :set_region, only: [:edit, :update, :destroy]

  # GET /regions
  # GET /regions.json
  def index
    @regions = Region.eager_load(:areas).order(:rank)
  end

  # GET /regions/new
  def new
    @region = Region.new
    @region_areas = RegionArea.none
  end

  # GET /regions/1/edit
  def edit
    @region_areas = region_areas(@region, true)
  end

  # POST /regions
  # POST /regions.json
  def create
    @region = Region.new(region_params)

    respond_to do |format|
      if @region.save
        format.html { redirect_to regions_path, notice: 'Region was successfully created.' }
        format.json { render :show, status: :created, location: @region }
      else
        @region_areas = region_areas(@region, false)
        format.html { render :new }
        format.json { render json: @region.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /regions/1
  # PATCH/PUT /regions/1.json
  def update
    respond_to do |format|
      if @region.update(region_params)
        format.html { redirect_to regions_path, notice: 'Region was successfully updated.' }
        format.json { render :show, status: :ok, location: @region }
      else
        @region_areas = region_areas(@region, false)
        format.html { render :edit }
        format.json { render json: @region.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /regions/1
  # DELETE /regions/1.json
  def destroy
    @region.destroy
    respond_to do |format|
      format.html { redirect_to regions_url, notice: 'Region was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private

  def region_areas(region, eager_load)
    result = region.region_areas
    result = result.eager_load(:area) if eager_load
    result.map do |ra|
      {
          id: ra.id,
          area_id: ra.area_id,
          _destroy: ra._destroy,
          _modify: ra.changed?,
          area_name: ra.area&.name,
          error: ra.errors.full_messages.join(',')
      }
    end
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_region
    @region = Region.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def region_params
    params.require(:region).permit(Region::REGISTRABLE_ATTRIBUTES +
                                      [region_areas_attributes: RegionArea::REGISTRABLE_ATTRIBUTES])
  end
end
