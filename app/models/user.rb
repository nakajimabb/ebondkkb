class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :registerable, :confirmable, :recoverable, :omniauthable
  devise :database_authenticatable, :rememberable,
         :timeoutable, :trackable, :validatable, :lockable

  belongs_to :parent, class_name: "User", foreign_key: :parent_id, optional: true
  has_many :group_users, dependent: :destroy
  has_many :groups, through: :group_users
  has_many :user_dated_values, dependent: :destroy

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
                              shift_number1 shift_number2 parent_id
                              password password_confirmation)

  scope :search, -> (user_name) do
    user_name = user_name.gsub(/\p{Blank}/, '')
    if user_name =~ /^[0-9a-zA-Z$]+$/
      where('users.code LIKE ?', '%' + user_name + '%')
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

  scope :with_dated_values, -> (date, params, suspend=false) do
    params = params.dup
    # TODO: user_dated_value に suspend がない場合も考慮する必要がある
    params[:suspend] = suspend if !suspend.nil? && !params.has_key?(:suspend)
    users = all
    params.each do |code, value|
      joined = "dated_values_#{code}"
      code = UserDatedValue.codes[code]
      users = users.joins("join user_dated_values #{joined} on users.id = #{joined}.user_id")
      users = users.where("#{joined}.dated_on = (select max(dated_on) from user_dated_values where dated_on <= ? and user_id = users.id and code = ?)", date, code)
      users = users.where(joined => {code: code, value: value})
      users
    end
    users.group(:id)
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
