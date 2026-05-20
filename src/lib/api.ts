export const API_BASE =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") ||
  "https://twall-backend-v1.onrender.com";

export const SUPPORT_EMAIL = "support@tradewall.live";

export type PublicDonor = {
  name: string | null;
  phone: string;
  mpesaCode: string | null;
  amount: number;
  currency: string;
  donatedAt: string;
};

export type DonorsPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PublicDonorsResponse = {
  donors: PublicDonor[];
  pagination: DonorsPagination;
};

export async function fetchPublicDonors(
  page = 1,
  limit = 20
): Promise<PublicDonorsResponse> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  const res = await fetch(`${API_BASE}/api/v1/donations/donors?${params}`);
  if (!res.ok) throw new Error("Failed to load donors");
  const data = await res.json();
  const donors: PublicDonor[] = (data.donors ?? []).map(
    (d: PublicDonor & { mpesaCode?: string | null }) => ({
      ...d,
      mpesaCode: d.mpesaCode ?? null,
    })
  );

  return {
    donors,
    pagination: data.pagination ?? {
      page,
      limit,
      total: data.donors?.length ?? 0,
      totalPages: 1,
    },
  };
}

export type InitiateDonationPayload = {
  phone_number: string;
  amount: number;
  kes_amount: number;
  donor_name: string;
  donor_email?: string;
  usd_amount?: number;
  consent_display_on_wall: boolean;
  consent_display_name: boolean;
};

export async function initiateDonationStk(payload: InitiateDonationPayload) {
  const res = await fetch(`${API_BASE}/api/v1/donations/initiate-stk`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to initiate payment");
  return data as { _id: string; CheckoutRequestID?: string };
}

export async function fetchDonationStatus(paymentId: string) {
  const res = await fetch(
    `${API_BASE}/api/v1/donations/status?paymentId=${encodeURIComponent(paymentId)}`
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to check payment status");
  return data as {
    status: "pending" | "completed" | "failed";
    failureReason?: string;
  };
}
