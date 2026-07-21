import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  BMIWidget,
  WeightLossWidget,
  RefeedingAlertWidget,
  EnergyWidget,
  MacroWidget,
  DietCodePicker,
} from "@/components/nutrition/widgets";
import {
  bmi, weightLossPct, nrs2002Total, nrs2002Interpret,
  YHCT_FORMULAS, DIET_CODES, type Formula, type Gender,
} from "@/lib/nutrition";

export const Route = createFileRoute("/dinh-duong/benh-an")({
  head: () => ({
    meta: [
      { title: "PK-02 số hoá – Bệnh án dinh dưỡng | TRAMED" },
      { name: "description", content: "Bệnh án dinh dưỡng lâm sàng (PK-02) số hoá: sàng lọc NRS-2002, BMI, refeeding alert, kê khẩu phần, bài thuốc YHCT bổ trợ – xuất PDF khớp mẫu." },
    ],
  }),
  validateSearch: (s: Record<string, unknown>) => ({
    template: typeof s.template === "string" ? s.template : undefined,
  }),
  component: BenhAnPage,
});

type FormState = {
  // hành chính
  hoTen: string; tuoi: number; gioi: Gender; maBn: string; khoa: string; ngayVao: string;
  // chẩn đoán
  dxTay: string; dxYhct: string; theBenh: string;
  // nhân trắc
  weight: number; usualWeight: number; height: number;
  // sụt cân tham chiếu
  wl1: number; wl3: number; wl6: number;
  // NRS-2002
  nrsNutri: 0 | 1 | 2 | 3;
  nrsDisease: 0 | 1 | 2 | 3;
  // refeeding
  fastingDays: number; lowElectrolyte: boolean; alcohol: boolean;
  // can thiệp
  formula: Formula;
  activity: number; stress: number;
  pPerKg: number; lPerKg: number; gPerKg: number;
  route: string; // PO/NG/PEG/TPN
  dietCodes: string[];
  yhctFormulas: string[];
  monitoring: string;
  notes: string;
};

const TEMPLATE_PRESETS: Record<string, Partial<FormState>> = {
  "suy-kiet": {
    theBenh: "Khí huyết lưỡng hư – Tỳ vị hư nhược",
    stress: 1.35, activity: 1.3,
    pPerKg: 1.8, lPerKg: 1.2, gPerKg: 4.5,
    dietCodes: ["DD11", "DD05"],
    yhctFormulas: ["Bát trân thang", "Thập toàn đại bổ"],
    monitoring: "Cân/tuần, albumin & prealbumin mỗi 2 tuần, lympho, BIA nếu có.",
  },
  "tieu-duong": {
    theBenh: "Thận âm hư – Vị nhiệt (Tiêu khát)",
    stress: 1.0, activity: 1.3,
    pPerKg: 1.0, lPerKg: 0.9, gPerKg: 3.0,
    dietCodes: ["DD06"],
    yhctFormulas: ["Lục vị địa hoàng", "Bạch hổ gia nhân sâm"],
    monitoring: "ĐH mao mạch 4 lần/ngày 3 ngày đầu, HbA1c 3 tháng, lipid, vi đạm niệu.",
  },
  "sau-phau": {
    theBenh: "Tỳ vị khí hư – Khí trệ huyết ứ sau phẫu",
    stress: 1.2, activity: 1.2,
    pPerKg: 1.5, lPerKg: 1.0, gPerKg: 4.0,
    dietCodes: ["DD02", "DD10"],
    yhctFormulas: ["Tứ quân tử thang", "Hương sa lục quân tử"],
    monitoring: "Bilan dịch ra/vào mỗi ngày, dấu hiệu liệt ruột, vết mổ, CRP/albumin tuần đầu.",
  },
};

const DEFAULT: FormState = {
  hoTen: "", tuoi: 0, gioi: "nam", maBn: "", khoa: "", ngayVao: new Date().toISOString().slice(0, 10),
  dxTay: "", dxYhct: "", theBenh: "",
  weight: 0, usualWeight: 0, height: 0,
  wl1: 0, wl3: 0, wl6: 0,
  nrsNutri: 0, nrsDisease: 0,
  fastingDays: 0, lowElectrolyte: false, alcohol: false,
  formula: "mifflin", activity: 1.3, stress: 1.0,
  pPerKg: 1.2, lPerKg: 1.0, gPerKg: 4.0,
  route: "PO", dietCodes: [], yhctFormulas: [], monitoring: "", notes: "",
};

function BenhAnPage() {
  const { template } = Route.useSearch();
  const [f, setF] = useState<FormState>(DEFAULT);
  const printRef = useRef<HTMLDivElement>(null);
  const applied = useRef(false);

  useEffect(() => {
    if (template && TEMPLATE_PRESETS[template] && !applied.current) {
      setF((cur) => ({ ...cur, ...TEMPLATE_PRESETS[template] }));
      applied.current = true;
    }
  }, [template]);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setF((p) => ({ ...p, [k]: v }));

  const bmiVal = bmi(f.weight, f.height);
  const wl6Pct = weightLossPct(f.weight, f.wl6);
  const nrsTotal = nrs2002Total(f.nrsNutri, f.nrsDisease, f.tuoi >= 70);
  const nrsResult = nrs2002Interpret(nrsTotal);

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-widest text-accent">/ pk-02 · số hoá</div>
            <h1 className="font-display text-3xl">Bệnh án dinh dưỡng lâm sàng</h1>
            <p className="text-sm text-muted-foreground">Sàng lọc → đánh giá → can thiệp → theo dõi. Tích hợp BMI, %sụt cân, NRS-2002, refeeding alert, diet-code và bài thuốc YHCT.</p>
          </div>
          <div className="flex gap-2 print:hidden">
            <Button variant="outline" onClick={() => setF(DEFAULT)}>Làm mới</Button>
            <Button onClick={() => window.print()} className="glow-cyan">Xuất PDF khớp mẫu →</Button>
          </div>
        </div>

        {template && (
          <div className="mb-4 rounded-md border border-accent/40 bg-accent/10 px-3 py-2 text-sm print:hidden">
            Đã áp dụng template <b className="text-accent">{template}</b>. Bạn có thể điều chỉnh tự do.
          </div>
        )}

        <Tabs defaultValue="tab1" className="print:hidden">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tab1">Tab 1 · Sàng lọc & đánh giá</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2 · Can thiệp dinh dưỡng</TabsTrigger>
          </TabsList>

          <TabsContent value="tab1" className="space-y-6">
            <Card className="border-accent/20 bg-card/50">
              <CardHeader className="pb-3">
                <CardTitle className="font-mono text-xs uppercase tracking-widest text-accent">A · Hành chính & chẩn đoán</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-3">
                  <Field label="Họ và tên"><Input value={f.hoTen} onChange={(e) => set("hoTen", e.target.value)} /></Field>
                  <Field label="Tuổi"><Input type="number" value={f.tuoi || ""} onChange={(e) => set("tuoi", parseInt(e.target.value) || 0)} /></Field>
                  <Field label="Giới">
                    <select className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm" value={f.gioi} onChange={(e) => set("gioi", e.target.value as Gender)}>
                      <option value="nam">Nam</option><option value="nu">Nữ</option>
                    </select>
                  </Field>
                  <Field label="Mã BN"><Input value={f.maBn} onChange={(e) => set("maBn", e.target.value)} /></Field>
                  <Field label="Khoa"><Input value={f.khoa} onChange={(e) => set("khoa", e.target.value)} /></Field>
                  <Field label="Ngày vào viện"><Input type="date" value={f.ngayVao} onChange={(e) => set("ngayVao", e.target.value)} /></Field>
                  <Field label="Chẩn đoán Tây y" className="md:col-span-2"><Input value={f.dxTay} onChange={(e) => set("dxTay", e.target.value)} placeholder="VD: K dạ dày T3N1M0 sau cắt 2/3" /></Field>
                  <Field label="Chẩn đoán YHCT (Bát cương · Tạng phủ)"><Input value={f.dxYhct} onChange={(e) => set("dxYhct", e.target.value)} placeholder="Lý-Hư-Hàn · Tỳ Vị" /></Field>
                  <Field label="Thể bệnh YHCT" className="md:col-span-3"><Input value={f.theBenh} onChange={(e) => set("theBenh", e.target.value)} placeholder="VD: Tỳ vị khí hư – Khí huyết lưỡng hư" /></Field>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 lg:grid-cols-2">
              <BMIWidget weight={f.weight} height={f.height} onChange={(w, h) => setF((p) => ({ ...p, weight: w, height: h }))} />
              <WeightLossWidget current={f.weight} usual={f.wl6} months={6} onChange={(c, u) => setF((p) => ({ ...p, weight: c, wl6: u }))} />
            </div>

            <Card className="border-accent/20 bg-card/50">
              <CardHeader className="pb-2">
                <CardTitle className="font-mono text-xs uppercase tracking-widest text-accent">B · NRS-2002 (sàng lọc nhanh)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ScoreRow label="Mức suy giảm dinh dưỡng" value={f.nrsNutri} onChange={(v) => set("nrsNutri", v)}
                  options={[
                    [0, "Bình thường"],
                    [1, "Sụt cân >5%/3 th HOẶC ăn 50-75% nhu cầu"],
                    [2, "Sụt cân >5%/2 th HOẶC BMI 18.5-20.5 + tổng trạng kém HOẶC ăn 25-60%"],
                    [3, "Sụt cân >5%/1 th HOẶC BMI <18.5 + tổng trạng kém HOẶC ăn 0-25%"],
                  ]}
                />
                <ScoreRow label="Mức nặng của bệnh" value={f.nrsDisease} onChange={(v) => set("nrsDisease", v)}
                  options={[
                    [0, "Không"],
                    [1, "COPD, ung thư, mãn tính có biến chứng, gãy xương háng"],
                    [2, "Phẫu thuật ổ bụng lớn, đột quỵ, viêm phổi nặng, ung thư huyết"],
                    [3, "Chấn thương sọ não, ghép tuỷ, ICU APACHE >10"],
                  ]}
                />
                <div className="flex items-center justify-between rounded-md border border-border/60 bg-background/40 px-3 py-2">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Tổng điểm (+1 nếu ≥70 tuổi)</div>
                    <div className="font-display text-2xl">{nrsTotal}</div>
                  </div>
                  <Badge variant="outline" className={`font-mono uppercase ${nrsResult.tone === "destructive" ? "border-destructive/50 bg-destructive/15 text-destructive" : "border-emerald-500/50 bg-emerald-500/15 text-emerald-300"}`}>
                    {nrsResult.label}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <RefeedingAlertWidget
              bmiVal={bmiVal}
              weightLoss6moPct={wl6Pct}
              fastingDays={f.fastingDays}
              lowElectrolyte={f.lowElectrolyte}
              alcoholOrComorbid={f.alcohol}
              onChange={(n) => setF((p) => ({ ...p, fastingDays: n.fastingDays, lowElectrolyte: n.lowElectrolyte, alcohol: n.alcoholOrComorbid }))}
            />
          </TabsContent>

          <TabsContent value="tab2" className="space-y-6">
            <EnergyWidget
              formula={f.formula} gender={f.gioi} weight={f.weight} height={f.height} age={f.tuoi}
              activity={f.activity} stress={f.stress}
              onChange={(n) => setF((p) => ({ ...p, ...n }))}
            />
            <MacroWidget weight={f.weight} p={f.pPerKg} l={f.lPerKg} g={f.gPerKg}
              onChange={(n) => setF((p) => ({ ...p, pPerKg: n.p, lPerKg: n.l, gPerKg: n.g }))}
            />

            <Card className="border-accent/20 bg-card/50">
              <CardHeader className="pb-2"><CardTitle className="font-mono text-xs uppercase tracking-widest text-accent">▶ Đường nuôi</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {["PO", "NG (ống mũi-dạ dày)", "PEG", "TPN (tĩnh mạch)", "Kết hợp PO + EN", "Kết hợp EN + PN"].map((r) => (
                    <button type="button" key={r} onClick={() => set("route", r)}
                      className={`rounded-md border px-3 py-1.5 text-sm transition ${f.route === r ? "border-accent bg-accent/15 text-accent" : "border-border/60 hover:border-accent/40"}`}>
                      {r}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <DietCodePicker
              selected={f.dietCodes}
              onToggle={(c) => setF((p) => ({ ...p, dietCodes: p.dietCodes.includes(c) ? p.dietCodes.filter((x) => x !== c) : [...p.dietCodes, c] }))}
            />

            <Card className="border-accent/20 bg-card/50">
              <CardHeader className="pb-2"><CardTitle className="font-mono text-xs uppercase tracking-widest text-accent">☯ Bài thuốc YHCT bổ trợ</CardTitle></CardHeader>
              <CardContent>
                <div className="grid gap-2 md:grid-cols-2">
                  {YHCT_FORMULAS.map((y) => {
                    const on = f.yhctFormulas.includes(y.name);
                    return (
                      <button type="button" key={y.name}
                        onClick={() => setF((p) => ({ ...p, yhctFormulas: on ? p.yhctFormulas.filter((x) => x !== y.name) : [...p.yhctFormulas, y.name] }))}
                        className={`rounded-md border px-3 py-2 text-left text-sm transition ${on ? "border-accent bg-accent/15" : "border-border/60 hover:border-accent/40"}`}>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{y.name}</span>
                          <span className="font-mono text-[10px] uppercase text-muted-foreground">{y.group}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">{y.indication}</div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="border-accent/20 bg-card/50">
              <CardHeader className="pb-2"><CardTitle className="font-mono text-xs uppercase tracking-widest text-accent">◐ Theo dõi & ghi chú</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <Field label="Kế hoạch theo dõi (cân nặng, sinh hoá, sinh hiệu)">
                  <Textarea rows={3} value={f.monitoring} onChange={(e) => set("monitoring", e.target.value)} />
                </Field>
                <Field label="Ghi chú khác / lưu ý kiêng kỵ">
                  <Textarea rows={3} value={f.notes} onChange={(e) => set("notes", e.target.value)} />
                </Field>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Print view – matches PK-02 layout */}
        <div ref={printRef} className="hidden print:block">
          <PrintView f={f} bmiVal={bmiVal} wl6Pct={wl6Pct} nrsTotal={nrsTotal} nrsResult={nrsResult} />
        </div>
      </div>

      <style>{`
        @media print {
          body { background: white !important; color: black !important; }
          .print\\:hidden { display: none !important; }
          .print\\:block { display: block !important; }
          @page { size: A4; margin: 14mm 12mm; }
        }
      `}</style>
    </div>
  );
}

function Header() {
  return (
    <header className="z-30 border-b border-accent/30 bg-background/85 backdrop-blur-xl print:hidden">
      <div className="container mx-auto flex items-center justify-between px-6 py-3">
        <Link to="/" className="font-display text-lg">TRAMED</Link>
        <nav className="flex gap-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          <Link to="/dinh-duong" className="rounded-full px-3 py-1.5 hover:bg-accent/10 hover:text-accent">/ dashboard</Link>
          <Link to="/dinh-duong/benh-an" search={{}} className="rounded-full px-3 py-1.5 hover:bg-accent/10 hover:text-accent">/ bệnh án</Link>
        </nav>
      </div>
    </header>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <Label className="mb-1 block text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function ScoreRow({ label, value, onChange, options }: {
  label: string; value: 0 | 1 | 2 | 3;
  onChange: (v: 0 | 1 | 2 | 3) => void;
  options: [0 | 1 | 2 | 3, string][];
}) {
  return (
    <div>
      <div className="mb-1 text-sm font-medium">{label}</div>
      <div className="grid gap-1.5">
        {options.map(([v, text]) => (
          <label key={v} className={`flex cursor-pointer items-start gap-2 rounded-md border px-3 py-2 text-sm transition ${value === v ? "border-accent bg-accent/10" : "border-border/60 hover:border-accent/40"}`}>
            <input type="radio" name={label} className="mt-1" checked={value === v} onChange={() => onChange(v)} />
            <span><b className="font-mono text-accent">{v}</b> · {text}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function PrintView({ f, bmiVal, wl6Pct, nrsTotal, nrsResult }: {
  f: FormState; bmiVal: number | null; wl6Pct: number | null; nrsTotal: number; nrsResult: { label: string };
}) {
  const dietList = DIET_CODES.filter((d) => f.dietCodes.includes(d.code));
  return (
    <div style={{ color: "#000", fontFamily: "DM Sans, sans-serif", fontSize: 11, lineHeight: 1.45 }}>
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <div style={{ fontSize: 10 }}>BỆNH VIỆN ………………… · KHOA: {f.khoa || "…………"}</div>
        <h1 style={{ fontSize: 16, margin: "4px 0", letterSpacing: 1 }}>BỆNH ÁN DINH DƯỠNG (PK-02)</h1>
        <div style={{ fontSize: 10 }}>Số: {f.maBn || "……"} · Ngày vào viện: {f.ngayVao}</div>
      </div>
      <hr />
      <h3 style={hh}>I. HÀNH CHÍNH</h3>
      <table style={tbl}><tbody>
        <tr><td style={lbl}>Họ tên</td><td>{f.hoTen}</td><td style={lbl}>Tuổi</td><td>{f.tuoi}</td><td style={lbl}>Giới</td><td>{f.gioi}</td></tr>
        <tr><td style={lbl}>Chẩn đoán Tây y</td><td colSpan={5}>{f.dxTay}</td></tr>
        <tr><td style={lbl}>Chẩn đoán YHCT</td><td colSpan={3}>{f.dxYhct}</td><td style={lbl}>Thể bệnh</td><td>{f.theBenh}</td></tr>
      </tbody></table>

      <h3 style={hh}>II. NHÂN TRẮC & SÀNG LỌC</h3>
      <table style={tbl}><tbody>
        <tr><td style={lbl}>Cân hiện tại</td><td>{f.weight} kg</td><td style={lbl}>Cân 6 tháng trước</td><td>{f.wl6} kg</td><td style={lbl}>Cao</td><td>{f.height} cm</td></tr>
        <tr><td style={lbl}>BMI</td><td>{bmiVal ? bmiVal.toFixed(1) : "–"}</td><td style={lbl}>% sụt cân/6th</td><td>{wl6Pct != null ? wl6Pct.toFixed(1) + "%" : "–"}</td><td style={lbl}>NRS-2002</td><td>{nrsTotal} · {nrsResult.label}</td></tr>
        <tr><td style={lbl}>Refeeding risk</td><td colSpan={5}>Nhịn ăn {f.fastingDays} ngày · Điện giải thấp: {f.lowElectrolyte ? "có" : "không"} · Rượu/thuốc nguy cơ: {f.alcohol ? "có" : "không"}</td></tr>
      </tbody></table>

      <h3 style={hh}>III. CAN THIỆP DINH DƯỠNG</h3>
      <table style={tbl}><tbody>
        <tr><td style={lbl}>Đường nuôi</td><td>{f.route}</td><td style={lbl}>Công thức BMR</td><td>{f.formula}</td><td style={lbl}>HS hoạt động × stress</td><td>{f.activity} × {f.stress}</td></tr>
        <tr><td style={lbl}>Đạm (g/kg)</td><td>{f.pPerKg}</td><td style={lbl}>Lipid (g/kg)</td><td>{f.lPerKg}</td><td style={lbl}>Glucid (g/kg)</td><td>{f.gPerKg}</td></tr>
        <tr><td style={lbl}>Diet code</td><td colSpan={5}>{dietList.map((d) => `${d.code}-${d.name}`).join(" · ") || "–"}</td></tr>
        <tr><td style={lbl}>Bài thuốc YHCT</td><td colSpan={5}>{f.yhctFormulas.join(" · ") || "–"}</td></tr>
      </tbody></table>

      <h3 style={hh}>IV. THEO DÕI</h3>
      <div style={{ border: "1px solid #000", padding: 6, minHeight: 50 }}>{f.monitoring}</div>

      <h3 style={hh}>V. GHI CHÚ</h3>
      <div style={{ border: "1px solid #000", padding: 6, minHeight: 40 }}>{f.notes}</div>

      <div style={{ marginTop: 24, display: "flex", justifyContent: "space-between", fontSize: 10 }}>
        <div>Người làm bệnh án<br /><br />………………………</div>
        <div>Trưởng khoa<br /><br />………………………</div>
      </div>
    </div>
  );
}

const hh: React.CSSProperties = { fontSize: 12, margin: "10px 0 4px", borderBottom: "1px solid #000", paddingBottom: 2 };
const tbl: React.CSSProperties = { width: "100%", borderCollapse: "collapse", fontSize: 11 };
const lbl: React.CSSProperties = { background: "#eee", padding: "3px 6px", border: "1px solid #999", width: "14%", fontWeight: 600 };
