import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import AOS from "aos";
import { DonationWidget } from "@/components/DonationWidget";
import { DonorsSection } from "@/components/DonorsSection";
import { LandingFooter } from "@/components/LandingFooter";
import { LandingNav } from "@/components/LandingNav";

export const Route = createFileRoute("/donors")({
  head: () => ({
    meta: [
      { title: "Our Donors — TradeWall" },
      {
        name: "description",
        content:
          "Thank you to everyone who supports TradeWall. See our community donors and contribute via M-Pesa.",
      },
      { property: "og:title", content: "Our Donors — TradeWall" },
      {
        property: "og:description",
        content: "Community supporters helping keep TradeWall running and scaling and improving.",
      },
    ],
  }),
  component: DonorsPage,
});

function DonorsPage() {
  const [donationOpen, setDonationOpen] = useState(false);
  const [donorsRefreshToken, setDonorsRefreshToken] = useState(0);

  const handleDonationSuccess = () => {
    setDonorsRefreshToken((t) => t + 1);
    // M-Pesa receipt may arrive slightly after status=completed
    window.setTimeout(() => setDonorsRefreshToken((t) => t + 1), 5000);
  };

  useEffect(() => {
    AOS.init({ duration: 550, easing: "ease-out-cubic", once: true, offset: 40 });
  }, []);

  return (
    <div className="bg-tw text-white min-h-screen">
      <LandingNav onDonateClick={() => setDonationOpen(true)} />
      <DonationWidget
        open={donationOpen}
        onOpenChange={setDonationOpen}
        onDonationSuccess={handleDonationSuccess}
      />
      <main className="pt-16 min-h-[calc(100vh-4rem)] flex flex-col">
        <DonorsSection
          onDonateClick={() => setDonationOpen(true)}
          refreshToken={donorsRefreshToken}
        />
      </main>
      <LandingFooter />
    </div>
  );
}
