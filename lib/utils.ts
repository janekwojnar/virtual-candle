export function clampDays(d: number) {
  const n = Math.floor(d);
  if (Number.isNaN(n) || n < 1) return 1;
  if (n > 365) return 365;
  return n;
}

export function nowPlusDays(days: number) {
  const ms = days * 24 * 60 * 60 * 1000;
  return new Date(Date.now() + ms);
}
