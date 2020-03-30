class RegionArea < ApplicationRecord
  belongs_to :region
  belongs_to :area

  validates :area_id, uniqueness: { scope: [:region_id, :area_id]  }

  REGISTRABLE_ATTRIBUTES = %i(id region_id area_id _destroy)
end
