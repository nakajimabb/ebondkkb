class KkbCategory < ApplicationRecord
  has_many :kkbs, dependent: :destroy
  belongs_to :parent, class_name: 'KkbCategory', foreign_key: :parent_id, optional: true

  validates :code, presence: true
  validates :name, presence: true

  def set_created_or_updated_by(user_id)
    if new_record?
      self.created_by_id = user_id
    else
      self.updated_by_id = user_id
    end
  end
end
