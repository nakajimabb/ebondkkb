class Region < ApplicationRecord
  has_many :region_areas, dependent: :destroy
  accepts_nested_attributes_for :region_areas, allow_destroy: true
  has_many :areas, through: :region_areas

  REGISTRABLE_ATTRIBUTES = %i(code name hidden rank)
end
