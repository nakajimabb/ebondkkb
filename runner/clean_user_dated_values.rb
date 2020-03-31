prev_udv = nil
UserDatedValue.all.order(:user_id, :code, :dated_on).each do |udv|
  if udv.user_id == prev_udv&.user_id && udv.code == prev_udv&.code
    if udv.value == prev_udv.value
      udv.delete
    end
  end
  prev_udv = udv
end


