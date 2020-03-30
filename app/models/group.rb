class Group < ApplicationRecord
  has_many :group_users, dependent: :destroy
  accepts_nested_attributes_for :group_users, allow_destroy: true
  has_many :users, through: :group_users

  validates :code,
            presence: true,
            uniqueness: { case_sensitive: :false },
            length: { minimum: 2, maximum: 16 }
  validates :name, presence: true

  REGISTRABLE_ATTRIBUTES = %i(code name hidden)

  scope :search, -> (group_name) do
    group_name = group_name.gsub(/\p{Blank}/, '')
    if group_name =~ /^[0-9a-zA-Z$]+$/
      where('groups.code LIKE ?', '%' + group_name + '%')
    elsif group_name =~ /^[\p{Hiragana}]+$/ or group_name =~ /^[\p{Katakana}]+$/
      group_name = group_name.tr('ぁ-ん','ァ-ン')
      where('groups.kana LIKE ?', '%' + group_name + '%')
    else
      where('groups.name LIKE ?', '%' + group_name + '%')
    end
  end
end
