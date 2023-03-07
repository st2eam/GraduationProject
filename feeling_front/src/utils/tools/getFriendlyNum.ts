export function getFriendlyNum(num: number) {
  return num > 9999 ? `${(num / 10000).toFixed(1)}w` : num
}
