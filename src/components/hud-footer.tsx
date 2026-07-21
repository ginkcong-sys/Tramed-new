import { Link } from "@tanstack/react-router";
import { Phone, Mail, X } from "lucide-react";
import { useState, useEffect } from "react";
import thanhCongPhoto from "@/assets/thanh-cong.png.asset.json";

export function HudFooter() {
  const year = new Date().getFullYear();
  const [photoOpen, setPhotoOpen] = useState(false);

  useEffect(() => {
    if (!photoOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPhotoOpen(false);
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [photoOpen]);


  return (
    <footer id="contact" className="relative border-t border-slate-200 bg-[#E0F2FE]">
      <div className="container mx-auto px-6 py-6">
        {/* Main row: brand · leader+contact · nav */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="font-display text-xl font-black tracking-tight text-slate-900">
              TRAMED
            </span>
            <span className="rounded border border-sky-500/40 bg-sky-400/15 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-sky-700">
              nttu clinical tech
            </span>
          </Link>

          {/* Leader + contact – compact inline card */}
          <div className="flex items-center gap-3 rounded-xl border border-sky-400/30 bg-white/90 px-3 py-2 shadow-sm">
            <button
              type="button"
              onClick={() => setPhotoOpen(true)}
              aria-label="Xem ảnh lớn Tiết Thành Công"
              className="h-11 w-11 shrink-0 overflow-hidden rounded-full ring-2 ring-sky-400/50 transition hover:ring-sky-500 hover:ring-4 focus:outline-none focus:ring-4 focus:ring-sky-500"
            >
              <img
                src={thanhCongPhoto.url}
                alt="Tiết Thành Công"
                className="h-full w-full object-cover object-center"
              />
            </button>
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-2">
                <span className="font-display text-sm font-bold leading-tight text-slate-900">Tiết Thành Công</span>
                <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-sky-700">Leader · TRAMED</span>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                <a href="tel:0767955931" className="inline-flex items-center gap-1.5 text-slate-800 hover:text-sky-700">
                  <Phone className="h-3 w-3 text-sky-600" />
                  <span className="font-mono text-[11px] tracking-wide">0767 955 931</span>
                </a>
                <span className="text-slate-300">·</span>
                <a href="mailto:ginkcong@gmail.com" className="inline-flex items-center gap-1.5 text-slate-800 hover:text-sky-700">
                  <Mail className="h-3 w-3 text-sky-600" />
                  <span className="font-mono text-[11px] tracking-wide">ginkcong@gmail.com</span>
                </a>
              </div>
            </div>
          </div>



        </div>

        {/* Bottom strip: copyright + disclaimer */}
        <div className="mt-5 flex flex-col gap-1 border-t border-slate-200/70 pt-3 text-[11px] leading-[1.6] text-slate-500 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="font-medium text-slate-800">© {year} TRAMED</span>
            <span className="mx-2 text-slate-300">·</span>
            Đề tài khởi nghiệp YHCT · ĐH Nguyễn Tất Thành
          </div>
          <div>Hỗ trợ quyết định lâm sàng · không thay thế thầy thuốc.</div>
        </div>
      </div>

      {photoOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Ảnh Tiết Thành Công"
          onClick={() => setPhotoOpen(false)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <button
            type="button"
            aria-label="Đóng"
            onClick={() => setPhotoOpen(false)}
            className="absolute right-4 top-4 rounded-full bg-white/90 p-2 text-slate-900 shadow-lg transition hover:bg-white"
          >
            <X className="h-5 w-5" />
          </button>
          <figure
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[92vh] max-w-[92vw] flex-col items-center gap-3"
          >
            <img
              src={thanhCongPhoto.url}
              alt="Tiết Thành Công"
              className="max-h-[80vh] w-auto rounded-2xl object-contain shadow-[0_20px_80px_rgba(56,189,248,0.35)] ring-4 ring-sky-400/60"
            />
            <figcaption className="text-center">
              <div className="font-display text-lg font-bold text-white">Tiết Thành Công</div>
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-sky-300">Leader · TRAMED</div>
            </figcaption>
          </figure>
        </div>
      )}
    </footer>
  );
}
