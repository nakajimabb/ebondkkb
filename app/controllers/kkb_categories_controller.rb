class KkbCategoriesController < ApplicationController
  def index
    @kkb_categories = KkbCategory.all.order(:rank, :code)
  end

  def show
    @kkb_category = KkbCategory.find(params[:id])
  end
end
