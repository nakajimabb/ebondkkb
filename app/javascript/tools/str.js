export function str(value, default_str='', paddding=null, strlen=null) {
  let s = value || default_str;
  if(s && paddding && strlen > String(s).length) {
    s = (paddding.repeat(strlen) + s).slice(-strlen)
  }
  return s;
}
