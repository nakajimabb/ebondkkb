class KkbGroup < ApplicationRecord
  belongs_to :kkb
  belongs_to :group

  enum permission: {reader: 1, charge: 2}
end
