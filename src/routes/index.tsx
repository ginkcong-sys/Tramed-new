import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Activity, Leaf, Eye, Sparkles, LineChart, Target, Rocket, Users, Lightbulb, TrendingUp, Award, Zap, Globe, X } from "lucide-react";
import { SatinButton } from "@/components/ui/satin-button";
import logo from "@/assets/tramed-logo-official.png.asset.json";
import nttuLogo from "@/assets/nttu-logo.png.asset.json";
import minhNhuPhoto from "@/assets/minh-nhu.jpg.asset.json";
import thienAnPhoto from "@/assets/thien-an.jpg.asset.json";
import thanhCongPhoto from "@/assets/thanh-cong.png.asset.json";
import tanHiepPhoto from "@/assets/tan-hiep.png";
import giaHieuPhoto from "@/assets/gia-hieu.png.asset.json";
import ngocGiauPhoto from "@/assets/ngoc-giau.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TRAMED – Trợ lý chẩn trị & kê đơn Y học cổ truyền" },
      { name: "description", content: "Hệ sinh thái hỗ trợ thầy thuốc YHCT: biện chứng luận trị, kê đơn Quân-Thần-Tá-Sứ, cảnh báo tương tác Đông-Tây y theo thời gian thực." },
      { property: "og:title", content: "TRAMED – Trợ lý chẩn trị cho thầy thuốc YHCT" },
      { property: "og:description", content: "Lý luận biện chứng – kê đơn an toàn – cảnh báo tương tác Đông-Tây y." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen">




      {/* Hero – Nền tảng trí tuệ Đông y toàn diện */}
      <section className="relative overflow-hidden">
        <div className="grid-bg absolute inset-0 opacity-20" />
        {/* deep ambient glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_45%,color-mix(in_oklab,var(--cyan)_14%,transparent),transparent_75%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_40%_30%_at_50%_100%,color-mix(in_oklab,var(--indigo)_25%,transparent),transparent_75%)]" />

        {/* Ngũ hành – pentagram chìm sau nội dung hero */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.38]"><NguHanhPentagram /></div>

        {/* ECG waveform crossing through the center */}
        <svg
          aria-hidden
          viewBox="0 0 1400 200"
          preserveAspectRatio="none"
          className="pointer-events-none absolute left-0 right-0 top-[62%] h-[120px] w-full opacity-[0.18]"
        >
          <defs>
            <linearGradient id="ecgGrad" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="var(--cyan)" stopOpacity="0" />
              <stop offset="20%" stopColor="var(--cyan)" stopOpacity="0.8" />
              <stop offset="80%" stopColor="var(--cyan)" stopOpacity="0.8" />
              <stop offset="100%" stopColor="var(--cyan)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0 100 L260 100 L290 100 L300 70 L310 130 L320 60 L330 140 L340 100 L600 100 L640 100 L660 80 L680 120 L700 50 L720 150 L740 100 L1080 100 L1110 100 L1120 70 L1130 130 L1140 60 L1150 140 L1160 100 L1400 100"
            fill="none"
            stroke="url(#ecgGrad)"
            strokeWidth="1.5"
          />
        </svg>

        <div className="container relative mx-auto px-6 py-8 md:py-12 lg:py-14">
          <div className="mx-auto max-w-5xl text-center">
            {/* Triple pill row */}
            <div className="mx-auto inline-flex flex-wrap items-center justify-center gap-x-4 gap-y-1 rounded-full border border-accent/30 bg-card/80 px-4 py-1.5 font-mono text-[10px] uppercase leading-[1.5] tracking-[0.2em] text-foreground/95 backdrop-blur-md">
              <span>Dual-model</span>
              <span className="h-1 w-1 rounded-full bg-accent/50" />
              <span>RAG dược điển</span>
              <span className="h-1 w-1 rounded-full bg-accent/50" />
              <span>Cảnh báo real-time</span>
            </div>

            {/* HERO – editorial, no boxes */}
            <div className="relative mt-4 md:mt-5">
              <h1 className="font-display flex flex-wrap items-center justify-center gap-x-1 text-[1.5rem] leading-[1.08] tracking-tight text-foreground sm:text-[1.9rem] md:gap-x-2 md:text-[2.4rem] lg:text-[3rem]">
                <span className="whitespace-nowrap">Nền tảng</span>
                <span className="whitespace-nowrap font-black" style={{ color: "#38BDF8" }}>trí tuệ</span>
                <span className="whitespace-nowrap font-black">Đông y</span>
                <span className="whitespace-nowrap">toàn diện.</span>
              </h1>

              <div
                aria-hidden
                className="mx-auto my-4 h-px w-12 md:w-16"
                style={{ background: "linear-gradient(to right, transparent, rgba(253,224,71,0.9), transparent)" }}
              />

              <p
                className="mx-auto max-w-2xl text-balance font-sans text-base font-bold leading-relaxed md:text-lg"
                style={{
                  color: "#38BDF8",
                  textShadow: "0 0 10px rgba(56,189,248,0.22), 0 0 20px rgba(56,189,248,0.10)",
                }}
              >
                Kết hợp tinh hoa cổ truyền và công nghệ lâm sàng tân tiến – một mặt sách được lật, một chương chẩn trị bắt đầu.
              </p>
            </div>

            {/* FEATURES – open editorial columns, only hairlines */}
            <div className="relative mx-auto mt-8 md:mt-10 max-w-6xl rounded-2xl border border-[#FACC15]/30 bg-card/80 px-5 py-8 shadow-2xl shadow-black/10 backdrop-blur-xl md:px-8 md:py-10">
            <div className="mb-8 pb-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#38BDF8]/40 bg-[#38BDF8]/10 px-3 py-1.5 font-mono text-[10px] font-bold uppercase leading-[1.5] tracking-[0.28em] text-[#38BDF8]"
                  style={{ textShadow: "0 0 8px rgba(56,189,248,0.35), 0 0 16px rgba(56,189,248,0.15)" }}>
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#38BDF8] opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#38BDF8]" />
                  </span>
                  Ba trụ cột hệ thống
                </span>
                <div
                  aria-hidden
                  className="mx-auto mt-3 h-px w-16"
                  style={{ background: "linear-gradient(to right, transparent, rgba(56,189,248,0.95), transparent)" }}
                />
              </div>

              <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3 md:gap-5 lg:gap-6">
                <FeatureInline
                  align="center"
                  index="01"
                  eyebrow="Tứ chẩn"
                  title={
                    <span
                      className="inline-flex items-baseline whitespace-nowrap text-[1.15rem] leading-[1.45] tracking-[0.12em] md:text-[1.32rem] lg:text-[1.48rem]"
                      style={{
                        color: "#FFFFFF",
                        textShadow: "0 0 6px rgba(255,255,255,0.22), 0 0 14px rgba(255,255,255,0.10), 0 0 24px rgba(255,255,255,0.05)",
                      }}
                    >
                      Biện chứng <span className="ml-1 font-sans text-[#FFFFFF]">số hoá</span>
                    </span>
                  }
                  desc="Phân tích chính xác triệu chứng và mạch lý, đối chiếu với dữ liệu lâm sàng đã được kiểm chứng."
                />
                <FeatureInline
                  align="center"
                  index="02"
                  eyebrow="Lập phương"
                  title={
                    <span
                      className="inline-flex items-baseline whitespace-nowrap text-[1.15rem] leading-[1.45] tracking-[0.12em] md:text-[1.32rem] lg:text-[1.48rem]"
                      style={{
                        color: "#FFFFFF",
                        textShadow: "0 0 6px rgba(255,255,255,0.22), 0 0 14px rgba(255,255,255,0.10), 0 0 24px rgba(255,255,255,0.05)",
                      }}
                    >
                      Quân–Thần–<span className="font-sans text-[#FFFFFF]">Tá–Sứ</span>
                    </span>
                  }
                  desc="Hỗ trợ kê đơn theo nguyên tắc cổ truyền, tối ưu vị thuốc và liều lượng cho từng thể bệnh."
                />
                <FeatureInline
                  align="center"
                  index="03"
                  eyebrow="An toàn"
                  title={
                    <span
                      className="inline-flex items-baseline whitespace-nowrap text-[1.15rem] leading-[1.45] tracking-[0.12em] md:text-[1.32rem] lg:text-[1.48rem]"
                      style={{
                        color: "#FFFFFF",
                        textShadow: "0 0 6px rgba(255,255,255,0.22), 0 0 14px rgba(255,255,255,0.10), 0 0 24px rgba(255,255,255,0.05)",
                      }}
                    >
                      Đông–Tây y <span className="ml-1 font-sans text-[#FFFFFF]">giám sát</span>
                    </span>
                  }
                  desc="Cảnh báo tương tác thuốc – Thập bát phản, Thập cửu úy – theo thời gian thực trên toa."
                />
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 md:mt-10">
              <SatinButton to="/ke-don" size="md">
                Bắt đầu phiên chẩn trị
              </SatinButton>
              <a
                href="#bento"
                className="btn-glass-outline rounded-full px-7 py-3 text-sm font-semibold uppercase tracking-wider"
              >
                Khám phá hệ thống
              </a>
            </div>
          </div>
        </div>

        {/* sparkle */}
        <span className="pointer-events-none absolute bottom-8 right-10 text-accent/70 hidden lg:block">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0l2.4 9.6L24 12l-9.6 2.4L12 24l-2.4-9.6L0 12l9.6-2.4z" /></svg>
        </span>
      </section>


      {/* Bento Grid */}
      <section id="bento" className="bg-white py-24 md:py-28">
        <div className="container mx-auto px-6">
          <SectionHead
            eyebrow="Case study"
            title="Một phiên chẩn trị điển hình"
            lead="Từ Tứ chẩn tới phương dược Quân–Thần–Tá–Sứ – hệ thống giữ vai trò trợ lý, thầy thuốc giữ quyền chốt cuối."
            tone="light"
          />
          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-6 md:grid-rows-[auto_auto_auto] md:gap-6">
            {/* Big card – Phiếu chẩn trị */}
            <div className="glass glow-indigo relative overflow-hidden rounded-2xl p-6 md:col-span-4 md:row-span-2">
              <div className="grid-bg absolute inset-0 opacity-30" />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <span className="pill"><span className="h-1.5 w-1.5 rounded-full bg-accent" />Live · Phiếu chẩn trị</span>
                  <span className="font-mono text-xs text-foreground/90">CASE_ID · 0x4F2A</span>
                </div>
                <div className="mt-5 grid gap-3 text-sm">
                  <Row k="Bệnh nhân" v="Nữ, 58t · THA · suy thận độ 2" />
                  <Row k="Tứ chẩn" v="Lưỡi đỏ, rêu vàng khô · Mạch huyền sác" />
                  <Row k="Biện chứng (Bát cương)" v="Lý · Hư · Nhiệt · Âm hư" />
                  <Row k="Hội chứng bệnh" v="Can dương thượng kháng, Thận âm hư" highlight />
                  <Row k="Pháp trị" v="Tư âm tiềm dương, bình can tức phong" />
                </div>
                <div className="mt-4 rounded-xl border border-border/80 bg-card p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="font-mono text-[10px] uppercase tracking-widest text-accent">Phương dược · Thiên ma câu đằng ẩm (gia giảm)</div>
                    <span className="font-mono text-[10px] text-foreground/90">6 vị</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs md:grid-cols-3">
                    {(
                      [
                        ["Thiên ma", "12g", "Quân"],
                        ["Câu đằng", "16g", "Quân"],
                        ["Thạch quyết minh", "30g", "Thần"],
                        ["Hoàng cầm", "10g", "Thần"],
                        ["Đỗ trọng", "12g", "Tá"],
                        ["Cam thảo", "4g", "Sứ"],
                      ] as const
                    ).map(([n, d, r]) => {
                      const roleStyles: Record<string, CSSProperties> = {
                        Quân: {
                          background: "color-mix(in oklab, var(--primary) 88%, black 6%)",
                          color: "var(--primary-foreground)",
                          border: "1px solid color-mix(in oklab, var(--primary) 70%, transparent)",
                        },
                        Thần: {
                          background: "color-mix(in oklab, var(--primary) 16%, transparent)",
                          color: "#38BDF8",
                          border: "1px solid color-mix(in oklab, var(--primary) 38%, transparent)",
                        },
                        Tá: {
                          background: "color-mix(in oklab, var(--accent) 14%, transparent)",
                          color: "#38BDF8",
                          border: "1px solid color-mix(in oklab, var(--accent) 32%, transparent)",
                        },
                        Sứ: {
                          background: "color-mix(in oklab, var(--muted) 80%, transparent)",
                          color: "color-mix(in oklab, var(--foreground) 78%, transparent)",
                          border: "1px solid color-mix(in oklab, var(--border) 80%, transparent)",
                        },
                      };
                      return (
                        <div
                          key={n}
                          className="flex items-center justify-between rounded-md border border-border/50 bg-card px-2.5 py-2"
                        >
                          <span className="text-foreground">
                            <span className="font-semibold">{n}</span>{" "}
                            <span className="text-foreground/90">{d}</span>
                          </span>
                          <span
                            className="rounded-full px-2 py-[2px] font-mono text-[9px] font-semibold uppercase tracking-wider"
                            style={roleStyles[r]}
                          >
                            {r}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                </div>
                <div className="mt-4 flex items-start gap-3 rounded-xl border border-destructive bg-destructive/25 p-3.5 text-sm text-destructive-foreground shadow-lg shadow-destructive/25">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-base">⚠</span>
                  <div>
                    <div className="font-black uppercase tracking-wider" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>Cảnh báo tương tác</div>
                    <div className="mt-0.5 font-bold" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>BN dùng Warfarin – tránh Đan sâm / Đương quy (xuất huyết).</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stat: models */}
            <div className="card-emerald relative overflow-hidden rounded-2xl p-6 md:col-span-2 transition duration-300">
              <span className="pill">Dual-Model</span>
              <div className="mt-4 font-display text-6xl gradient-text">02</div>
              <p className="mt-2 text-sm leading-[1.55] text-foreground/90">
                VNPT SmartVision + Agent nội bộ phối hợp chéo, giảm hallucination.
              </p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider">
                  <span className="text-accent">VNPT SmartVision</span>
                  <span className="text-foreground/90">94%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-border/50">
                  <div className="h-full w-[94%] rounded-full bg-gradient-to-r from-accent to-primary" />
                </div>
                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider">
                  <span className="text-primary">Agent nội bộ</span>
                  <span className="text-foreground/90">91%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-border/50">
                  <div className="h-full w-[91%] rounded-full bg-gradient-to-r from-primary to-accent" />
                </div>
              </div>
            </div>

            {/* Stat: warnings */}
            <div className="card-emerald relative overflow-hidden rounded-2xl p-6 md:col-span-2 transition duration-300">
              <span className="pill">Giám sát</span>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-display text-6xl gradient-text">37</span>
                <span className="font-mono text-xs text-foreground/90">cặp</span>
              </div>
              <p className="mt-2 text-sm leading-[1.55] text-foreground/90">
                Thập bát phản · Thập cửu úy · tương tác thảo dược × tân dược.
              </p>
            </div>


            {/* Pillar 1 */}
            <PillarCard
              index="01"
              eyebrow="RAG"
              title="Nguồn tri thức chuẩn"
              desc="Mọi câu trả lời được truy xuất từ kho giáo trình & dược điển chính thống – không tự bịa vị thuốc, không tự chế phác đồ."
            >
              <ul className="mt-5 space-y-2 text-[13.5px] font-semibold text-foreground/90">
                <li>• <span className="text-foreground font-bold">Dược điển Việt Nam V</span> – Bộ Y tế</li>
                <li>• <span className="text-foreground font-bold">Bài giảng YHCT</span> – ĐH Y Hà Nội & ĐH Y Dược TP.HCM</li>
                <li>• <span className="text-foreground font-bold">Phương tễ học · Trung dược học</span> – NXB Y học</li>
                <li>• <span className="text-foreground font-bold">Châm cứu học</span> – Viện Châm cứu TW</li>
                <li>• <span className="text-foreground font-bold">Bệnh học Nội khoa YHHĐ</span> – ĐH Y Hà Nội</li>
                <li>• <span className="text-foreground font-bold">Hướng dẫn chẩn đoán & điều trị</span> – Bộ Y tế</li>
              </ul>
            </PillarCard>

            {/* Pillar 2 */}
            <PillarCard
              index="02"
              eyebrow="Reasoning"
              title="Biện chứng Bát cương"
              desc="Mô phỏng tư duy lâm sàng: Tứ chẩn → Bát cương → Tạng phủ – Khí huyết – Kinh lạc → Pháp trị → Phương dược Quân-Thần-Tá-Sứ. Có lý do cho từng vị thuốc."
            />

            {/* Pillar 3 */}
            <PillarCard
              index="03"
              eyebrow="Safety"
              title="Cảnh báo realtime"
              desc="Tự động quét Thập bát phản – Thập cửu úy, kỵ thai, liều độc, và tương tác thảo dược × tân dược của bệnh nhân ngay khi kê đơn."
            />
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="how" className="relative overflow-hidden bg-[#E0F2FE] py-24 md:py-28">
        <div className="container mx-auto px-6">
          <div className="mb-14 max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-sky-300/70 bg-white/80 px-3 py-1.5 font-mono text-[10px] font-semibold uppercase leading-[1.5] tracking-[0.25em] text-sky-700 backdrop-blur-sm">
              Pipeline
            </span>
            <h2 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
              Quy trình khép kín
            </h2>
            <div aria-hidden className="mt-4 h-px w-16 bg-sky-500/70" />
            <p className="mt-4 text-[15px] font-semibold leading-7 text-slate-700">
              Bốn bước tuần tự, mỗi bước có đầu ra kiểm chứng được – không có bước nào chạy ngầm ngoài tầm giám sát của thầy thuốc.
            </p>
          </div>
          <ol className="grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-4">
            {[
              ["Tứ chẩn", "Vọng – Văn – Vấn – Thiết kết hợp dữ liệu sinh hóa."],
              ["Biện chứng", "Bát cương · Tạng phủ · Khí huyết tự động lập luận."],
              ["Kê đơn", "Phương dược Quân–Thần–Tá–Sứ, cá nhân hóa liều."],
              ["Theo dõi", "Biểu đồ tiến triển, gợi ý gia giảm khi tái khám."],
            ].map(([t, d], i) => (
              <li key={t} className="group relative flex flex-col rounded-2xl bg-white/80 p-6 shadow-sm shadow-sky-900/5 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-lg hover:shadow-sky-900/10">
                {/* Hairline top */}
                <div className="h-px w-full bg-sky-200">
                  <div className="h-full w-8 bg-sky-500 transition-all duration-700 group-hover:w-full" />
                </div>

                {/* Numeral */}
                <div className="mt-6 flex items-baseline gap-4">
                  <span className="font-display text-[3.25rem] font-light leading-none tracking-tight text-sky-700">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-sky-500">
                    Step
                  </span>
                </div>

                {/* Title */}
                <h3 className="mt-6 font-display text-[1.75rem] font-bold leading-[1.1] text-slate-900">
                  {t}
                </h3>

                {/* Description */}
                <p className="mt-3 max-w-[28ch] text-[14px] font-semibold leading-6 text-slate-700">
                  {d}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>


      {/* Team */}
      <section id="team" className="container mx-auto px-6 py-24 md:py-28">
        <SectionHead
          eyebrow="Team"
          title="Nhóm phát triển"
          lead="Trường Đại học Nguyễn Tất Thành · Khoa Dược – đội ngũ sinh viên và giảng viên đồng hành cùng dự án khởi nghiệp YHCT 2026."
        />

        {/* Giới thiệu dự án Tramed */}
        <div className="mt-12">
          <ProjectCard />
        </div>

        {/* GVHD + Thành viên gộp chung */}
        <div className="mt-10">
          {/* GVHD */}
          <div className="mb-3 font-mono text-[11px] uppercase tracking-widest" style={{ color: "#8FB0E0" }}>// Giảng viên hướng dẫn</div>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { name: "ThS.BS. Nguyễn Hồ Minh Như", role: "GVHD · Y học cổ truyền", photo: minhNhuPhoto.url, bio: "Định hướng chuyên môn YHCT, thẩm định bài thuốc & kiểm chứng tri thức cổ phương cho hệ thống." },
              { name: "ThS.DS. Lư Bích Ngọc Giàu", role: "GVHD · Khoa Dược", photo: ngocGiauPhoto.url, bio: "Cố vấn dược lý hiện đại, đánh giá an toàn – tương tác thuốc và chuẩn hóa dữ liệu nghiên cứu." },
            ].map((m, i) => (
              <MemberCard key={m.name} name={m.name} role={m.role} bio={m.bio} photo={m.photo} index={i} variant="advisor" />
            ))}
          </div>

          {/* Sinh viên */}
          <div className="mt-4">
            <div className="mb-3 font-mono text-[11px] uppercase tracking-widest" style={{ color: "#8FB0E0" }}>// Thành viên</div>
            <div className="grid gap-4 md:grid-cols-4">
              {[
                { name: "Tiết Thành Công", role: "Leader dự án · SV ngành YHCT", photo: thanhCongPhoto.url, variant: "leader" as const, bio: "Điều phối nhóm, lên chiến lược sản phẩm và kết nối tri thức YHCT vào sản phẩm số." },
                { name: "Đào Lê Thiên Ân", role: "Phòng nội dung · SV ngành Dược", photo: thienAnPhoto.url, variant: "member" as const, bio: "Xây dựng nội dung dược học, biên tập tri thức và chuẩn hóa thông tin bài thuốc." },
                { name: "Phạm Tấn Hiệp", role: "Phòng truyền thông · SV ngành Dược", photo: tanHiepPhoto, variant: "member" as const, bio: "Phụ trách truyền thông – thương hiệu, lan tỏa giá trị YHCT đến cộng đồng người dùng." },
                { name: "Lê Hoàng Gia Hiếu", role: "Phòng kỹ thuật · SV ngành Dược", photo: giaHieuPhoto.url, variant: "member" as const, bio: "Phát triển hạ tầng, tích hợp công nghệ thông minh và tối ưu trải nghiệm sản phẩm trên nền tảng số." },
              ].map((m, i) => (
                <MemberCard key={m.name} name={m.name} role={m.role} bio={m.bio} photo={m.photo} index={i + 2} variant={m.variant} />
              ))}
            </div>
          </div>
        </div>

        {/* University banner – minimal editorial */}
        <div className="mt-12 border-t border-b border-accent/15 py-6">
          <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
            <div className="flex items-center gap-3">
              <img
                src={logo.url}
                alt="Logo Nhóm TRAMED"
                className="h-8 w-8 rounded-md bg-white p-0.5 object-contain"
              />
              <span className="font-mono text-xs text-accent/70">×</span>
              <img
                src={nttuLogo.url}
                alt="Logo Đại học Nguyễn Tất Thành"
                className="h-8 w-8 rounded-md bg-white p-0.5 object-contain"
              />
              <div className="ml-2 hidden h-8 w-px bg-accent/20 md:block" />
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent/80">Hợp tác nghiên cứu</div>
                <div className="mt-0.5 text-sm md:text-base">Nhóm TRAMED × ĐH Nguyễn Tất Thành <span className="text-foreground/90">· Khoa Dược</span></div>
              </div>
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/90">
              Đề tài khởi nghiệp YHCT · 2026
            </div>
          </div>
        </div>

      </section>



    </div>
  );
}

function Row({ k, v, highlight }: { k: string; v: string; highlight?: boolean }) {
  return (
    <div className="grid grid-cols-[160px_1fr] items-baseline gap-6 border-b border-dashed border-border/60 py-3">
      <span
        className="font-sans text-[11px] font-semibold uppercase tracking-[0.06em]"
        style={{ color: "color-mix(in oklab, var(--foreground) 78%, transparent)" }}
      >
        {k}
      </span>
      <span
        className={
          highlight
            ? "text-left text-sm font-semibold text-accent"
            : "text-left text-sm font-semibold text-foreground"
        }
      >
        {v}
      </span>
    </div>
  );
}


function MemberCard({ name, role, bio, index, variant = "member", photo }: { name: string; role: string; bio?: string; index: number; variant?: "advisor" | "leader" | "member"; photo?: string }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [open]);

  const initials = name
    .split(" ")
    .slice(-2)
    .map((s) => s[0])
    .join("");

  const cardClass =
    variant === "advisor"
      ? "team-card team-card-advisor"
      : variant === "leader"
        ? "team-card team-card-leader"
        : "team-card";

  const avatarRingClass =
    variant === "advisor"
      ? "ring-2 ring-[#38BDF8] shadow-[0_0_20px_rgba(56,189,248,0.30)]"
      : variant === "leader"
        ? "ring-2 ring-[#B45309] shadow-[0_0_20px_rgba(11,79,191,0.30)]"
        : "ring-2 ring-[#D97706] shadow-[0_0_20px_rgba(47,111,224,0.30)]";

  const fallbackGlow =
    variant === "advisor"
      ? "shadow-[0_0_20px_rgba(56,189,248,0.30)]"
      : variant === "leader"
        ? "shadow-[0_0_20px_rgba(11,79,191,0.30)]"
        : "shadow-[0_0_20px_rgba(47,111,224,0.30)]";

  const tagText =
    variant === "advisor" ? "★ GVHD" : variant === "leader" ? "LEADER" : `0${index - 1}`;

  const tagColor =
    variant === "advisor"
      ? "text-[#38BDF8]"
      : variant === "leader"
        ? "text-[#38BDF8]"
        : "text-[#38BDF8]";

  const underlineGradient =
    variant === "advisor"
      ? "from-[#38BDF8] to-[#38BDF8]"
      : variant === "leader"
        ? "from-[#B45309] to-[#D97706]"
        : "from-[#D97706] to-[#38BDF8]";

  const orbColor =
    variant === "advisor"
      ? "bg-[#38BDF8]/10 group-hover:bg-[#38BDF8]/25"
      : variant === "leader"
        ? "bg-[#B45309]/10 group-hover:bg-[#B45309]/25"
        : "bg-[#D97706]/10 group-hover:bg-[#D97706]/25";


  const isMember = variant === "member";
  const isAdvisor = variant === "advisor";
  const isLeader = variant === "leader";
  const styledBg = isMember
    ? "linear-gradient(135deg, #FFFFFF 0%, #E0F2FE 55%, #BAE6FD 100%)"
    : isAdvisor
      ? "linear-gradient(135deg, #FFFFFF 0%, #DBEAFE 55%, #93C5FD 130%)"
      : isLeader
        ? "linear-gradient(135deg, #FFFFFF 0%, #E0F2FE 55%, #7DD3FC 100%)"
        : undefined;
  const styledRing = isMember
    ? "border border-[#38BDF8]/60 shadow-[0_8px_30px_-8px_rgba(56,189,248,0.45)]"
    : isAdvisor
      ? "border border-[#60A5FA]/70 shadow-[0_8px_30px_-8px_rgba(59,130,246,0.5)]"
      : isLeader
        ? "border border-[#2563EB]/50 shadow-[0_8px_30px_-8px_rgba(37,99,235,0.5)]"
        : "";

  const tagPillBg =
    styledBg
      ? "bg-white/70 text-[#1D4ED8] border border-[#2563EB]/40"
      : `bg-card border border-border/60 ${tagColor}`;

  return (
    <div
      className={`${cardClass} group relative overflow-hidden rounded-2xl p-5 ${styledBg ? "text-[#0B1E3F]" : ""} ${styledRing} flex flex-col`}
      style={{
        animationDelay: `${index * 90}ms`,
        ...(styledBg ? { background: styledBg } : {}),
      }}
    >
      {/* Tag pill in absolute top-right to avoid colliding with avatar/name */}
      <span
        className={`pointer-events-none absolute right-3 top-3 z-10 rounded-full px-2 py-1 font-mono text-[9px] uppercase leading-[1.5] tracking-widest backdrop-blur-sm ${tagPillBg}`}
      >
        {tagText}
      </span>

      <div className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full blur-2xl transition-all duration-500 ${orbColor}`} />
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-0 transition-opacity duration-500 group-hover:opacity-30" />

      {/* Avatar row */}
      <div className="relative flex items-center gap-4 pr-14">
        <button
          type="button"
          onClick={() => photo && setOpen(true)}
          aria-label={`Xem ảnh ${name}`}
          className={`relative h-14 w-14 shrink-0 rounded-full transition-transform ${photo ? "cursor-zoom-in hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#38BDF8]/60" : "cursor-default"}`}
        >
          {photo ? (
            <div className={`relative h-14 w-14 overflow-hidden rounded-full ${avatarRingClass}`}>
              <img src={photo} alt={name} className="h-full w-full object-cover object-center" />
            </div>
          ) : (
            <div className={`relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-accent to-primary font-display text-sm font-semibold text-accent-foreground ${fallbackGlow}`}>
              {initials}
            </div>
          )}
        </button>
        <div className="min-w-0 flex-1">
          <div className={`font-display text-[15px] font-bold leading-tight transition-colors ${styledBg ? "text-[#0B1E3F] group-hover:text-[#1D4ED8]" : "group-hover:text-accent"}`}>
            {name}
          </div>
          <div
            className="mt-1 font-mono text-[10px] font-semibold uppercase leading-[1.5] tracking-wider"
            style={styledBg ? { color: "#1D4ED8" } : { color: "color-mix(in oklab, var(--foreground) 72%, transparent)" }}
          >
            {role}
          </div>
        </div>
      </div>

      {/* Bio / intro */}
      {bio && (
        <p
          className="relative mt-3 pb-1 text-[12.5px] font-medium leading-6"
          style={styledBg ? { color: "rgba(11, 30, 63, 0.85)" } : { color: "color-mix(in oklab, var(--foreground) 78%, transparent)" }}
        >
          {bio}
        </p>
      )}

      <div className={`relative mt-4 h-px w-0 bg-gradient-to-r ${underlineGradient} transition-all duration-500 group-hover:w-full`} />

      {open && photo && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`Ảnh ${name}`}
        >
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setOpen(false); }}
            aria-label="Đóng"
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-[#38BDF8]"
          >
            <X className="h-5 w-5" />
          </button>
          <figure
            className="relative max-h-[90vh] max-w-[92vw] overflow-hidden rounded-2xl shadow-[0_0_60px_rgba(56,189,248,0.35)] ring-2 ring-[#38BDF8]/60"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={photo} alt={name} className="block max-h-[80vh] w-auto object-contain" />
            <figcaption className="bg-[#0A1B4C]/95 px-5 py-3 text-white">
              <div className="font-display text-base font-bold">{name}</div>
              <div className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-[#38BDF8]">{role}</div>
            </figcaption>
          </figure>
        </div>
      )}
    </div>
  );
}


function NguHanhRing({ label, symbol, color, className }: { label: string; symbol: string; color: string; className?: string }) {
  return (
    <div className={`flex flex-col items-center gap-2 ${className ?? ""}`}>
      <div
        className="relative flex h-16 w-16 items-center justify-center rounded-full border text-2xl"
        style={{
          borderColor: `color-mix(in oklab, ${color} 70%, transparent)`,
          boxShadow: `0 0 24px color-mix(in oklab, ${color} 35%, transparent), inset 0 0 12px color-mix(in oklab, ${color} 20%, transparent)`,
          background: `radial-gradient(circle at 30% 30%, color-mix(in oklab, ${color} 18%, transparent), transparent 70%)`,
          color,
        }}
      >
        <span>{symbol}</span>
        <span
          className="absolute inset-[-6px] rounded-full border opacity-30"
          style={{ borderColor: `color-mix(in oklab, ${color} 50%, transparent)` }}
        />
      </div>
      <span className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: `color-mix(in oklab, ${color} 85%, white)` }}>{label}</span>
    </div>
  );
}

function FeatureInline({
  eyebrow,
  title,
  desc,
  align = "center",
  index,
  icon,
  iconGradient = "from-accent to-primary",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  desc: string;
  align?: "left" | "center" | "right";
  index?: string;
  icon?: React.ReactNode;
  iconGradient?: string;
}) {
  const alignClass =
    align === "left" ? "text-left items-start" : align === "right" ? "text-right items-end" : "text-center items-center";
  const lineGradient =
    align === "left"
      ? "linear-gradient(to right, rgba(56,189,248,0.95), rgba(56,189,248,0.4))"
      : align === "right"
        ? "linear-gradient(to left, rgba(56,189,248,0.95), rgba(56,189,248,0.4))"
        : "linear-gradient(to right, rgba(56,189,248,0.4), rgba(56,189,248,0.95), rgba(56,189,248,0.4))";

  return (
    <div
      className={`group relative flex flex-col rounded-2xl border border-[#38BDF8]/15 bg-gradient-to-b from-card/90 to-card/60 px-5 py-6 shadow-lg shadow-black/5 transition-all duration-500 hover:-translate-y-1 hover:border-[#38BDF8]/40 hover:shadow-[#38BDF8]/10 md:px-6 md:py-7 ${alignClass}`}
    >
      {/* subtle ambient glow on hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(56,189,248,0.12), transparent 70%)",
        }}
      />

      <div className="relative">
        {index && (
          <span className="absolute right-0 top-0 font-mono text-[10px] font-bold uppercase tracking-widest text-[#38BDF8]/25 transition-colors group-hover:text-[#38BDF8]/60"
            style={{ textShadow: "0 0 6px rgba(56,189,248,0.25)" }}>
            {index}
          </span>
        )}

        {icon && (
          <div
            className={`mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${iconGradient} text-white shadow-lg shadow-black/15 transition-transform duration-500 group-hover:scale-110 group-hover:shadow-[#38BDF8]/25`}
          >
            {icon}
          </div>
        )}

        {eyebrow && (
          <span className="mt-4 inline-block rounded-full border border-[#38BDF8]/30 bg-[#38BDF8]/10 px-2.5 py-1 font-mono text-[9px] font-bold uppercase leading-[1.5] tracking-[0.25em] text-[#38BDF8]"
            style={{ textShadow: "0 0 6px rgba(56,189,248,0.35), 0 0 12px rgba(56,189,248,0.15)" }}>
            {eyebrow}
          </span>
        )}
        <h3 className="mt-3 pb-1 font-display text-xl font-semibold leading-[1.45] tracking-tight text-foreground md:text-[1.6rem] md:leading-[1.4]">
          {title}
        </h3>
        <div
          aria-hidden
          className="mt-3 h-px w-8 transition-all duration-500 group-hover:w-12"
          style={{ background: lineGradient }}
        />
        <p className="mt-3 w-full text-[15px] font-medium leading-relaxed text-foreground/90 md:text-base">
          {desc}
        </p>
      </div>
    </div>
  );
}





function NguHanhPentagram() {
  // 5 nodes, từ trên cùng theo chiều kim đồng hồ: Hỏa · Thổ · Kim · Thủy · Mộc
  const nodes = [
    { key: "hoa", label: "HOẢ · FIRE", han: "火", x: 400, y: 90, tint: "#38BDF8", soft: "#BAE6FD" },
    { key: "tho", label: "THỔ · EARTH", han: "土", x: 690, y: 300, tint: "#0EA5E9", soft: "#BAE6FD" },
    { key: "kim", label: "KIM · METAL", han: "金", x: 580, y: 660, tint: "#7DD3FC", soft: "#E0F2FE" },
    { key: "thuy", label: "THUỶ · WATER", han: "水", x: 220, y: 660, tint: "#0284C7", soft: "#BAE6FD" },
    { key: "moc", label: "MỘC · WOOD", han: "木", x: 110, y: 300, tint: "#22D3EE", soft: "#BAE6FD" },
  ];
  const shengOrder = ["moc", "hoa", "tho", "kim", "thuy", "moc"];
  const keOrder = ["moc", "tho", "thuy", "hoa", "kim", "moc"];
  const byKey = Object.fromEntries(nodes.map((n) => [n.key, n]));
  const path = (order: string[]) =>
    order.map((k, i) => `${i === 0 ? "M" : "L"} ${byKey[k].x} ${byKey[k].y}`).join(" ");

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 aspect-square w-[min(820px,92%)] opacity-70"
      style={{
        maskImage:
          "radial-gradient(ellipse 38% 30% at 50% 50%, transparent 0%, transparent 55%, rgba(0,0,0,0.4) 75%, #000 95%, #000 100%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 38% 30% at 50% 50%, transparent 0%, transparent 55%, rgba(0,0,0,0.4) 75%, #000 95%, #000 100%)",
      }}
    >
      <svg viewBox="0 0 800 800" className="h-full w-full">
        <defs>
          <radialGradient id="phCenterGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.42" />
            <stop offset="55%" stopColor="#0EA5E9" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="shengStroke" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#BAE6FD" />
            <stop offset="25%" stopColor="#38BDF8" />
            <stop offset="50%" stopColor="#0EA5E9" />
            <stop offset="75%" stopColor="#7DD3FC" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>
          <filter id="phSoftGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="phStrongGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" />
          </filter>
        </defs>

        <style>{`
          @keyframes ph-spin { to { transform: rotate(360deg); } }
          @keyframes ph-spin-rev { to { transform: rotate(-360deg); } }
          @keyframes ph-dash { to { stroke-dashoffset: -200; } }
          @keyframes ph-pulse { 0%,100% { opacity: 0.55; } 50% { opacity: 1; } }
          .ph-ring-out { transform-origin: 400px 400px; animation: ph-spin 80s linear infinite; }
          .ph-ring-in  { transform-origin: 400px 400px; animation: ph-spin-rev 60s linear infinite; }
          .ph-dash     { animation: ph-dash 18s linear infinite; }
          .ph-pulse    { animation: ph-pulse 4s ease-in-out infinite; }
        `}</style>

        {/* halo nền */}
        <circle cx="400" cy="400" r="380" fill="url(#phCenterGlow)" />

        {/* 3 vòng tròn */}
        <g className="ph-ring-out">
          <circle cx="400" cy="400" r="370" fill="none" stroke="color-mix(in oklab,#38BDF8 40%,transparent)" strokeWidth="0.8" strokeDasharray="1 7" />
        </g>
        <g className="ph-ring-in">
          <circle cx="400" cy="400" r="330" fill="none" stroke="color-mix(in oklab,#38BDF8 55%,transparent)" strokeWidth="1" strokeDasharray="6 10" />
        </g>
        <circle cx="400" cy="400" r="290" fill="none" stroke="color-mix(in oklab,#38BDF8 30%,transparent)" strokeWidth="0.6" />

        {/* Pentagon tương sinh – gradient stroke + animated dashes */}
        <path
          d={path(shengOrder)}
          fill="color-mix(in oklab,#38BDF8 6%,transparent)"
          stroke="url(#shengStroke)"
          strokeWidth="2.4"
          strokeLinejoin="round"
          filter="url(#phSoftGlow)"
        />
        <path
          d={path(shengOrder)}
          fill="none"
          stroke="color-mix(in oklab,#38BDF8 90%,white)"
          strokeWidth="1"
          strokeDasharray="6 14"
          strokeLinejoin="round"
          className="ph-dash"
          opacity="0.8"
        />

        {/* Sao ngũ giác – tương khắc */}
        <path
          d={path(keOrder)}
          fill="none"
          stroke="color-mix(in oklab,#38BDF8 75%,transparent)"
          strokeWidth="1.2"
          strokeDasharray="3 6"
          strokeLinejoin="round"
          filter="url(#phSoftGlow)"
          opacity="0.7"
        />

        {/* Mũi tên hướng tương sinh trên các cạnh pentagon */}
        {shengOrder.slice(0, 5).map((from, i) => {
          const to = shengOrder[i + 1];
          const a = byKey[from], b = byKey[to];
          const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
          const dx = b.x - a.x, dy = b.y - a.y;
          const len = Math.hypot(dx, dy);
          const ux = dx / len, uy = dy / len;
          const px = -uy, py = ux;
          const tip = 14;
          return (
            <polygon
              key={i}
              points={`${mx + ux * tip},${my + uy * tip} ${mx - ux * 4 + px * 7},${my - uy * 4 + py * 7} ${mx - ux * 4 - px * 7},${my - uy * 4 - py * 7}`}
              fill={byKey[to].tint}
              opacity="0.85"
              filter="url(#phSoftGlow)"
            />
          );
        })}

        {/* Yin-yang trung tâm */}
        <g transform="translate(400 400)" className="ph-pulse">
          <circle r="56" fill="color-mix(in oklab,var(--background) 80%,black)" stroke="color-mix(in oklab,#38BDF8 80%,transparent)" strokeWidth="1.2" />
          <circle r="56" fill="none" stroke="#38BDF8" strokeWidth="0.6" filter="url(#phStrongGlow)" opacity="0.6" />
          <path
            d="M0 -50 A 50 50 0 0 1 0 50 A 25 25 0 0 1 0 0 A 25 25 0 0 0 0 -50 Z"
            fill="color-mix(in oklab,#38BDF8 78%,white)"
          />
          <circle cx="0" cy="-25" r="5" fill="#0a1424" />
          <circle cx="0" cy="25" r="5" fill="color-mix(in oklab,#38BDF8 90%,white)" />
        </g>

        {/* 5 nodes */}
        {nodes.map((n) => (
          <g key={n.key}>
            <circle cx={n.x} cy={n.y} r="70" fill={n.tint} opacity="0.10" filter="url(#phStrongGlow)" />
            <circle cx={n.x} cy={n.y} r="52" fill={n.tint} opacity="0.06" />
            <circle cx={n.x} cy={n.y} r="44" fill="color-mix(in oklab,var(--background) 88%,black)" stroke={n.tint} strokeWidth="1.8" />
            <circle cx={n.x} cy={n.y} r="50" fill="none" stroke={n.tint} strokeWidth="0.7" strokeDasharray="2 4" opacity="0.6" />
            <text
              x={n.x}
              y={n.y + 14}
              textAnchor="middle"
              fontSize="42"
              fontFamily="ui-sans-serif, 'Noto Sans SC', system-ui, sans-serif"
              fontWeight="600"
              fill={n.soft}
              filter="url(#phSoftGlow)"
            >
              {n.han}
            </text>
            <text
              x={n.x}
              y={n.y + 74}
              textAnchor="middle"
              fontSize="10"
              fontFamily="ui-monospace, monospace"
              letterSpacing="2.5"
              fill={`color-mix(in oklab, ${n.tint} 85%, white)`}
              opacity="0.95"
            >
              {n.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function ProjectCard() {
  return (
    <div
      className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50 md:p-10"
    >
      {/* Ambient orbs – sky tint on white */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-sky-200/40 blur-3xl transition duration-700 group-hover:bg-sky-300/50" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-sky-100/40 blur-3xl transition duration-700 group-hover:bg-sky-200/50" />

      {/* Corner brackets */}
      <span className="pointer-events-none absolute left-4 top-4 h-5 w-5 border-l-2 border-t-2 border-sky-300/70" />
      <span className="pointer-events-none absolute right-4 top-4 h-5 w-5 border-r-2 border-t-2 border-sky-300/70" />
      <span className="pointer-events-none absolute bottom-4 left-4 h-5 w-5 border-b-2 border-l-2 border-sky-300/70" />
      <span className="pointer-events-none absolute bottom-4 right-4 h-5 w-5 border-b-2 border-r-2 border-sky-300/70" />

      <div className="relative">
        {/* Header – editorial, no icons */}
        <div className="flex flex-col items-start gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-sky-600">Giới thiệu dự án</span>
            <h3 className="mt-3 font-display text-4xl leading-[1.15] tracking-tight text-slate-900 md:text-5xl">
              <span className="font-light text-slate-700">TRAMED</span>{" "}
              <span className="font-black" style={{ color: "#38BDF8" }}>Y học cổ truyền thông minh</span>
            </h3>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 font-mono text-[10px] uppercase leading-[1.5] tracking-widest text-sky-700 whitespace-nowrap">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-500" />
            </span>
            Đề tài khởi nghiệp 2026
          </div>
        </div>

        {/* Mission */}
        <p className="mt-6 max-w-3xl text-[16px] font-semibold leading-8 text-slate-700">
          Tramed là dự án tiên phong trong việc chuyển đổi số nền Y học cổ truyền (YHCT). Chúng tôi kiến tạo một hệ sinh thái thông minh, nơi công nghệ trở thành công cụ hỗ trợ đắc lực, giúp chuẩn hóa, lưu trữ và tư vấn các giải pháp YHCT một cách khoa học, hiện đại và dễ tiếp cận hơn đối với mọi người.
        </p>

        {/* Core values – big numerals, no icons */}
        <div className="mt-10 grid gap-0 border-t border-slate-200 md:grid-cols-3">
          {[
            { n: "01", title: "Thông minh hóa", desc: "Tra cứu & đề xuất lộ trình chăm sóc sức khỏe cá nhân hóa dựa trên YHCT." },
            { n: "02", title: "Chuẩn hóa", desc: "Hệ thống hóa kiến thức y dược cổ truyền thành kho dữ liệu số đáng tin cậy." },
            { n: "03", title: "Tiên phong", desc: "Kết nối giá trị truyền thống với công nghệ hiện đại, hiện đại hóa y học dân tộc." },
          ].map((v) => (
            <div
              key={v.title}
              className="group/val relative border-b border-slate-100 py-6 md:border-b-0 md:border-r md:px-6 md:py-4 md:last:border-r-0 md:first:pl-0 md:last:pr-0"
            >
              <span className="pointer-events-none absolute left-0 top-0 h-px w-10 bg-sky-400 transition-all duration-500 group-hover/val:w-24" />
              <div className="font-display text-5xl font-light text-sky-500 md:text-6xl">{v.n}</div>
              <h4 className="mt-3 font-display text-2xl font-black tracking-tight text-slate-900">{v.title}</h4>
              <p className="mt-2 max-w-xs text-[14px] font-semibold leading-6 text-slate-600">{v.desc}</p>
            </div>
          ))}
        </div>

        {/* Vision & Mission – editorial split */}
        <div className="mt-10 grid gap-8 border-t border-slate-200 pt-8 md:grid-cols-2">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-sky-600">Tầm nhìn</span>
            <h4 className="mt-3 font-display text-2xl font-black tracking-tight text-slate-900 md:text-3xl">
              Số hóa <span className="font-light text-slate-700">tri thức nghìn năm</span>
            </h4>
            <p className="mt-3 text-[15px] font-semibold leading-7 text-slate-700">
              Trở thành nền tảng thông minh hàng đầu Việt Nam về Y học cổ truyền – nơi mọi bài thuốc, vị thuốc, kinh nghiệm cổ phương được chuẩn hóa, kiểm chứng và truyền lại cho thế hệ mai sau bằng ngôn ngữ của công nghệ.
            </p>
          </div>
          <div className="md:border-l md:border-slate-200 md:pl-8">
            <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-sky-600">Sứ mệnh</span>
            <h4 className="mt-3 font-display text-2xl font-black tracking-tight text-slate-900 md:text-3xl">
              Đưa YHCT <span className="font-light text-slate-700">đến gần mọi người</span>
            </h4>
            <p className="mt-3 text-[15px] font-semibold leading-7 text-slate-700">
              Giúp người dân tự tra cứu, hiểu đúng và sử dụng an toàn các phương thuốc YHCT; đồng hành cùng bác sĩ – dược sĩ trong việc ra quyết định lâm sàng dựa trên dữ liệu khoa học và kinh nghiệm cổ truyền.
            </p>
          </div>
        </div>

        {/* Highlights stats – bold editorial row */}
        <div className="mt-10 grid grid-cols-2 gap-6 border-t border-slate-200 pt-8 md:grid-cols-4">
          {[
            { v: "1000+", l: "Vị thuốc & bài thuốc" },
            { v: "02", l: "VNPT SmartVision & Agent" },
            { v: "24/7", l: "Tư vấn không gián đoạn" },
            { v: "MVP", l: "Miễn phí giai đoạn thử nghiệm" },
          ].map((s) => (
            <div key={s.l}>
              <div className="font-display text-4xl font-black tracking-tight md:text-5xl" style={{ color: "#38BDF8" }}>{s.v}</div>
              <div className="mt-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// Editorial primitives – shared rhythm across the landing page
// ────────────────────────────────────────────────────────────────

function SectionHead({
  eyebrow,
  title,
  lead,
  align = "left",
  tone = "dark",
}: {
  eyebrow: string;
  title: React.ReactNode;
  lead?: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
}) {
  const wrap = align === "center" ? "mx-auto text-center items-center" : "items-start text-left";
  const pillClass =
    tone === "light"
      ? "border-sky-300/70 bg-white/80 text-sky-700"
      : "border-accent/40 bg-card/70 text-accent";
  const titleClass = tone === "light" ? "text-slate-900" : "text-foreground";
  const leadClass = tone === "light" ? "text-slate-700" : "text-foreground/90";
  const rule = tone === "light" ? "bg-sky-500/70" : "bg-accent/70";
  return (
    <div className={`flex max-w-2xl flex-col ${wrap}`}>
      <span
        className={`inline-flex items-center gap-2 self-start rounded-full border px-3 py-1.5 font-mono text-[10px] font-semibold uppercase leading-[1.5] tracking-[0.28em] backdrop-blur-sm ${pillClass} ${
          align === "center" ? "self-center" : ""
        }`}
      >
        {eyebrow}
      </span>
      <h2
        className={`mt-4 font-display text-[2.25rem] font-extrabold leading-[1.1] tracking-tight md:text-5xl ${titleClass}`}
      >
        {title}
      </h2>
      <div aria-hidden className={`mt-4 h-px w-16 ${rule}`} />
      {lead && (
        <p className={`mt-4 text-[15px] font-semibold leading-7 md:text-base ${leadClass}`}>
          {lead}
        </p>
      )}
    </div>
  );
}

function PillarCard({
  index,
  eyebrow,
  title,
  desc,
  children,
}: {
  index: string;
  eyebrow: string;
  title: string;
  desc: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="card-emerald group relative flex flex-col overflow-hidden rounded-2xl p-7 md:col-span-2 md:p-8">
      {/* Hairline top w/ expanding indicator */}
      <div className="absolute inset-x-0 top-0 h-px bg-accent/25">
        <div className="h-full w-10 bg-accent transition-all duration-700 group-hover:w-full" />
      </div>

      <div className="flex items-baseline gap-4">
        <span className="font-display text-[2.75rem] font-light leading-none tracking-tight text-accent/85">
          {index}
        </span>
        <span className="font-mono text-[10px] font-semibold uppercase leading-[1.5] tracking-[0.32em] text-accent">
          {eyebrow}
        </span>
      </div>

      <h3 className="mt-5 font-display text-[1.6rem] font-bold leading-[1.2] tracking-tight text-foreground md:text-[1.75rem]">
        {title}
      </h3>

      <p className="mt-3 max-w-[36ch] text-[14.5px] font-semibold leading-7 text-foreground/90">
        {desc}
      </p>

      {children}
    </div>
  );
}



