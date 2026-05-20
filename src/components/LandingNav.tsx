import { Link } from "@tanstack/react-router";
import { ArrowRight, Heart, Menu, X } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import logo from "@/assets/tradewall-logo.jpg";
import { cn } from "@/lib/utils";

const SIGNIN_URL = "https://app.tradewall.live/login";
const SIGNUP_URL = "https://app.tradewall.live/login?tab=signup";
const MENU_EXIT_MS = 300;

const NAV_LINKS = [
  { href: "/#features", label: "Features" },
  { href: "/#journaling", label: "Journaling" },
  { href: "/#copy", label: "Copy Trading" },
  { href: "/#signals", label: "Signal Rooms" },
] as const;

const MOBILE_MENU_ITEMS = [
  ...NAV_LINKS.map((link) => ({ type: "anchor" as const, ...link })),
  { type: "donors" as const, label: "Donors" },
  { type: "donate" as const, label: "Donate" },
  { type: "signin" as const, label: "Sign in" },
];

type LandingNavProps = {
  onDonateClick: () => void;
};

export function LandingNav({ onDonateClick }: LandingNavProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuMounted, setMenuMounted] = useState(false);
  const menuPanelRef = useRef<HTMLElement>(null);
  const menuToggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (menuOpen) setMenuMounted(true);
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (
        menuPanelRef.current?.contains(target) ||
        menuToggleRef.current?.contains(target)
      ) {
        return;
      }
      setMenuOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuMounted || menuOpen) return;
    const timer = window.setTimeout(() => setMenuMounted(false), MENU_EXIT_MS);
    return () => window.clearTimeout(timer);
  }, [menuOpen, menuMounted]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const handleDonate = () => {
    closeMenu();
    onDonateClick();
  };

  const menuAnim = menuOpen ? "open" : "closed";

  const itemClass = (index: number) =>
    cn(
      "px-3 py-3 rounded-xl transition-colors duration-200",
      menuAnim === "open" ? "nav-menu-item-open" : "nav-menu-item-closed",
    );

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[#071122]/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5" onClick={closeMenu}>
          <div className="w-9 h-9 rounded-full bg-white grid place-items-center overflow-hidden">
            <img src={logo} alt="TradeWall" className="w-9 h-9 object-cover rounded-full" />
          </div>
          <span className="font-bold text-lg tracking-tight">TradeWall</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-white/70">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-white transition">
              {link.label}
            </a>
          ))}
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
          <button
            ref={menuToggleRef}
            type="button"
            className={cn(
              "md:hidden relative inline-flex items-center justify-center w-10 h-10 rounded-full tw-card text-white transition-all duration-300",
              menuOpen && "border-white/20 bg-white/[0.08]",
            )}
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="landing-mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <span className="relative block w-5 h-5">
              <Menu
                className={cn(
                  "absolute inset-0 w-5 h-5 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  menuOpen ? "opacity-0 rotate-90 scale-50" : "opacity-100 rotate-0 scale-100",
                )}
              />
              <X
                className={cn(
                  "absolute inset-0 w-5 h-5 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  menuOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50",
                )}
              />
            </span>
          </button>
        </div>
      </div>

      {menuMounted &&
        createPortal(
          <button
            type="button"
            className={cn(
              "md:hidden fixed inset-0 top-16 z-40 cursor-default bg-black/50 backdrop-blur-[2px]",
              menuAnim === "open" ? "nav-menu-backdrop-open" : "nav-menu-backdrop-closed",
            )}
            aria-label="Close menu"
            onClick={closeMenu}
          />,
          document.body,
        )}

      {menuMounted && (
          <nav
            ref={menuPanelRef}
            id="landing-mobile-menu"
            className={cn(
              "md:hidden relative z-50 overflow-hidden border-t border-white/10",
              "bg-[#071122]/95 backdrop-blur-xl shadow-[0_24px_48px_-12px_rgba(0,0,0,0.55)]",
              "before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-[#4aa3e8]/50 before:to-transparent",
              menuAnim === "open" ? "nav-menu-panel-open" : "nav-menu-panel-closed",
            )}
          >
            <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-1">
              {MOBILE_MENU_ITEMS.map((item, index) => {
                const style = { "--nav-item-delay": `${index * 42}ms` } as CSSProperties;

                if (item.type === "anchor") {
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={closeMenu}
                      style={style}
                      className={cn(
                        itemClass(index),
                        "text-white/80 hover:text-white hover:bg-white/5",
                      )}
                    >
                      {item.label}
                    </a>
                  );
                }

                if (item.type === "donors") {
                  return (
                    <Link
                      key="donors"
                      to="/donors"
                      onClick={closeMenu}
                      style={style}
                      className={cn(itemClass(index), "text-white/80 hover:text-white hover:bg-white/5")}
                      activeProps={{ className: cn(itemClass(index), "text-white bg-white/5 font-medium") }}
                    >
                      {item.label}
                    </Link>
                  );
                }

                if (item.type === "donate") {
                  return (
                    <button
                      key="donate"
                      type="button"
                      onClick={handleDonate}
                      style={style}
                      className={cn(
                        itemClass(index),
                        "text-left inline-flex items-center gap-2 text-pink-400 hover:text-pink-300 hover:bg-white/5 font-medium",
                      )}
                    >
                      <Heart className="w-4 h-4 fill-pink-400/30" />
                      {item.label}
                    </button>
                  );
                }

                return (
                  <a
                    key="signin"
                    href={SIGNIN_URL}
                    onClick={closeMenu}
                    style={style}
                    className={cn(
                      itemClass(index),
                      "text-white/80 hover:text-white hover:bg-white/5 sm:hidden",
                    )}
                  >
                    {item.label}
                  </a>
                );
              })}
            </div>
          </nav>
      )}
    </header>
  );
}
