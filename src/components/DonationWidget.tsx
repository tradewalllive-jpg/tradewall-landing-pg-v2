import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Heart, Loader2, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { toast } from "sonner";
import {
  initiateDonationStk,
  fetchDonationStatus,
  SUPPORT_EMAIL,
} from "@/lib/api";
import {
  fetchUsdToKesRate,
  USD_KES_FALLBACK_RATE,
  usdToKes,
} from "@/lib/exchangeRate";
import { ConversionLine, UsdKesRateBadge } from "@/components/UsdKesRateBadge";

const PRESET_AMOUNTS = ["2", "5", "10", "25", "50"];
const STEPS = ["amount", "details", "consent", "pay"] as const;
type Step = (typeof STEPS)[number];

type DonationWidgetProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showFloatingButton?: boolean;
  /** Called when M-Pesa payment is confirmed completed */
  onDonationSuccess?: () => void;
};

export function DonationWidget({
  open: controlledOpen,
  onOpenChange,
  showFloatingButton = true,
  onDonationSuccess,
}: DonationWidgetProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;
  const setIsOpen = useCallback(
    (value: boolean) => {
      if (!isControlled) setInternalOpen(value);
      onOpenChange?.(value);
    },
    [isControlled, onOpenChange]
  );

  const [step, setStep] = useState<Step>("amount");
  const [amount, setAmount] = useState("5");
  const [customAmount, setCustomAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [consentWall, setConsentWall] = useState(false);
  const [consentName, setConsentName] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [rateLoading, setRateLoading] = useState(false);

  const stepIndex = STEPS.indexOf(step);
  const rate = exchangeRate ?? USD_KES_FALLBACK_RATE;
  const rateReady = exchangeRate !== null;

  useEffect(() => {
    if (!isOpen || exchangeRate !== null) return;
    setRateLoading(true);
    fetchUsdToKesRate()
      .then(setExchangeRate)
      .catch(() => setExchangeRate(USD_KES_FALLBACK_RATE))
      .finally(() => setRateLoading(false));
  }, [isOpen, exchangeRate]);

  const resetForm = () => {
    setStep("amount");
    setAmount("5");
    setCustomAmount("");
    setDonorName("");
    setPhoneNumber("");
    setDonorEmail("");
    setConsentWall(false);
    setConsentName(false);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) resetForm();
  };

  const getUsdAmount = (): number => {
    if (amount === "custom") {
      return parseFloat(customAmount) || 0;
    }
    return parseFloat(amount) || 0;
  };

  const getKesAmount = (): number => usdToKes(getUsdAmount(), rate);

  const canProceed = (): boolean => {
    switch (step) {
      case "amount": {
        const kes = getKesAmount();
        return kes >= 1;
      }
      case "details":
        return (
          donorName.trim().length >= 2 &&
          /^(254|0)[17]\d{8}$/.test(phoneNumber.replace(/\s/g, ""))
        );
      case "consent":
        return true;
      case "pay":
        return true;
      default:
        return false;
    }
  };

  const goNext = () => {
    if (!canProceed()) {
      if (step === "amount") {
        toast.error(
          amount === "custom"
            ? "Enter a custom amount in USD (at least enough for KES 1)"
            : "Please select a valid donation amount"
        );
      }
      if (step === "details") toast.error("Enter your name and a valid M-Pesa number");
      return;
    }
    const idx = stepIndex + 1;
    if (idx < STEPS.length) setStep(STEPS[idx]);
  };

  const goBack = () => {
    const idx = stepIndex - 1;
    if (idx >= 0) setStep(STEPS[idx]);
  };

  const pollPaymentStatus = (paymentId: string) => {
    const pollIntervalMs = 3000;
    const maxAttempts = 40;
    let attempts = 0;

    const poll = async () => {
      attempts += 1;
      try {
        const result = await fetchDonationStatus(paymentId);
        if (result.status === "completed") {
          setIsProcessing(false);
          toast.success("Thank you! Your donation was received.");
          onDonationSuccess?.();
          handleOpenChange(false);
          return;
        }
        if (result.status === "failed") {
          setIsProcessing(false);
          toast.error(result.failureReason || "Payment failed or was cancelled.");
          return;
        }
        if (attempts < maxAttempts) {
          setTimeout(poll, pollIntervalMs);
        } else {
          setIsProcessing(false);
          toast.message("Payment pending", {
            description: `If you completed M-Pesa, we'll confirm shortly. Contact ${SUPPORT_EMAIL} if needed.`,
          });
        }
      } catch {
        if (attempts < maxAttempts) setTimeout(poll, pollIntervalMs);
        else setIsProcessing(false);
      }
    };
    setTimeout(poll, 2000);
  };

  const handleDonate = async () => {
    const kesAmount = Math.round(getKesAmount());
    if (kesAmount < 1) {
      toast.error("Please enter a valid donation amount");
      return;
    }

    setIsProcessing(true);
    try {
      const response = await initiateDonationStk({
        phone_number: phoneNumber.replace(/\s/g, ""),
        amount: kesAmount,
        kes_amount: kesAmount,
        donor_name: donorName.trim(),
        donor_email: donorEmail.trim() || undefined,
        usd_amount: getUsdAmount(),
        consent_display_on_wall: consentWall,
        consent_display_name: consentName && consentWall,
      });

      toast.success("STK push sent — check your phone to complete payment");
      if (response._id) pollPaymentStatus(response._id);
      else setIsProcessing(false);
    } catch (err) {
      setIsProcessing(false);
      toast.error(err instanceof Error ? err.message : "Payment failed");
    }
  };

  const stepLabels: Record<Step, string> = {
    amount: "Choose amount",
    details: "Your details",
    consent: "Privacy",
    pay: "Confirm & pay",
  };

  return (
    <>
      {showFloatingButton && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 left-6 z-50 group"
          aria-label="Support TradeWall"
        >
          <div className="relative bg-[#071122] border border-white/10 rounded-full p-3 shadow-lg hover:shadow-glow hover:scale-105 transition-all">
            <Heart className="h-5 w-5 text-pink-400 fill-pink-400/30" />
          </div>
          <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2.5 py-1.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Support TradeWall
          </span>
        </button>
      )}

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md bg-[#0a1628] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-pink-400 fill-pink-400/40" />
              Support TradeWall
            </DialogTitle>
            <DialogDescription className="text-white/60">
              Help us keep the platform running for traders everywhere.
            </DialogDescription>
            <UsdKesRateBadge
              rate={exchangeRate}
              loading={rateLoading}
              className="pt-1 border-t border-white/5"
            />
          </DialogHeader>

          {/* Step progress */}
          <div className="flex items-center gap-1 py-2">
            {STEPS.map((s, i) => (
              <div key={s} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={`h-1.5 w-full rounded-full transition-colors ${
                    i <= stepIndex ? "bg-tw-blue" : "bg-white/10"
                  }`}
                />
                <span
                  className={`text-[10px] hidden sm:block ${
                    i === stepIndex ? "text-white" : "text-white/40"
                  }`}
                >
                  {stepLabels[s]}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-4 py-2 min-h-[220px]">
            {step === "amount" && (
              <div className="space-y-3">
                <Label className="text-white/80">Select amount (USD)</Label>
                <div className="grid grid-cols-3 gap-2">
                  {PRESET_AMOUNTS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAmount(preset)}
                      className={`px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                        amount === preset
                          ? "bg-pink-500 text-white"
                          : "bg-white/5 text-white/80 hover:bg-white/10"
                      }`}
                    >
                      ${preset}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setAmount("custom")}
                    className={`px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                      amount === "custom"
                        ? "bg-pink-500 text-white"
                        : "bg-white/5 text-white/80 hover:bg-white/10"
                    }`}
                  >
                    Custom
                  </button>
                </div>
                {amount === "custom" && (
                  <div className="space-y-2">
                    <Label htmlFor="custom-usd" className="text-white/70 text-xs">
                      Custom amount (USD)
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 text-sm">
                        $
                      </span>
                      <Input
                        id="custom-usd"
                        type="number"
                        placeholder="e.g. 15.00"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        min={0.01}
                        step={0.01}
                        className="bg-white/5 border-white/10 text-white pl-7"
                      />
                    </div>
                    <UsdKesRateBadge rate={exchangeRate} loading={rateLoading} />
                  </div>
                )}
                <ConversionLine
                  usd={getUsdAmount()}
                  kes={getKesAmount()}
                  rate={exchangeRate}
                  loading={rateLoading && !rateReady}
                />
              </div>
            )}

            {step === "details" && (
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="donor-name">Your name</Label>
                  <Input
                    id="donor-name"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    placeholder="How should we address you?"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="donor-phone">M-Pesa phone number</Label>
                  <Input
                    id="donor-phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="0712345678"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="donor-email">
                    Email <span className="text-white/40 font-normal">(optional — for receipt)</span>
                  </Label>
                  <Input
                    id="donor-email"
                    type="email"
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>
            )}

            {step === "consent" && (
              <div className="space-y-4">
                <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-3">
                  <p className="text-sm text-white/90 font-medium">Private by default</p>
                  <p className="text-sm text-white/60 mt-1 leading-relaxed">
                    You do <strong className="text-white/80">not</strong> have to appear on our Donors
                    wall. Leave the options below unchecked to donate anonymously — only you and
                    TradeWall will know about your contribution.
                  </p>
                </div>
                <p className="text-sm text-white/60">
                  Optional: opt in if you&apos;d like to be thanked publicly. Phone numbers are always
                  partially masked (e.g. 0742****60).
                </p>
                <label className="flex items-start gap-3 cursor-pointer">
                  <Checkbox
                    checked={consentWall}
                    onCheckedChange={(v) => {
                      setConsentWall(v === true);
                      if (!v) setConsentName(false);
                    }}
                    className="mt-0.5 border-white/30"
                  />
                  <span className="text-sm text-white/80">
                    Yes, show my contribution on the Donors wall (obfuscated phone only)
                  </span>
                </label>
                <label
                  className={`flex items-start gap-3 ${
                    consentWall ? "cursor-pointer" : "opacity-50 cursor-not-allowed"
                  }`}
                >
                  <Checkbox
                    checked={consentName}
                    disabled={!consentWall}
                    onCheckedChange={(v) => setConsentName(v === true)}
                    className="mt-0.5 border-white/30"
                  />
                  <span className="text-sm text-white/80">
                    Also show my name on the Donors wall
                  </span>
                </label>
                {!consentWall && (
                  <p className="text-xs text-emerald-400/90">
                    You&apos;ll stay off the Donors wall — no further action needed.
                  </p>
                )}
                <p className="text-xs text-white/50">
                  Questions? Email{" "}
                  <a href={`mailto:${SUPPORT_EMAIL}`} className="text-tw-blue hover:underline">
                    {SUPPORT_EMAIL}
                  </a>
                </p>
              </div>
            )}

            {step === "pay" && (
              <div className="space-y-3">
                <ConversionLine
                  usd={getUsdAmount()}
                  kes={getKesAmount()}
                  rate={exchangeRate}
                  loading={rateLoading && !rateReady}
                />
                <div className="tw-card rounded-xl p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Name</span>
                  <span>{donorName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Phone</span>
                  <span>{phoneNumber}</span>
                </div>
                {donorEmail && (
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Receipt email</span>
                    <span className="truncate max-w-[180px]">{donorEmail}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Donors wall</span>
                  <span>
                    {consentWall
                      ? consentName
                        ? "Public (name + phone)"
                        : "Public (phone only)"
                      : "Private — not listed"}
                  </span>
                </div>
                <p className="text-xs text-white/50 pt-2 border-t border-white/10">
                  M-Pesa STK push will be sent to your phone. Secure processing via PayHero.
                </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            {stepIndex > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={goBack}
                disabled={isProcessing}
                className="border-white/10 text-white hover:bg-white/5"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Back
              </Button>
            )}
            {step !== "pay" ? (
              <Button
                type="button"
                onClick={goNext}
                className="flex-1 bg-tw-blue hover:bg-tw-blue/90"
              >
                Continue <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleDonate}
                disabled={isProcessing}
                className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing…
                  </>
                ) : (
                  <>
                    <Heart className="mr-2 h-4 w-4 fill-current" />
                    Send STK Push
                  </>
                )}
              </Button>
            )}
          </div>

          {step === "pay" && (
            <p className="text-xs text-center text-white/40 flex items-center justify-center gap-1">
              <Check className="w-3 h-3" /> Encrypted & secure
            </p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
