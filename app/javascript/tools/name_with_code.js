export function full_name(user) {
  if (user) {
    return [user.last_name, user.first_name].filter(Boolean).join(' ');
  }
}

export function user_name_with_code(user) {
  return `${full_name(user)}(${user.code})`;
}

export function name_with_code(someone) {
  return `${someone.name}(${someone.code})`;
}
