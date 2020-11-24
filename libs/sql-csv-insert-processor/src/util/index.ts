export function isNumber(value) {
  try {
    value = Number(value);
    return typeof value === 'number' && isFinite(value);
  } catch (error) {
    return false;
  }
}

export function replaceAll(string, search, replace) {
  return string.split(search).join(replace);
}