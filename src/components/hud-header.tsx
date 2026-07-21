import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import logo from "@/assets/tramed-logo-official.png.asset.json";

/**
 * Global HUD header – sticky tab bar persisted across every route
 * so navigating between Khám & Kê đơn / Dinh dưỡng / Vọng chẩn keeps
 * the same top-level navigation visible.
 */
export function HudHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [clock, setClock] = useState<string | null>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const tick = () => setClock(new Date().toLocaleTimeString("en-GB", { hour12: false }));
    tick();
    const t = setInterval(tick, 1000);
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearInterval(t);
    };
  }, []);

  // Anchor links only work on the landing page; on other routes route them home with a hash.
  const anchor = (id: string, label: string) =>
    isHome ? (
      <a href={`#${id}`} className="whitespace-nowrap rounded-full px-2 py-1 transition hover:bg-accent/10 hover:text-accent">{label}</a>
    ) : (
      <Link to="/" hash={id} className="whitespace-nowrap rounded-full px-2 py-1 transition hover:bg-accent/10 hover:text-accent">{label}</Link>
    );

  const tabClass = (active: boolean) =>
    `whitespace-nowrap rounded-full px-1.5 py-0.5 transition ${
      active
        ? "border border-accent/70 bg-accent/15 text-foreground"
        : "border border-transparent hover:bg-accent/10 hover:text-accent"
    }`;

  return (
    <header
      className="hud-header fixed inset-x-0 top-0 z-50 border-b border-accent/30 bg-background/90 backdrop-blur-xl shadow-[0_4px_20px_-8px_color-mix(in_oklab,var(--cyan)_35%,transparent)]"
    >
      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent transition-opacity duration-500 ${
          scrolled ? "opacity-100" : "opacity-60"
        }`}
      />

      <div className="container relative mx-auto flex items-center justify-between gap-3 px-4 py-2.5 sm:px-6 sm:py-3">
        <Link to="/" className="flex min-w-0 items-center gap-2 sm:gap-3">
          <div className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white shadow-[0_0_0_2px_rgba(255,255,255,0.22),0_6px_20px_rgba(255,255,255,0.28),0_0_36px_rgba(12,167,137,0.24)] sm:rounded-xl">
            <img
              src={logo.url}
              alt="TRAMED"
              className="h-10 w-10 object-contain p-0.5 sm:h-12 sm:w-12 sm:p-1 md:h-14 md:w-14"
            />
            <span className="absolute -bottom-0.5 -right-0.5 h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]" />
          </div>
          <div className="min-w-0 leading-tight">
            <div className="flex items-center gap-1.5">
              <span className="truncate font-display text-base font-black tracking-tight text-foreground sm:text-lg md:text-xl"
                style={{ textShadow: "0 0 12px rgba(56,189,248,0.22), 0 0 24px rgba(56,189,248,0.10)" }}>
                TRAMED
              </span>
              <span className="hidden h-3 w-px bg-border/60 md:block" />
              <span className="hidden items-center gap-1 rounded-full border border-accent/40 bg-accent/10 px-1.5 py-0.5 font-mono text-[8px] uppercase leading-[1.4] tracking-[0.14em] text-accent md:inline-flex">
                <span className="relative h-1 w-1 rounded-full bg-accent shadow-[0_0_8px_var(--cyan)]" />
                online
              </span>
            </div>
            <div className="hidden items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.14em] text-muted-foreground sm:flex">
              <span className="truncate">nttu clinical tech</span>
              {clock && <span suppressHydrationWarning className="shrink-0 text-accent/80">utc {clock}</span>}
            </div>
          </div>
        </Link>

        <nav className="scrollbar-none hidden items-center gap-0.5 overflow-x-auto rounded-full border border-accent/40 bg-card/60 px-1 py-0.5 font-mono text-[8px] font-semibold uppercase leading-[1.4] tracking-[0.08em] text-foreground backdrop-blur md:flex">
          <Link to="/kham-benh" className={tabClass(pathname.startsWith("/kham-benh") || pathname.startsWith("/ke-don"))}>
            khám &amp; kê đơn
          </Link>
          <Link to="/dinh-duong" className={tabClass(pathname.startsWith("/dinh-duong"))}>dinh dưỡng</Link>
          <Link to="/duong-sinh" className={tabClass(pathname.startsWith("/duong-sinh"))}>dưỡng sinh</Link>
          <Link to="/vong-chan" className={tabClass(pathname.startsWith("/vong-chan"))}>
            vọng chẩn
          </Link>
          <Link to="/cong-nghe" className={tabClass(pathname.startsWith("/cong-nghe"))}>công nghệ</Link>
          {anchor("bento", "hệ thống")}
          {anchor("how", "quy trình")}
          {anchor("team", "nhóm")}
        </nav>
      </div>

      {/* Mobile / tablet nav – horizontal scroll strip */}
      <nav className="border-t border-border/40 bg-background/70 backdrop-blur md:hidden">
        <div className="scrollbar-none flex items-center gap-1 overflow-x-auto px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          <Link to="/kham-benh" className={`shrink-0 ${tabClass(pathname.startsWith("/kham-benh") || pathname.startsWith("/ke-don"))}`}>khám &amp; kê đơn</Link>
          <Link to="/dinh-duong" className={`shrink-0 ${tabClass(pathname.startsWith("/dinh-duong"))}`}>dinh dưỡng</Link>
          <Link to="/duong-sinh" className={`shrink-0 ${tabClass(pathname.startsWith("/duong-sinh"))}`}>dưỡng sinh</Link>
          <Link to="/vong-chan" className={`shrink-0 ${tabClass(pathname.startsWith("/vong-chan"))}`}>vọng chẩn</Link>
          <Link to="/cong-nghe" className={`shrink-0 ${tabClass(pathname.startsWith("/cong-nghe"))}`}>công nghệ</Link>
          <span className="mx-1 h-4 w-px shrink-0 bg-border/60" />
          {isHome ? (
            <>
              <a href="#bento" className="shrink-0 rounded-full px-2 py-1 hover:bg-accent/10 hover:text-accent">hệ thống</a>
              <a href="#how" className="shrink-0 rounded-full px-2 py-1 hover:bg-accent/10 hover:text-accent">quy trình</a>
              <a href="#team" className="shrink-0 rounded-full px-2 py-1 hover:bg-accent/10 hover:text-accent">nhóm</a>
            </>
          ) : (
            <>
              <Link to="/" hash="bento" className="shrink-0 rounded-full px-2 py-1 hover:bg-accent/10 hover:text-accent">hệ thống</Link>
              <Link to="/" hash="how" className="shrink-0 rounded-full px-2 py-1 hover:bg-accent/10 hover:text-accent">quy trình</Link>
              <Link to="/" hash="team" className="shrink-0 rounded-full px-2 py-1 hover:bg-accent/10 hover:text-accent">nhóm</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
