import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  bmi,
  bmiCategory,
  weightLossPct,
  weightLossSeverity,
  refeedingRisk,
  REFEEDING_PROTOCOL,
  bmr,
  ACTIVITY_FACTORS,
  STRESS_FACTORS,
  macroBreakdown,
  DIET_CODES,
  type Formula,
  type Gender,
} from "@/lib/nutrition";

function ToneBadge({ tone, children }: { tone: string; children: React.ReactNode }) {
  const cls =
    tone === "destructive"
      ? "border-destructive/50 bg-destructive/15 text-destructive"
      : tone === "warning"
      ? "border-sky-500/50 bg-sky-500/15 text-sky-300"
      : tone === "success"
      ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-300"
      : "border-border bg-muted/40 text-muted-foreground";
  return <Badge variant="outline" className={`font-mono uppercase tracking-wider ${cls}`}>{children}</Badge>;
}

export function BMIWidget({ weight, height, onChange }: {
  weight: number; height: number; onChange: (w: number, h: number) => void;
}) {
  const b = bmi(weight, height);
  const cat = bmiCategory(b);
  return (
    <Card className="border-accent/20 bg-card/50">
      <CardHeader className="pb-2">
        <CardTitle className="font-mono text-xs uppercase tracking-widest text-accent">◇ BMI · WHO Asian</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Cân nặng (kg)</Label>
            <Input type="number" step="0.1" value={weight || ""} onChange={(e) => onChange(parseFloat(e.target.value) || 0, height)} />
          </div>
          <div>
            <Label className="text-xs">Chiều cao (cm)</Label>
            <Input type="number" step="0.5" value={height || ""} onChange={(e) => onChange(weight, parseFloat(e.target.value) || 0)} />
          </div>
        </div>
        <div className="flex items-center justify-between rounded-md border border-border/60 bg-background/40 px-3 py-2">
          <div className="font-display text-2xl">{b ? b.toFixed(1) : "–"}</div>
          <ToneBadge tone={cat.tone}>{cat.label}</ToneBadge>
        </div>
      </CardContent>
    </Card>
  );
}

export function WeightLossWidget({
  current, usual, months, onChange,
}: {
  current: number; usual: number; months: 1 | 3 | 6;
  onChange: (current: number, usual: number, months: 1 | 3 | 6) => void;
}) {
  const pct = weightLossPct(current, usual);
  const sev = weightLossSeverity(pct, months);
  return (
    <Card className="border-accent/20 bg-card/50">
      <CardHeader className="pb-2">
        <CardTitle className="font-mono text-xs uppercase tracking-widest text-accent">◇ % sụt cân</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-3 gap-2">
          <div>
            <Label className="text-xs">Cân hiện tại</Label>
            <Input type="number" step="0.1" value={current || ""} onChange={(e) => onChange(parseFloat(e.target.value) || 0, usual, months)} />
          </div>
          <div>
            <Label className="text-xs">Cân thường ngày</Label>
            <Input type="number" step="0.1" value={usual || ""} onChange={(e) => onChange(current, parseFloat(e.target.value) || 0, months)} />
          </div>
          <div>
            <Label className="text-xs">Trong (tháng)</Label>
            <select
              className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
              value={months}
              onChange={(e) => onChange(current, usual, Number(e.target.value) as 1 | 3 | 6)}
            >
              <option value={1}>1</option>
              <option value={3}>3</option>
              <option value={6}>6</option>
            </select>
          </div>
        </div>
        <div className="flex items-center justify-between rounded-md border border-border/60 bg-background/40 px-3 py-2">
          <div className="font-display text-2xl">{pct != null ? `${pct.toFixed(1)}%` : "–"}</div>
          <ToneBadge tone={sev.tone}>{sev.label}</ToneBadge>
        </div>
      </CardContent>
    </Card>
  );
}

export function RefeedingAlertWidget(opts: {
  bmiVal: number | null;
  weightLoss6moPct: number | null;
  fastingDays: number;
  lowElectrolyte: boolean;
  alcoholOrComorbid: boolean;
  onChange: (next: { fastingDays: number; lowElectrolyte: boolean; alcoholOrComorbid: boolean }) => void;
}) {
  const risk = refeedingRisk({
    bmiVal: opts.bmiVal,
    weightLoss6moPct: opts.weightLoss6moPct,
    fastingDays: opts.fastingDays,
    lowElectrolyte: opts.lowElectrolyte,
    alcoholOrComorbid: opts.alcoholOrComorbid,
  });
  const tone =
    risk.level === "high" ? "destructive" : risk.level === "moderate" ? "warning" : "success";
  return (
    <Card className={`border ${risk.level === "high" ? "border-destructive/60" : "border-accent/20"} bg-card/50`}>
      <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
        <CardTitle className="font-mono text-xs uppercase tracking-widest text-accent">⚠ refeeding syndrome screen</CardTitle>
        <ToneBadge tone={tone}>
          {risk.level === "high" ? "Nguy cơ CAO" : risk.level === "moderate" ? "Nguy cơ VỪA" : "Nguy cơ thấp"}
        </ToneBadge>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <Label className="text-xs">Số ngày nhịn ăn / ăn rất ít</Label>
            <Input
              type="number"
              min={0}
              value={opts.fastingDays || 0}
              onChange={(e) => opts.onChange({
                fastingDays: parseInt(e.target.value) || 0,
                lowElectrolyte: opts.lowElectrolyte,
                alcoholOrComorbid: opts.alcoholOrComorbid,
              })}
            />
          </div>
          <label className="flex items-center gap-2 rounded-md border border-border/60 bg-background/30 px-3 py-2 text-sm">
            <input
              type="checkbox"
              checked={opts.lowElectrolyte}
              onChange={(e) => opts.onChange({
                fastingDays: opts.fastingDays,
                lowElectrolyte: e.target.checked,
                alcoholOrComorbid: opts.alcoholOrComorbid,
              })}
            />
            K⁺ / Mg²⁺ / P- thấp trước nuôi
          </label>
          <label className="flex items-center gap-2 rounded-md border border-border/60 bg-background/30 px-3 py-2 text-sm">
            <input
              type="checkbox"
              checked={opts.alcoholOrComorbid}
              onChange={(e) => opts.onChange({
                fastingDays: opts.fastingDays,
                lowElectrolyte: opts.lowElectrolyte,
                alcoholOrComorbid: e.target.checked,
              })}
            />
            Nghiện rượu / dùng insulin · lợi tiểu · antacid
          </label>
        </div>
        {risk.reasons.length > 0 && (
          <Alert className={risk.level === "high" ? "border-destructive/60 bg-destructive/10" : "border-sky-500/40 bg-sky-500/10"}>
            <AlertTitle className="font-mono text-xs uppercase">Tiêu chuẩn dương tính</AlertTitle>
            <AlertDescription>
              <ul className="mt-1 list-disc pl-5 text-sm">
                {risk.reasons.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </AlertDescription>
          </Alert>
        )}
        {risk.level !== "low" && (
          <div className="rounded-md border border-accent/30 bg-accent/5 p-3">
            <div className="mb-1 font-mono text-xs uppercase tracking-wider text-accent">Protocol khuyến cáo (NICE / ASPEN)</div>
            <ol className="list-decimal space-y-1 pl-5 text-sm text-foreground/90">
              {REFEEDING_PROTOCOL.map((line, i) => (
                <li key={i} dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>") }} />
              ))}
            </ol>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function EnergyWidget({
  formula, gender, weight, height, age, activity, stress, onChange,
}: {
  formula: Formula; gender: Gender; weight: number; height: number; age: number;
  activity: number; stress: number;
  onChange: (next: Partial<{ formula: Formula; gender: Gender; weight: number; height: number; age: number; activity: number; stress: number }>) => void;
}) {
  const base = bmr(formula, gender, weight, height, age);
  const tee = base ? base * activity * stress : null;
  return (
    <Card className="border-accent/20 bg-card/50">
      <CardHeader className="pb-2">
        <CardTitle className="font-mono text-xs uppercase tracking-widest text-accent">⚙ Nhu cầu năng lượng</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <Label className="text-xs">Công thức</Label>
            <select className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
              value={formula} onChange={(e) => onChange({ formula: e.target.value as Formula })}>
              <option value="mifflin">Mifflin-St Jeor</option>
              <option value="harris">Harris-Benedict</option>
            </select>
          </div>
          <div>
            <Label className="text-xs">Giới</Label>
            <select className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
              value={gender} onChange={(e) => onChange({ gender: e.target.value as Gender })}>
              <option value="nam">Nam</option>
              <option value="nu">Nữ</option>
            </select>
          </div>
          <div>
            <Label className="text-xs">Tuổi</Label>
            <Input type="number" value={age || ""} onChange={(e) => onChange({ age: parseInt(e.target.value) || 0 })} />
          </div>
          <div>
            <Label className="text-xs">Cân (kg)</Label>
            <Input type="number" step="0.1" value={weight || ""} onChange={(e) => onChange({ weight: parseFloat(e.target.value) || 0 })} />
          </div>
          <div>
            <Label className="text-xs">Cao (cm)</Label>
            <Input type="number" step="0.5" value={height || ""} onChange={(e) => onChange({ height: parseFloat(e.target.value) || 0 })} />
          </div>
          <div>
            <Label className="text-xs">Hệ số hoạt động</Label>
            <select className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
              value={activity} onChange={(e) => onChange({ activity: parseFloat(e.target.value) })}>
              {ACTIVITY_FACTORS.map((a) => <option key={a.v} value={a.v}>{a.v} – {a.label}</option>)}
            </select>
          </div>
          <div className="md:col-span-3">
            <Label className="text-xs">Hệ số stress / chuyển hoá</Label>
            <select className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
              value={stress} onChange={(e) => onChange({ stress: parseFloat(e.target.value) })}>
              {STRESS_FACTORS.map((s) => <option key={s.v} value={s.v}>×{s.v} – {s.label}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-md border border-border/60 bg-background/40 px-3 py-2">
            <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">BMR</div>
            <div className="font-display text-xl">{base ? Math.round(base) : "–"} <span className="text-xs text-muted-foreground">kcal</span></div>
          </div>
          <div className="rounded-md border border-accent/40 bg-accent/10 px-3 py-2">
            <div className="font-mono text-[10px] uppercase tracking-wider text-accent">TEE mục tiêu</div>
            <div className="font-display text-xl text-accent">{tee ? Math.round(tee) : "–"} <span className="text-xs">kcal/ngày</span></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function MacroWidget({ weight, p, l, g, onChange }: {
  weight: number; p: number; l: number; g: number;
  onChange: (next: { p: number; l: number; g: number }) => void;
}) {
  const m = useMemo(() => macroBreakdown(weight, { p, l, g }), [weight, p, l, g]);
  return (
    <Card className="border-accent/20 bg-card/50">
      <CardHeader className="pb-2">
        <CardTitle className="font-mono text-xs uppercase tracking-widest text-accent">⚖ Phân bố chất sinh năng (g/kg/ngày)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-3 gap-3">
          {([
            ["p", "Đạm", p, "1.0–1.5"],
            ["l", "Lipid", l, "0.8–1.2"],
            ["g", "Glucid", g, "3–5"],
          ] as const).map(([k, label, v, ref]) => (
            <div key={k}>
              <Label className="text-xs">{label} <span className="text-muted-foreground">({ref})</span></Label>
              <Input type="number" step="0.1" value={v || ""} onChange={(e) => onChange({
                p: k === "p" ? parseFloat(e.target.value) || 0 : p,
                l: k === "l" ? parseFloat(e.target.value) || 0 : l,
                g: k === "g" ? parseFloat(e.target.value) || 0 : g,
              })} />
            </div>
          ))}
        </div>
        <div className="space-y-1.5">
          {([
            ["Đạm", m.kcal.p, m.percent.p, "bg-cyan-400"],
            ["Lipid", m.kcal.l, m.percent.l, "bg-sky-400"],
            ["Glucid", m.kcal.g, m.percent.g, "bg-indigo-400"],
          ] as const).map(([label, kcal, pct, color]) => (
            <div key={label} className="flex items-center gap-2 text-xs">
              <span className="w-14 text-muted-foreground">{label}</span>
              <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <div className={`absolute inset-y-0 left-0 ${color}`} style={{ width: `${Math.min(100, pct)}%` }} />
              </div>
              <span className="w-32 text-right font-mono">{Math.round(kcal)} kcal · {pct.toFixed(0)}%</span>
            </div>
          ))}
          <div className="mt-2 flex justify-between rounded-md border border-accent/40 bg-accent/10 px-3 py-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-accent">Tổng kcal cung cấp</span>
            <span className="font-display text-lg text-accent">{Math.round(m.kcal.total)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DietCodePicker({ selected, onToggle }: {
  selected: string[]; onToggle: (code: string) => void;
}) {
  return (
    <Card className="border-accent/20 bg-card/50">
      <CardHeader className="pb-2">
        <CardTitle className="font-mono text-xs uppercase tracking-widest text-accent">▤ Diet-code library</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2 md:grid-cols-2">
          {DIET_CODES.map((d) => {
            const on = selected.includes(d.code);
            return (
              <button
                type="button"
                key={d.code}
                onClick={() => onToggle(d.code)}
                className={`flex items-start gap-3 rounded-md border px-3 py-2 text-left text-sm transition ${
                  on
                    ? "border-accent bg-accent/15 text-accent-foreground shadow-[0_0_0_1px_var(--cyan)]"
                    : "border-border/60 bg-background/30 hover:border-accent/40 hover:bg-accent/5"
                }`}
              >
                <span className={`mt-0.5 font-mono text-xs ${on ? "text-accent" : "text-muted-foreground"}`}>{d.code}</span>
                <span className="flex-1">
                  <span className="block font-medium">{d.name}</span>
                  <span className="block text-xs text-muted-foreground">{d.desc}</span>
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">{d.kcal} kcal</span>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
