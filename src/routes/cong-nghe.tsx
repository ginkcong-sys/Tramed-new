import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SatinButton } from "@/components/ui/satin-button";

export const Route = createFileRoute("/cong-nghe")({
  head: () => ({
    meta: [
      { title: "Công nghệ · TRAMED" },
      { name: "description", content: "Kiến trúc công nghệ lõi của TRAMED: dual-model chẩn trị, RAG dược điển, cảnh báo real-time và nguồn dữ liệu đáng tin cậy." },
      { property: "og:title", content: "Công nghệ · TRAMED" },
      { property: "og:description", content: "Kiến trúc công nghệ lõi của TRAMED: dual-model chẩn trị, RAG dược điển, cảnh báo real-time." },
    ],
  }),
  component: CongNghePage,
});

function CongNghePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="grid-bg absolute inset-0 opacity-15" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,color-mix(in_oklab,var(--cyan)_12%,transparent),transparent_70%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_35%_28%_at_50%_100%,color-mix(in_oklab,var(--indigo)_18%,transparent),transparent_70%)]" />

        <div className="container relative mx-auto px-6 py-10 md:py-16 lg:py-20">
          <div className="mx-auto max-w-3xl text-center">
            {/* Tech pill badge – inspired by clean international web style */}
            <div className="mx-auto inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1 rounded-full border border-[rgba(56,189,248,0.22)] bg-card/80 px-4 py-1.5 shadow-[0_2px_12px_-4px_rgba(56,189,248,0.15)] backdrop-blur-sm">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#38BDF8]">Dual-model</span>
              <span className="h-1 w-1 rounded-full bg-[#38BDF8]" />
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#38BDF8]">RAG dược điển</span>
              <span className="h-1 w-1 rounded-full bg-[#38BDF8]" />
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#38BDF8]">Cảnh báo real-time</span>
            </div>

            <div className="relative mt-5 md:mt-6">
              <h1 className="font-display text-[2.5rem] leading-[1.12] tracking-tight text-foreground md:text-[3.5rem] lg:text-[4.2rem]">
                <span className="block font-normal">Kiến trúc</span>
                <span className="block font-bold">công nghệ lõi.</span>
              </h1>

              <div
                aria-hidden
                className="mx-auto my-5 h-px w-16 md:w-20"
                style={{ background: "linear-gradient(to right, transparent, rgba(125,211,252,0.85), transparent)" }}
              />

              <p className="mx-auto max-w-2xl text-balance font-sans text-base font-semibold leading-relaxed text-[#7DD3FC] md:text-lg">
                Mỗi quyết định lâm sàng đều có căn cứ: từ nguồn tri thức chuẩn, qua kiểm soát song song, đến giám sát an toàn tức thì.
              </p>
            </div>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3 md:mt-9">
              <SatinButton to="/ke-don" size="sm">
                Trải nghiệm chẩn trị
              </SatinButton>
              <a
                href="#dual-model"
                className="btn-glass-outline rounded-full px-6 py-2.5 text-xs font-semibold uppercase tracking-wider"
              >
                Khám phá chi tiết
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Three pillars – open editorial columns */}
      <section className="container mx-auto px-6 pb-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-5 flex items-baseline justify-between gap-4 border-b border-accent/25 pb-2.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-foreground/75">
              Ba trụ cột vận hành
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-foreground/65">
              I · II · III
            </span>
          </div>

          <div className="grid grid-cols-1 gap-y-8 md:grid-cols-3 md:gap-y-0">
            <TechPillar
              index="I"
              eyebrow="Nhận diện"
              title={<>VNPT SmartVision × <span className="font-sans" style={{ color: "#38BDF8" }}>Agent nội bộ</span></>}
              desc="Dual-model kết hợp thị giác máy tính cho lưỡi sắc, mặt sắc với mô hình ngôn ngữ nội bộ để luận giải Tứ chẩn theo chuẩn YHCT."
              bordered
            />
            <TechPillar
              index="II"
              eyebrow="Tri thức"
              title={<>RAG trên <span className="font-sans" style={{ color: "#38BDF8" }}>dược điển chuẩn</span></>}
              desc="Mọi gợi ý phương thuốc đều được truy xuất từ kho tài liệu đã xác thực, kèm trích dẫn nguồn để bác sĩ đối chiếu."
              bordered
            />
            <TechPillar
              index="III"
              eyebrow="An toàn"
              title={<>Giám sát <span className="font-sans" style={{ color: "#38BDF8" }}>real-time</span></>}
              desc="Hệ thống quét tương tác thuốc – Thập bát phản, Thập cửu úy, tương tác Đông–Tây y – ngay khi bác sĩ thêm vị vào toa."
            />
          </div>
        </div>
      </section>

      {/* Detail sections */}
      <section id="dual-model" className="container mx-auto px-6 py-14 md:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-16">
            <div className="md:col-span-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-foreground/70">01 / Dual-model</span>
              <h2 className="mt-3 font-display text-[1.7rem] font-semibold leading-snug tracking-tight pb-1 md:text-[2rem]">
                Hai tầng kiểm soát chéo.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-foreground/90">
                Không đặt cược vào một đầu ra duy nhất. Mô hình thị giác xử lý dữ liệu hình ảnh lâm sàng, mô hình ngôn ngữ nội bộ luận giải theo ngữ cảnh YHCT, hai bên ràng buộc lẫn nhau để giảm sai lệch.
              </p>
            </div>
            <div className="md:col-span-8">
              <div className="space-y-0 border-l border-accent/25">
                <DetailRow
                  k="Tầng nhận diện"
                  v="VNPT SmartVision phân tích đặc điểm lưỡi, sắc mặt, đưa ra vector đặc trưng thô."
                />
                <DetailRow
                  k="Tầng luận giải"
                  v="Agent nội bộ kết hợp vector đó với Tứ chẩn văn bản, sinh chẩn đoán biện chứng và pháp trị."
                />
                <DetailRow
                  k="Cơ chế ràng buộc"
                  v="Nếu hai tầng không đồng thuận về nhóm bệnh lý, hệ thống đưa ra mức độ tin cậy và đề xuất thầy thuốc xem xét."
                />
                <DetailRow
                  k="Hiệu quả"
                  v="Thử nghiệm nội bộ trên 278 ca lâm sàng cho độ chính xác biện chứng đạt 88,2%."
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-14 md:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-16">
            <div className="md:col-span-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-foreground/70">02 / RAG dược điển</span>
              <h2 className="mt-3 font-display text-[1.7rem] font-semibold leading-snug tracking-tight pb-1 md:text-[2rem]">
                Nguồn dữ liệu đáng tin cậy.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-foreground/90">
                Hệ thống không tự phát minh vị thuốc. Mọi phương thuốc đều được tìm kiếm ngữ nghĩa trong kho tài liệu đã chuẩn hóa, sau đó ghép nối với triệu chứng bệnh nhân.
              </p>
            </div>
            <div className="md:col-span-8">
              <div className="space-y-0 border-l border-accent/25">
                <DetailRow
                  k="pgvector"
                  v="Các đoạn văn bản y khoa được embedding vào PostgreSQL với pgvector, hỗ trợ tìm kiếm cosine similarity."
                />
                <DetailRow
                  k="Kho tài liệu"
                  v="Dược điển Việt Nam V, bài giảng YHCT từ ĐH Y Hà Nội & ĐH Y Dược TP.HCM, Phương tễ học, Trung dược học."
                />
                <DetailRow
                  k="Trích dẫn"
                  v="Mỗi gợi ý đều hiển thị nguồn đoạn văn, giúp bác sĩ kiểm chứng và giải thích cho bệnh nhân."
                />
                <DetailRow
                  k="Kiểm soát chất lượng"
                  v="Nội dung được chia chunk, gán metadata nguồn và lọc trùng lặp trước khi đưa vào kho tra cứu."
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-14 md:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-16">
            <div className="md:col-span-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-foreground/70">03 / Cảnh báo</span>
              <h2 className="mt-3 font-display text-[1.7rem] font-semibold leading-snug tracking-tight pb-1 md:text-[2rem]">
                An toàn theo thời gian thực.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-foreground/90">
                Toa thuốc không chỉ được kiểm tra một lần. Mỗi khi bác sĩ thay đổi liều lượng, thêm vị mới hoặc ghi nhận tân dược đồng dùng, hệ thống quét lại toàn bộ tương tác.
              </p>
            </div>
            <div className="md:col-span-8">
              <div className="space-y-0 border-l border-accent/25">
                <DetailRow
                  k="Thập bát phản"
                  v="18 cặp vị thuốc tương khắc trong y học cổ truyền được kiểm tra tự động."
                />
                <DetailRow
                  k="Thập cửu úy"
                  v="19 cặp vị thuốc gây độc hại khi phối hợp được cảnh báo ngay trên giao diện kê đơn."
                />
                <DetailRow
                  k="Tương tác Đông–Tây y"
                  v="Đối chiếu với dược lý tân dược để phát hiện nguy cơ xuất huyết, hạ đường huyết, tăng/giảm hấp thu."
                />
                <DetailRow
                  k="Mức độ cảnh báo"
                  v="Phân loại theo mức độ nghiêm trọng, kèm gợi ý thay thế hoặc điều chỉnh liều."
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & audit section */}
      <section className="container mx-auto px-6 py-14 md:py-20">
        <div className="mx-auto max-w-5xl border-t border-accent/25 pt-12 md:pt-16">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-16">
            <div className="md:col-span-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-foreground/70">04 / Tin cậy</span>
              <h2 className="mt-3 font-display text-[1.7rem] font-semibold leading-snug tracking-tight pb-1 md:text-[2rem]">
                Kiểm soát & truy xuất.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-foreground/90">
                Mỗi phiên chẩn trị đều được ghi nhận, ký số và khóa hồ sơ. Bác sĩ giữ quyền quyết định cuối cùng, còn hệ thống đảm bảo dấu vết đầy đủ.
              </p>
            </div>
            <div className="md:col-span-8">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <TrustCard
                  title="Ký số SHA-256"
                  desc="Hồ sơ được băm và khóa sau khi bác sĩ chốt quyết định, ngăn sửa đổi ngoài ý muốn."
                />
                <TrustCard
                  title="Audit trail"
                  desc="Ghi lại ai đã thao tác, thao tác gì và thời điểm nào trên từng bước chẩn trị."
                />
                <TrustCard
                  title="Báo cáo tự động"
                  desc="Sinh báo cáo lâm sàng và đơn thuốc chuẩn hóa, hỗ trợ in và lưu trữ điện tử."
                />
                <TrustCard
                  title="Quyền quyết định bác sĩ"
                  desc="Hệ thống chỉ đề xuất, không thay thế phán đoán lâm sàng của thầy thuốc."
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data sources strip */}
      <section className="container mx-auto px-6 pb-20 pt-6">
        <div className="mx-auto max-w-5xl">
          <div className="mb-5 flex items-baseline justify-between gap-4 border-b border-accent/25 pb-2.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-foreground/75">
              Nguồn dữ liệu chính thống
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-foreground/65">
              11 tài liệu · 2.778 chunks
            </span>
          </div>
          <div className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2 md:grid-cols-3">
            {[
              "Dược điển Việt Nam V",
              "Bài giảng YHCT – ĐH Y Hà Nội",
              "Bài giảng YHCT – ĐH Y Dược TP.HCM",
              "Phương tễ học – NXB Y học",
              "Trung dược học – NXB Y học",
              "Châm cứu học – Viện Châm cứu TW",
              "Bệnh học Nội khoa YHHĐ – ĐH Y Hà Nội",
              "Hướng dẫn chẩn đoán & điều trị – Bộ Y tế",
              "Y học cổ truyền cơ bản",
              "Dinh dưỡng YHCT & thực dưỡng",
              "Cẩm nang xử trí cấp cứu YHCT",
            ].map((src) => (
              <div key={src} className="flex items-start gap-3 py-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#38BDF8]" />
                <span className="text-sm font-medium leading-snug text-foreground/95">{src}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 pb-24">
        <div className="mx-auto max-w-3xl text-center">
          <div
            aria-hidden
            className="mx-auto mb-6 h-px w-24"
            style={{ background: "linear-gradient(to right, transparent, rgba(253,224,71,0.6), transparent)" }}
          />
          <h2 className="font-display text-[1.6rem] font-semibold tracking-tight md:text-[2rem]">
            Sẵn sàng kiểm chứng.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-foreground/90">
            TRAMED được xây dựng để hỗ trợ thầy thuốc, không thay thế. Hãy thử nghiệm quy trình chẩn trị và xem cách hệ thống kiểm soát thông tin.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <SatinButton to="/kham-benh" size="md">
              Bắt đầu khám bệnh
            </SatinButton>
            <Link
              to="/"
              className="btn-glass-outline rounded-full px-7 py-3 text-sm font-semibold uppercase tracking-wider"
            >
              Quay lại trang chủ
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function TechPillar({
  index,
  eyebrow,
  title,
  desc,
  bordered,
}: {
  index: string;
  eyebrow: string;
  title: React.ReactNode;
  desc: string;
  bordered?: boolean;
}) {
  return (
    <div className={`px-2 py-1 md:px-4 ${bordered ? "md:border-r md:border-accent/25" : ""}`}>
      <div className="flex items-baseline gap-3">
        <span className="font-display text-4xl font-black leading-none text-foreground/40 md:text-5xl">
          {index}
        </span>
        <div>
          <div className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/90">{eyebrow}</div>
          <h3 className="mt-1 font-display text-lg font-bold leading-snug tracking-tight pb-0.5 md:text-xl">
            {title}
          </h3>
        </div>
      </div>
      <div
        aria-hidden
        className="my-3 h-px w-12"
        style={{ background: "linear-gradient(to right, rgba(11,79,191,0.45), transparent)" }}
      />
      <p className="text-sm font-medium leading-relaxed text-foreground/95">{desc}</p>
    </div>
  );
}

function DetailRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="group border-b border-foreground/8 py-4 pl-5 transition-colors hover:bg-foreground/[0.015] md:pl-6">
      <div className="flex flex-col gap-1 md:flex-row md:gap-6">
        <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-[#38BDF8] md:w-32">{k}</span>
        <span className="text-sm leading-relaxed text-foreground/95">{v}</span>
      </div>
    </div>
  );
}

function TrustCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="border-l-2 border-[#38BDF8]/30 pl-4 transition-colors hover:border-[#38BDF8]">
      <h4 className="font-display text-base font-semibold tracking-tight">{title}</h4>
      <p className="mt-1 text-sm leading-relaxed text-foreground/90">{desc}</p>
    </div>
  );
}
