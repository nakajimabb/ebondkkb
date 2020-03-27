class GroupUser < ApplicationRecord
  belongs_to :group
  belongs_to :user

  validates :user_id, uniqueness: { scope: [:group_id, :user_id]  }

  REGISTRABLE_ATTRIBUTES = %i(id user_id group_id _destroy)
end
