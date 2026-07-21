// Nutrition clinical helpers – pure functions, no React.

export type Gender = "nam" | "nu";
export type Formula = "harris" | "mifflin";

// WHO Asian BMI thresholds
export function bmi(weightKg: number, heightCm: number): number | null {
  if (!weightKg || !heightCm) return null;
  const h = heightCm / 100;
  return weightKg / (h * h);
}

export function bmiCategory(b: number | null) {
  if (b == null || !isFinite(b)) return { label: "–", tone: "muted" as const };
  if (b < 16) return { label: "Suy dinh dưỡng nặng", tone: "destructive" as const };
  if (b < 17) return { label: "SDD vừa", tone: "destructive" as const };
  if (b < 18.5) return { label: "Thiếu cân", tone: "warning" as const };
  if (b < 23) return { label: "Bình thường", tone: "success" as const };
  if (b < 25) return { label: "Thừa cân", tone: "warning" as const };
  if (b < 30) return { label: "Béo phì độ I", tone: "warning" as const };
  return { label: "Béo phì độ II+", tone: "destructive" as const };
}

// % weight loss
export function weightLossPct(current: number, usual: number) {
  if (!current || !usual) return null;
  return ((usual - current) / usual) * 100;
}

export function weightLossSeverity(pct: number | null, months: 1 | 3 | 6) {
  if (pct == null) return { label: "–", tone: "muted" as const };
  const thresholds: Record<number, [number, number]> = {
    1: [2, 5],
    3: [5, 7.5],
    6: [7.5, 10],
  };
  const [mild, severe] = thresholds[months];
  if (pct >= severe) return { label: `Sụt cân nặng (${pct.toFixed(1)}%/${months}th)`, tone: "destructive" as const };
  if (pct >= mild) return { label: `Sụt cân đáng kể (${pct.toFixed(1)}%/${months}th)`, tone: "warning" as const };
  if (pct > 0) return { label: `Nhẹ (${pct.toFixed(1)}%/${months}th)`, tone: "muted" as const };
  return { label: "Không sụt cân", tone: "success" as const };
}

// Harris-Benedict revised (1984) / Mifflin-St Jeor (1990)
export function bmr(formula: Formula, gender: Gender, weightKg: number, heightCm: number, ageYr: number) {
  if (!weightKg || !heightCm || !ageYr) return null;
  if (formula === "mifflin") {
    const s = gender === "nam" ? 5 : -161;
    return 10 * weightKg + 6.25 * heightCm - 5 * ageYr + s;
  }
  // Harris-Benedict
  return gender === "nam"
    ? 88.362 + 13.397 * weightKg + 4.799 * heightCm - 5.677 * ageYr
    : 447.593 + 9.247 * weightKg + 3.098 * heightCm - 4.330 * ageYr;
}

export const ACTIVITY_FACTORS = [
  { v: 1.2, label: "Nằm tại giường" },
  { v: 1.3, label: "Hoạt động nhẹ" },
  { v: 1.5, label: "Hoạt động vừa" },
  { v: 1.75, label: "Hoạt động nặng" },
];

export const STRESS_FACTORS = [
  { v: 1.0, label: "Không stress" },
  { v: 1.2, label: "Phẫu thuật nhẹ / nhiễm trùng" },
  { v: 1.35, label: "Đa chấn thương / nhiễm khuẩn nặng" },
  { v: 1.5, label: "Sepsis nặng" },
  { v: 1.75, label: "Bỏng > 40% / hồi sức" },
];

// Refeeding syndrome – NICE / ASPEN criteria
export function refeedingRisk(opts: {
  bmiVal: number | null;
  weightLoss6moPct: number | null;
  fastingDays: number;
  lowElectrolyte: boolean;
  alcoholOrComorbid: boolean;
}) {
  const reasons: string[] = [];
  let level: "low" | "moderate" | "high" = "low";

  // High-risk (NICE: ≥1)
  if (opts.bmiVal != null && opts.bmiVal < 16) reasons.push("BMI < 16 (cao)");
  if (opts.weightLoss6moPct != null && opts.weightLoss6moPct > 15) reasons.push("Sụt cân > 15%/6 tháng (cao)");
  if (opts.fastingDays >= 10) reasons.push(`Nhịn ăn ≥10 ngày (cao)`);
  if (opts.lowElectrolyte) reasons.push("K+/Mg++/P- thấp trước nuôi (cao)");
  if (reasons.length > 0) level = "high";

  // Moderate (NICE: ≥2)
  const modFlags: string[] = [];
  if (opts.bmiVal != null && opts.bmiVal < 18.5) modFlags.push("BMI < 18.5");
  if (opts.weightLoss6moPct != null && opts.weightLoss6moPct > 10) modFlags.push("Sụt cân > 10%/6th");
  if (opts.fastingDays >= 5) modFlags.push("Nhịn ăn ≥5 ngày");
  if (opts.alcoholOrComorbid) modFlags.push("Nghiện rượu / dùng insulin-lợi tiểu-thuốc dạ dày");

  if (level === "low" && modFlags.length >= 2) {
    level = "moderate";
    reasons.push(...modFlags.map((f) => `${f} (vừa)`));
  }

  return { level, reasons };
}

export const REFEEDING_PROTOCOL = [
  "Khởi đầu **10 kcal/kg/ngày** (ca cực nặng: 5 kcal/kg) – tăng dần trong 4-7 ngày đến mục tiêu.",
  "Bổ sung **Thiamine 200-300 mg/ngày** trước & 10 ngày đầu nuôi.",
  "Kiểm tra & bù **K⁺ (2-4 mmol/kg)**, **PO₄³⁻ (0.3-0.6 mmol/kg)**, **Mg²⁺ (0.2-0.4 mmol/kg)** trước nuôi.",
  "Theo dõi điện giải, đường huyết, dấu hiệu sống mỗi 12h trong 72h đầu.",
  "Hạn chế dịch & natri trong những ngày đầu; cân & xuất nhập mỗi ngày.",
];

// NRS-2002 simplified
export function nrs2002Total(
  impairedNutrition: 0 | 1 | 2 | 3,
  severityOfDisease: 0 | 1 | 2 | 3,
  age70Plus: boolean,
) {
  return impairedNutrition + severityOfDisease + (age70Plus ? 1 : 0);
}

export function nrs2002Interpret(total: number) {
  if (total >= 3) return { label: "Có nguy cơ SDD – cần can thiệp", tone: "destructive" as const };
  return { label: "Chưa nguy cơ – đánh giá lại mỗi tuần", tone: "success" as const };
}

// Diet code library (mô phỏng theo PK Chợ Rẫy / BV TW)
export type DietCode = {
  code: string;
  name: string;
  kcal: string;
  desc: string;
  group: "thông thường" | "bệnh lý" | "nuôi ăn";
};

export const DIET_CODES: DietCode[] = [
  { code: "DD01", name: "Cơm thường", kcal: "1800-2000", desc: "Khẩu phần chuẩn cho BN không hạn chế", group: "thông thường" },
  { code: "DD02", name: "Cháo / mềm", kcal: "1600-1800", desc: "BN sau phẫu thuật, răng hàm mặt, nuốt khó nhẹ", group: "thông thường" },
  { code: "DD03", name: "Súp xay – nuốt khó", kcal: "1400-1600", desc: "Rối loạn nuốt mức IDDSI 3-4", group: "thông thường" },
  { code: "DD04", name: "Sữa qua sonde 1.0", kcal: "1500", desc: "Nuôi ăn qua NG/PEG – isocaloric", group: "nuôi ăn" },
  { code: "DD05", name: "Sữa cao năng 1.5-2.0", kcal: "2000-2400", desc: "Hạn chế dịch / nhu cầu cao", group: "nuôi ăn" },
  { code: "DD06", name: "Đái tháo đường", kcal: "1600-1800", desc: "Low-GI, carb 45-50%, chia 5-6 bữa", group: "bệnh lý" },
  { code: "DD07", name: "Suy thận chưa lọc", kcal: "1800", desc: "Đạm 0.6-0.8 g/kg, hạn chế K-P-Na", group: "bệnh lý" },
  { code: "DD08", name: "Suy thận có lọc", kcal: "2000", desc: "Đạm 1.2-1.4 g/kg, hạn chế K-P", group: "bệnh lý" },
  { code: "DD09", name: "Xơ gan", kcal: "1800-2000", desc: "Đạm 1.0-1.5 g/kg (BCAA), bữa khuya tránh hạ đường", group: "bệnh lý" },
  { code: "DD10", name: "Low-residue (tiêu hoá)", kcal: "1600", desc: "Trước/sau nội soi, viêm ruột bùng phát", group: "bệnh lý" },
  { code: "DD11", name: "High-protein (suy kiệt)", kcal: "2200-2500", desc: "Đạm 1.5-2.0 g/kg, ω-3, vi chất", group: "bệnh lý" },
  { code: "DD12", name: "Tim mạch / hạ muối", kcal: "1800", desc: "Na < 2g/ngày, hạn chế chất béo bão hoà", group: "bệnh lý" },
];

// Macro distribution
export function macroBreakdown(weightKg: number, gPerKg: { p: number; l: number; g: number }) {
  const p = (gPerKg.p || 0) * weightKg;
  const l = (gPerKg.l || 0) * weightKg;
  const g = (gPerKg.g || 0) * weightKg;
  const kcalP = p * 4;
  const kcalL = l * 9;
  const kcalG = g * 4;
  const total = kcalP + kcalL + kcalG;
  return {
    grams: { p, l, g },
    kcal: { p: kcalP, l: kcalL, g: kcalG, total },
    percent: total ? { p: (kcalP / total) * 100, l: (kcalL / total) * 100, g: (kcalG / total) * 100 } : { p: 0, l: 0, g: 0 },
  };
}

// YHCT herbal formulas – for nutrition context
export const YHCT_FORMULAS = [
  { name: "Tứ quân tử thang", indication: "Tỳ vị khí hư – ăn kém, mệt mỏi, đại tiện lỏng", group: "bổ khí" },
  { name: "Sâm linh bạch truật tán", indication: "Tỳ hư tiết tả – tiêu hoá kém, sụt cân, đầy bụng", group: "bổ khí kiện tỳ" },
  { name: "Bát trân thang", indication: "Khí huyết lưỡng hư – suy nhược sau bệnh nặng", group: "bổ khí huyết" },
  { name: "Thập toàn đại bổ", indication: "Khí huyết âm dương đều hư – BN ung thư, hậu phẫu kéo dài", group: "đại bổ" },
  { name: "Hương sa lục quân tử", indication: "Tỳ hư khí trệ – đầy hơi, nôn, ăn không tiêu", group: "kiện tỳ hành khí" },
  { name: "Lục vị địa hoàng", indication: "Thận âm hư – ĐTĐ thể âm hư, khô khát, gầy sút", group: "bổ thận âm" },
  { name: "Bạch hổ gia nhân sâm", indication: "Vị nhiệt khát thuỷ – ĐTĐ thể vị nhiệt", group: "thanh nhiệt sinh tân" },
  { name: "Bổ trung ích khí", indication: "Trung khí hạ hãm – sa tạng, mệt nói nhỏ, biếng ăn", group: "thăng đề" },
];
