class Group < ApplicationRecord
  has_many :group_users, dependent: :destroy
  accepts_nested_attributes_for :group_users, allow_destroy: true
  has_many :users, through: :group_users

  validates :code, presence: true
  validates :name, presence: true

  REGISTRABLE_ATTRIBUTES = %i(code name hidden)

end
