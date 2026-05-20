import { Link } from "@tanstack/react-router";
import { ArrowRight, Heart } from "lucide-react";
import logo from "@/assets/tradewall-logo.jpg";

const SIGNIN_URL = "https://app.tradewall.live/login";
const SIGNUP_URL = "https://app.tradewall.live/login?tab=signup";

type LandingNavProps = {
  onDonateClick: () => void;
};

export function LandingNav({ onDonateClick }: LandingNavProps) {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[#071122]/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-white grid place-items-center overflow-hidden">
            <img src={logo} alt="TradeWall" className="w-9 h-9 object-cover rounded-full" />
          </div>
          <span className="font-bold text-lg tracking-tight">TradeWall</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-white/70">
          <a href="/#features" className="hover:text-white transition">
            Features
          </a>
          <a href="/#journaling" className="hover:text-white transition">
            Journaling
          </a>
          <a href="/#copy" className="hover:text-white transition">
            Copy Trading
          </a>
          <a href="/#signals" className="hover:text-white transition">
            Signal Rooms
          </a>
          <Link
            to="/donors"
            className="hover:text-white transition"
            activeProps={{ className: "text-white font-medium" }}
          >
            Donors
          </Link>
          <button
            type="button"
            onClick={onDonateClick}
            className="inline-flex items-center gap-1.5 text-pink-400 hover:text-pink-300 transition font-medium"
          >
            <Heart className="w-4 h-4 fill-pink-400/30" />
            Donate
          </button>
        </nav>
        <div className="flex items-center gap-2">
          <a
            href={SIGNIN_URL}
            className="hidden sm:inline-flex px-4 py-2 text-sm text-white/80 hover:text-white transition"
          >
            Sign in
          </a>
          <a
            href={SIGNUP_URL}
            className="inline-flex items-center gap-1.5 bg-tw-blue text-white px-4 py-2 rounded-full text-sm font-medium transition"
          >
            Get started <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </header>
  );
}
