export function convertToAbbreviation(value: number | string) {
  const num = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(num)) return value;

  const absNum = Math.abs(num);

  if (absNum >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  }

  if (absNum >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  }

  return num.toString();
}
