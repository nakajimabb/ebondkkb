class Company < ApplicationRecord
  has_many :dests, dependent: :destroy

  enum section: {weeds: 1, lunar: 2, third_pole: 3}

  REGISTRABLE_ATTRIBUTES = %i(code name section hidden)

  scope :search, -> (name) do
    name = name.gsub(/\p{Blank}/, '')
    if name =~ /^[0-9a-zA-Z$]+$/
      where('code LIKE ?', '%' + name + '%')
    else
      where('name LIKE ?', '%' + name + '%')
    end
  end

  scope :active, -> { where(hidden: false) }

  def name_with_code
    "#{name}(#{code})"
  end
end
