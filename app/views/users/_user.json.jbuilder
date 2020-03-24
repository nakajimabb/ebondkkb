json.extract! user, :id, :code, :email, :first_name, :last_name, :first_name_kana, :last_name_kana, :sex, :birthday, :zip, :prefecture, :city, :street, :building, :tel, :mobile, :fax
json.url user_url(user, format: :json)
