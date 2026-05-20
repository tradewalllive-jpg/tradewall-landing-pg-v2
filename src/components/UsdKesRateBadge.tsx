import { formatUsdKesRate } from "@/lib/exchangeRate";

type UsdKesRateBadgeProps = {
  rate: number | null;
  loading?: boolean;
  className?: string;
};

/** Always-visible USD→KES rate used beside conversion amounts */
export function UsdKesRateBadge({ rate, loading, className = "" }: UsdKesRateBadgeProps) {
  return (
    <p
      className={`text-xs text-white/50 ${className}`}
      title="Rate from ExchangeRate-API (USD base), refreshed when you open the donation form"
    >
      {loading || rate === null ? (
        <>Loading rate: <span className="text-white/40">1 USD = … KES</span></>
      ) : (
        <>{formatUsdKesRate(rate)}</>
      )}
    </p>
  );
}

type ConversionLineProps = {
  usd: number;
  kes: number;
  rate: number | null;
  loading?: boolean;
};

/** USD + KES pair with rate always shown underneath */
export function ConversionLine({ usd, kes, rate, loading }: ConversionLineProps) {
  return (
    <div className="space-y-1 rounded-lg bg-white/5 border border-white/10 px-3 py-2.5">
      <p className="text-sm text-white/80">
        <span className="text-white font-semibold">${usd.toFixed(2)} USD</span>
        <span className="text-white/40 mx-2">≈</span>
        <span className="text-white font-semibold">
          {loading || rate === null ? "…" : `KES ${Math.round(kes).toLocaleString()}`}
        </span>
        <span className="text-white/40 text-xs ml-1">via M-Pesa</span>
      </p>
      <UsdKesRateBadge rate={rate} loading={loading} />
    </div>
  );
}
