export function full_name(user) {
  if (user) {
    return [user.last_name, user.first_name].filter(Boolean).join(' ');
  }
}

export function name_with_code(user) {
  return `${full_name(user)}(${user.code})`;
}
