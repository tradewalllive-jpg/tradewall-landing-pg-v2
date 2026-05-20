import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Heart, Loader2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  fetchPublicDonors,
  type PublicDonor,
  type DonorsPagination,
  SUPPORT_EMAIL,
} from "@/lib/api";

const PAGE_SIZE = 20;

type DonorsSectionProps = {
  onDonateClick?: () => void;
  /** Increment or change to refetch the donors list (e.g. after a new donation) */
  refreshToken?: number;
};

function formatAmount(donor: PublicDonor) {
  return donor.currency === "KES"
    ? `KES ${Number(donor.amount).toLocaleString()}`
    : `$${Number(donor.amount).toFixed(2)}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-KE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function DonorsSection({ onDonateClick, refreshToken = 0 }: DonorsSectionProps) {
  const [donors, setDonors] = useState<PublicDonor[]>([]);
  const [pagination, setPagination] = useState<DonorsPagination | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPage = useCallback(async (targetPage: number, options?: { silent?: boolean }) => {
    const silent = options?.silent ?? false;
    if (silent) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const result = await fetchPublicDonors(targetPage, PAGE_SIZE);
      setDonors(result.donors);
      setPagination(result.pagination);
      setPage(result.pagination.page);
    } catch {
      if (!silent) {
        setError("Unable to load donors right now.");
        setDonors([]);
      }
    } finally {
      if (silent) setRefreshing(false);
      else setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (refreshToken === 0) {
      loadPage(1);
      return;
    }
    loadPage(1, { silent: true });
  }, [refreshToken, loadPage]);

  const totalPages = pagination?.totalPages ?? 1;
  const total = pagination?.total ?? 0;
  const rangeStart = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, total);

  return (
    <section id="donors" className="pt-4 pb-10 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-500/5 to-transparent pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-6">
        <div
          className="mb-5 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3"
          data-aos="fade-down"
          data-aos-duration="500"
        >
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs text-pink-400/90 mb-1.5">
              <Heart className="w-3.5 h-3.5 fill-pink-400/25 animate-pulse" />
              <span>Thank you to our community</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Our Donors</h1>
          </div>
          <p
            className="text-sm text-white/55 max-w-md sm:text-right leading-snug"
            data-aos="fade-left"
            data-aos-delay="120"
            data-aos-duration="500"
          >
            Every contribution helps keep TradeWall running and scaling. Phone numbers are partially hidden for
            privacy.
          </p>
        </div>

        {loading && (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-tw-blue" />
          </div>
        )}

        {error && !loading && (
          <p className="text-center text-white/50 py-8">{error}</p>
        )}

        {!loading && !error && donors.length === 0 && (
          <div
            className="text-center py-10 tw-card rounded-2xl max-w-md mx-auto"
            data-aos="fade-up"
            data-aos-delay="180"
          >
            <Users className="w-10 h-10 mx-auto text-white/30 mb-3" />
            <p className="text-white/60">Be the first to support TradeWall!</p>
            {onDonateClick && (
              <button
                type="button"
                onClick={onDonateClick}
                className="mt-4 inline-flex items-center gap-2 text-pink-400 hover:text-pink-300 text-sm font-medium"
              >
                <Heart className="w-4 h-4" /> Make a donation
              </button>
            )}
          </div>
        )}

        {!loading && donors.length > 0 && (
          <div
            data-aos="fade-up"
            data-aos-delay="180"
            data-aos-duration="550"
            className="tw-card rounded-2xl overflow-hidden border border-white/10 relative"
          >
            {refreshing && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#071122]/60 backdrop-blur-[1px]">
                <Loader2 className="w-6 h-6 animate-spin text-tw-blue" />
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.03]">
                    <th className="px-4 py-2.5 font-medium text-white/70 text-xs uppercase tracking-wide">
                      Name
                    </th>
                    <th className="px-4 py-2.5 font-medium text-white/70 text-xs uppercase tracking-wide">
                      M-Pesa phone
                    </th>
                    <th className="px-4 py-2.5 font-medium text-white/70 text-xs uppercase tracking-wide">
                      M-Pesa code
                    </th>
                    <th className="px-4 py-2.5 font-medium text-white/70 text-xs uppercase tracking-wide">
                      Amount
                    </th>
                    <th className="px-4 py-2.5 font-medium text-white/70 text-xs uppercase tracking-wide hidden sm:table-cell">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {donors.map((donor, i) => (
                    <tr
                      key={`${donor.phone}-${donor.mpesaCode ?? ""}-${donor.donatedAt}-${i}`}
                      className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-4 py-2.5 font-medium">
                        {donor.name || "Anonymous supporter"}
                      </td>
                      <td className="px-4 py-2.5 font-mono text-white/60 text-[13px]">{donor.phone}</td>
                      <td className="px-4 py-2.5 font-mono text-tw-blue text-[13px]">
                        {donor.mpesaCode || "—"}
                      </td>
                      <td className="px-4 py-2.5 text-tw-blue font-semibold whitespace-nowrap">
                        {formatAmount(donor)}
                      </td>
                      <td className="px-4 py-2.5 text-white/50 hidden sm:table-cell whitespace-nowrap text-[13px]">
                        {formatDate(donor.donatedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 border-t border-white/10">
                <p className="text-sm text-white/50">
                  Showing {rangeStart}–{rangeEnd} of {total} donors
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={page <= 1 || loading}
                    onClick={() => loadPage(page - 1)}
                    className="border-white/15 bg-transparent text-white hover:bg-white/10"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                  <span className="text-sm text-white/60 px-2 tabular-nums">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages || loading}
                    onClick={() => loadPage(page + 1)}
                    className="border-white/15 bg-transparent text-white hover:bg-white/10"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        <p className="text-center text-sm text-white/40 mt-6">
          Want to appear here? Opt in when donating. Need help?{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="text-tw-blue hover:underline">
            {SUPPORT_EMAIL}
          </a>
        </p>
      </div>
    </section>
  );
}
