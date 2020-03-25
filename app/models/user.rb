class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :registerable, :confirmable, :recoverable, :omniauthable
  devise :database_authenticatable, :rememberable,
         :timeoutable, :trackable, :validatable, :lockable

  enum sex: {male: 1, female: 2}
  enum section: {weeds: 1, leaf: 2, lunar: 3, adviser: 4}
  enum expense_section: {expense_weeds: 1, expense_leaf: 2, expense_lunar: 3}
  enum prefecture: Prefecture::CODES

  validates :code,
            presence: true,
            uniqueness: { case_sensitive: :false },
            length: { minimum: 2, maximum: 16 }

  REGISTRABLE_ATTRIBUTES = %i(code email first_name last_name first_name_kana last_name_kana sex birthday
                              zip prefecture city street building tel mobile fax
                              shift_number1 shift_number2
                              password password_confirmation)

  scope :search, -> (user_name) do
    user_name = user_name.gsub(/\p{Blank}/, '')
    if user_name =~ /^[0-9a-zA-Z$]+$/
      where('code LIKE ?', '%' + user_name + '%')
    elsif user_name =~ /^[\p{Hiragana}]+$/ or user_name =~ /^[\p{Katakana}]+$/
      user_name = user_name.tr('ぁ-ん','ァ-ン')
      where('concat(last_name_kana, first_name_kana) LIKE ?', '%' + user_name + '%')
    else
      where('concat(last_name, first_name) LIKE ?', '%' + user_name + '%')
    end
  end

  scope :active, -> (day=nil, except_shop=true, except_columns=nil) do
    day ||= Date.today
    excepts = except_columns || []

    users = all
    users = users.where(shop: false) if except_shop
    unless excepts.include?(:entered_on)
      users = users.where('entered_on is null or entered_on <= ?', day)
    end
    unless excepts.include?(:started_on)
      users = users.where('started_on is null or started_on <= ?', day)
    end
    unless excepts.include?(:finished_on)
      users = users.where('finished_on is null or finished_on >= ?', day)
    end
    unless excepts.include?(:retired_on)
      users = users.where('retired_on is null or retired_on >= ?', day)
    end
    users
  end

  scope :non_retired, -> (day=nil, except_shop=true) do
    active(day, except_shop, [:entered_on, :started_on, :finished_on])
  end

  def admin?
    self.id == 1
  end

  def name
    [last_name, first_name].compact.join(' ')
  end

  def kana
    [last_name_kana, first_name_kana].compact.join(' ')
  end

  def name_with_code
    name + '(' + code + ')'
  end
end
