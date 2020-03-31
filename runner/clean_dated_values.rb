prev_dated_value = nil
UserDatedValue.all.order(:user_id, :code, :dated_on).each do |dated_value|
  if dated_value.user_id == prev_dated_value&.user_id && dated_value.code == prev_dated_value&.code
    if dated_value.value == prev_dated_value.value
      dated_value.delete
    end
  end
  prev_dated_value = dated_value
end

prev_dated_value = nil
DestDatedValue.all.order(:dest_id, :code, :dated_on).each do |dated_value|
  if dated_value.dest_id == prev_dated_value&.dest_id && dated_value.code == prev_dated_value&.code
    if dated_value.value == prev_dated_value.value
      dated_value.delete
    end
  end
  prev_dated_value = dated_value
end



