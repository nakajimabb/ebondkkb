class Group < ApplicationRecord
  has_many :group_users, dependent: :destroy
  has_many :users, through: :group_users

  validates :code, presence: true
  validates :name, presence: true
end
