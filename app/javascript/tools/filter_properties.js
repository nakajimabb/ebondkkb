export function filter_properties(obj, cond) {
  let new_obj = Object.assign({}, obj);
  Object.keys(obj).forEach((key) => {
    if (!cond(new_obj[key])) delete new_obj[key];
  });
  return new_obj;
}
