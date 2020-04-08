json.shift_users do
  json.weekly do
    @shift_users[:weekly].each do |wday, shift_users|
      json.set! wday do
        json.array! shift_users, partial: "shift_users/shift_user", as: :shift_user
      end
    end
  end
  json.holiday do
    json.array! @shift_users[:holiday], partial: "shift_users/shift_user", as: :shift_user
  end
  json.custom do
    json.array! @shift_users[:custom], partial: "shift_users/shift_user", as: :shift_user
  end
  json.rest_week do
    json.array! @shift_users[:rest_week], partial: "shift_users/shift_user", as: :shift_user
  end
  json.daily do
    json.array! @shift_users[:daily], partial: "shift_users/shift_user", as: :shift_user
  end
end
json.dests do
  json.array! @dests, "id", "code", "name", "updated_at"
end
json.users do
  json.array! @users, "id", "code", "first_name", "last_name", "updated_at"
end
json.user_dated_values do
  json.array! @user_dated_values, "id", "user_id", "dated_on", "code", "value"
end
json.dest_dated_values do
  json.array! @dest_dated_values, "id", "dest_id", "dated_on", "code", "value"
end
