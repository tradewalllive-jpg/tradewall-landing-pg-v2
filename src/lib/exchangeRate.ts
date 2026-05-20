/**
 * USD → KES rate for donation M-Pesa conversions.
 * Source: ExchangeRate-API (free tier, no API key).
 * @see https://www.exchangerate-api.com/docs/free
 */
export const USD_KES_RATE_URL =
  "https://api.exchangerate-api.com/v4/latest/USD";

/** Used when the live rate request fails */
export const USD_KES_FALLBACK_RATE = 155;

export async function fetchUsdToKesRate(): Promise<number> {
  const res = await fetch(USD_KES_RATE_URL);
  if (!res.ok) throw new Error("Exchange rate unavailable");
  const data = (await res.json()) as { rates?: { KES?: number } };
  const kes = data.rates?.KES;
  if (typeof kes !== "number" || kes <= 0) throw new Error("Invalid KES rate");
  return kes;
}

/** e.g. "1 USD = 155.42 KES" */
export function formatUsdKesRate(rate: number): string {
  return `1 USD = ${rate.toFixed(2)} KES`;
}

export function usdToKes(usd: number, rate: number): number {
  return usd * rate;
}

export function kesToUsd(kes: number, rate: number): number {
  return kes / rate;
}
