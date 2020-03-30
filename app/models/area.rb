class Area < ApplicationRecord
  has_many :region_areas, dependent: :destroy
  has_many :regions, through: :region_areas

  validates :code,
            presence: true,
            uniqueness: { case_sensitive: :false },
            length: { minimum: 1, maximum: 16 }
  validates :name, presence: true

  REGISTRABLE_ATTRIBUTES = %i(code name short_name hidden)

  scope :active, -> { where(hidden: false) }

  def name_with_code
    "#{name}(#{code})"
  end
end
