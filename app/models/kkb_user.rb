class KkbUser < ApplicationRecord
  belongs_to :kkb
  belongs_to :user

  enum permission: {hidden: 0, reader: 1, charge: 2, chief: 3, hidden_super: 4}

  REGISTRABLE_ATTRIBUTES = %i(id kkb_id user_id permission _destroy)
end
