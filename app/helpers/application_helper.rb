module ApplicationHelper
  def attr_i18n(model, column)
    t("activerecord.attributes.#{model}.#{column}")
  end

  def prefecture_i18n(code)
    t("prefecture.#{code}") if code.present?
  end

  def prefecture_options
    User.prefectures.map { |code, _| [prefecture_i18n(code), code] }
  end

  def user_dated_value_options(code)
    UserDatedValue.enum_values(code).map { |key, value| [t("enum_values.user_dated_value.#{code}.#{key}"), value] }
  end

  def view_i18n(code, model='app')
    t("views.#{model}.#{code}") if code.present?
  end
end
