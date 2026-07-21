import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export interface SatinButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  to?: string;
  href?: string;
  showArrow?: boolean;
  loading?: boolean;
  size?: "sm" | "md";
}

const SatinButton = React.forwardRef<HTMLButtonElement, SatinButtonProps>(
  ({ className, children, asChild = false, to, href, showArrow = true, loading = false, size = "md", ...props }, ref) => {
    const classes = cn(
      "group relative inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-full font-bold tracking-tight",
      "bg-gradient-to-b from-[#FDE68A] via-[#F59E0B] to-[#D97706]",
      "text-[#451A03]",
      "shadow-[0_10px_25px_-5px_rgba(0,0,0,0.5),inset_0_1.5px_1px_rgba(255,255,255,0.6)]",
      "border-b-2 border-[#92400E]/50",
      "hover:brightness-105 active:translate-y-0.5 transition-all duration-300",
      "disabled:pointer-events-none disabled:opacity-60",
      size === "sm" && "px-6 py-2.5 text-xs uppercase tracking-wider",
      size === "md" && "px-8 py-3.5 text-sm",
      className
    );

    const icon = loading ? (
      <span className="inline-block h-2 w-2 rounded-full bg-current animate-ping" />
    ) : (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="drop-shadow-sm shrink-0">
        <path d="M12 3L14.5 10L21.5 12L14.5 14L12 21L9.5 14L2.5 12L9.5 10L12 3Z" fill="currentColor" />
        <circle cx="19" cy="6" r="1.5" fill="currentColor" />
      </svg>
    );

    const label = <span>{loading && typeof children === "string" ? children.replace("✨", "").replace("→", "").trim() : children}</span>;

    const arrow = showArrow && !loading && (
      <>
        <div className="h-4 w-[1.5px] bg-current/20" />
        <svg
          className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="3"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </>
    );

    const content = (
      <>
        {icon}
        {label}
        {arrow}
      </>
    );

    if (to) {
      return (
        <Link to={to} className={classes}>
          {content}
        </Link>
      );
    }

    if (href) {
      return (
        <a href={href} className={classes}>
          {content}
        </a>
      );
    }

    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={classes} ref={ref} {...props}>
        {content}
      </Comp>
    );
  }
);
SatinButton.displayName = "SatinButton";

export { SatinButton };
