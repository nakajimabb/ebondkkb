class KkbUser < ApplicationRecord
  belongs_to :kkb
  belongs_to :user

  enum permission: {hidden: 0, reader: 1, charge: 2, chief: 3, hidden_super: 4}
end
