import type { MealPlan, MealSection } from "@/lib/tradmed.functions";

const fmt = (n: number | undefined | null) =>
  n === undefined || n === null || Number.isNaN(n) ? "–" : Number.isInteger(n) ? String(n) : n.toFixed(1);

function StatPill({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 to-transparent px-3 py-2.5">
      <div className="font-mono text-[9px] uppercase tracking-widest text-primary/70">{label}</div>
      <div className="mt-0.5 font-display text-lg font-semibold leading-none text-primary">{value}</div>
      {sub && <div className="mt-1 text-[10px] text-muted-foreground">{sub}</div>}
    </div>
  );
}

function MealCard({ meal }: { meal: MealSection }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border/60 bg-card/60 shadow-sm">
      <header className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border/50 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent px-4 py-2.5">
        <h4 className="flex items-center gap-2 font-display text-sm font-semibold text-foreground">
          <span className="text-base">{meal.emoji}</span>
          {meal.name}
          <span className="ml-1 rounded-full bg-primary/15 px-2 py-0.5 font-mono text-[10px] text-primary">
            {fmt(meal.total?.kcal)} kcal
          </span>
        </h4>
        {meal.description && (
          <p className="max-w-md text-right text-[11px] text-muted-foreground">{meal.description}</p>
        )}
      </header>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[12px]">
          <thead className="bg-muted/30">
            <tr className="text-left text-[10px] uppercase tracking-wider text-muted-foreground">
              <th className="px-3 py-2 font-medium">Nguyên liệu</th>
              <th className="px-2 py-2 text-right font-medium">KL</th>
              <th className="px-2 py-2 text-right font-medium">kcal</th>
              <th className="px-2 py-2 text-right font-medium">P (g)</th>
              <th className="px-2 py-2 text-right font-medium">L (g)</th>
              <th className="px-2 py-2 text-right font-medium">G (g)</th>
              <th className="px-2 py-2 text-right font-medium">Xơ</th>
              <th className="px-2 py-2 text-right font-medium">Na</th>
              <th className="px-2 py-2 text-right font-medium">K</th>
              <th className="px-2 py-2 text-right font-medium">Ca</th>
              <th className="px-2 py-2 text-right font-medium">Fe</th>
              <th className="px-3 py-2 font-medium">Vitamin · Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            {meal.ingredients?.map((ing, i) => (
              <tr key={i} className="border-t border-border/40 hover:bg-primary/[0.03]">
                <td className="px-3 py-1.5 font-medium text-foreground">{ing.name}</td>
                <td className="px-2 py-1.5 text-right font-mono text-muted-foreground">{ing.qty}</td>
                <td className="px-2 py-1.5 text-right font-mono">{fmt(ing.kcal)}</td>
                <td className="px-2 py-1.5 text-right font-mono">{fmt(ing.p)}</td>
                <td className="px-2 py-1.5 text-right font-mono">{fmt(ing.l)}</td>
                <td className="px-2 py-1.5 text-right font-mono">{fmt(ing.g)}</td>
                <td className="px-2 py-1.5 text-right font-mono text-muted-foreground">{fmt(ing.fiber)}</td>
                <td className="px-2 py-1.5 text-right font-mono text-muted-foreground">{fmt(ing.na)}</td>
                <td className="px-2 py-1.5 text-right font-mono text-muted-foreground">{fmt(ing.k)}</td>
                <td className="px-2 py-1.5 text-right font-mono text-muted-foreground">{fmt(ing.ca)}</td>
                <td className="px-2 py-1.5 text-right font-mono text-muted-foreground">{fmt(ing.fe)}</td>
                <td className="px-3 py-1.5 text-[11px] text-muted-foreground">
                  {[ing.vitamins, ing.note].filter(Boolean).join(" · ")}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-primary/8">
            <tr className="border-t-2 border-primary/30 font-semibold text-primary">
              <td className="px-3 py-2" colSpan={2}>Tổng {meal.name.toLowerCase()}</td>
              <td className="px-2 py-2 text-right font-mono">{fmt(meal.total?.kcal)}</td>
              <td className="px-2 py-2 text-right font-mono">{fmt(meal.total?.p)}</td>
              <td className="px-2 py-2 text-right font-mono">{fmt(meal.total?.l)}</td>
              <td className="px-2 py-2 text-right font-mono">{fmt(meal.total?.g)}</td>
              <td className="px-2 py-2 text-right font-mono">{fmt(meal.total?.fiber)}</td>
              <td className="px-2 py-2 text-right font-mono">{fmt(meal.total?.na)}</td>
              <td className="px-2 py-2 text-right font-mono">{fmt(meal.total?.k)}</td>
              <td className="px-2 py-2 text-right font-mono">{fmt(meal.total?.ca)}</td>
              <td className="px-2 py-2 text-right font-mono">{fmt(meal.total?.fe)}</td>
              <td className="px-3 py-2 text-[11px] font-normal text-primary/80">{meal.total?.vitamins}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}

export function MealPlanView({ plan }: { plan: MealPlan }) {
  const t = plan.tdee;
  const day = plan.dayTotal;
  const rec = plan.recommendations || ({} as MealPlan["recommendations"]);

  const dayRows: Array<[string, string | number, string | undefined]> = [
    ["kcal", fmt(day?.kcal), rec.kcal],
    ["Protein (g)", fmt(day?.p), rec.p],
    ["Lipid (g)", fmt(day?.l), rec.l],
    ["Glucid (g)", fmt(day?.g), rec.g],
    ["Chất xơ (g)", fmt(day?.fiber), rec.fiber],
    ["Natri (mg)", fmt(day?.na), rec.na],
    ["Kali (mg)", fmt(day?.k), rec.k],
    ["Canxi (mg)", fmt(day?.ca), rec.ca],
    ["Sắt (mg)", fmt(day?.fe), rec.fe],
    ["Vit C (mg)", fmt(day?.vitC), rec.vitC],
    ["Vit A (μg RAE)", fmt(day?.vitA), rec.vitA],
  ];

  return (
    <div className="space-y-5">
      {/* TDEE summary */}
      {t && (
        <section className="rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/8 via-card to-background p-4">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-base">⚡</span>
            <h3 className="font-display text-sm font-semibold text-foreground">Nhu cầu năng lượng</h3>
          </div>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
            <StatPill label="BMR" value={`${fmt(t.bmr)}`} sub="kcal" />
            <StatPill label="TDEE" value={`${fmt(t.tdee)}`} sub="kcal" />
            <StatPill label="Mục tiêu" value={`${fmt(t.kcalTarget)}`} sub="kcal/ngày" />
            <StatPill label="Protein" value={`${fmt(t.protein?.g)} g`} sub={`${fmt(t.protein?.gPerKg)} g/kg`} />
            <StatPill label="Lipid" value={`${fmt(t.lipid?.g)} g`} sub={`${fmt(t.lipid?.pctKcal)}% kcal`} />
            <StatPill label="Glucid" value={`${fmt(t.glucid?.g)} g`} sub={`${fmt(t.glucid?.pctKcal)}% kcal`} />
          </div>
          {t.notes && (
            <p className="mt-3 rounded-md border-l-2 border-primary/40 bg-primary/5 px-3 py-1.5 text-[12px] text-foreground/85">
              {t.notes}
            </p>
          )}
        </section>
      )}

      {/* Meals */}
      <div className="space-y-3">
        {plan.meals?.map((m, i) => <MealCard key={i} meal={m} />)}
      </div>

      {/* Day total */}
      {day && (
        <section className="overflow-hidden rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/8 to-card shadow-sm">
          <header className="flex items-center gap-2 border-b border-accent/30 bg-accent/10 px-4 py-2.5">
            <span className="text-base">📊</span>
            <h3 className="font-display text-sm font-semibold text-foreground">Tổng ngày & đối chiếu khuyến nghị</h3>
          </header>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[12.5px]">
              <thead className="bg-muted/30 text-[10px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">Chỉ số</th>
                  <th className="px-3 py-2 text-right font-medium">Tổng ngày</th>
                  <th className="px-3 py-2 text-left font-medium">Khuyến nghị</th>
                </tr>
              </thead>
              <tbody>
                {dayRows.map(([label, val, recVal]) => (
                  <tr key={label} className="border-t border-border/40 even:bg-primary/[0.02]">
                    <td className="px-3 py-1.5 font-medium text-foreground">{label}</td>
                    <td className="px-3 py-1.5 text-right font-mono text-foreground">{val}</td>
                    <td className="px-3 py-1.5 text-[11.5px] text-muted-foreground">{recVal || "–"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {day.evaluation && (
            <div className="border-t border-border/40 bg-accent/5 px-4 py-2.5 text-[12px] text-foreground/85">
              <span className="font-semibold text-accent">Đánh giá: </span>{day.evaluation}
            </div>
          )}
        </section>
      )}

      {/* Warnings */}
      {plan.warnings?.length > 0 && (
        <section className="rounded-2xl border border-sky-500/30 bg-sky-50/40 p-4 dark:bg-sky-950/20">
          <div className="mb-2 flex items-center gap-2">
            <span>⚠️</span>
            <h3 className="font-display text-sm font-semibold text-sky-700 dark:text-sky-300">Cảnh báo & điều chỉnh</h3>
          </div>
          <ul className="space-y-1.5 pl-1 text-[12.5px] text-foreground/85">
            {plan.warnings.map((w, i) => (
              <li key={i} className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* YHCT */}
      {plan.yhctNote && (
        <section className="rounded-2xl border border-emerald-700/25 bg-emerald-50/30 p-4 dark:bg-emerald-950/20">
          <div className="mb-1.5 flex items-center gap-2">
            <span>🌿</span>
            <h3 className="font-display text-sm font-semibold text-emerald-800 dark:text-emerald-300">Đối chiếu YHCT</h3>
          </div>
          <p className="text-[12.5px] leading-relaxed text-foreground/85">{plan.yhctNote}</p>
        </section>
      )}

      {plan.disclaimer && (
        <p className="rounded-md border border-border/50 bg-muted/30 px-3 py-2 text-center text-[11px] text-muted-foreground">
          ⚠️ {plan.disclaimer}
        </p>
      )}
    </div>
  );
}
