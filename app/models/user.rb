class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :recoverable, :rememberable,
         :validatable, :lockable, :timeoutable, :trackable

  enum sex: {male: 1, female: 2}
  enum user_type: {normal: 1, shop: 99, admin: 100}
  enum section: {common: 0, weeds: 1, leaf: 2, lunar: 3, adviser: 4}
  enum expense_section: {expense_weeds: 1, expense_leaf: 2, expense_lunar: 3}
  enum prefecture: Prefecture::CODES

  validates :code,
            presence: true,
            uniqueness: { case_sensitive: :false },
            length: { minimum: 2, maximum: 16 }

  REGISTRABLE_ATTRIBUTES = %i(code email first_name last_name first_name_kana last_name_kana sex birthday
                              zip prefecture city street building tel mobile fax
                              password password_confirmation)

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
