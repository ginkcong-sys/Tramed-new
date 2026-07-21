import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type TemplateDef = {
  slug: string;
  title: string;
  subtitle: string;
  tag: string;
  criteria: string[];
  phases: { name: string; kcal: string; protein: string; notes: string }[];
  diet: { code: string; name: string }[];
  herbs: { name: string; dose: string; indication: string }[];
  monitoring: string[];
  discharge: string[];
};

const TEMPLATES: Record<string, TemplateDef> = {
  "suy-kiet": {
    slug: "suy-kiet",
    title: "Phác đồ BN suy kiệt / ung thư giai đoạn nặng",
    subtitle: "High-cal · High-protein · YHCT đại bổ khí huyết",
    tag: "DD11 · DD05",
    criteria: [
      "BMI < 18.5 hoặc sụt cân > 10%/6 tháng",
      "Ung thư đang điều trị / hậu hoá-xạ trị, suy kiệt mạn",
      "Albumin < 30 g/L, prealbumin < 150 mg/L",
      "Phù hợp thể YHCT: Khí huyết lưỡng hư, Tỳ Thận dương hư",
    ],
    phases: [
      { name: "Giai đoạn cấp (1-3 ngày, có nguy cơ refeeding)", kcal: "15-20 kcal/kg → tăng dần", protein: "1.0-1.2 g/kg", notes: "Bù thiamine 200-300 mg, P, K, Mg trước & trong nuôi." },
      { name: "Giai đoạn xây dựng (4-14 ngày)", kcal: "25-30 kcal/kg", protein: "1.5-2.0 g/kg", notes: "Bổ sung ω-3 EPA 2 g/ngày, vi chất Zn, Se, vitamin D." },
      { name: "Giai đoạn duy trì", kcal: "30-35 kcal/kg", protein: "1.5 g/kg", notes: "Khẩu phần ngon miệng, chia nhỏ 5-6 bữa, ONS xen kẽ." },
    ],
    diet: [
      { code: "DD11", name: "High-protein (suy kiệt)" },
      { code: "DD05", name: "Sữa cao năng 1.5-2.0" },
    ],
    herbs: [
      { name: "Bát trân thang", dose: "1 thang/ngày, sắc 200 ml chia 2", indication: "Khí huyết lưỡng hư – sau hoá trị, sụt cân, mệt mỏi" },
      { name: "Thập toàn đại bổ", dose: "1 thang/ngày", indication: "Khí huyết âm dương đều hư – BN ung thư giai đoạn cuối" },
      { name: "Quy tỳ thang", dose: "1 thang/ngày", indication: "Tâm Tỳ lưỡng hư – mất ngủ, hồi hộp, ăn kém" },
    ],
    monitoring: [
      "Cân nặng 2 lần/tuần, vòng cánh tay (MUAC) 1 lần/tuần.",
      "Albumin/prealbumin mỗi 2 tuần, lympho, hemoglobin.",
      "Điện giải đồ + P, Mg mỗi ngày trong tuần đầu nuôi.",
      "Đánh giá lại NRS-2002 mỗi tuần.",
    ],
    discharge: [
      "Tăng ≥ 1 kg sau 2 tuần hoặc ổn định cân nặng + tăng prealbumin.",
      "Dung nạp ≥ 75% nhu cầu năng lượng đường miệng.",
      "Không còn dấu hiệu refeeding, điện giải ổn định.",
    ],
  },
  "tieu-duong": {
    slug: "tieu-duong",
    title: "Phác đồ BN đái tháo đường (thể Tiêu khát)",
    subtitle: "Low-GI · Carb counting · YHCT thanh nhiệt – bổ thận âm",
    tag: "DD06",
    criteria: [
      "ĐTĐ type 2 nhập viện vì các bệnh lý khác hoặc kiểm soát kém",
      "HbA1c > 7%, có biến chứng vi mạch hoặc thần kinh",
      "Thể YHCT: Thượng tiêu (Phế nhiệt) / Trung tiêu (Vị nhiệt) / Hạ tiêu (Thận âm hư)",
    ],
    phases: [
      { name: "Khởi đầu", kcal: "25 kcal/kg cân lý tưởng", protein: "1.0 g/kg", notes: "Carb 45-50% – low GI, chất xơ ≥ 25 g/ngày, chia 5 bữa." },
      { name: "Ổn định", kcal: "25-30 kcal/kg", protein: "1.0-1.2 g/kg", notes: "Carb counting nếu dùng insulin nhanh, hạn chế đường tinh." },
      { name: "Duy trì sau viện", kcal: "Theo BMI mục tiêu", protein: "1.0 g/kg", notes: "Giáo dục dinh dưỡng, hoạt động thể lực 150 phút/tuần." },
    ],
    diet: [{ code: "DD06", name: "Đái tháo đường" }],
    herbs: [
      { name: "Lục vị địa hoàng", dose: "1 thang/ngày", indication: "Thận âm hư – Hạ tiêu, khô khát đêm, lưng gối mỏi" },
      { name: "Bạch hổ gia nhân sâm", dose: "1 thang/ngày", indication: "Vị nhiệt khát thuỷ – Trung tiêu, khát nhiều, đói nhiều" },
      { name: "Sa sâm mạch môn thang", dose: "1 thang/ngày", indication: "Phế Vị âm hư – Thượng tiêu, ho khan, miệng khô" },
    ],
    monitoring: [
      "Đường mao mạch 4 lần/ngày (trước ăn + 22h) trong 3 ngày đầu.",
      "HbA1c mỗi 3 tháng, lipid máu, vi đạm niệu mỗi 6 tháng.",
      "Soi đáy mắt, monofilament bàn chân định kỳ.",
    ],
    discharge: [
      "Đường máu trước ăn 80-130 mg/dL, sau ăn 2h < 180 mg/dL.",
      "Không hạ đường huyết trong 48h gần xuất viện.",
      "BN/gia đình hiểu carb counting, biết xử trí hạ đường.",
    ],
  },
  "sau-phau": {
    slug: "sau-phau",
    title: "Phác đồ BN sau phẫu thuật tiêu hoá (ERAS)",
    subtitle: "Early feeding · Liquid → Soft → Regular · YHCT kiện tỳ hành khí",
    tag: "DD02 · DD10 · DD11",
    criteria: [
      "Phẫu thuật ổ bụng có lập kế hoạch (đại tràng, dạ dày, gan-mật)",
      "Không có chống chỉ định ERAS (rò, tắc ruột, sốc nhiễm khuẩn nặng)",
      "Thể YHCT: Tỳ vị khí hư · Khí trệ huyết ứ",
    ],
    phases: [
      { name: "Trước mổ (carb-loading)", kcal: "Maltodextrin 50 g uống 2h trước mổ", protein: "–", notes: "Giảm đề kháng insulin, giảm dị hoá sau mổ." },
      { name: "Sau mổ ngày 0-1 (clear liquid)", kcal: "500-800 kcal", protein: "0.5 g/kg", notes: "Nước cháo, nước hoa quả pha loãng, ONS clear. Nhai kẹo cao su kích thích nhu động." },
      { name: "Ngày 2-3 (soft)", kcal: "1200-1600 kcal", protein: "1.0 g/kg", notes: "Cháo thịt nạc, súp xay, ONS high-protein 2 chai/ngày." },
      { name: "Ngày 4+ (regular)", kcal: "25-30 kcal/kg", protein: "1.5 g/kg", notes: "Khẩu phần bình thường, ưu tiên đạm động vật, ω-3." },
    ],
    diet: [
      { code: "DD02", name: "Cháo / mềm" },
      { code: "DD10", name: "Low-residue" },
      { code: "DD11", name: "High-protein" },
    ],
    herbs: [
      { name: "Tứ quân tử thang", dose: "1 thang/ngày từ ngày 2", indication: "Tỳ vị khí hư – bổ khí, kiện tỳ phục hồi tiêu hoá" },
      { name: "Hương sa lục quân tử", dose: "1 thang/ngày", indication: "Tỳ hư khí trệ – đầy bụng, ăn không tiêu, buồn nôn" },
      { name: "Đại kiến trung thang", dose: "Theo chỉ định BS YHCT", indication: "Hàn trệ trung tiêu – chướng bụng sau mổ, liệt ruột nhẹ" },
    ],
    monitoring: [
      "Bilan dịch ra/vào mỗi ngày trong 3 ngày đầu.",
      "Dấu hiệu liệt ruột, vết mổ, sốt, đau bụng.",
      "Albumin, prealbumin, CRP cuối tuần 1.",
      "Cân nặng khi xuất viện và tái khám sau 2 tuần.",
    ],
    discharge: [
      "Dung nạp ≥ 60% nhu cầu năng lượng đường miệng.",
      "Trung tiện, đại tiện được, không sốt, vết mổ khô.",
      "Không sụt cân > 5% so với trước mổ.",
    ],
  },
};

export const Route = createFileRoute("/dinh-duong/template/$slug")({
  loader: ({ params }) => {
    const t = TEMPLATES[params.slug];
    if (!t) throw notFound();
    return { template: t };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.template.title ?? "Template"} | TRAMED` },
      { name: "description", content: loaderData?.template.subtitle ?? "" },
    ],
  }),
  notFoundComponent: () => (
    <div className="container mx-auto max-w-2xl p-10 text-center">
      <h1 className="font-display text-2xl">Không tìm thấy template</h1>
      <p className="mt-2 text-muted-foreground">Có 3 template hợp lệ: suy-kiet, tieu-duong, sau-phau.</p>
      <Link to="/dinh-duong" className="mt-4 inline-block text-accent">← Về dashboard</Link>
    </div>
  ),
  errorComponent: () => <div className="container mx-auto p-10 text-center text-destructive">Lỗi tải template.</div>,
  component: TemplatePage,
});

function TemplatePage() {
  const { template: t } = Route.useLoaderData() as { template: TemplateDef };
  return (
    <div className="min-h-screen">
      <header className="z-30 border-b border-accent/30 bg-background/85 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between px-6 py-3">
          <Link to="/" className="font-display text-lg">TRAMED</Link>
          <nav className="flex gap-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            <Link to="/dinh-duong" className="rounded-full px-3 py-1.5 hover:bg-accent/10 hover:text-accent">/ dashboard</Link>
            <Link to="/dinh-duong/benh-an" search={{}} className="rounded-full px-3 py-1.5 hover:bg-accent/10 hover:text-accent">/ bệnh án</Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto max-w-5xl px-4 py-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-widest text-accent">/ template · {t.slug}</div>
            <h1 className="font-display text-3xl">{t.title}</h1>
            <p className="text-sm text-muted-foreground">{t.subtitle}</p>
            <div className="mt-2"><Badge variant="outline" className="border-accent/40 bg-accent/10 font-mono text-accent">{t.tag}</Badge></div>
          </div>
          <Link to="/dinh-duong/benh-an" search={{ template: t.slug }}>
            <Button className="glow-cyan">Áp dụng → tạo bệnh án</Button>
          </Link>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="border-accent/20 bg-card/50">
            <CardHeader><CardTitle className="font-mono text-xs uppercase tracking-widest text-accent">① Tiêu chuẩn chọn BN</CardTitle></CardHeader>
            <CardContent>
              <ul className="space-y-1.5 text-sm">
                {t.criteria.map((c, i) => <li key={i} className="flex gap-2"><span className="text-accent">▸</span>{c}</li>)}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-accent/20 bg-card/50">
            <CardHeader><CardTitle className="font-mono text-xs uppercase tracking-widest text-accent">④ Diet code áp dụng</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {t.diet.map((d) => (
                  <span key={d.code} className="rounded-md border border-accent/40 bg-accent/10 px-3 py-1.5 text-sm">
                    <span className="font-mono text-accent">{d.code}</span> · {d.name}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-4 border-accent/20 bg-card/50">
          <CardHeader><CardTitle className="font-mono text-xs uppercase tracking-widest text-accent">② Nhu cầu theo giai đoạn</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                  <tr><th className="py-2 pr-3">Giai đoạn</th><th className="pr-3">Năng lượng</th><th className="pr-3">Đạm</th><th>Ghi chú</th></tr>
                </thead>
                <tbody>
                  {t.phases.map((p, i) => (
                    <tr key={i} className="border-b border-border/40">
                      <td className="py-2 pr-3 font-medium">{p.name}</td>
                      <td className="pr-3 font-mono text-accent">{p.kcal}</td>
                      <td className="pr-3 font-mono text-accent">{p.protein}</td>
                      <td className="text-muted-foreground">{p.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-4 border-accent/20 bg-card/50">
          <CardHeader><CardTitle className="font-mono text-xs uppercase tracking-widest text-accent">③ Bài thuốc YHCT bổ trợ</CardTitle></CardHeader>
          <CardContent>
            <div className="grid gap-2 md:grid-cols-2">
              {t.herbs.map((h) => (
                <div key={h.name} className="rounded-md border border-border/60 bg-background/40 px-3 py-2">
                  <div className="flex justify-between"><span className="font-medium">{h.name}</span><span className="font-mono text-xs text-accent">{h.dose}</span></div>
                  <div className="text-xs text-muted-foreground">{h.indication}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <Card className="border-accent/20 bg-card/50">
            <CardHeader><CardTitle className="font-mono text-xs uppercase tracking-widest text-accent">⑤ Theo dõi</CardTitle></CardHeader>
            <CardContent><ul className="space-y-1.5 text-sm">{t.monitoring.map((m, i) => <li key={i} className="flex gap-2"><span className="text-accent">◇</span>{m}</li>)}</ul></CardContent>
          </Card>
          <Card className="border-emerald-500/30 bg-card/50">
            <CardHeader><CardTitle className="font-mono text-xs uppercase tracking-widest text-emerald-300">⑥ Tiêu chí xuất viện</CardTitle></CardHeader>
            <CardContent><ul className="space-y-1.5 text-sm">{t.discharge.map((d, i) => <li key={i} className="flex gap-2"><span className="text-emerald-300">✓</span>{d}</li>)}</ul></CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
