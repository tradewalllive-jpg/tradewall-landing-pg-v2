import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import AOS from "aos";
import {
  Home, BarChart3, Bell, Brain, BookOpen, LineChart, Copy, Radio,
  Megaphone, CreditCard, DollarSign, Server, ArrowRight, Check,
  TrendingUp, Sparkles, ShieldCheck, Zap, Users, Bot,
} from "lucide-react";
import logo from "@/assets/tradewall-logo.jpg";
import screenFeed from "@/assets/screen-feed.png";
import screenPost from "@/assets/screen-post.png";
import screenPartner from "@/assets/screen-partner.png";
import screenProfile from "@/assets/screen-profile.png";
import screenSignin from "@/assets/screen-signin.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TradeWall — Connect. Copy. Journal Automatically." },
      { name: "description", content: "TradeWall is the social network for traders. Share insights, journal smarter, copy proven strategies, and join signal rooms — all in one place." },
      { property: "og:title", content: "TradeWall — Connect. Copy. Journal Automatically." },
      { property: "og:description", content: "The social network for traders. Smart journaling, copy trading, signal rooms and AI strategy training." },
    ],
  }),
  component: Landing,
});

const SIGNIN_URL = "https://www.tradewall.live/login";
const SIGNUP_URL = "https://tradewall.live/login?tab=signup";

function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[#071122]/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-white grid place-items-center overflow-hidden">
            <img src={logo} alt="TradeWall" className="w-9 h-9 object-cover rounded-full" />
          </div>
          <span className="font-bold text-lg tracking-tight">TradeWall</span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm text-white/70">
          <a href="#features" className="hover:text-white transition">Features</a>
          <a href="#journaling" className="hover:text-white transition">Journaling</a>
          <a href="#copy" className="hover:text-white transition">Copy Trading</a>
          <a href="#signals" className="hover:text-white transition">Signal Rooms</a>
        </nav>
        <div className="flex items-center gap-2">
          <a href={SIGNIN_URL} className="hidden sm:inline-flex px-4 py-2 text-sm text-white/80 hover:text-white transition">Sign in</a>
          <a href={SIGNUP_URL} className="inline-flex items-center gap-1.5 bg-tw-blue text-white px-4 py-2 rounded-full text-sm font-medium transition">
            Get started <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative pt-32 pb-24 overflow-hidden gradient-hero">
      <div className="absolute inset-0 grid-bg opacity-60" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-tw-blue/20 blur-[120px] pulse-glow" />

      <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        <div data-aos="fade-right">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full tw-card text-xs text-white/70 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-tw-blue animate-pulse" /> The social network for traders
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
            Connect. Copy.<br />
            <span className="bg-gradient-to-r from-white via-[#4aa3e8] to-[#2d7bb4] bg-clip-text text-transparent">
              Journal Automatically.
            </span>
          </h1>
          <p className="mt-6 text-lg text-white/70 max-w-xl leading-relaxed">
            Share insights with top traders, mirror verified strategies in real time, and let TradeWall journal every trade for you — turning data into discipline and discipline into edge.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={SIGNUP_URL} className="inline-flex items-center gap-2 bg-tw-blue text-white px-6 py-3.5 rounded-full font-medium shadow-glow transition">
              Create free account <ArrowRight className="w-4 h-4" />
            </a>
            <a href={SIGNIN_URL} className="inline-flex items-center gap-2 tw-card text-white px-6 py-3.5 rounded-full font-medium hover:border-white/20 transition">
              Sign in
            </a>
          </div>
          <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
            {[
              { v: "10k+", l: "Traders" },
              { v: "MT4/5", l: "Synced" },
              { v: "24/7", l: "Live feed" },
            ].map((s) => (
              <div key={s.l}>
                <div className="text-2xl font-bold">{s.v}</div>
                <div className="text-xs text-white/50 uppercase tracking-wider">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative h-[560px]" data-aos="fade-left" data-aos-delay="100">
          {/* Floating decorative cards */}
          <div className="absolute top-8 -left-6 z-20 tw-card rounded-2xl p-4 float-y shadow-glow w-56" style={{ animationDelay: "0s" }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full gradient-blue grid place-items-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs text-white/50">Win rate</div>
                <div className="font-semibold text-sm">+68.4%</div>
              </div>
            </div>
            <div className="h-12 flex items-end gap-1">
              {[30, 50, 35, 70, 55, 80, 65, 90].map((h, i) => (
                <div key={i} className="flex-1 rounded-sm gradient-blue" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>

          <div className="absolute bottom-12 -right-4 z-20 tw-card rounded-2xl p-4 float-y w-60" style={{ animationDelay: "2s" }}>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-[#ef4d5a]/20 grid place-items-center">
                <Bot className="w-4 h-4 text-[#ef4d5a]" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold">AI Signal · EUR/USD</div>
                <div className="text-xs text-white/50">Long · TP 1.0942 · SL 1.0890</div>
              </div>
            </div>
          </div>

          {/* Main phone-like screen */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full max-w-[460px] screen-tilt-l">
              <div className="absolute -inset-6 bg-tw-blue/20 blur-3xl rounded-full" />
              <div className="relative tw-card rounded-3xl p-3 shadow-screen">
                <div className="flex items-center justify-between px-2 py-1.5 mb-2">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                    <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                    <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-white/40">App preview</span>
                </div>
                <img src={screenFeed} alt="TradeWall feed preview" className="rounded-2xl w-full block" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureGrid() {
  const features = [
    { icon: Home, title: "Feed", desc: "Trader-only social timeline." },
    { icon: BarChart3, title: "Dashboard", desc: "Balance, equity, ROI live." },
    { icon: Brain, title: "TradeWall AI", desc: "Smart insights on your trades." },
    { icon: BookOpen, title: "My Journals", desc: "Confluences, notes, screenshots." },
    { icon: LineChart, title: "Analytics", desc: "Performance you can prove." },
    { icon: Copy, title: "Copy Trading", desc: "Mirror vetted strategies." },
    { icon: Radio, title: "Signal Rooms", desc: "Subscribe to proven providers." },
    { icon: Megaphone, title: "Ads Service", desc: "Promote your strategy." },
    { icon: CreditCard, title: "Payments", desc: "Seamless billing built in." },
    { icon: DollarSign, title: "Earnings", desc: "Monetize your edge." },
    { icon: Server, title: "APIs", desc: "MT4/MT5 account linking." },
    { icon: ShieldCheck, title: "Verified Badge", desc: "TradeWall Pro credibility." },
  ];
  return (
    <section id="features" className="py-28 bg-tw-2 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16" data-aos="fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full tw-card text-xs text-white/70 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-tw-blue" /> Everything a trader needs
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            One platform. Every workflow.
          </h2>
          <p className="mt-4 text-white/60">
            From your first journaled trade to your first paid signal room — TradeWall covers the entire trader lifecycle.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <div
              key={f.title}
              data-aos="fade-up"
              data-aos-delay={(i % 4) * 80}
              className="tw-card rounded-2xl p-6 hover:border-white/20 hover:translate-y-[-4px] transition-all duration-300 group"
            >
              <div className="w-11 h-11 rounded-xl bg-tw-blue/15 grid place-items-center mb-4 group-hover:bg-tw-blue/25 transition">
                <f.icon className="w-5 h-5 text-tw-blue" />
              </div>
              <h3 className="font-semibold text-lg">{f.title}</h3>
              <p className="text-sm text-white/55 mt-1">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureSection({
  id, eyebrow, title, desc, points, img, reverse, tilt,
}: {
  id: string; eyebrow: string; title: string; desc: string;
  points: string[]; img: string; reverse?: boolean; tilt: string;
}) {
  return (
    <section id={id} className="py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <div
          className={reverse ? "lg:order-2" : ""}
          data-aos={reverse ? "fade-left" : "fade-right"}
        >
          <div className="text-tw-blue text-sm font-semibold uppercase tracking-widest mb-3">{eyebrow}</div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">{title}</h2>
          <p className="mt-5 text-white/70 text-lg leading-relaxed">{desc}</p>
          <ul className="mt-7 space-y-3">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-3">
                <div className="mt-0.5 w-5 h-5 rounded-full gradient-blue grid place-items-center shrink-0">
                  <Check className="w-3 h-3" />
                </div>
                <span className="text-white/80">{p}</span>
              </li>
            ))}
          </ul>
          <a href={SIGNUP_URL} className="mt-8 inline-flex items-center gap-2 text-tw-blue hover:gap-3 transition-all font-medium">
            Get started <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div
          className={`relative ${reverse ? "lg:order-1" : ""}`}
          data-aos={reverse ? "fade-right" : "fade-left"}
        >
          <div className="absolute -inset-10 bg-tw-blue/10 blur-3xl rounded-full pulse-glow" />
          <div className={`relative ${tilt}`}>
            <div className="relative tw-card rounded-3xl p-3 shadow-screen">
              <div className="flex items-center justify-between px-2 py-1.5 mb-2">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                </div>
                <span className="text-[10px] uppercase tracking-widest text-white/40">App preview</span>
              </div>
              <img src={img} alt="TradeWall app interface preview" className="rounded-2xl w-full block" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsBand() {
  return (
    <section className="py-20 bg-tw-2 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8 text-center">
        {[
          { icon: Users, v: "Trader-first", l: "Community" },
          { icon: Zap, v: "Real-time", l: "MT4/MT5 sync" },
          { icon: ShieldCheck, v: "Verified", l: "Track records" },
          { icon: Bot, v: "AI-ready", l: "Strategy training" },
        ].map((s, i) => (
          <div key={s.l} data-aos="zoom-in" data-aos-delay={i * 80}>
            <div className="w-12 h-12 rounded-2xl gradient-blue grid place-items-center mx-auto mb-3 shadow-glow">
              <s.icon className="w-5 h-5" />
            </div>
            <div className="text-xl font-bold">{s.v}</div>
            <div className="text-xs text-white/50 uppercase tracking-wider mt-1">{s.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-tw-blue/20 blur-[120px] pulse-glow" />
      <div className="relative max-w-3xl mx-auto px-6 text-center" data-aos="zoom-in">
        <div className="w-16 h-16 rounded-full bg-white grid place-items-center mx-auto mb-6 shadow-glow overflow-hidden">
          <img src={logo} alt="TradeWall" className="w-16 h-16 object-cover rounded-full" />
        </div>
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
          Your trading journal,<br />
          <span className="bg-gradient-to-r from-[#4aa3e8] to-white bg-clip-text text-transparent">
            on autopilot.
          </span>
        </h2>
        <p className="mt-5 text-white/70 text-lg max-w-xl mx-auto">
          Join the traders journaling smarter, copying proven strategies, and earning from their edge — all on TradeWall.
        </p>
        <div className="mt-9 flex flex-wrap gap-3 justify-center">
          <a href={SIGNUP_URL} className="inline-flex items-center gap-2 bg-tw-blue text-white px-7 py-4 rounded-full font-medium shadow-glow text-base">
            Create free account <ArrowRight className="w-4 h-4" />
          </a>
          <a href={SIGNIN_URL} className="inline-flex items-center gap-2 tw-card text-white px-7 py-4 rounded-full font-medium text-base">
            Sign in
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-tw border-t border-white/5 py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-white grid place-items-center overflow-hidden">
            <img src={logo} alt="TradeWall" className="w-8 h-8 object-cover rounded-full" />
          </div>
          <span className="font-bold">TradeWall</span>
        </div>
        <div className="text-sm text-white/40">© {new Date().getFullYear()} TradeWall. Connect. Copy. Journal Automatically.</div>
        <div className="flex gap-5 text-sm text-white/60">
          <a href={SIGNIN_URL} className="hover:text-white">Sign in</a>
          <a href={SIGNUP_URL} className="hover:text-white">Sign up</a>
        </div>
      </div>
    </footer>
  );
}

function Landing() {
  useEffect(() => {
    AOS.init({ duration: 800, easing: "ease-out-cubic", once: true, offset: 60 });
  }, []);

  return (
    <div className="bg-tw text-white min-h-screen">
      <Nav />
      <main>
        <Hero />
        <FeatureGrid />
        <FeatureSection
          id="journaling"
          eyebrow="Smart Journaling"
          title="Every trade. Auto-logged. Auto-analyzed."
          desc="Sync MetaTrader 4 or 5 and TradeWall journals every entry, exit, and outcome. Add confluences, notes, and screenshots — then watch your dashboard reveal what's actually working."
          points={[
            "MT4 & MT5 account linking — live",
            "Balance, equity, win rate, ROI in one dashboard",
            "Discipline journaling for pre/post-trade reflection",
          ]}
          img={screenPost}
          tilt="screen-tilt-r"
        />
        <FeatureSection
          id="copy"
          eyebrow="Copy Trading"
          title="Mirror strategies from traders with verified track records."
          desc="Browse vetted traders and AI strategies. Follow the ones you trust, and let TradeWall handle the execution. Profitable traders can list their own strategies and earn from every follower."
          points={[
            "Verified performance — no fake screenshots",
            "Human and AI strategies side by side",
            "Earn by sharing your edge",
          ]}
          img={screenPartner}
          tilt="screen-tilt-l"
          reverse
        />
        <StatsBand />
        <FeatureSection
          id="signals"
          eyebrow="Signal Rooms"
          title="Subscribe to rooms run by proven signal providers."
          desc="Get trade ideas straight from traders with the receipts to back them. Or run your own signal room and turn your discipline into recurring revenue."
          points={[
            "Real-time trade ideas with context",
            "Run a paid room with one click",
            "Transparent performance for every host",
          ]}
          img={screenProfile}
          tilt="screen-tilt-r"
        />
        <FeatureSection
          id="ai"
          eyebrow="AI Strategy Training"
          title="Your journal is the dataset. The AI is the apprentice."
          desc="Every trade you journal trains a model on your unique edge. On the roadmap: an AI that learns your style and trades on your behalf — fully transparent, fully under your control."
          points={[
            "Personal models trained on your data",
            "Roadmap: automated trading on your style",
            "Stay in control — review and approve",
          ]}
          img={screenSignin}
          tilt="screen-tilt-flat"
          reverse
        />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
