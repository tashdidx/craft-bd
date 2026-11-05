export function formatBdt(amount: number | string) {
  const value = typeof amount === "string" ? Number(amount) : amount;

  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);
}

export function formatDate(
  value: string | Date,
  options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  },
) {
  const date = typeof value === "string" ? new Date(value) : value;

  return new Intl.DateTimeFormat("en-GB", options).format(date);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-BD").format(value);
}

export function formatWeight(grams: number | null) {
  if (!grams || grams <= 0) return null;

  if (grams >= 1_000) {
    const kilograms = grams / 1_000;
    return `${Number.isInteger(kilograms) ? kilograms : kilograms.toFixed(1)} kg`;
  }

  return `${formatNumber(grams)} g`;
}
