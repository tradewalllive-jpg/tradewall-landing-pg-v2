import logo from "@/assets/tradewall-logo.jpg";

const SIGNIN_URL = "https://app.tradewall.live/login";
const SIGNUP_URL = "https://app.tradewall.live/login?tab=signup";

export function LandingFooter() {
  return (
    <footer className="bg-tw border-t border-white/5 py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-white grid place-items-center overflow-hidden">
            <img src={logo} alt="TradeWall" className="w-8 h-8 object-cover rounded-full" />
          </div>
          <span className="font-bold">TradeWall</span>
        </div>
        <div className="text-sm text-white/40">
          © {new Date().getFullYear()} TradeWall. Connect. Copy. Journal Automatically.
        </div>
        <div className="flex gap-5 text-sm text-white/60">
          <a href={SIGNIN_URL} className="hover:text-white">
            Sign in
          </a>
          <a href={SIGNUP_URL} className="hover:text-white">
            Sign up
          </a>
        </div>
      </div>
    </footer>
  );
}
