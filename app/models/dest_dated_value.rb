class DestDatedValue < ApplicationRecord
  belongs_to :dest

  enum code: {area_id: 1, supervisor_id: 2}
end
