export function isNumber(value) {
  try {
    value = Number(value);
    return typeof value === 'number' && isFinite(value);
  } catch (error) {
    return false;
  }
}