import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { SatinButton } from "@/components/ui/satin-button";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Document, Packer, Paragraph, HeadingLevel, TextRun, AlignmentType } from "docx";
import fileSaver from "file-saver";
const { saveAs } = fileSaver;
import { tradmedChat, analyzeDrugRx, analyzeMealPlan } from "@/lib/tradmed.functions";
import { MealPlanView } from "@/components/nutrition/meal-plan-view";
import { useSharedPatient, writeSharedPatient } from "@/lib/shared-patient";
import { searchIcd, searchDrug, parseDrugLine, findInteractions, type DrugItem, type InteractionFinding } from "@/lib/medical-db";
import { Mermaid } from "@/components/Mermaid";
import logo from "@/assets/tramed-logo-official.png.asset.json";

export const Route = createFileRoute("/kham-benh")({
  head: () => ({
    meta: [
      { title: "Khám bệnh – TRAMED" },
      { name: "description", content: "Quy trình khám bệnh 6 bước YHCT: Hồ sơ, Lâm sàng, Đánh giá, Biện chứng, Gợi ý toa, Hiệu chỉnh – có hỗ trợ." },
    ],
  }),
  component: KhamBenh,
});

type HoSo = {
  name: string; year: string; gender: string; address: string; date: string;
  tienSuBenh: string;     // tiền sử bệnh nền (THA, ĐTĐ, gan, thận, thai sản…)
  diUngThuoc: string;     // tiền sử dị ứng thuốc
  thuocDangDung: string;  // thuốc đang dùng (Đông + Tây)
  chanDoanYHHD: string;   // chẩn đoán YHHĐ (ICD)
  canLamSang: string;     // cận lâm sàng (XN máu / CĐHA)
};
type LamSang = { chief: string; vong: string; van: string; vanQ: string; thiet: string; tongue: string; pulse: string };
type LamSangYHHD = {
  // Sinh hiệu
  mach: string; ha: string; nhipTho: string; nhietDo: string; spo2: string; canNang: string; chieuCao: string;
  // Khám toàn thân & cơ quan
  toanThan: string;       // tri giác, da niêm, hạch, phù, thể trạng
  timMach: string;        // T1 T2, tiếng thổi, mỏm tim, mạch ngoại biên
  hoHap: string;          // rì rào, ran, gõ, rung thanh
  bung: string;           // bụng mềm, gan-lách, điểm đau, phản ứng dội
  thanKinh: string;       // tri giác, vận động, cảm giác, phản xạ
  coXuongKhop: string;    // tầm vận động, sưng-nóng-đỏ-đau, biến dạng
  khac: string;           // tai-mũi-họng, da, niệu-sinh dục…
  // Nghiệm pháp khám đã làm + kết quả
  nghiemPhap: string;
  // Cận lâm sàng
  canLamSangCo: string;   // đã có (kết quả XN/CĐHA)
  canLamSangCan: string;  // đề xuất thêm
};
type DanhGia = { bat: string; tang: string; khi: string; nguyen: string };
type BienChung = { hoiChung: string; phap: string; batPhap: string; lyLuan: string };
type ChamCuu = { huyetChinh: string; huyetPhoi: string; thuPhap: string; luuKim: string; lieuTrinh: string; kyThuat: string };
type DonYHHD = { chanDoan: string; thuoc: string; canLamSang: string; ghiChu: string };
type GoiYToa = {
  phuong: string; vi: string; lieu: string; cachDung: string;
  chamCuu: ChamCuu;
  yhhd: DonYHHD;
};
type HieuChinh = { giaGiam: string; kiengKy: string; theoDoi: string };
type DuongSinh = {
  nguyenTac: string;
  monAn: string;
  cachLam: string;
  thucDonSang: string;
  thucDonTrua: string;
  thucDonToi: string;
  kieng: string;
};
type ChotHoSo = {
  locked: boolean;
  signedAt: string;      // ISO
  doctorName: string;
  doctorLicense: string; // số CCHN
  coSo: string;          // cơ sở khám chữa bệnh
  ketLuan: string;       // kết luận cuối cùng của BS
  signatureHash: string; // SHA-256 của snapshot hồ sơ
  soHoSo: string;        // mã hồ sơ tự sinh
};

type RecordItem = {
  id: string;
  savedAt: string;
  b0: HoSo; b1: LamSang; b1y: LamSangYHHD; b2: DanhGia; b3: BienChung; b4: GoiYToa; b5: HieuChinh; b6: DuongSinh;
  chot?: ChotHoSo;
};

const EMPTY_CHAMCUU: ChamCuu = { huyetChinh: "", huyetPhoi: "", thuPhap: "", luuKim: "", lieuTrinh: "", kyThuat: "" };
const EMPTY_YHHD: DonYHHD = { chanDoan: "", thuoc: "", canLamSang: "", ghiChu: "" };
const EMPTY_B0: HoSo = { name: "", year: "", gender: "", address: "", date: new Date().toISOString().slice(0, 10), tienSuBenh: "", diUngThuoc: "", thuocDangDung: "", chanDoanYHHD: "", canLamSang: "" };
const EMPTY_B1: LamSang = { chief: "", vong: "", van: "", vanQ: "", thiet: "", tongue: "", pulse: "" };
const EMPTY_B1Y: LamSangYHHD = {
  mach: "", ha: "", nhipTho: "", nhietDo: "", spo2: "", canNang: "", chieuCao: "",
  toanThan: "", timMach: "", hoHap: "", bung: "", thanKinh: "", coXuongKhop: "", khac: "",
  nghiemPhap: "", canLamSangCo: "", canLamSangCan: "",
};
const EMPTY_B4: GoiYToa = { phuong: "", vi: "", lieu: "", cachDung: "", chamCuu: { ...EMPTY_CHAMCUU }, yhhd: { ...EMPTY_YHHD } };
const EMPTY_B3: BienChung = { hoiChung: "", phap: "", batPhap: "", lyLuan: "" };
const EMPTY_B6: DuongSinh = { nguyenTac: "", monAn: "", cachLam: "", thucDonSang: "", thucDonTrua: "", thucDonToi: "", kieng: "" };
const EMPTY_CHOT: ChotHoSo = { locked: false, signedAt: "", doctorName: "", doctorLicense: "", coSo: "", ketLuan: "", signatureHash: "", soHoSo: "" };

/** Bổ sung trường mới cho hồ sơ cũ trong localStorage. */
function migrateRecord(r: any): RecordItem {
  return {
    ...r,
    b0: { ...EMPTY_B0, ...(r.b0 || {}) },
    b1: { ...EMPTY_B1, ...(r.b1 || {}) },
    b1y: { ...EMPTY_B1Y, ...(r.b1y || {}) },
    b3: { ...EMPTY_B3, ...(r.b3 || {}) },
    b4: {
      ...EMPTY_B4,
      ...(r.b4 || {}),
      chamCuu: { ...EMPTY_CHAMCUU, ...((r.b4 && r.b4.chamCuu) || {}) },
      yhhd: { ...EMPTY_YHHD, ...((r.b4 && r.b4.yhhd) || {}) },
    },
    b6: { ...EMPTY_B6, ...(r.b6 || {}) },
    chot: { ...EMPTY_CHOT, ...(r.chot || {}) },
  };
}

const LS_KEY = "tradmed:records:v1";

const STEPS = [
  { v: "b0", code: "B0", label: "Hồ sơ" },
  { v: "b1", code: "B1", label: "Lâm sàng" },
  { v: "b2", code: "B2", label: "Đánh giá" },
  { v: "b3", code: "B3", label: "Biện chứng" },
  { v: "b4", code: "B4", label: "Gợi ý toa" },
  { v: "b5", code: "B5", label: "Hiệu chỉnh" },
  { v: "b6", code: "B6", label: "Dưỡng sinh" },
  { v: "b7", code: "B7", label: "Chốt & Ký số" },
] as const;

type StepKey = (typeof STEPS)[number]["v"];

function KhamBenh() {
  const fn = useServerFn(tradmedChat);
  const [step, setStep] = useState<StepKey>("b0");

  const [b0, setB0] = useState<HoSo>({ ...EMPTY_B0 });
  const [b1, setB1] = useState<LamSang>({ ...EMPTY_B1 });
  const [b1y, setB1y] = useState<LamSangYHHD>({ ...EMPTY_B1Y });
  const [b2, setB2] = useState<DanhGia>({ bat: "", tang: "", khi: "", nguyen: "" });
  const [b3, setB3] = useState<BienChung>({ ...EMPTY_B3 });
  const [b4, setB4] = useState<GoiYToa>({ ...EMPTY_B4, chamCuu: { ...EMPTY_CHAMCUU }, yhhd: { ...EMPTY_YHHD } });
  const [b5, setB5] = useState<HieuChinh>({ giaGiam: "", kiengKy: "", theoDoi: "" });
  const [b6, setB6] = useState<DuongSinh>({ ...EMPTY_B6 });
  const [chot, setChot] = useState<ChotHoSo>({ ...EMPTY_CHOT });

  // === Tính các bước đã có dữ liệu để làm nổi bật trên sidebar ===
  const filledSteps = useMemo(() => {
    const set = new Set<StepKey>();
    if (b0.name || b0.year || b0.gender || b0.address || b0.tienSuBenh || b0.diUngThuoc || b0.thuocDangDung || b0.chanDoanYHHD || b0.canLamSang) set.add("b0");
    if (b1.chief || b1.vong || b1.van || b1.vanQ || b1.thiet || b1.tongue || b1.pulse || b1y.mach || b1y.ha || b1y.nhipTho || b1y.nhietDo || b1y.spo2 || b1y.canNang || b1y.chieuCao || b1y.toanThan || b1y.timMach || b1y.hoHap || b1y.bung || b1y.thanKinh || b1y.coXuongKhop || b1y.khac || b1y.nghiemPhap || b1y.canLamSangCo || b1y.canLamSangCan) set.add("b1");
    if (b2.bat || b2.tang || b2.khi || b2.nguyen) set.add("b2");
    if (b3.hoiChung || b3.phap || b3.batPhap || b3.lyLuan) set.add("b3");
    if (b4.phuong || b4.vi || b4.lieu || b4.cachDung || b4.chamCuu.huyetChinh || b4.chamCuu.huyetPhoi || b4.chamCuu.thuPhap || b4.chamCuu.kyThuat || b4.chamCuu.luuKim || b4.chamCuu.lieuTrinh || b4.yhhd.chanDoan || b4.yhhd.thuoc || b4.yhhd.canLamSang || b4.yhhd.ghiChu) set.add("b4");
    if (b5.giaGiam || b5.kiengKy || b5.theoDoi) set.add("b5");
    if (b6.nguyenTac || b6.monAn || b6.cachLam || b6.thucDonSang || b6.thucDonTrua || b6.thucDonToi || b6.kieng) set.add("b6");
    if (chot.locked || chot.doctorName || chot.signatureHash) set.add("b7");
    return set;
  }, [b0, b1, b1y, b2, b3, b4, b5, b6, chot]);

  const [aiOut, setAiOut] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // === Dinh dưỡng cho B6 ===
  const mealFn = useServerFn(analyzeMealPlan);
  const [mealOut, setMealOut] = useState("");
  const [mealPlan, setMealPlan] = useState<import("@/lib/tradmed.functions").MealPlan | null>(null);
  const [mealLoading, setMealLoading] = useState(false);
  const [mealErr, setMealErr] = useState<string | null>(null);
  const [mealParams, setMealParams] = useState({
    tuoi: "", gender: "", cao: "", can: "",
    activity: "1.3",           // 1.2 nằm · 1.3 nhẹ · 1.5 vừa · 1.7 nặng
    goal: "duy_tri",            // duy_tri | giam_can | tang_can | tang_co
  });
  // Tự đồng bộ từ B0/B1y nếu BS chưa nhập tay
  useEffect(() => {
    setMealParams((p) => ({
      ...p,
      tuoi: p.tuoi || (b0.year ? String(Math.max(0, new Date().getFullYear() - Number(b0.year))) : ""),
      gender: p.gender || b0.gender || "",
      cao: p.cao || b1y.chieuCao || "",
      can: p.can || b1y.canNang || "",
    }));
  }, [b0.year, b0.gender, b1y.chieuCao, b1y.canNang]);

  const runMealAnalyzer = async () => {
    if (!b6.thucDonSang.trim() && !b6.thucDonTrua.trim() && !b6.thucDonToi.trim()) {
      setMealErr("Cần ít nhất 1 bữa trong thực đơn."); return;
    }
    setMealErr(null); setMealLoading(true);
    try {
      const res = await mealFn({ data: {
        sang: b6.thucDonSang, trua: b6.thucDonTrua, toi: b6.thucDonToi,
        canNang: mealParams.can, chieuCao: mealParams.cao,
        age: mealParams.tuoi, gender: mealParams.gender,
        activity: mealParams.activity, goal: mealParams.goal,
        chanDoan: [b3.hoiChung, b4.yhhd?.chanDoan].filter(Boolean).join(" · "),
        tienSu: b0.tienSuBenh, diUng: b0.diUngThuoc,
        monAn: b6.monAn, nguyenTac: b6.nguyenTac,
      }});
      const content = res?.content || "";
      const plan = res?.plan || null;
      if (!plan && !content) {
        setMealErr("Hệ thống tạm thời không phản hồi. Vui lòng thử lại sau ít phút.");
      } else {
        setMealPlan(plan);
        setMealOut(content);
      }
    } catch (e) {
      setMealErr(e instanceof Error ? e.message : "Lỗi hệ thống");
    } finally { setMealLoading(false); }
  };


  // === Records (localStorage) ===
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setRecords((JSON.parse(raw) as any[]).map(migrateRecord));
    } catch { /* ignore */ }
  }, []);

  // === Liên kết hồ sơ bệnh nhân với tab Kê đơn ===
  useSharedPatient((sp) => {
    if (!sp) return;
    setB0((b) => ({
      ...b,
      name: sp.name ?? b.name,
      year: sp.year ?? b.year,
      gender: sp.gender ?? b.gender,
      address: sp.address ?? b.address,
      date: sp.date ?? b.date,
    }));
    setB1((b) => ({ ...b, chief: sp.chief ?? b.chief }));
  });
  useEffect(() => {
    writeSharedPatient({
      name: b0.name, year: b0.year, gender: b0.gender,
      address: b0.address, date: b0.date, chief: b1.chief,
    });
  }, [b0.name, b0.year, b0.gender, b0.address, b0.date, b1.chief]);

  const persist = (list: RecordItem[]) => {
    setRecords(list);
    localStorage.setItem(LS_KEY, JSON.stringify(list));
  };

  const snapshot = (): Omit<RecordItem, "id" | "savedAt"> => ({ b0, b1, b1y, b2, b3, b4, b5, b6, chot });

  const saveCurrent = () => {
    const now = new Date().toISOString();
    if (currentId) {
      const next = records.map((r) => (r.id === currentId ? { ...r, ...snapshot(), savedAt: now } : r));
      persist(next);
    } else {
      const id = (crypto.randomUUID?.() ?? `r_${Date.now()}`) as string;
      const rec: RecordItem = { id, savedAt: now, ...snapshot() };
      persist([rec, ...records]);
      setCurrentId(id);
    }
  };

  const exportWord = async () => {
    const H = (t: string) => new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 240, after: 120 }, children: [new TextRun({ text: t, bold: true })] });
    const F = (label: string, value: string) =>
      new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: `${label}: `, bold: true }), new TextRun(value || "–")] });
    const P = (t: string) => new Paragraph({ spacing: { after: 80 }, children: [new TextRun(t)] });

    const children: Paragraph[] = [
      new Paragraph({ alignment: AlignmentType.CENTER, heading: HeadingLevel.TITLE, children: [new TextRun({ text: "PHIẾU KHÁM BỆNH Y HỌC CỔ TRUYỀN", bold: true })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 240 }, children: [new TextRun({ text: `Ngày xuất: ${new Date().toLocaleString("vi-VN")}` })] }),

      H("B0 · Hồ sơ bệnh nhân"),
      F("Họ tên", b0.name), F("Năm sinh", b0.year), F("Giới tính", b0.gender), F("Địa chỉ", b0.address), F("Ngày khám", b0.date),

      H("B1 · Lâm sàng YHCT (Tứ chẩn)"),
      F("Lý do khám", b1.chief), F("Vọng", b1.vong), F("Văn", b1.van), F("Vấn", b1.vanQ), F("Thiết", b1.thiet), F("Lưỡi", b1.tongue), F("Mạch", b1.pulse),

      H("B1 · Lâm sàng YHHĐ"),
      F("Sinh hiệu", [b1y.mach && `M ${b1y.mach}`, b1y.ha && `HA ${b1y.ha}`, b1y.nhipTho && `NT ${b1y.nhipTho}`, b1y.nhietDo && `T° ${b1y.nhietDo}`, b1y.spo2 && `SpO₂ ${b1y.spo2}`, b1y.canNang && `CN ${b1y.canNang}`, b1y.chieuCao && `Cao ${b1y.chieuCao}`].filter(Boolean).join(" · ")),
      F("Toàn thân", b1y.toanThan), F("Tim mạch", b1y.timMach), F("Hô hấp", b1y.hoHap), F("Bụng", b1y.bung),
      F("Thần kinh", b1y.thanKinh), F("Cơ-Xương-Khớp", b1y.coXuongKhop), F("Khác", b1y.khac),
      F("Nghiệm pháp đã làm", b1y.nghiemPhap),
      F("Cận lâm sàng đã có", b1y.canLamSangCo), F("Cận lâm sàng cần làm", b1y.canLamSangCan),

      H("B2 · Đánh giá"),
      F("Bát cương", b2.bat), F("Tạng phủ", b2.tang), F("Khí–Huyết–Tân dịch", b2.khi), F("Nguyên nhân", b2.nguyen),

      H("B3 · Biện chứng"),
      F("Hội chứng bệnh", b3.hoiChung), F("Pháp trị", b3.phap),

      H("B4 · Gợi ý toa – YHCT"),
      F("Phương thuốc", b4.phuong), F("Vị thuốc", b4.vi), F("Liều lượng", b4.lieu), F("Cách dùng", b4.cachDung),

      H("B4 · Phác đồ châm cứu"),
      F("Huyệt chủ", b4.chamCuu.huyetChinh), F("Huyệt phối", b4.chamCuu.huyetPhoi),
      F("Thủ pháp", b4.chamCuu.thuPhap), F("Kỹ thuật", b4.chamCuu.kyThuat),
      F("Lưu kim (phút)", b4.chamCuu.luuKim), F("Liệu trình", b4.chamCuu.lieuTrinh),

      H("B4 · Đơn YHHĐ kết hợp"),
      F("Chẩn đoán YHHĐ", b4.yhhd.chanDoan),
      F("Thuốc tân dược", b4.yhhd.thuoc),
      F("Cận lâm sàng", b4.yhhd.canLamSang),
      F("Ghi chú", b4.yhhd.ghiChu),

      H("B5 · Hiệu chỉnh"),
      F("Gia giảm", b5.giaGiam), F("Kiêng kỵ", b5.kiengKy), F("Theo dõi", b5.theoDoi),

      H("B6 · Dưỡng sinh – Thực dưỡng"),
      F("Nguyên tắc", b6.nguyenTac),
      F("Món ăn gợi ý", b6.monAn),
      F("Cách làm", b6.cachLam),
      F("Bữa sáng", b6.thucDonSang),
      F("Bữa trưa", b6.thucDonTrua),
      F("Bữa tối", b6.thucDonToi),
      F("Kiêng kỵ thực phẩm", b6.kieng),
    ];

    if (aiOut) {
      children.push(H("Kết quả phân tích hỗ trợ"));
      aiOut.split("\n").forEach((line) => children.push(P(line)));
    }

    const doc = new Document({
      styles: { default: { document: { run: { font: "Times New Roman", size: 24 } } } },
      sections: [{ properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } }, children }],
    });
    const blob = await Packer.toBlob(doc);
    const safe = (b0.name || "ho-so").trim().replace(/\s+/g, "_").replace(/[^\w\-]/g, "");
    saveAs(blob, `kham-benh_${safe}_${b0.date || new Date().toISOString().slice(0, 10)}.docx`);
  };

  const loadRecord = (id: string) => {
    const r = records.find((x) => x.id === id);
    if (!r) return;
    setB0(r.b0); setB1(r.b1); setB1y(r.b1y || { ...EMPTY_B1Y }); setB2(r.b2); setB3(r.b3); setB4(r.b4); setB5(r.b5); setB6(r.b6 || { ...EMPTY_B6 });
    setChot({ ...EMPTY_CHOT, ...(r.chot || {}) });
    setCurrentId(id);
    setStep("b0");
    setAiOut("");
  };

  const deleteRecord = (id: string) => {
    if (!confirm("Xoá hồ sơ này?")) return;
    persist(records.filter((r) => r.id !== id));
    if (currentId === id) setCurrentId(null);
    setCompareIds(compareIds.filter((x) => x !== id));
  };

  const newRecord = () => {
    if (currentId || b0.name || b1.chief) {
      if (!confirm("Tạo hồ sơ mới? Dữ liệu chưa lưu sẽ mất.")) return;
    }
    setB0({ ...EMPTY_B0, date: new Date().toISOString().slice(0, 10) });
    setB1({ ...EMPTY_B1 });
    setB1y({ ...EMPTY_B1Y });
    setB2({ bat: "", tang: "", khi: "", nguyen: "" });
    setB3({ ...EMPTY_B3 });
    setB4({ ...EMPTY_B4, chamCuu: { ...EMPTY_CHAMCUU }, yhhd: { ...EMPTY_YHHD } });
    setB5({ giaGiam: "", kiengKy: "", theoDoi: "" });
    setB6({ ...EMPTY_B6 });
    setChot({ ...EMPTY_CHOT });
    setCurrentId(null);
    setAiOut("");
    setStep("b0");
  };

  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  };

  const idx = STEPS.findIndex((s) => s.v === step);
  const go = (i: number) => setStep(STEPS[Math.max(0, Math.min(STEPS.length - 1, i))].v);

  const prompt = useMemo(() => buildPrompt({ b0, b1, b1y, b2, b3, b4, b5, b6 }, step), [b0, b1, b1y, b2, b3, b4, b5, b6, step]);

  const [citations, setCitations] = useState<Array<{ source: string; page: number | null; content: string; similarity: number }>>([]);

  const runAI = async () => {
    setErr(null);
    setLoading(true);
    setAiOut("");
    setCitations([]);
    try {
      let knowledgeQuery: string | undefined;
      if (step === "b4") {
        knowledgeQuery = ["châm cứu huyệt phối huyệt biện chứng nội khoa", b3.hoiChung, b3.phap, b4.phuong, b4.vi, b4.chamCuu.huyetChinh, b4.chamCuu.huyetPhoi, b4.yhhd.chanDoan, b4.yhhd.thuoc, b0.diUngThuoc, b0.tienSuBenh].filter(Boolean).join(" · ");
      } else if (step === "b6") {
        knowledgeQuery = ["món ăn bài thuốc dưỡng sinh", b3.hoiChung, b3.phap, b2.tang, b2.khi, b1.chief, b0.chanDoanYHHD, b6.nguyenTac, b6.monAn].filter(Boolean).join(" · ");
      } else if (step === "b1" || step === "b2" || step === "b3") {
        knowledgeQuery = ["lý luận YHCT tứ chẩn bát cương thiệt chẩn mạch chẩn nội khoa", b1.chief, b1.tongue, b1.pulse, b1y.toanThan, b1y.timMach, b1y.hoHap, b1y.bung, b1y.thanKinh, b1y.coXuongKhop, b0.chanDoanYHHD, b3.hoiChung].filter(Boolean).join(" · ");
      }
      const res = await fn({ data: { messages: [{ role: "user", content: prompt }], knowledgeQuery } });
      setAiOut(res.content);
      setCitations(res.citations ?? []);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Lỗi không xác định");
    } finally {
      setLoading(false);
    }
  };

  const [b6AutoLoading, setB6AutoLoading] = useState(false);
  const [b6AutoErr, setB6AutoErr] = useState<string | null>(null);
  const runB6AutoFill = async () => {
    setB6AutoErr(null);
    setB6AutoLoading(true);
    try {
      const ctx = [
        b0.chanDoanYHHD && `Chẩn đoán YHHĐ: ${b0.chanDoanYHHD}`,
        b0.diUngThuoc && `Dị ứng: ${b0.diUngThuoc}`,
        b0.tienSuBenh && `Tiền sử: ${b0.tienSuBenh}`,
        b1.chief && `Lý do khám: ${b1.chief}`,
        b2.tang && `Tạng phủ: ${b2.tang}`,
        b2.khi && `Khí-Huyết: ${b2.khi}`,
        b3.hoiChung && `Hội chứng YHCT: ${b3.hoiChung}`,
        b3.phap && `Pháp trị: ${b3.phap}`,
        b6.nguyenTac && `Nguyên tắc dưỡng sinh BS đã nhập: ${b6.nguyenTac}`,
        b6.kieng && `Thực phẩm kiêng BS đã nhập: ${b6.kieng}`,
      ].filter(Boolean).join("\n");
      const ask = `Bạn là chuyên gia DƯỠNG SINH – THỰC DƯỠNG YHCT. Dựa vào BỐI CẢNH bệnh nhân + NGUYÊN TẮC bác sĩ đã nhập dưới đây, hãy thiết kế phần dưỡng sinh.

Phối hợp các nguyên lý âm-dương ngày-đêm / theo mùa / theo thể chất + khung giờ ăn 3 cử để chọn món cụ thể và cách làm phù hợp. TUYỆT ĐỐI KHÔNG nêu tên sách / giáo trình / tác giả / số trang trong câu trả lời.

BỐI CẢNH:
${ctx}

YÊU CẦU: Trả về DUY NHẤT một JSON object (KHÔNG markdown, KHÔNG \`\`\`), đúng schema:
{
  "monAn": "Mỗi dòng 1 món + công dụng ngắn (3-6 món)",
  "cachLam": "Cách làm chi tiết từng món: Nguyên liệu / Cách nấu / Cách dùng – văn phong sách dễ hiểu",
  "thucDonSang": "Gợi ý bữa sáng (1-2 dòng)",
  "thucDonTrua": "Gợi ý bữa trưa (1-2 dòng)",
  "thucDonToi": "Gợi ý bữa tối nhẹ dễ tiêu (1-2 dòng)"
}`;
      const knowledgeQuery = ["món ăn bài thuốc dưỡng sinh", b3.hoiChung, b3.phap, b2.tang, b6.nguyenTac, b6.kieng].filter(Boolean).join(" · ");
      const res = await fn({ data: { messages: [{ role: "user", content: ask }], knowledgeQuery, forceAI: true } });
      const raw = res.content || "";
      const m = raw.match(/\{[\s\S]*\}/);
      if (!m) throw new Error("Hệ thống không trả về JSON hợp lệ");
      const parsed = JSON.parse(m[0]);
      setB6((prev) => ({
        ...prev,
        monAn: parsed.monAn ?? prev.monAn,
        cachLam: parsed.cachLam ?? prev.cachLam,
        thucDonSang: parsed.thucDonSang ?? prev.thucDonSang,
        thucDonTrua: parsed.thucDonTrua ?? prev.thucDonTrua,
        thucDonToi: parsed.thucDonToi ?? prev.thucDonToi,
      }));
      setCitations(res.citations ?? []);
    } catch (e) {
      setB6AutoErr(e instanceof Error ? e.message : "Lỗi không xác định");
    } finally {
      setB6AutoLoading(false);
    }
  };

  // B3: Gợi ý Chẩn đoán YHHĐ + Hội chứng YHCT + Pháp trị (BS can thiệp/sửa lại)
  const [b3AutoLoading, setB3AutoLoading] = useState(false);
  const [b3AutoErr, setB3AutoErr] = useState<string | null>(null);
  const runB3AutoFill = async () => {
    setB3AutoErr(null);
    setB3AutoLoading(true);
    try {
      const ctx = [
        b0.chanDoanYHHD && `CĐ sơ bộ (B0): ${b0.chanDoanYHHD}`,
        b0.tienSuBenh && `Tiền sử: ${b0.tienSuBenh}`,
        b0.diUngThuoc && `Dị ứng: ${b0.diUngThuoc}`,
        b1.chief && `Lý do khám: ${b1.chief}`,
        b1.tongue && `Lưỡi: ${b1.tongue}`,
        b1.pulse && `Mạch: ${b1.pulse}`,
        b1y.toanThan && `Toàn thân: ${b1y.toanThan}`,
        b1y.timMach && `Tim mạch: ${b1y.timMach}`,
        b1y.hoHap && `Hô hấp: ${b1y.hoHap}`,
        b1y.bung && `Bụng: ${b1y.bung}`,
        b1y.thanKinh && `Thần kinh: ${b1y.thanKinh}`,
        b1y.coXuongKhop && `Cơ xương khớp: ${b1y.coXuongKhop}`,
        b2.bat && `Bát cương: ${b2.bat}`,
        b2.tang && `Tạng phủ: ${b2.tang}`,
        b2.khi && `Khí-Huyết-Tân dịch: ${b2.khi}`,
      ].filter(Boolean).join("\n");
      const ask = `Bạn là chuyên gia NỘI KHOA YHHĐ + YHCT. Dựa BỐI CẢNH BN, suy luận song song để đề xuất:
① Chẩn đoán YHHĐ (kèm mã ICD-10 nếu xác định được; nhiều CĐ thì phân cách bằng dấu phẩy).
② Hội chứng YHCT (rút ra từ Tứ chẩn + Bát cương; nhiều hội chứng thì phân cách bằng dấu phẩy).
③ Pháp trị YHCT tương ứng hội chứng.
④ Bát pháp áp dụng (chọn 1-3 trong 8 pháp: Hãn, Thổ, Hạ, Hoà, Ôn, Thanh, Bổ, Tiêu – kèm giải thích ngắn vì sao chọn).
⑤ Lý luận YHCT: viết đoạn văn 4-8 câu, chuỗi lập luận Tứ chẩn → Bát cương → Tạng phủ / Khí-Huyết → Nguyên nhân → Hội chứng → Pháp trị → gợi ý phương dược tiêu biểu (giải thích VÌ SAO chọn phương đó – quân/thần/tá/sứ đối trị với cơ chế bệnh sinh nào).

BỐI CẢNH:
${ctx}

YÊU CẦU: Trả về DUY NHẤT 1 JSON (KHÔNG markdown, KHÔNG \`\`\`):
{
  "chanDoanYHHD": "Tên bệnh (Mã ICD-10), Tên bệnh 2 (Mã ICD-10)…",
  "hoiChung": "Hội chứng 1, Hội chứng 2…",
  "phap": "Pháp trị tương ứng, ngắn gọn",
  "batPhap": "Ôn – Bổ – Tiêu (mỗi pháp kèm 1 cụm lý do rất ngắn)",
  "lyLuan": "Đoạn văn lý luận YHCT liền mạch giải thích cơ chế bệnh và vì sao chọn phương."
}`;
      const knowledgeQuery = ["biện chứng YHCT bát cương tạng phủ bát pháp", b1.chief, b1.tongue, b1.pulse, b2.bat, b2.tang, b0.chanDoanYHHD].filter(Boolean).join(" · ");
      const res = await fn({ data: { messages: [{ role: "user", content: ask }], knowledgeQuery, forceAI: true } });
      const raw = res.content || "";
      const m = raw.match(/\{[\s\S]*\}/);
      if (!m) throw new Error("Hệ thống không trả về JSON hợp lệ");
      const parsed = JSON.parse(m[0]);
      if (parsed.chanDoanYHHD) {
        setB4((prev) => ({ ...prev, yhhd: { ...prev.yhhd, chanDoan: prev.yhhd.chanDoan?.trim() ? prev.yhhd.chanDoan : parsed.chanDoanYHHD } }));
      }
      setB3((prev) => ({
        hoiChung: prev.hoiChung?.trim() ? prev.hoiChung : (parsed.hoiChung ?? prev.hoiChung),
        phap: prev.phap?.trim() ? prev.phap : (parsed.phap ?? prev.phap),
        batPhap: prev.batPhap?.trim() ? prev.batPhap : (parsed.batPhap ?? prev.batPhap ?? ""),
        lyLuan: prev.lyLuan?.trim() ? prev.lyLuan : (parsed.lyLuan ?? prev.lyLuan ?? ""),
      }));
      setCitations(res.citations ?? []);
    } catch (e) {
      setB3AutoErr(e instanceof Error ? e.message : "Lỗi không xác định");
    } finally {
      setB3AutoLoading(false);
    }
  };

  // B3 · Sinh riêng "Lý luận YHCT" chuyên sâu (giải thích chọn phương) – dùng cả b4 nếu đã có
  const [lyLuanLoading, setLyLuanLoading] = useState(false);
  const [lyLuanErr, setLyLuanErr] = useState<string | null>(null);
  const runLyLuanFill = async () => {
    setLyLuanErr(null);
    setLyLuanLoading(true);
    try {
      const ctx = [
        b1.chief && `Lý do khám: ${b1.chief}`,
        b1.tongue && `Lưỡi: ${b1.tongue}`,
        b1.pulse && `Mạch: ${b1.pulse}`,
        b1.vong && `Vọng: ${b1.vong}`,
        b1.van && `Văn: ${b1.van}`,
        b1.vanQ && `Vấn: ${b1.vanQ}`,
        b1.thiet && `Thiết: ${b1.thiet}`,
        b2.bat && `Bát cương: ${b2.bat}`,
        b2.tang && `Tạng phủ: ${b2.tang}`,
        b2.khi && `Khí-Huyết-Tân dịch: ${b2.khi}`,
        b2.nguyen && `Nguyên nhân: ${b2.nguyen}`,
        b3.hoiChung && `Hội chứng: ${b3.hoiChung}`,
        b3.phap && `Pháp trị: ${b3.phap}`,
        b3.batPhap && `Bát pháp: ${b3.batPhap}`,
        b4.phuong && `Phương dự kiến: ${b4.phuong}`,
        b4.vi && `Vị thuốc: ${b4.vi}`,
      ].filter(Boolean).join("\n");
      const ask = `Bạn là giảng viên YHCT. Viết đoạn LÝ LUẬN YHCT liền mạch (6-10 câu, văn phong học thuật, tiếng Việt) giải thích:
- Cơ chế bệnh sinh theo Bát cương (Biểu/Lý – Hàn/Nhiệt – Hư/Thực – Âm/Dương).
- Tạng phủ – Khí – Huyết – Tân dịch bị ảnh hưởng và mối quan hệ sinh khắc.
- Nguyên nhân (lục dâm / thất tình / bất nội ngoại nhân) dẫn đến hội chứng.
- Vì sao chọn PHÁP TRỊ và các BÁT PHÁP tương ứng đối trị với cơ chế bệnh.
- Nếu có phương dự kiến: phân tích vai QUÂN – THẦN – TÁ – SỨ, giải thích vì sao phương đó phù hợp hội chứng (đối chứng lập phương). Nếu chưa có, đề xuất 1 phương cổ phù hợp và giải thích lý do chọn.

TUYỆT ĐỐI KHÔNG nêu tên sách / giáo trình / tác giả / số trang.

BỐI CẢNH:
${ctx}

YÊU CẦU: Trả về DUY NHẤT 1 JSON: { "lyLuan": "…đoạn văn…" }`;
      const knowledgeQuery = ["lý luận biện chứng luận trị bát cương bát pháp quân thần tá sứ đối chứng lập phương", b3.hoiChung, b3.phap, b4.phuong, b4.vi, b2.bat, b2.tang].filter(Boolean).join(" · ");
      const res = await fn({ data: { messages: [{ role: "user", content: ask }], knowledgeQuery, forceAI: true } });
      const raw = res.content || "";
      const m = raw.match(/\{[\s\S]*\}/);
      if (!m) throw new Error("Hệ thống không trả về JSON hợp lệ");
      const parsed = JSON.parse(m[0]);
      if (parsed.lyLuan) setB3((prev) => ({ ...prev, lyLuan: parsed.lyLuan }));
      setCitations(res.citations ?? []);
    } catch (e) {
      setLyLuanErr(e instanceof Error ? e.message : "Lỗi không xác định");
    } finally {
      setLyLuanLoading(false);
    }
  };

  // === B7 · Ký số & khoá hồ sơ ===
  const [signErr, setSignErr] = useState<string | null>(null);
  const [signing, setSigning] = useState(false);

  const canSign = () =>
    b0.name.trim() && b3.hoiChung.trim() && (b4.phuong.trim() || b4.yhhd.thuoc.trim() || b4.chamCuu.huyetChinh.trim());

  const signAndLock = async () => {
    setSignErr(null);
    if (!chot.doctorName.trim() || !chot.doctorLicense.trim()) {
      setSignErr("Vui lòng nhập Họ tên bác sĩ và số Chứng chỉ hành nghề (CCHN).");
      return;
    }
    if (!canSign()) {
      setSignErr("Hồ sơ chưa đủ tối thiểu: cần Họ tên (B0), Hội chứng (B3) và ít nhất 1 điều trị (B4).");
      return;
    }
    if (!confirm("Ký số & KHOÁ hồ sơ này? Sau khi khoá, các bước B0→B6 sẽ chuyển sang chế độ chỉ đọc.")) return;
    setSigning(true);
    try {
      const now = new Date();
      const payload = JSON.stringify({ b0, b1, b1y, b2, b3, b4, b5, b6, doctorName: chot.doctorName, doctorLicense: chot.doctorLicense, at: now.toISOString() });
      const buf = new TextEncoder().encode(payload);
      const hashBuf = await crypto.subtle.digest("SHA-256", buf);
      const hash = Array.from(new Uint8Array(hashBuf)).map((b) => b.toString(16).padStart(2, "0")).join("");
      const soHoSo = chot.soHoSo || `HS-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${hash.slice(0, 6).toUpperCase()}`;
      const next: ChotHoSo = { ...chot, locked: true, signedAt: now.toISOString(), signatureHash: hash, soHoSo };
      setChot(next);
      // Lưu ngay bản đã khoá
      setTimeout(() => saveCurrent(), 0);
    } catch (e) {
      setSignErr(e instanceof Error ? e.message : "Không thể tạo chữ ký số.");
    } finally {
      setSigning(false);
    }
  };

  const unlock = () => {
    if (!confirm("Mở khoá để chỉnh sửa? Chữ ký số hiện tại sẽ bị huỷ và cần ký lại sau khi sửa.")) return;
    setChot({ ...EMPTY_CHOT, doctorName: chot.doctorName, doctorLicense: chot.doctorLicense, coSo: chot.coSo });
  };

  const printReport = () => {
    if (typeof window !== "undefined") window.print();
  };

  return (
    <div className="min-h-screen">
      <header className="z-30 border-b border-border/60 bg-background/60 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between gap-3 px-6 py-4">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-card/50 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground transition hover:border-accent/50 hover:bg-accent/10 hover:text-accent"
            >
              <span className="transition-transform group-hover:-translate-x-0.5">←</span>
              <span>Trang chủ</span>
            </Link>
            <span className="hidden h-5 w-px bg-border md:block" />
            <Link to="/kham-benh" className="flex items-center gap-3">
              <img src={logo.url} alt="TRAMED" className="h-9 w-9 rounded-md bg-white p-0.5 object-contain" />
              <div className="leading-tight">
                <div className="font-display text-base font-semibold">TRAMED</div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Phòng chẩn trị · Khám → Kê đơn</div>
              </div>
            </Link>
          </div>
          <nav className="hidden items-center gap-1 rounded-full border border-border/60 bg-card/40 px-1.5 py-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground md:flex">
            <Link to="/kham-benh" className="rounded-full bg-accent/15 px-3 py-1 text-accent">① Khám bệnh</Link>
            <span className="text-accent/50">→</span>
            <Link to="/ke-don" className="rounded-full px-3 py-1 transition hover:bg-accent/10 hover:text-accent">② Kê đơn thông minh</Link>
          </nav>
        </div>
      </header>

      <section className="container mx-auto px-6 py-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <span className="pill">Workflow · 6S</span>
            <h1 className="mt-3 font-display text-3xl md:text-4xl">Quy trình khám bệnh YHCT</h1>
          </div>
          <div className="hidden font-mono text-[11px] text-muted-foreground md:block">
            STEP {idx + 1}/{STEPS.length}
          </div>
        </div>

        {/* Records bar */}
        <RecordsBar
          records={records}
          currentId={currentId}
          compareIds={compareIds}
          onNew={newRecord}
          onSave={saveCurrent}
          onExport={exportWord}
          onOpenCompare={() => setShowCompare(true)}
          onLoad={loadRecord}
          onDelete={deleteRecord}
          onToggleCompare={toggleCompare}
        />


        {/* Layout: vertical step rail + content */}
        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          {/* Vertical step rail */}
          <aside className="card-emerald rounded-2xl p-3 transition duration-300 md:sticky md:top-4 md:w-56 md:shrink-0">
            <div className="mb-3 px-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Workflow · STEP {idx + 1}/{STEPS.length}
            </div>
            <nav className="flex flex-row gap-1.5 overflow-x-auto md:flex-col md:overflow-visible">
              {STEPS.map((s, i) => {
                const active = s.v === step;
                const filled = filledSteps.has(s.v);
                const done = i < idx && filled;
                return (
                  <button
                    key={s.v}
                    onClick={() => setStep(s.v)}
                    className={`group flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-sm transition md:w-full ${
                      active
                        ? "border-accent bg-accent/25 text-accent-foreground glow-amber"
                        : done
                          ? "border-accent/70 bg-accent/15 text-foreground"
                          : filled
                            ? "border-accent/45 bg-accent/10 text-foreground hover:border-accent/65 hover:bg-accent/18"
                            : "border-border bg-card/40 text-muted-foreground hover:border-accent/40 hover:text-foreground"
                    }`}
                  >
                    <span className={`font-mono text-[11px] tracking-wider ${active ? "text-accent-foreground" : filled || done ? "text-accent" : ""}`}>{s.code}</span>
                    <span className={`${active ? "font-bold" : "font-medium"}`}>{s.label}</span>
                    {filled && !done && !active && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_6px_rgba(250,204,21,0.8)]" aria-label="Đã nhập" />
                    )}
                    {done && <span className="ml-auto font-mono text-[10px] text-accent">Xong</span>}
                  </button>
                );
              })}
            </nav>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-border/40">
              <div
                className="h-full bg-gradient-to-r from-primary via-accent to-accent transition-all duration-500"
                style={{ width: `${((idx + 1) / STEPS.length) * 100}%` }}
              />
            </div>
          </aside>

          {/* Right column: Analysis action + Panel */}
          <div className="min-w-0 flex-1">
            {/* Primary action */}
            <div className="sticky top-2 z-20 mb-6 rounded-2xl border border-accent/40 bg-gradient-to-r from-accent/15 via-primary/10 to-accent/15 p-3 backdrop-blur-xl">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-accent">Phân tích & phản biện</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    Phân tích bước <span className="text-foreground font-medium">{STEPS[idx].label}</span>, phát hiện mâu thuẫn chẩn đoán → điều trị, vẽ sơ đồ luận chứng.
                  </div>
                </div>
                <SatinButton
                  onClick={runAI}
                  disabled={loading}
                  loading={loading}
                  size="md"
                >
                  {loading ? "Đang phân tích…" : "Phân tích tự động"}
                </SatinButton>
              </div>
            </div>

            {/* Panel */}
            <div className={`glass rounded-2xl p-6 md:p-8 ${chot.locked && step !== "b7" ? "relative" : ""}`}>
              {chot.locked && step !== "b7" && (
                <div className="mb-4 flex items-center justify-between rounded-lg border border-accent/40 bg-cyan-400/10 px-3 py-2 text-xs text-cyan-200">
                  <span>🔒 Hồ sơ đã ký số & khoá – các bước này ở chế độ chỉ đọc.</span>
                  <button type="button" onClick={() => setStep("b7")} className="rounded-full border border-accent/40 px-3 py-1 font-mono text-[10px] uppercase text-cyan-200 hover:bg-emerald-400/20">
                    Đến B7 →
                  </button>
                </div>
              )}
              <fieldset disabled={chot.locked && step !== "b7"} className={chot.locked && step !== "b7" ? "opacity-70" : ""}>



          {step === "b0" && (
            <Panel code="B0" title="Hồ sơ bệnh nhân" desc="Hành chính · tiền sử · chẩn đoán & CLS ĐÃ CÓ trước khi khám (giấy chuyển viện / khám tuyến trước) – dùng làm bối cảnh cảnh báo dị ứng & tương tác. Chẩn đoán YHHĐ chính thức sẽ kết luận ở B4.">
              <Grid>
                <Field label="Họ tên" v={b0.name} on={(v) => setB0({ ...b0, name: v })} />
                <Field label="Năm sinh" v={b0.year} on={(v) => setB0({ ...b0, year: v })} placeholder="1968" />
                <Select label="Giới tính" v={b0.gender} on={(v) => setB0({ ...b0, gender: v })} opts={["Nam", "Nữ", "Khác"]} />
                <Field label="Ngày khám" type="date" v={b0.date} on={(v) => setB0({ ...b0, date: v })} />
                <Field label="Địa chỉ" v={b0.address} on={(v) => setB0({ ...b0, address: v })} full />
                <Area label="Tiền sử bệnh nền" v={b0.tienSuBenh} on={(v) => setB0({ ...b0, tienSuBenh: v })} placeholder="THA · ĐTĐ · suy gan · suy thận · thai sản · loét DD…" full />
                <Area label="⚠ Tiền sử dị ứng thuốc" v={b0.diUngThuoc} on={(v) => setB0({ ...b0, diUngThuoc: v })} placeholder="Penicillin (mề đay), Aspirin (khó thở), Đan sâm…" />
                <Area label="Thuốc đang dùng (Đông + Tây)" v={b0.thuocDangDung} on={(v) => setB0({ ...b0, thuocDangDung: v })} placeholder="Warfarin 5mg/ngày, Metformin 850mg×2…" />
                <IcdAutocomplete label="Chẩn đoán YHHĐ đã có (tuyến trước / chuyển viện)" v={b0.chanDoanYHHD} on={(v) => setB0({ ...b0, chanDoanYHHD: v })} />
                <Area label="CLS đã có (XN / CĐHA gần nhất)" v={b0.canLamSang} on={(v) => setB0({ ...b0, canLamSang: v })} placeholder="HA 160/95, Glucose 7.8, LDL 4.2…" />
              </Grid>
            </Panel>

          )}

          {step === "b1" && (
            <Panel code="B1" title="Lâm sàng" desc="Tách 2 khối: ① Lâm sàng YHHĐ (sinh hiệu · khám cơ quan · nghiệm pháp · cận lâm sàng) và ② Lâm sàng YHCT (Tứ chẩn).">
              <Area label="Lý do vào viện / Triệu chứng chính" v={b1.chief} on={(v) => setB1({ ...b1, chief: v })} full />
              <B1Tabs b1={b1} setB1={setB1} b1y={b1y} setB1y={setB1y} />
            </Panel>
          )}

          {step === "b2" && (
            <Panel code="B2" title="Đánh giá tổng hợp" desc="Bát cương · Tạng phủ · Khí huyết · Nguyên nhân.">
              <BatCuongPicker value={b2.bat} onChange={(v) => setB2({ ...b2, bat: v })} />
              <Grid>
                <AreaChips label="Tạng phủ liên đới" v={b2.tang} on={(v) => setB2({ ...b2, tang: v })} groups={CHIPS_TANG} placeholder="Vd: Can, Thận" />
                <AreaChips label="Khí – Huyết – Tân dịch" v={b2.khi} on={(v) => setB2({ ...b2, khi: v })} groups={CHIPS_KHI_HUYET} placeholder="Vd: Khí hư, Huyết ứ" />
                <AreaChips label="Nguyên nhân (Bệnh nhân)" v={b2.nguyen} on={(v) => setB2({ ...b2, nguyen: v })} groups={CHIPS_NGUYEN_NHAN} placeholder="Lục dâm · Thất tình · Ẩm thực…" full />
              </Grid>
            </Panel>
          )}

          {step === "b3" && (
            <Panel code="B3" title="Biện chứng & Chẩn đoán" desc="Kết luận song song: ① Chẩn đoán YHHĐ (từ B1 lâm sàng + CLS) · ② Hội chứng YHCT (từ Tứ chẩn + Bát cương) · ③ Pháp trị.">
              <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-dashed border-accent/40 bg-accent/5 p-3">
                  <div className="text-[12px] text-muted-foreground">
                    <span className="font-semibold text-foreground">Suy luận từ B0 → B2</span> để đề xuất CĐ YHHĐ + Hội chứng YHCT + Pháp trị. Bác sĩ <span className="font-semibold text-accent">tự sửa</span> tất cả các ô bên dưới.
                  </div>
                  <button
                    type="button"
                    onClick={runB3AutoFill}
                    disabled={b3AutoLoading}
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent to-primary px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:scale-[1.02] disabled:opacity-60"
                  >
                    <span className={`inline-block h-2 w-2 rounded-full bg-white ${b3AutoLoading ? "animate-ping" : "animate-pulse"}`} />
                    {b3AutoLoading ? "Đang phân tích…" : "✨ Gợi ý biện chứng"}
                  </button>
                </div>
                {b3AutoErr && <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-[12px] text-destructive">{b3AutoErr}</div>}

                <section className="rounded-xl border border-primary/25 bg-primary/5 p-4">
                  <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-primary">① Chẩn đoán YHHĐ (kết luận)</div>
                  <IcdAutocomplete
                    label="Chẩn đoán YHHĐ + mã ICD-10"
                    v={b4.yhhd.chanDoan}
                    on={(v) => setB4({ ...b4, yhhd: { ...b4.yhhd, chanDoan: v } })}
                  />
                  <div className="mt-1 text-[11px] text-muted-foreground">Khác với "CĐ đã có" ở B0 – đây là kết luận chính thức của bác sĩ sau khi thăm khám. Có thể nhập nhiều mã, ngăn cách bằng dấu phẩy.</div>
                </section>
                <section className="rounded-xl border border-accent/25 bg-accent/5 p-4 space-y-3">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-accent">② Hội chứng YHCT &amp; ③ Pháp trị</div>
                  <Area label="Hội chứng YHCT" v={b3.hoiChung} on={(v) => setB3({ ...b3, hoiChung: v })} placeholder="Can dương thượng kháng, Thận âm hư" />
                  <Area label="Pháp trị" v={b3.phap} on={(v) => setB3({ ...b3, phap: v })} placeholder="Tư âm tiềm dương, bình can tức phong" />
                </section>

                <section className="rounded-xl border border-sky-400/30 bg-sky-400/5 p-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="font-mono text-[10px] uppercase tracking-widest text-sky-300">④ Bát pháp &amp; ⑤ Lý luận YHCT (giải thích chọn phương)</div>
                    <button
                      type="button"
                      onClick={runLyLuanFill}
                      disabled={lyLuanLoading}
                      className="inline-flex items-center gap-2 rounded-full border border-sky-400/60 bg-sky-400/10 px-3 py-1.5 text-[12px] font-semibold text-sky-200 transition hover:bg-sky-400/20 disabled:opacity-60"
                      title="Sinh đoạn lý luận YHCT giải thích cơ chế bệnh sinh và vì sao chọn phương"
                    >
                      <span className={`inline-block h-1.5 w-1.5 rounded-full bg-sky-300 ${lyLuanLoading ? "animate-ping" : "animate-pulse"}`} />
                      {lyLuanLoading ? "Đang lập luận…" : "✎ Sinh lý luận YHCT"}
                    </button>
                  </div>
                  {lyLuanErr && <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-[11px] text-destructive">{lyLuanErr}</div>}
                  <AreaChips
                    label="Bát pháp áp dụng (Hãn · Thổ · Hạ · Hoà · Ôn · Thanh · Bổ · Tiêu)"
                    v={b3.batPhap}
                    on={(v) => setB3({ ...b3, batPhap: v })}
                    groups={CHIPS_BAT_PHAP}
                    placeholder="Vd: Ôn – Bổ (ôn dương ích khí) · Tiêu (tiêu đàm hoạt huyết)"
                    full
                  />
                  <div>
                    <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      Lý luận YHCT – chuỗi biện chứng &amp; giải thích chọn phương
                    </span>
                    <textarea
                      value={b3.lyLuan}
                      onChange={(e) => setB3({ ...b3, lyLuan: e.target.value })}
                      rows={7}
                      placeholder={"Tứ chẩn cho thấy… → Bát cương thuộc… → Tạng phủ tổn thương ở… → Nguyên nhân do… → Hội chứng là… → Pháp trị… → Bát pháp áp dụng… → Chọn phương ABC vì Quân là… Thần là… Tá là… Sứ là…"}
                      className="w-full rounded-lg border border-sky-400/30 bg-background/50 px-3 py-2 text-sm leading-relaxed outline-none transition focus:border-sky-400/60 focus:ring-2 focus:ring-sky-400/20"
                    />
                    <div className="mt-1 text-[11px] text-muted-foreground">
                      Đoạn văn này sẽ được in kèm hồ sơ và đơn thuốc – làm bằng chứng biện chứng luận trị.
                    </div>
                  </div>
                </section>
              </div>

            </Panel>
          )}


          {step === "b4" && (
            <Panel code="B4" title="Gợi ý toa – YHCT + Châm cứu + YHHĐ" desc="Cảnh báo dị ứng, Thập bát phản, tương tác Đông–Tây y.">
              <div className="space-y-6">
                {/* 1. Phương dược YHCT */}
                <section className="rounded-xl border border-accent/30 bg-accent/5 p-4">
                  <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-accent">① Phương dược YHCT (Quân – Thần – Tá – Sứ)</div>
                  <Grid>
                    <Field label="Tên phương" v={b4.phuong} on={(v) => setB4({ ...b4, phuong: v })} placeholder="Thiên ma câu đằng ẩm" full />
                    <Area label="Các vị thuốc" v={b4.vi} on={(v) => setB4({ ...b4, vi: v })} placeholder="Thiên ma 12g (Quân) · Câu đằng 16g (Quân)…" />
                    <Area label="Liều / Số thang" v={b4.lieu} on={(v) => setB4({ ...b4, lieu: v })} />
                    <Area label="Cách dùng" v={b4.cachDung} on={(v) => setB4({ ...b4, cachDung: v })} placeholder="Sắc uống ngày 1 thang, chia 2 lần" full />
                  </Grid>
                </section>

                {/* 2. Châm cứu */}
                <section className="rounded-xl border border-sky-400/30 bg-sky-400/5 p-4">
                  <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-sky-300">② Phác đồ châm cứu</div>
                  <Grid>
                    <Area label="Huyệt chủ" v={b4.chamCuu.huyetChinh} on={(v) => setB4({ ...b4, chamCuu: { ...b4.chamCuu, huyetChinh: v } })} placeholder="Bách hội, Phong trì, Thái xung…" />
                    <Area label="Huyệt phối" v={b4.chamCuu.huyetPhoi} on={(v) => setB4({ ...b4, chamCuu: { ...b4.chamCuu, huyetPhoi: v } })} placeholder="Hợp cốc, Tam âm giao…" />
                    <Select label="Thủ pháp" v={b4.chamCuu.thuPhap} on={(v) => setB4({ ...b4, chamCuu: { ...b4.chamCuu, thuPhap: v } })} opts={["", "Bổ", "Tả", "Bình bổ bình tả"]} />
                    <Select label="Kỹ thuật" v={b4.chamCuu.kyThuat} on={(v) => setB4({ ...b4, chamCuu: { ...b4.chamCuu, kyThuat: v } })} opts={["", "Hào châm", "Điện châm", "Cứu ngải", "Nhĩ châm", "Châm + Cứu"]} />
                    <Field label="Lưu kim (phút)" v={b4.chamCuu.luuKim} on={(v) => setB4({ ...b4, chamCuu: { ...b4.chamCuu, luuKim: v } })} placeholder="20–30" />
                    <Field label="Liệu trình" v={b4.chamCuu.lieuTrinh} on={(v) => setB4({ ...b4, chamCuu: { ...b4.chamCuu, lieuTrinh: v } })} placeholder="Ngày 1 lần × 10 ngày" />
                  </Grid>
                </section>

                {/* 3. Đơn YHHĐ */}
                <section className="rounded-xl border border-primary/30 bg-primary/5 p-4">
                  <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-primary">③ Đơn YHHĐ (kết hợp / song trị)</div>
                  <Grid>
                    <IcdAutocomplete label="Chẩn đoán YHHĐ" v={b4.yhhd.chanDoan} on={(v) => setB4({ ...b4, yhhd: { ...b4.yhhd, chanDoan: v } })} />
                    <Area label="Cận lâm sàng đề xuất" v={b4.yhhd.canLamSang} on={(v) => setB4({ ...b4, yhhd: { ...b4.yhhd, canLamSang: v } })} placeholder="ECG, sinh hóa máu, lipid…" />
                    <DrugListEditor
                      label="Thuốc tân dược (gợi ý + cảnh báo tương tác/quá liều)"
                      v={b4.yhhd.thuoc}
                      on={(v) => setB4({ ...b4, yhhd: { ...b4.yhhd, thuoc: v } })}
                      allergies={b0.diUngThuoc}
                      chanDoan={b4.yhhd.chanDoan || b0.chanDoanYHHD}
                      tienSu={b0.tienSuBenh}
                      age={b0.year}
                      gender={b0.gender}
                      full
                    />
                    <Area label="Ghi chú / Hướng dẫn" v={b4.yhhd.ghiChu} on={(v) => setB4({ ...b4, yhhd: { ...b4.yhhd, ghiChu: v } })} full />
                  </Grid>
                </section>
              </div>
            </Panel>
          )}

          {step === "b5" && (
            <Panel code="B5" title="Hiệu chỉnh & Theo dõi" desc="Gia giảm, kiêng kỵ, lịch tái khám.">
              <Grid>
                <Area label="Gia giảm theo triệu chứng" v={b5.giaGiam} on={(v) => setB5({ ...b5, giaGiam: v })} />
                <Area label="Kiêng kỵ / Tương tác" v={b5.kiengKy} on={(v) => setB5({ ...b5, kiengKy: v })} />
                <Area label="Kế hoạch theo dõi" v={b5.theoDoi} on={(v) => setB5({ ...b5, theoDoi: v })} full />
              </Grid>
            </Panel>
          )}

          {step === "b6" && (
            <Panel
              code="B6"
              title="Dưỡng sinh – Thực dưỡng theo hội chứng"
              desc='Hệ thống sẽ chọn món ăn – bài thuốc phù hợp pháp trị và thiết kế thực đơn 3 cử trong ngày.'
            >
              <div className="space-y-6">
                <section className="rounded-xl border border-primary/20 bg-primary/[0.035] p-4 shadow-sm shadow-primary/5">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <div className="font-mono text-[10px] uppercase tracking-widest text-primary/75">① Nguyên tắc dưỡng sinh</div>
                    <button
                      onClick={runB6AutoFill}
                      disabled={b6AutoLoading || (!b6.nguyenTac.trim() && !b6.kieng.trim() && !b3.hoiChung.trim())}
                      className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-primary transition hover:bg-primary hover:text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40"
                      title="Đọc nguyên tắc + bối cảnh và tự điền Món ăn / Cách làm / Thực đơn 3 cử"
                    >
                      {b6AutoLoading ? "⏳ Đang sinh thực đơn…" : "✨ Sinh món + thực đơn 3 cử →"}
                    </button>
                  </div>
                  {b6AutoErr && (
                    <div className="mb-3 rounded-lg border border-destructive/40 bg-destructive/10 p-2 text-[11px] text-destructive">{b6AutoErr}</div>
                  )}
                  <Area
                    label="Nguyên tắc (ăn ấm/mát, tính vị, sinh hoạt)"
                    v={b6.nguyenTac}
                    on={(v) => setB6({ ...b6, nguyenTac: v })}
                    placeholder="Ăn ấm, tránh sống lạnh, ngủ trước 23h, dưỡng Can – bình Mộc…"
                    full
                  />
                  <Area
                    label="Thực phẩm KIÊNG (theo hội chứng + dị ứng)"
                    v={b6.kieng}
                    on={(v) => setB6({ ...b6, kieng: v })}
                    placeholder="Kiêng đồ cay nóng, rượu bia, hải sản lạnh…"
                    full
                  />
                </section>

                <section className="rounded-xl border border-accent/18 bg-accent/[0.03] p-4 shadow-sm shadow-accent/5">
                  <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-accent/75">② Món ăn – bài thuốc gợi ý</div>
                  <Grid>
                    <Area
                      label="Danh sách món (mỗi dòng 1 món + công dụng)"
                      v={b6.monAn}
                      on={(v) => setB6({ ...b6, monAn: v })}
                      placeholder="Giò heo hầm hạt sen – kiện Tỳ, an thần · Canh nhân sâm hồ đào – bổ Khí, cố Thận…"
                      full
                    />
                    <Area
                      label="Cách làm chi tiết"
                      v={b6.cachLam}
                      on={(v) => setB6({ ...b6, cachLam: v })}
                      placeholder="Vật liệu / Chuẩn bị / Cách nấu – như sách"
                      full
                    />
                  </Grid>
                </section>

                <section className="rounded-xl border border-primary/30 bg-primary/5 p-4">
                  <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-primary">③ Thực đơn mẫu – 3 cử</div>
                  <Grid>
                    <Area label="🌅 Bữa sáng" v={b6.thucDonSang} on={(v) => setB6({ ...b6, thucDonSang: v })} placeholder="Cháo hoài sơn ý dĩ + trà gừng ấm" />
                    <Area label="🌤️ Bữa trưa" v={b6.thucDonTrua} on={(v) => setB6({ ...b6, thucDonTrua: v })} placeholder="Cơm + giò heo hầm hạt sen + canh bí đỏ" />
                    <Area label="🌙 Bữa tối" v={b6.thucDonToi} on={(v) => setB6({ ...b6, thucDonToi: v })} placeholder="Cháo nhân sâm hồ đào (nhẹ, dễ tiêu)" full />
                  </Grid>

                  <div className="mt-4 rounded-lg border border-dashed border-primary/40 bg-background/40 p-3">
                    <div className="mb-3 text-xs font-semibold text-primary">✨ Định lượng & vi chất – chỉnh thông số bên dưới để tính chính xác</div>
                    <div className="grid grid-cols-2 gap-2 md:grid-cols-6">
                      {[
                        { k: "tuoi", label: "Tuổi", ph: "30", w: "" },
                        { k: "cao", label: "Cao (cm)", ph: "165", w: "" },
                        { k: "can", label: "Cân (kg)", ph: "60", w: "" },
                      ].map((f) => (
                        <label key={f.k} className="flex flex-col gap-0.5 text-[11px] text-muted-foreground">
                          {f.label}
                          <input
                            value={(mealParams as any)[f.k]}
                            onChange={(e) => setMealParams({ ...mealParams, [f.k]: e.target.value })}
                            placeholder={f.ph}
                            className="rounded border border-border bg-background px-2 py-1 text-sm text-foreground outline-none focus:border-primary"
                          />
                        </label>
                      ))}
                      <label className="flex flex-col gap-0.5 text-[11px] text-muted-foreground">
                        Giới
                        <select
                          value={mealParams.gender}
                          onChange={(e) => setMealParams({ ...mealParams, gender: e.target.value })}
                          className="rounded border border-border bg-background px-2 py-1 text-sm text-foreground outline-none focus:border-primary"
                        >
                          <option value="">–</option>
                          <option value="Nam">Nam</option>
                          <option value="Nữ">Nữ</option>
                        </select>
                      </label>
                      <label className="flex flex-col gap-0.5 text-[11px] text-muted-foreground">
                        Vận động
                        <select
                          value={mealParams.activity}
                          onChange={(e) => setMealParams({ ...mealParams, activity: e.target.value })}
                          className="rounded border border-border bg-background px-2 py-1 text-sm text-foreground outline-none focus:border-primary"
                        >
                          <option value="1.2">Tĩnh tại (1.2)</option>
                          <option value="1.3">Nhẹ (1.3)</option>
                          <option value="1.5">Vừa (1.5)</option>
                          <option value="1.7">Nặng (1.7)</option>
                        </select>
                      </label>
                      <label className="flex flex-col gap-0.5 text-[11px] text-muted-foreground">
                        Mục tiêu
                        <select
                          value={mealParams.goal}
                          onChange={(e) => setMealParams({ ...mealParams, goal: e.target.value })}
                          className="rounded border border-border bg-background px-2 py-1 text-sm text-foreground outline-none focus:border-primary"
                        >
                          <option value="duy_tri">Duy trì</option>
                          <option value="giam_can">Giảm cân</option>
                          <option value="tang_can">Tăng cân</option>
                          <option value="tang_co">Tăng cơ</option>
                        </select>
                      </label>
                    </div>

                    <div className="mt-3 flex items-center justify-end">
                      <button
                        onClick={runMealAnalyzer}
                        disabled={mealLoading}
                        className="rounded-full bg-gradient-to-r from-primary to-accent px-4 py-1.5 text-xs font-semibold text-primary-foreground shadow-md transition hover:opacity-90 disabled:opacity-50"
                      >
                        {mealLoading ? "⏳ Đang tính…" : "🥗 Phân tích kcal · P/L/G · vi chất"}
                      </button>
                    </div>

                    {mealErr && <div className="mt-2 rounded bg-red-100 px-2 py-1 text-xs text-red-800">{mealErr}</div>}
                    {(mealPlan || mealOut) && (
                      <div className="mt-4 overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-br from-card via-background to-primary/5 shadow-[0_8px_30px_-12px_color-mix(in_oklab,var(--primary)_30%,transparent)]">
                        <div className="flex items-center justify-between gap-3 border-b border-primary/20 bg-gradient-to-r from-primary/15 via-primary/8 to-transparent px-5 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">🥗</span>
                            <div>
                              <div className="font-display text-sm font-semibold text-primary">Phân tích dinh dưỡng cá thể hoá</div>
                              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">YHCT + Lâm sàng</div>
                            </div>
                          </div>
                          <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-primary">kcal · P/L/G · vi chất</span>
                        </div>
                        <div className="px-5 py-4">
                          {mealPlan ? (
                            <MealPlanView plan={mealPlan} />
                          ) : (
                            <article className="prose prose-sm max-w-none prose-headings:font-display prose-headings:text-primary prose-strong:text-primary">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>{mealOut}</ReactMarkdown>
                            </article>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </Panel>
          )}

          {step === "b7" && (
            <Panel
              code="B7"
              title="Chốt hồ sơ · Ký số & In"
              desc="Bác sĩ xác nhận kết luận cuối cùng, ký số để KHOÁ hồ sơ (không sửa được nữa). Hệ thống tự sinh Báo cáo tổng hợp + Đơn thuốc và cho phép in trực tiếp hoặc xuất Word."
            >
              <div className="space-y-6">
                {/* Thông tin bác sĩ ký */}
                <section className="rounded-xl border border-primary/25 bg-primary/5 p-4">
                  <div className="mb-3 font-mono text-[10px] uppercase tracking-widest text-primary">① Bác sĩ ký chốt</div>
                  <Grid>
                    <Field label="Họ tên bác sĩ" v={chot.doctorName} on={(v) => setChot({ ...chot, doctorName: v })} placeholder="BS. Nguyễn Văn A" />
                    <Field label="Số Chứng chỉ hành nghề" v={chot.doctorLicense} on={(v) => setChot({ ...chot, doctorLicense: v })} placeholder="CCHN 001234/BYT-CCHN" />
                    <Field label="Cơ sở KCB" v={chot.coSo} on={(v) => setChot({ ...chot, coSo: v })} placeholder="Phòng chẩn trị YHCT ..." full />
                    <Area label="Kết luận cuối cùng của bác sĩ" v={chot.ketLuan} on={(v) => setChot({ ...chot, ketLuan: v })} placeholder="Tóm tắt chẩn đoán chính, hướng điều trị, tiên lượng, hẹn tái khám..." full />
                  </Grid>

                  {signErr && (
                    <div className="mt-3 rounded-lg border border-destructive/40 bg-destructive/10 p-2 text-[12px] text-destructive">{signErr}</div>
                  )}

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    {!chot.locked ? (
                      <button
                        type="button"
                        onClick={signAndLock}
                        disabled={signing}
                        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition hover:scale-[1.02] disabled:opacity-60"
                      >
                        🔒 {signing ? "Đang ký số…" : "Ký số & Khoá hồ sơ"}
                      </button>
                    ) : (
                      <>
                        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/50 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-accent">
                          ✅ Đã ký số · Hồ sơ đã khoá
                        </div>
                        <button
                          type="button"
                          onClick={unlock}
                          className="rounded-full border border-border bg-card/60 px-4 py-2 text-xs text-muted-foreground hover:text-foreground"
                        >
                          🔓 Mở khoá để sửa
                        </button>
                      </>
                    )}
                    <button
                      type="button"
                      onClick={printReport}
                      disabled={!chot.locked}
                      className="rounded-full border border-accent/40 bg-accent/10 px-5 py-2 text-sm font-semibold text-accent transition hover:bg-accent/20 disabled:opacity-40"
                      title={chot.locked ? "In Báo cáo + Đơn thuốc" : "Cần ký số trước khi in"}
                    >
                      🖨️ In báo cáo & đơn thuốc
                    </button>
                    <button
                      type="button"
                      onClick={exportWord}
                      className="rounded-full border border-border bg-card/50 px-5 py-2 text-sm transition hover:bg-card"
                    >
                      📄 Xuất Word (.docx)
                    </button>
                  </div>

                  {chot.locked && (
                    <div className="mt-4 grid gap-2 rounded-lg border border-emerald-400/25 bg-primary/8 p-3 font-mono text-[11px] text-cyan-200 md:grid-cols-2">
                      <div><span className="text-cyan-400/70">Số hồ sơ:</span> {chot.soHoSo}</div>
                      <div><span className="text-cyan-400/70">Thời điểm ký:</span> {new Date(chot.signedAt).toLocaleString("vi-VN")}</div>
                      <div className="md:col-span-2 break-all"><span className="text-cyan-400/70">SHA-256:</span> {chot.signatureHash}</div>
                    </div>
                  )}
                </section>

                {/* Preview báo cáo */}
                <FinalReportPreview b0={b0} b1={b1} b1y={b1y} b2={b2} b3={b3} b4={b4} b5={b5} b6={b6} chot={chot} />
              </div>
            </Panel>
          )}
          </fieldset>




          {/* Analysis output */}
          {(err || aiOut || citations.length > 0) && (
            <div className="mt-6 border-t border-border/60 pt-6">
              <div className="mb-3 flex items-center justify-between">
                <div className="font-mono text-[10px] uppercase tracking-widest text-accent">
                  Kết quả phân tích · {STEPS[idx].label}
                </div>
                <button
                  onClick={runAI}
                  disabled={loading}
                  className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent transition hover:bg-accent/20 disabled:opacity-50"
                >
                  {loading ? "⏳ Đang phân tích…" : "↻ Phân tích lại"}
                </button>
              </div>
              {err && (
                <div className="mb-3 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">{err}</div>
              )}
              {aiOut && (
                <article className="prose prose-invert max-w-none rounded-xl border border-border/60 bg-background/40 p-5 prose-headings:font-display prose-headings:text-accent prose-strong:text-foreground">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({ className, children, ...props }: any) {
                        const lang = /language-(\w+)/.exec(className || "")?.[1];
                        const text = String(children).replace(/\n$/, "");
                        if (lang === "mermaid") return <Mermaid code={text} />;
                        return <code className={className} {...props}>{children}</code>;
                      },
                    }}
                  >
                    {aiOut}
                  </ReactMarkdown>
                </article>
              )}
              {/* citations dùng nội bộ – KHÔNG hiển thị nội dung/tên nguồn ra UI */}
            </div>
          )}

          {/* Nav */}
          <div className="mt-8 flex items-center justify-between border-t border-border/60 pt-5">
            <button
              onClick={() => { if (b0.name.trim()) saveCurrent(); go(idx - 1); }}
              disabled={idx === 0}
              className="rounded-full border border-border bg-card/50 px-5 py-2 text-sm transition hover:bg-card disabled:opacity-40"
            >
              ← Quay lại
            </button>
            <div className="font-mono text-[11px] text-muted-foreground">
              {STEPS[idx].code} · {STEPS[idx].label}
            </div>
            <button
              onClick={() => { if (b0.name.trim()) saveCurrent(); go(idx + 1); }}
              disabled={idx === STEPS.length - 1}
              className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-40"
            >
              Tiếp tục →
            </button>
          </div>
        </div>
          </div>
        </div>
      </section>


      {showCompare && compareIds.length === 2 && (
        <CompareModal
          a={records.find((r) => r.id === compareIds[0])!}
          b={records.find((r) => r.id === compareIds[1])!}
          onClose={() => setShowCompare(false)}
        />
      )}
    </div>
  );
}

function CompareModal({ a, b, onClose }: { a: RecordItem; b: RecordItem; onClose: () => void }) {
  const rows: { k: string; av: string; bv: string }[] = [
    { k: "Bệnh nhân", av: `${a.b0.name} · ${a.b0.year} · ${a.b0.gender}`, bv: `${b.b0.name} · ${b.b0.year} · ${b.b0.gender}` },
    { k: "Ngày khám", av: a.b0.date, bv: b.b0.date },
    { k: "Triệu chứng chính", av: a.b1.chief, bv: b.b1.chief },
    { k: "Lưỡi · Mạch", av: `${a.b1.tongue} · ${a.b1.pulse}`, bv: `${b.b1.tongue} · ${b.b1.pulse}` },
    { k: "Bát cương", av: a.b2.bat, bv: b.b2.bat },
    { k: "Tạng phủ", av: a.b2.tang, bv: b.b2.tang },
    { k: "Hội chứng", av: a.b3.hoiChung, bv: b.b3.hoiChung },
    { k: "Pháp trị", av: a.b3.phap, bv: b.b3.phap },
    { k: "Phương dược", av: a.b4.phuong, bv: b.b4.phuong },
    { k: "Vị thuốc", av: a.b4.vi, bv: b.b4.vi },
    { k: "Gia giảm", av: a.b5.giaGiam, bv: b.b5.giaGiam },
  ];
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="glass max-h-[90vh] w-full max-w-5xl overflow-auto rounded-2xl p-6" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-accent">So sánh 2 phiên biện chứng</div>
            <h3 className="mt-1 font-display text-2xl">Đối chiếu kết luận</h3>
          </div>
          <button onClick={onClose} className="rounded-full border border-border bg-card/50 px-3 py-1 text-sm">Đóng ✕</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 text-left font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                <th className="w-40 py-2 pr-3">Mục</th>
                <th className="py-2 pr-3 text-accent">A · {new Date(a.savedAt).toLocaleString("vi-VN")}</th>
                <th className="py-2 text-primary">B · {new Date(b.savedAt).toLocaleString("vi-VN")}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const diff = (r.av || "").trim() !== (r.bv || "").trim();
                return (
                  <tr key={r.k} className={`border-b border-border/40 align-top ${diff ? "bg-accent/5" : ""}`}>
                    <td className="py-2 pr-3 font-mono text-[11px] text-muted-foreground">{r.k}</td>
                    <td className="py-2 pr-3 text-foreground">{r.av || <span className="text-muted-foreground">–</span>}</td>
                    <td className="py-2 text-foreground">{r.bv || <span className="text-muted-foreground">–</span>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-3 font-mono text-[10px] text-muted-foreground">
          Các dòng được tô sáng là phần khác biệt giữa 2 phiên.
        </div>
      </div>
    </div>
  );
}

/* ===================== FINAL REPORT PREVIEW (in được) ===================== */
function FinalReportPreview({
  b0, b1, b1y, b2, b3, b4, b5, b6, chot,
}: {
  b0: HoSo; b1: LamSang; b1y: LamSangYHHD; b2: DanhGia; b3: BienChung; b4: GoiYToa; b5: HieuChinh; b6: DuongSinh; chot: ChotHoSo;
}) {
  const age = b0.year ? String(Math.max(0, new Date().getFullYear() - Number(b0.year))) : "";
  const vitals = [
    b1y.mach && `M ${b1y.mach}`, b1y.ha && `HA ${b1y.ha}`, b1y.nhipTho && `NT ${b1y.nhipTho}`,
    b1y.nhietDo && `T° ${b1y.nhietDo}`, b1y.spo2 && `SpO₂ ${b1y.spo2}`,
    b1y.canNang && `${b1y.canNang}kg`, b1y.chieuCao && `${b1y.chieuCao}cm`,
  ].filter(Boolean).join(" · ");

  const Row = ({ label, value }: { label: string; value?: string }) => (
    <div className="grid grid-cols-[140px_1fr] gap-3 py-1 print:py-0.5">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground print:text-foreground">{label}</div>
      <div className="whitespace-pre-wrap text-sm print:text-foreground">{value?.trim() ? value : "–"}</div>
    </div>
  );

  return (
    <>
      <section id="print-area" className="rounded-xl border border-border/60 bg-background/40 p-6 print:border-0 print:bg-white print:p-0 print:text-foreground">
        <div className="print-header hidden print:block">
          <div className="text-center">
            <div className="text-xs uppercase">{chot.coSo || "PHÒNG CHẨN TRỊ Y HỌC CỔ TRUYỀN"}</div>
            <h1 className="mt-1 text-2xl font-bold">BÁO CÁO KHÁM BỆNH & ĐƠN THUỐC</h1>
            <div className="mt-0.5 text-xs">Số hồ sơ: <b>{chot.soHoSo || "–"}</b> · Ngày: {b0.date || "–"}</div>
          </div>
          <hr className="my-3 border-black" />
        </div>

        <div className="mb-4 flex items-center justify-between print:hidden">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-accent">② Xem trước Báo cáo & Đơn thuốc</div>
            <h3 className="mt-1 font-display text-xl">Bản in chính thức</h3>
          </div>
          {chot.locked && (
            <span className="rounded-full border border-accent/40 bg-cyan-400/10 px-3 py-1 font-mono text-[10px] uppercase text-accent">
              Đã khoá
            </span>
          )}
        </div>

        {/* PHẦN 1 – Hành chính */}
        <h4 className="mb-1 border-b border-border/50 pb-1 font-display text-base font-semibold text-primary print:text-black print:border-black">
          I. Hành chính bệnh nhân
        </h4>
        <div className="mb-4 grid gap-x-6 md:grid-cols-2">
          <Row label="Họ tên" value={b0.name} />
          <Row label="Năm sinh" value={b0.year + (age ? ` (${age} tuổi)` : "")} />
          <Row label="Giới tính" value={b0.gender} />
          <Row label="Ngày khám" value={b0.date} />
          <Row label="Địa chỉ" value={b0.address} />
          <Row label="Tiền sử" value={b0.tienSuBenh} />
          <Row label="Dị ứng thuốc" value={b0.diUngThuoc} />
          <Row label="Thuốc đang dùng" value={b0.thuocDangDung} />
        </div>

        {/* PHẦN 2 – Lâm sàng */}
        <h4 className="mb-1 border-b border-border/50 pb-1 font-display text-base font-semibold text-primary print:text-black print:border-black">
          II. Lâm sàng
        </h4>
        <div className="mb-4">
          <Row label="Lý do khám" value={b1.chief} />
          <Row label="Sinh hiệu" value={vitals} />
          <Row label="Tứ chẩn" value={[b1.vong && `Vọng: ${b1.vong}`, b1.van && `Văn: ${b1.van}`, b1.vanQ && `Vấn: ${b1.vanQ}`, b1.thiet && `Thiết: ${b1.thiet}`].filter(Boolean).join(" · ")} />
          <Row label="Lưỡi · Mạch" value={[b1.tongue, b1.pulse].filter(Boolean).join(" · ")} />
          <Row label="CLS đã có" value={b1y.canLamSangCo} />
        </div>

        {/* PHẦN 3 – Biện chứng */}
        <h4 className="mb-1 border-b border-border/50 pb-1 font-display text-base font-semibold text-primary print:text-black print:border-black">
          III. Chẩn đoán & Biện chứng
        </h4>
        <div className="mb-4">
          <Row label="Chẩn đoán YHHĐ" value={b4.yhhd.chanDoan || b0.chanDoanYHHD} />
          <Row label="Bát cương" value={b2.bat} />
          <Row label="Tạng phủ · Khí huyết" value={[b2.tang, b2.khi].filter(Boolean).join(" · ")} />
          <Row label="Hội chứng YHCT" value={b3.hoiChung} />
          <Row label="Pháp trị" value={b3.phap} />
          <Row label="Bát pháp" value={b3.batPhap} />
          {b3.lyLuan && (
            <div className="mt-2 rounded-md border border-sky-400/40 bg-sky-50/40 p-3 print:border-black print:bg-white">
              <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-sky-700 print:text-foreground">Lý luận YHCT (biện chứng luận trị)</div>
              <div className="whitespace-pre-wrap text-[12.5px] leading-relaxed text-foreground print:text-foreground">{b3.lyLuan}</div>
            </div>
          )}
        </div>

        {/* PHẦN 4 – ĐƠN THUỐC */}
        <div className="mt-4 rounded-lg border-2 border-primary/40 p-4 print:border-black print:border">
          <div className="mb-2 text-center">
            <div className="font-display text-lg font-bold text-primary print:text-foreground">ĐƠN THUỐC</div>
            <div className="text-[11px] text-muted-foreground print:text-foreground">
              Số: <b>{chot.soHoSo || "–"}</b> · Ngày kê: {b0.date || "–"}
            </div>
          </div>

          {b4.phuong || b4.vi ? (
            <>
              <div className="mt-3 text-sm font-semibold text-primary print:text-foreground">A. Phương thuốc YHCT</div>
              <Row label="Tên phương" value={b4.phuong} />
              <Row label="Vị thuốc" value={b4.vi} />
              <Row label="Liều · Số thang" value={b4.lieu} />
              <Row label="Cách dùng" value={b4.cachDung} />
            </>
          ) : null}

          {b4.chamCuu.huyetChinh || b4.chamCuu.huyetPhoi ? (
            <>
              <div className="mt-3 text-sm font-semibold text-primary print:text-foreground">B. Châm cứu</div>
              <Row label="Huyệt chủ" value={b4.chamCuu.huyetChinh} />
              <Row label="Huyệt phối" value={b4.chamCuu.huyetPhoi} />
              <Row label="Thủ pháp · Kỹ thuật" value={[b4.chamCuu.thuPhap, b4.chamCuu.kyThuat].filter(Boolean).join(" · ")} />
              <Row label="Lưu kim · Liệu trình" value={[b4.chamCuu.luuKim && `${b4.chamCuu.luuKim}′`, b4.chamCuu.lieuTrinh].filter(Boolean).join(" · ")} />
            </>
          ) : null}

          {b4.yhhd.thuoc ? (
            <>
              <div className="mt-3 text-sm font-semibold text-primary print:text-foreground">C. Thuốc tân dược (YHHĐ)</div>
              <Row label="Thuốc" value={b4.yhhd.thuoc} />
              <Row label="Cận lâm sàng đề xuất" value={b4.yhhd.canLamSang} />
              <Row label="Ghi chú" value={b4.yhhd.ghiChu} />
            </>
          ) : null}

          <div className="mt-3">
            <div className="text-sm font-semibold text-primary print:text-foreground">D. Hiệu chỉnh & Dặn dò</div>
            <Row label="Gia giảm" value={b5.giaGiam} />
            <Row label="Kiêng kỵ" value={b5.kiengKy} />
            <Row label="Theo dõi · Tái khám" value={b5.theoDoi} />
            {(b6.nguyenTac || b6.kieng) && <Row label="Dưỡng sinh" value={[b6.nguyenTac, b6.kieng && `Kiêng: ${b6.kieng}`].filter(Boolean).join(" · ")} />}
          </div>
        </div>

        {/* PHẦN 5 – Kết luận & chữ ký */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <div className="text-sm font-semibold text-primary print:text-foreground">Kết luận của bác sĩ</div>
            <div className="mt-1 whitespace-pre-wrap text-sm print:text-foreground">{chot.ketLuan || "–"}</div>
          </div>
          <div className="text-center">
            <div className="text-[11px] text-muted-foreground print:text-foreground">
              {b0.address ? "" : ""}Ngày {new Date(chot.signedAt || Date.now()).toLocaleDateString("vi-VN")}
            </div>
            <div className="mt-1 text-sm font-semibold text-primary print:text-foreground">BÁC SĨ ĐIỀU TRỊ</div>
            <div className="text-[10px] text-muted-foreground print:text-foreground">(Ký, ghi rõ họ tên)</div>
            <div className="mt-10 text-base font-bold print:text-foreground">{chot.doctorName || "–"}</div>
            <div className="text-[11px] text-muted-foreground print:text-foreground">CCHN: {chot.doctorLicense || "–"}</div>
            {chot.locked && (
              <div className="mt-3 inline-block rounded border border-cyan-500/50 bg-cyan-950/30 px-2 py-1 font-mono text-[9px] text-cyan-200 print:border-black print:bg-white print:text-foreground">
                ✔ ĐÃ KÝ SỐ · {new Date(chot.signedAt).toLocaleString("vi-VN")}
                <br />SHA-256: {chot.signatureHash.slice(0, 32)}…
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 text-center text-[10px] text-muted-foreground print:text-foreground">
          Hồ sơ được ký số bằng thuật toán SHA-256; mọi chỉnh sửa sau ký sẽ vô hiệu hoá chữ ký.
        </div>
      </section>
    </>
  );
}

function Panel({ code, title, desc, children }: { code: string; title: string; desc: string; children: ReactNode }) {
  return (
    <div>
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-xs text-accent">{code}</span>
        <h2 className="font-display text-2xl md:text-3xl">{title}</h2>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
      <div className="mt-5 space-y-4">{children}</div>
    </div>
  );
}

function Grid({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 md:grid-cols-2">{children}</div>;
}

function Field({
  label, v, on, type = "text", placeholder, full,
}: { label: string; v: string; on: (v: string) => void; type?: string; placeholder?: string; full?: boolean }) {
  return (
    <label className={`block ${full ? "md:col-span-2" : ""}`}>
      <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
      <input
        type={type}
        value={v}
        onChange={(e) => on(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-border bg-background/50 px-3 py-2 text-sm outline-none transition focus:border-accent/60 focus:ring-2 focus:ring-accent/20"
      />
    </label>
  );
}

function Select({ label, v, on, opts }: { label: string; v: string; on: (v: string) => void; opts: string[] }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
      <select
        value={v}
        onChange={(e) => on(e.target.value)}
        className="w-full rounded-lg border border-border bg-background/50 px-3 py-2 text-sm outline-none transition focus:border-accent/60 focus:ring-2 focus:ring-accent/20"
      >
        <option value="">-- Chọn --</option>
        {opts.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}

function Area({
  label, v, on, placeholder, full,
}: { label: string; v: string; on: (v: string) => void; placeholder?: string; full?: boolean }) {
  return (
    <label className={`block ${full ? "md:col-span-2" : ""}`}>
      <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
      <textarea
        value={v}
        onChange={(e) => on(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full rounded-lg border border-border bg-background/50 px-3 py-2 text-sm outline-none transition focus:border-accent/60 focus:ring-2 focus:ring-accent/20"
      />
    </label>
  );
}

/* ===================== Autocomplete ICD-10 ===================== */
function IcdAutocomplete({
  label, v, on, full,
}: { label: string; v: string; on: (v: string) => void; full?: boolean }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  // Lấy phần sau dấu phẩy cuối cùng → cho phép thêm nhiều bệnh danh, mỗi cái sau dấu ", "
  const lastSeg = (s: string) => {
    const i = s.lastIndexOf(",");
    return i >= 0 ? s.slice(i + 1).trim() : s.trim();
  };
  const activeQuery = q || lastSeg(v);
  const hits = useMemo(() => searchIcd(activeQuery, 10), [activeQuery]);
  const pick = (code: string, name: string) => {
    const entry = `${code} – ${name}`;
    const i = v.lastIndexOf(",");
    // Sau khi chọn → thêm ", " để bác sĩ gõ tiếp mã bệnh kế tiếp
    if (i >= 0) {
      on(`${v.slice(0, i + 1)} ${entry}, `);
    } else {
      on(`${entry}, `);
    }
    setQ("");
    setOpen(false);
  };
  return (
    <label className={`relative block ${full ? "md:col-span-2" : ""}`}>
      <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
      <textarea
        value={v}
        onChange={(e) => {
          const val = e.target.value;
          on(val);
          setQ(lastSeg(val));
          setOpen(true);
        }}
        onFocus={() => { setQ(lastSeg(v)); setOpen(true); }}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
        placeholder="Gõ tên/mã (VD: viêm họng, I10, đtđ…) – ngăn cách nhiều mã bằng dấu phẩy"
        rows={2}
        className="w-full rounded-lg border border-border bg-background/50 px-3 py-2 text-sm outline-none transition focus:border-accent/60 focus:ring-2 focus:ring-accent/20"
      />
      {open && hits.length > 0 && (
        <div className="absolute z-30 mt-1 max-h-72 w-full overflow-y-auto rounded-lg border border-accent/40 bg-card/95 shadow-xl backdrop-blur">
          {hits.map((it) => (
            <button
              key={it.code}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); pick(it.code, it.name); }}
              className="flex w-full items-start gap-2 border-b border-border/40 px-3 py-2 text-left text-xs transition hover:bg-accent/15"
            >
              <span className="rounded bg-primary/20 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-primary">{it.code}</span>
              <span className="flex-1">{it.name}</span>
            </button>
          ))}
        </div>
      )}
    </label>
  );
}

/* ===================== Drug List Editor ===================== */
function DrugListEditor({
  label, v, on, allergies, chanDoan, tienSu, age, gender, full,
}: {
  label: string; v: string; on: (v: string) => void;
  allergies?: string; chanDoan?: string; tienSu?: string;
  age?: string; gender?: string; full?: boolean;
}) {
  const analyzeFn = useServerFn(analyzeDrugRx);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState<{ idx: number; line: string; msgs: { level: "high" | "warn" | "ok"; text: string }[] } | null>(null);
  const [aiOut, setAiOut] = useState<string>("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiErr, setAiErr] = useState<string | null>(null);
  const lines = v.split("\n").map((s) => s.trim()).filter(Boolean);
  const parsed = useMemo(() => lines.map(parseDrugLine), [v]);
  const interactions = useMemo(() => findInteractions(parsed), [parsed]);
  const hits = useMemo(() => searchDrug(q, 10), [q]);

  const allergySet = useMemo(() => {
    const a = (allergies || "").toLowerCase();
    return parsed.map((p) => p.drug && a && a.includes(p.drug.name.toLowerCase()));
  }, [allergies, parsed]);

  const runAI = async () => {
    if (!v.trim()) return;
    setAiErr(null); setAiLoading(true);
    try {
      const { content } = await analyzeFn({ data: {
        drugs: v, chanDoan, tienSu, diUng: allergies, age, gender,
      }});
      setAiOut(content);
    } catch (e) {
      setAiErr(e instanceof Error ? e.message : "Lỗi hệ thống");
    } finally { setAiLoading(false); }
  };

  // Auto-analyze sau 1.5s không gõ (debounce)
  useEffect(() => {
    if (!v.trim()) { setAiOut(""); return; }
    const t = window.setTimeout(() => { runAI(); }, 1500);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [v, chanDoan, tienSu, allergies]);


  const addDrug = (d: DrugItem) => {
    const newLine = `${d.name} ${d.defaultDose}`;
    on(v ? `${v.trimEnd()}\n${newLine}` : newLine);
    setQ("");
    setOpen(false);
  };
  const updateLine = (i: number, text: string) => {
    const next = [...lines];
    next[i] = text;
    on(next.join("\n"));
  };
  const removeLine = (i: number) => on(lines.filter((_, j) => j !== i).join("\n"));

  const nameOf = (key: string) => parsed.find((p) => p.drug?.key === key)?.drug?.name || key;
  const otherName = (it: InteractionFinding, currentIndex: number) => {
    const [aIndex, bIndex] = it.indices;
    if (currentIndex === aIndex) return it.drugs[1]?.name || nameOf(it.pair[1]);
    if (currentIndex === bIndex) return it.drugs[0]?.name || nameOf(it.pair[0]);
    return it.drugs.map((d) => d.name).join(" + ");
  };
  const interactionFor = (index: number) =>
    interactions.filter((it) => it.indices[0] === index || it.indices[1] === index);

  // Kiểm tra 1 dòng → trả về danh sách vi phạm nguyên tắc kê đơn
  const checkLine = (i: number) => {
    const p = parsed[i];
    if (!p) return;
    const msgs: { level: "high" | "warn" | "ok"; text: string }[] = [];
    if (allergySet[i]) msgs.push({ level: "high", text: `⛔ DỊ ỨNG: bệnh nhân đã ghi nhận dị ứng với ${p.drug?.name} (xem B0).` });
    if (p.overdose && p.drug?.maxDailyMg) {
      msgs.push({ level: "high", text: `⚠ QUÁ LIỀU: ∑ ${p.totalPerDay?.toFixed(p.totalPerDay! < 1 ? 3 : 0)}${p.drug.unit}/24h vượt ngưỡng tối đa ${p.drug.maxDailyMg}${p.drug.unit}/24h.` });
    }
    interactionFor(i).forEach((it) => {
      const other = otherName(it, i);
      msgs.push({
        level: it.interaction.level === "high" ? "high" : "warn",
        text: `⚠ TƯƠNG TÁC ${it.interaction.level === "high" ? "CAO" : "TB"} với ${other}: ${it.interaction.note}`,
      });
    });
    if (p.drug?.warn) msgs.push({ level: "warn", text: `⚠ Lưu ý: ${p.drug.warn}` });
    if (!p.drug && p.raw) msgs.push({ level: "warn", text: `❓ Không khớp DB – nhập tự do, không thể kiểm tra liều/tương tác.` });
    if (msgs.length === 0) msgs.push({ level: "ok", text: "✓ Hợp lệ – không phát hiện vi phạm nguyên tắc kê đơn." });
    setAlert({ idx: i, line: p.raw, msgs });
    const ttl = msgs.some((m) => m.level === "high") ? 10000 : msgs[0].level === "ok" ? 2500 : 7000;
    window.setTimeout(() => setAlert((a) => (a && a.idx === i && a.line === p.raw ? null : a)), ttl);
  };

  return (
    <div className={`${full ? "md:col-span-2" : ""}`}>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
        {interactions.length > 0 && (
          <span className="rounded-full bg-red-500/15 px-2 py-0.5 font-mono text-[10px] font-semibold text-red-400">
            ⚠ {interactions.length} tương tác
          </span>
        )}
      </div>

      {/* 🚨 BANNER TỔNG CẢNH BÁO – hiển thị NGAY khi toa có tương tác */}
      {interactions.length > 0 && (() => {
        const highs = interactions.filter((it) => it.interaction.level === "high");
        const meds = interactions.filter((it) => it.interaction.level !== "high");
        return (
          <div
            role="alert"
            className={`mb-3 overflow-hidden rounded-xl border-2 shadow-lg ${
              highs.length > 0
                ? "border-red-500/70 bg-red-500/15 animate-pulse"
                : "border-amber-500/70 bg-amber-500/10"
            }`}
          >
            <div className={`flex items-center gap-2 px-3 py-2 ${highs.length > 0 ? "bg-red-500/25" : "bg-amber-500/20"}`}>
              <span className="text-lg leading-none">{highs.length > 0 ? "🚨" : "⚠️"}</span>
              <span className="font-mono text-[11px] font-black uppercase tracking-widest text-foreground">
                CẢNH BÁO TOA · {highs.length > 0 && <span className="text-red-300">{highs.length} tương tác NGUY CƠ CAO</span>}
                {highs.length > 0 && meds.length > 0 && " · "}
                {meds.length > 0 && <span className="text-amber-200">{meds.length} trung bình</span>}
              </span>
            </div>
            <ul className="divide-y divide-white/10">
              {interactions.slice(0, 6).map((it, idx) => {
                const high = it.interaction.level === "high";
                return (
                  <li key={idx} className="flex items-start gap-2 px-3 py-2 text-[12px]">
                    <span className={`mt-0.5 rounded px-1.5 py-0.5 font-mono text-[10px] font-bold ${
                      high ? "bg-red-500/40 text-red-100" : "bg-amber-500/30 text-amber-100"
                    }`}>
                      {high ? "CAO" : "TB"}
                    </span>
                    <span className="flex-1">
                      <span className="font-bold text-foreground">{it.drugs[0]?.name || nameOf(it.pair[0])}</span>
                      <span className="mx-1 text-muted-foreground">×</span>
                      <span className="font-bold text-foreground">{it.drugs[1]?.name || nameOf(it.pair[1])}</span>
                      <span className={`ml-2 ${high ? "text-red-100" : "text-amber-100"}`}>— {it.interaction.note}</span>
                    </span>
                  </li>
                );
              })}
              {interactions.length > 6 && (
                <li className="px-3 py-1.5 text-center text-[11px] text-muted-foreground">
                  … và {interactions.length - 6} cảnh báo khác bên dưới
                </li>
              )}
            </ul>
          </div>
        );
      })()}


      {/* Search bar */}
      <div className="relative mb-2">
        <input
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
          placeholder="🔍 Gõ tên hoạt chất / biệt dược (VD: amlodipin, augmentin, panadol…)"
          className="w-full rounded-lg border border-accent/40 bg-background/50 px-3 py-2 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
        {open && hits.length > 0 && (
          <div className="absolute z-30 mt-1 max-h-72 w-full overflow-y-auto rounded-lg border border-accent/40 bg-card/95 shadow-xl backdrop-blur">
            {hits.map((d) => (
              <button
                key={d.key}
                type="button"
                onMouseDown={(e) => { e.preventDefault(); addDrug(d); }}
                className="flex w-full items-start gap-2 border-b border-border/40 px-3 py-2 text-left text-xs transition hover:bg-accent/15"
              >
                <span className="rounded bg-accent/20 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-accent">+</span>
                <span className="flex-1">
                  <div className="font-semibold text-foreground">{d.name} {d.brand && <span className="text-muted-foreground">· {d.brand}</span>}</div>
                  <div className="text-[12px] font-medium text-foreground/90">{d.group} · {d.defaultDose} {d.maxDailyMg ? `· max ${d.maxDailyMg}${d.unit}/24h` : ""}</div>
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Flash alert sau khi bấm Enter */}
      {alert && (
        <div className={`mb-2 rounded-lg border px-3 py-2 text-xs shadow-lg ${
          alert.msgs.some((m) => m.level === "high")
            ? "border-red-500/60 bg-red-500/15"
            : alert.msgs[0]?.level === "ok"
            ? "border-cyan-500/60 bg-cyan-950/300/10"
            : "border-sky-500/60 bg-sky-500/10"
        }`}>
          <div className="mb-1 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/80">
              Kiểm tra dòng #{alert.idx + 1}: <span className="text-accent">{alert.line}</span>
            </span>
            <button type="button" onClick={() => setAlert(null)} className="text-muted-foreground hover:text-foreground">✕</button>
          </div>
          <ul className="space-y-0.5">
            {alert.msgs.map((m, k) => (
              <li key={k} className={
                m.level === "high" ? "text-red-200 font-semibold"
                : m.level === "ok" ? "text-accent"
                : "text-sky-200"
              }>{m.text}</li>
            ))}
          </ul>
        </div>
      )}

      {/* List */}
      <div className="space-y-1.5">
        {parsed.length === 0 && (
          <div className="rounded-lg border border-dashed border-border/60 bg-background/30 px-3 py-3 text-center text-xs text-muted-foreground">
            Chưa có thuốc. Tìm và bấm để thêm. Có thể chỉnh sửa liều ngay sau khi thêm. <span className="text-accent">Bấm Enter trong ô liều để kiểm tra nguyên tắc kê đơn.</span>
          </div>
        )}
        {parsed.map((p, i) => {
          const itx = interactionFor(i);
          const hasInteraction = itx.length > 0;
          const allergy = allergySet[i];
          const overdose = p.overdose;
          const danger = hasInteraction || overdose || allergy;
          return (
            <div
              key={i}
              className={`rounded-lg border px-2.5 py-2 transition ${
                danger ? "border-red-500/50 bg-red-500/10" : "border-border bg-background/40"
              }`}
            >
              <div className="flex items-start gap-2">
                <input
                  value={p.raw}
                  onChange={(e) => updateLine(i, e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); checkLine(i); } }}
                  title="Bấm Enter để kiểm tra nguyên tắc kê đơn"
                  className={`flex-1 rounded border bg-transparent px-2 py-1 text-sm outline-none ${
                    danger ? "border-red-500/40 focus:border-red-400" : "border-border/60 focus:border-accent/60"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => removeLine(i)}
                  className="rounded border border-border/60 px-2 py-1 text-xs text-muted-foreground hover:bg-card"
                  title="Xoá"
                >
                  ✕
                </button>
              </div>

              {/* Meta + warnings */}
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[12px] font-semibold leading-snug text-foreground">
                {p.drug && (
                  <span className="rounded-md bg-white/15 px-2 py-0.5 font-mono text-foreground">
                    {p.drug.group}
                    {p.drug.maxDailyMg ? ` · max ${p.drug.maxDailyMg}${p.drug.unit}/24h` : ""}
                  </span>
                )}
                {p.totalPerDay && p.drug?.maxDailyMg && (
                  <span className={`rounded-md px-2 py-0.5 font-mono text-black ${overdose ? "bg-red-500/50" : "bg-cyan-200"}`}>
                    ∑ {p.totalPerDay.toFixed(p.totalPerDay < 1 ? 3 : 0)}{p.drug.unit}/24h
                  </span>
                )}
                {overdose && (
                  <span className="rounded-md bg-red-500/50 px-2 py-0.5 text-foreground">
                    ⚠ QUÁ LIỀU – vượt {p.drug?.maxDailyMg}{p.drug?.unit}/24h
                  </span>
                )}
                {allergy && (
                  <span className="rounded-md bg-red-400 px-2 py-0.5 text-foreground">
                    ⛔ DỊ ỨNG (theo B0)
                  </span>
                )}
                {!p.drug && p.raw && (
                  <span className="rounded-md bg-sky-200 px-2 py-0.5 text-foreground">
                    Không khớp DB – nhập tự do
                  </span>
                )}
                {p.drug?.warn && (
                  <span className="rounded-md bg-sky-100 px-2 py-0.5 text-black ring-1 ring-sky-300">
                    ⚠ {p.drug.warn}
                  </span>
                )}
                {hasInteraction && itx.map((it, k) => {
                  const other = otherName(it, i);
                  const high = it.interaction.level === "high";
                  return (
                    <span
                      key={`tt-${k}`}
                      title={it.interaction.note}
                      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-bold ring-1 ${
                        high
                          ? "bg-red-600 text-white ring-red-800 animate-pulse"
                          : "bg-amber-400 text-black ring-amber-600"
                      }`}
                    >
                      ⚠ TƯƠNG TÁC {high ? "CAO" : "TB"} · {other}
                    </span>
                  );
                })}
              </div>


              {/* Interaction notes */}
              {hasInteraction && (
                <div className="mt-2 space-y-1">
                  {itx.map((it, k) => {
                    const other = otherName(it, i);
                    return (
                      <div key={k} className="rounded-md bg-red-50 px-2.5 py-1.5 text-[13px] text-red-900 ring-1 ring-red-300">
                        <span className="font-bold">⚠ {it.interaction.level === "high" ? "Nguy cơ CAO" : "Trung bình"}</span>
                        <span className="text-red-700"> · với <b>{other}</b>:</span>{" "}
                        {it.interaction.note}
                      </div>

                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Phân tích đơn thuốc – auto + manual */}
      {v.trim() && (
        <div className="mt-4 rounded-xl border-2 border-accent/40 bg-gradient-to-br from-accent/5 to-primary/5 p-4">
          <div className="mb-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-accent/20 px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-widest text-accent">
                💊 Dược sĩ thông minh
              </span>
              <span className="text-xs text-muted-foreground">Phân tích liều · Tương tác thuốc–thuốc · Tương tác thuốc–bệnh</span>
            </div>
            <button
              type="button"
              onClick={runAI}
              disabled={aiLoading}
              className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground transition hover:scale-[1.03] disabled:opacity-50"
            >
              {aiLoading ? "⏳ Đang phân tích…" : "🔄 Phân tích lại"}
            </button>
          </div>
          {aiErr && <div className="mb-2 rounded-md border border-destructive bg-destructive/10 px-3 py-2 text-xs text-destructive">{aiErr}</div>}
          {aiLoading && !aiOut && (
            <div className="flex items-center gap-2 py-3 text-sm text-muted-foreground">
              <span className="inline-block h-3 w-3 animate-pulse rounded-full bg-accent" />
              Dược sĩ thông minh đang phân tích đơn của bạn…
            </div>
          )}
          {aiOut && (
            <div className="prose prose-sm max-w-none rounded-lg bg-card/70 p-3 text-sm prose-headings:font-display prose-headings:text-foreground prose-strong:text-accent">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{aiOut}</ReactMarkdown>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ============= B1 Tabs: Lâm sàng YHHĐ + YHCT ============= */
const NGHIEM_PHAP_GROUPS: { label: string; items: string[] }[] = [
  { label: "Cơ–xương–khớp / Cột sống", items: ["Lasègue", "Bragard", "Schober", "FABER (Patrick)", "FADIR", "Tinel cổ tay", "Phalen", "McMurray", "Lachman", "Drawer trước/sau", "Adam (vẹo cột sống)", "Spurling"] },
  { label: "Bụng – Tiêu hoá", items: ["Murphy", "McBurney", "Blumberg (phản ứng dội)", "Rovsing", "Psoas", "Obturator", "Cullen", "Grey-Turner", "Castell (lách)"] },
  { label: "Thần kinh", items: ["Kernig", "Brudzinski", "Babinski", "Hoffmann", "Romberg", "Ngón tay-mũi", "Gót-gối", "Lhermitte", "Cảm giác nông sâu", "Phản xạ gân xương"] },
  { label: "Tim mạch – Mạch máu", items: ["Allen (bàn tay)", "Homans (HKTM)", "ABI", "Trendelenburg", "Buerger", "Mạch ngoại biên 4 chi"] },
  { label: "Hô hấp", items: ["Gõ phổi", "Rung thanh", "Rì rào phế nang", "Đếm nhịp thở 1 phút"] },
];

function VitalField({ label, v, on, unit, placeholder }: { label: string; v: string; on: (v: string) => void; unit: string; placeholder?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label} <span className="text-accent">({unit})</span></span>
      <input
        value={v}
        onChange={(e) => on(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-border bg-background/50 px-3 py-2 text-sm outline-none transition focus:border-accent/60 focus:ring-2 focus:ring-accent/20"
      />
    </label>
  );
}

function B1Tabs({
  b1, setB1, b1y, setB1y,
}: { b1: LamSang; setB1: (v: LamSang) => void; b1y: LamSangYHHD; setB1y: (v: LamSangYHHD) => void }) {
  const [tab, setTab] = useState<"yhhd" | "yhct">("yhhd");
  return (
    <div className="mt-2">
      <div className="mb-4 inline-flex rounded-xl border border-border bg-card/40 p-1 font-mono text-[11px] uppercase tracking-wider">
        <button
          onClick={() => setTab("yhhd")}
          className={`rounded-lg px-4 py-1.5 transition ${tab === "yhhd" ? "bg-primary/20 text-primary glow-cyan" : "text-muted-foreground hover:text-foreground"}`}
        >🩻 Lâm sàng YHHĐ</button>
        <button
          onClick={() => setTab("yhct")}
          className={`rounded-lg px-4 py-1.5 transition ${tab === "yhct" ? "bg-accent/20 text-accent glow-cyan" : "text-muted-foreground hover:text-foreground"}`}
        >☯ Lâm sàng YHCT (Tứ chẩn)</button>
      </div>

      {tab === "yhhd" && (
        <div className="space-y-5">
          <section className="rounded-xl border border-primary/30 bg-primary/5 p-4">
            <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-primary">① Sinh hiệu</div>
            <div className="grid gap-3 md:grid-cols-4">
              <VitalField label="HA" v={b1y.ha} on={(v) => setB1y({ ...b1y, ha: v })} unit="mmHg" placeholder="120/80" />
              <VitalField label="Mạch" v={b1y.mach} on={(v) => setB1y({ ...b1y, mach: v })} unit="l/p" placeholder="78" />
              <VitalField label="Nhịp thở" v={b1y.nhipTho} on={(v) => setB1y({ ...b1y, nhipTho: v })} unit="l/p" placeholder="18" />
              <VitalField label="Nhiệt độ" v={b1y.nhietDo} on={(v) => setB1y({ ...b1y, nhietDo: v })} unit="°C" placeholder="37.0" />
              <VitalField label="SpO₂" v={b1y.spo2} on={(v) => setB1y({ ...b1y, spo2: v })} unit="%" placeholder="98" />
              <VitalField label="Cân nặng" v={b1y.canNang} on={(v) => setB1y({ ...b1y, canNang: v })} unit="kg" placeholder="60" />
              <VitalField label="Chiều cao" v={b1y.chieuCao} on={(v) => setB1y({ ...b1y, chieuCao: v })} unit="cm" placeholder="165" />
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card/30 p-4">
            <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">② Khám toàn thân & cơ quan</div>
            <Grid>
              <Area label="Toàn thân (tri giác · da niêm · hạch · phù · thể trạng)" v={b1y.toanThan} on={(v) => setB1y({ ...b1y, toanThan: v })} placeholder="Tỉnh, tiếp xúc tốt; da niêm hồng; không phù; BMI…" full />
              <Area label="Tim mạch" v={b1y.timMach} on={(v) => setB1y({ ...b1y, timMach: v })} placeholder="T1 T2 rõ đều, không tiếng thổi; mạch quay đều rõ…" />
              <Area label="Hô hấp" v={b1y.hoHap} on={(v) => setB1y({ ...b1y, hoHap: v })} placeholder="Rì rào phế nang êm dịu 2 phế trường; không ran…" />
              <Area label="Tiêu hoá – Bụng" v={b1y.bung} on={(v) => setB1y({ ...b1y, bung: v })} placeholder="Bụng mềm, gan lách không sờ thấy, không điểm đau…" />
              <Area label="Thần kinh" v={b1y.thanKinh} on={(v) => setB1y({ ...b1y, thanKinh: v })} placeholder="12 đôi dây sọ ổn, cơ lực 5/5, phản xạ đều 2 bên…" />
              <Area label="Cơ – Xương – Khớp" v={b1y.coXuongKhop} on={(v) => setB1y({ ...b1y, coXuongKhop: v })} placeholder="Tầm vận động · sưng/nóng/đỏ/đau · biến dạng…" />
              <Area label="Khác (TMH · Da liễu · Niệu – sinh dục)" v={b1y.khac} on={(v) => setB1y({ ...b1y, khac: v })} full />
            </Grid>
          </section>

          <section className="rounded-xl border border-sky-400/30 bg-sky-400/5 p-4">
            <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-sky-300">③ Nghiệm pháp khám (gợi ý theo cơ quan)</div>
            <Area label="Nghiệm pháp đã làm + kết quả" v={b1y.nghiemPhap} on={(v) => setB1y({ ...b1y, nghiemPhap: v })} placeholder="VD: Lasègue (P) 40° (+); Murphy (–); Romberg (–)…" full />
            <ChipPicker
              value={b1y.nghiemPhap}
              onChange={(v) => setB1y({ ...b1y, nghiemPhap: v })}
              groups={NGHIEM_PHAP_GROUPS}
              sep="; "
            />
            <p className="mt-2 font-mono text-[10px] text-muted-foreground">Bấm chip để chèn nghiệm pháp; sau đó gõ trực tiếp kết quả (+ / –, độ, mức).</p>
          </section>

          <section className="rounded-xl border border-primary/30 bg-primary/8 p-4">
            <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-accent">④ Cận lâm sàng</div>
            <Grid>
              <Area label="Đã có (kết quả XN / CĐHA)" v={b1y.canLamSangCo} on={(v) => setB1y({ ...b1y, canLamSangCo: v })} placeholder="Glu 7.8 · HbA1c 7.2 · ECG nhịp xoang · X-quang phổi…" full />
              <Area label="Đề xuất làm thêm" v={b1y.canLamSangCan} on={(v) => setB1y({ ...b1y, canLamSangCan: v })} placeholder="Lipid máu, men gan, siêu âm bụng, MRI cột sống…" full />
            </Grid>
          </section>
        </div>
      )}

      {tab === "yhct" && (
        <Grid>
          <AreaChips label="Vọng (nhìn)" v={b1.vong} on={(v) => setB1({ ...b1, vong: v })} groups={CHIPS_VONG} />
          <AreaChips label="Văn (nghe / ngửi)" v={b1.van} on={(v) => setB1({ ...b1, van: v })} groups={CHIPS_VAN} />
          <AreaChips label="Vấn (hỏi – Thập vấn)" v={b1.vanQ} on={(v) => setB1({ ...b1, vanQ: v })} groups={CHIPS_VAN_Q} full />
          <AreaChips label="Thiết (sờ nắn / xúc chẩn)" v={b1.thiet} on={(v) => setB1({ ...b1, thiet: v })} groups={CHIPS_THIET} />
          <AreaChips label="Lưỡi (Thiệt chẩn)" v={b1.tongue} on={(v) => setB1({ ...b1, tongue: v })} groups={CHIPS_TONGUE} placeholder="Vd: Lưỡi đỏ, rêu vàng khô" />
          <AreaChips label="Mạch (Mạch chẩn)" v={b1.pulse} on={(v) => setB1({ ...b1, pulse: v })} groups={CHIPS_PULSE} placeholder="Vd: Huyền · Sác" full />
        </Grid>
      )}
    </div>
  );
}

function buildPrompt(
  d: { b0: HoSo; b1: LamSang; b1y: LamSangYHHD; b2: DanhGia; b3: BienChung; b4: GoiYToa; b5: HieuChinh; b6: DuongSinh },
  step: StepKey,
) {
  const ctx = `# Hồ sơ bệnh nhân (B0)
- Họ tên: ${d.b0.name || "(trống)"} · Năm sinh: ${d.b0.year || "?"} · Giới: ${d.b0.gender || "?"}
- Địa chỉ: ${d.b0.address || "(trống)"} · Ngày khám: ${d.b0.date}
- Tiền sử: ${d.b0.tienSuBenh || "–"} · Dị ứng thuốc: ${d.b0.diUngThuoc || "–"}
- Thuốc đang dùng: ${d.b0.thuocDangDung || "–"} · CĐ YHHĐ: ${d.b0.chanDoanYHHD || "–"}

# Lâm sàng YHCT – Tứ chẩn (B1)
- Triệu chứng chính: ${d.b1.chief || "(trống)"}
- Vọng: ${d.b1.vong} · Văn: ${d.b1.van} · Vấn: ${d.b1.vanQ} · Thiết: ${d.b1.thiet}
- Lưỡi: ${d.b1.tongue} · Mạch: ${d.b1.pulse}

# Lâm sàng YHHĐ (B1y)
- Sinh hiệu: M ${d.b1y.mach || "–"} · HA ${d.b1y.ha || "–"} · NT ${d.b1y.nhipTho || "–"} · T° ${d.b1y.nhietDo || "–"} · SpO₂ ${d.b1y.spo2 || "–"} · Cân nặng ${d.b1y.canNang || "–"} · Cao ${d.b1y.chieuCao || "–"}
- Toàn thân: ${d.b1y.toanThan || "–"}
- Tim mạch: ${d.b1y.timMach || "–"}
- Hô hấp: ${d.b1y.hoHap || "–"}
- Bụng: ${d.b1y.bung || "–"}
- Thần kinh: ${d.b1y.thanKinh || "–"}
- Cơ-Xương-Khớp: ${d.b1y.coXuongKhop || "–"}
- Khác: ${d.b1y.khac || "–"}
- Nghiệm pháp đã làm + kết quả: ${d.b1y.nghiemPhap || "–"}
- Cận lâm sàng đã có: ${d.b1y.canLamSangCo || "–"}
- Cận lâm sàng cần làm thêm: ${d.b1y.canLamSangCan || "–"}

# Đánh giá (B2)
- Bát cương: ${d.b2.bat}
- Tạng phủ: ${d.b2.tang}
- Khí huyết: ${d.b2.khi}
- Nguyên nhân: ${d.b2.nguyen}

# Biện chứng (B3)
- Hội chứng: ${d.b3.hoiChung}
- Pháp trị: ${d.b3.phap}

# Toa hiện tại (B4)
## YHCT
- Phương: ${d.b4.phuong}
- Vị: ${d.b4.vi}
- Liều: ${d.b4.lieu}
- Cách dùng: ${d.b4.cachDung}
## Châm cứu
- Huyệt chủ: ${d.b4.chamCuu.huyetChinh}
- Huyệt phối: ${d.b4.chamCuu.huyetPhoi}
- Thủ pháp: ${d.b4.chamCuu.thuPhap} · Kỹ thuật: ${d.b4.chamCuu.kyThuat}
- Lưu kim: ${d.b4.chamCuu.luuKim} · Liệu trình: ${d.b4.chamCuu.lieuTrinh}
## YHHĐ
- Chẩn đoán: ${d.b4.yhhd.chanDoan}
- Thuốc: ${d.b4.yhhd.thuoc}
- Cận lâm sàng: ${d.b4.yhhd.canLamSang}
- Ghi chú: ${d.b4.yhhd.ghiChu}

# Hiệu chỉnh (B5)
- Gia giảm: ${d.b5.giaGiam}
- Kiêng kỵ: ${d.b5.kiengKy}
- Theo dõi: ${d.b5.theoDoi}

# Dưỡng sinh (B6)
- Nguyên tắc: ${d.b6.nguyenTac}
- Món ăn gợi ý: ${d.b6.monAn}
`;

  const ask: Record<StepKey, string> = {
    b0: "Đánh giá độ đầy đủ của hồ sơ hành chính, gợi ý thông tin còn thiếu cần thu thập.",
    b1: "Phân tích SONG SONG hai phần: (a) Tứ chẩn YHCT – gợi ý câu hỏi/khám còn thiếu, nhận định sơ bộ lưỡi-mạch; (b) Khám lâm sàng YHHĐ – nhận xét sinh hiệu bất thường, gợi ý NGHIỆM PHÁP KHÁM còn thiếu theo cơ quan đang nghi ngờ (Lasègue/Bragard, Murphy/Blumberg, Kernig/Brudzinski, Romberg/Finger-nose, Tinel/Phalen, Allen, Adson, Schober…), và đề xuất CẬN LÂM SÀNG cần làm thêm. KHÔNG nêu tên sách/giáo trình.",
    b2: "Tổng hợp Bát cương – Tạng phủ – Khí huyết – Nguyên nhân từ cả dữ liệu Tứ chẩn YHCT lẫn lâm sàng + cận lâm sàng YHHĐ.",
    b3: "Kết luận hội chứng YHCT và đề xuất pháp trị, kèm lập luận ngắn gọn.",
    b4: `Đề xuất TOA ĐẦY ĐỦ với 3 KHỐI BẮT BUỘC, trình bày Markdown có tiêu đề rõ ràng. TUYỆT ĐỐI KHÔNG nêu tên sách / giáo trình / tác giả / số trang:

## ⚠️ Khối cảnh báo an toàn (đặt LÊN ĐẦU)
- Đối chiếu DỊ ỨNG THUỐC ở B0 với mọi vị Đông – Tây sẽ kê.
- Thập bát phản – Thập cửu úy nếu có cặp vị tương phản.
- Tương tác Đông–Tây y (ví dụ Warfarin × Đan sâm/Đương quy/Bạch quả; IMAO × Ma hoàng; Lợi tiểu × Cam thảo…).
- Chống chỉ định: thai sản, suy gan, suy thận, bệnh nền (đối chiếu B0).

## ① Phương dược YHCT (Quân – Thần – Tá – Sứ)
Tên phương · phân vai từng vị (tính – vị – quy kinh – liều g) · cách sắc/uống · số thang · gia giảm theo triệu chứng.

## ② Phác đồ châm cứu (BẮT BUỘC vận dụng kiến thức nội bộ về Huyệt thường dùng + Nguyên tắc phối huyệt + Châm cứu theo bệnh YHHĐ trong "Trích nội bộ")
- **Chọn huyệt theo nguyên tắc phối huyệt**: nguyên-lạc, du-mộ, khích-hợp, bản-tiêu, tả-hữu, trên-dưới, biểu-lý, theo kinh & theo bệnh YHHĐ – nêu RÕ nguyên tắc đang áp dụng cho từng cụm huyệt.
- **Huyệt chủ** (3–6 huyệt): mỗi huyệt ghi *Tên · kinh · vị trí giải phẫu ngắn · tác dụng chính · lý do chọn theo hội chứng/pháp trị*.
- **Huyệt phối** theo triệu chứng phụ (mỗi huyệt cũng nêu vị trí + tác dụng + lý do).
- **Thủ pháp** Bổ / Tả / Bình bổ bình tả cho từng huyệt + lý do (hư thì bổ, thực thì tả).
- **Kỹ thuật**: Hào châm / Điện châm (tần số Hz, sóng) / Cứu ngải / Nhĩ châm / Mai hoa châm – chọn theo hội chứng.
- **Hướng & độ sâu kim** an toàn cho các huyệt vùng nguy hiểm (đầu mặt cổ, ngực lưng, bụng).
- **Lưu kim** (phút) · **Liệu trình** (số lần/tuần × số tuần) · mốc đánh giá hiệu quả.
- **Chống chỉ định & cảnh báo**: thai phụ (Hợp cốc, Tam âm giao, Côn lôn, Chí âm, vùng bụng dưới…), vùng có vết thương/nhiễm trùng, rối loạn đông máu, máy tạo nhịp với điện châm, huyệt nguy hiểm gần phổi/tim/mạch lớn.

## ③ Đơn YHHĐ kết hợp (song trị)
- Chẩn đoán YHHĐ + mã ICD-10 nếu có.
- Bảng thuốc tân dược: | Tên gốc | Hoạt chất | Hàm lượng | Đường dùng | Liều/ngày | Số ngày | Ghi chú |
- Đề xuất CẬN LÂM SÀNG cần làm (XN máu, sinh hoá, ECG, CĐHA…) và mốc theo dõi.

Kết thúc bằng dòng: ⚠️ Đề xuất tham khảo – quyết định cuối cùng thuộc về thầy thuốc lâm sàng.`,
    b5: "Gợi ý gia giảm theo triệu chứng, kiêng kỵ, lịch tái khám và chỉ số cần theo dõi.",
    b6: `Tư vấn DƯỠNG SINH – THỰC DƯỠNG theo hội chứng YHCT của bệnh nhân. TUYỆT ĐỐI KHÔNG nêu tên sách / giáo trình / tác giả / số trang / ký hiệu [n · tr.X] trong câu trả lời – chỉ trình bày kiến thức dưới dạng kinh nghiệm lâm sàng.

Trình bày Markdown với CÁC PHẦN BẮT BUỘC:
1. **Nguyên tắc dưỡng sinh** (3–5 gạch đầu dòng): chỉ rõ tính âm/dương của thể bệnh, hướng cân bằng (ăn ấm/mát, tăng/giảm đạm động vật, tỉ lệ rau-cá-ngũ cốc nhiệt đới), khung giờ ăn 3 cử theo nhịp ngày-đêm (sáng dương thăng phát, trưa cân bằng, tối thu liễm – không ăn khuya), điều chỉnh theo mùa hiện tại.
2. **Món ăn – bài thuốc gợi ý** (chọn 3–5 món PHÙ HỢP hội chứng + nguyên tắc ở mục 1). Mỗi món gồm:
   - **Tên món** · *Công dụng theo YHCT* (quy kinh, tác dụng) · *Tính âm/dương của món*.
   - **Vật liệu** (định lượng cụ thể).
   - **Cách làm** (các bước rõ ràng, dễ hiểu như sách nấu ăn).
   - **Kỵ / Lưu ý**.
3. **THỰC ĐƠN MẪU 1 NGÀY – 3 cử** (bảng Markdown) – sắp món theo đúng nguyên tắc âm-dương ngày-đêm:
   | Cử | Giờ | Tính âm/dương | Món chính | Món phụ / canh | Tráng miệng – nước uống | Ghi chú YHCT |
   - Sáng (~6–8h, dương thăng): món ấm, nhiều năng lượng.
   - Trưa (~11–13h, cân bằng): đủ chất, có cả động-thực vật.
   - Tối (~17–19h, âm thu liễm): nhẹ, dễ tiêu, ít đạm động vật; tránh ăn sau 21h.
4. **Thực phẩm nên KIÊNG** (theo hội chứng + dị ứng thuốc B0 + mùa hiện tại).
5. Kết thúc bằng dòng: ⚠️ Đề xuất tham khảo – không thay thế chỉ định của thầy thuốc.`,
    b7: "Rà soát toàn bộ hồ sơ B0→B6, chỉ ra thiếu sót còn lại trước khi bác sĩ ký số chốt hồ sơ.",
  };

  const critique = `

---
# 🩺 QUY TẮC PHẢN BIỆN LÂM SÀNG (BẮT BUỘC)

Bạn là **trợ lý lâm sàng YHCT – YHHĐ** đóng vai **người phản biện** cho bác sĩ.

## 1. Soát lỗi từ chẩn đoán → điều trị
Sau khi đưa nội dung chính, **TỰ KIỂM TRA và LIỆT KÊ** mọi vấn đề (nếu có):
- Mâu thuẫn: triệu chứng ↔ bát cương / tạng phủ / hội chứng / pháp trị / phương dược / châm cứu / thuốc tân dược.
- Phương dược sai pháp trị, vị thuốc không hợp hội chứng, **Thập bát phản – Thập cửu úy**.
- Châm cứu: huyệt không hợp pháp, thủ pháp Bổ/Tả ngược, chống chỉ định (thai phụ, vùng nguy hiểm).
- Đơn YHHĐ: **dị ứng (đối chiếu B0)**, **tương tác Đông–Tây** (Warfarin × Đan sâm/Đương quy/Bạch quả, IMAO × Ma hoàng, Cam thảo × Lợi tiểu, Aspirin × Ibuprofen, NSAID × ƯCMC/ARB, Clopidogrel × Omeprazol, Macrolid/Quinolon × QT, SSRI × Tramadol …), **quá liều**, chống chỉ định (thai, suy gan/thận, trẻ em).
- Thiếu cận lâm sàng cốt lõi cho chẩn đoán.

## 2. Khi phát hiện vấn đề – TRÌNH BÀY theo MẪU:

### ⚠️ Cảnh báo & Phản biện
| # | Mức độ | Vị trí lỗi | Mô tả | Đề xuất sửa |
|---|--------|------------|-------|-------------|
| 1 | 🔴 CAO / 🟡 TB / 🟢 Nhẹ | B?/khối nào | … | … |

### 🔗 Sơ đồ luận chứng (giải thích vì sao sai)
\\\`\\\`\\\`mermaid
flowchart LR
  S[Triệu chứng / Lưỡi / Mạch] --> B[Bát cương]
  B --> H[Hội chứng]
  H --> P[Pháp trị]
  P --> R[Phương dược / Châm / Tây y]
  R -.❌ mâu thuẫn.-> X[Lỗi: ...]
\\\`\\\`\\\`
Dùng cú pháp **mermaid flowchart** (LR/TD) hoặc **sequenceDiagram**.
**KHÔNG dùng emoji bên trong nút mermaid** (gây lỗi parser) – dùng chữ thuần.
Nhãn nút Việt có dấu phải bọc trong dấu ngoặc kép: \`A["Tỳ hư"]\`.

### 🧠 Lập luận thuyết phục
Với MỖI lỗi, nêu **lý lẽ lâm sàng YHCT/YHHĐ** giải thích vì sao đơn hiện tại chưa hợp lý và cần sửa ra sao. TUYỆT ĐỐI KHÔNG nêu tên sách / giáo trình / tác giả / số trang / ký hiệu [n · tr.X] – chỉ trình bày như kinh nghiệm chuyên môn.

## 3. Khi KHÔNG có vấn đề
Ghi rõ: **"✅ Không phát hiện mâu thuẫn rõ ràng giữa chẩn đoán và điều trị."** rồi bỏ qua phần phản biện.

---
Trả lời bằng tiếng Việt, Markdown đầy đủ, kết thúc bằng dòng \`⚠️ Đề xuất tham khảo – không thay thế chỉ định của thầy thuốc.\``;

  return `${ctx}\n---\nYêu cầu cho bước **${step.toUpperCase()}**: ${ask[step]}${critique}`;
}

/* ──────────────── CHIP DICTIONARIES (chuẩn theo giáo trình YHCT) ──────────────── */

type ChipGroup = { label?: string; items: string[] };

const CHIPS_VONG: ChipGroup[] = [
  { label: "Thần", items: ["Thần tỉnh táo", "Thần mệt mỏi", "Thần đãn (sa sút)", "Vô thần"] },
  { label: "Sắc mặt", items: ["Sắc hồng nhuận", "Sắc trắng nhợt", "Sắc vàng (úa/sạm)", "Sắc đỏ", "Sắc xanh tím", "Sắc đen sạm"] },
  { label: "Hình thể", items: ["Thể trạng gầy", "Thể trạng béo bệu", "Da khô", "Phù"] },
];

const CHIPS_VAN: ChipGroup[] = [
  { label: "Tiếng nói – hô hấp", items: ["Giọng nói nhỏ yếu", "Giọng to khoẻ", "Tiếng thở thô", "Thở yếu ngắn", "Ho khan", "Ho đờm", "Khò khè", "Hắt hơi"] },
  { label: "Mùi (khứu)", items: ["Hơi thở hôi", "Hơi thở chua", "Mùi cơ thể nồng", "Phân – nước tiểu khẳn"] },
];

const CHIPS_VAN_Q: ChipGroup[] = [
  { label: "1. Hàn – Nhiệt", items: ["Sợ lạnh", "Sợ gió", "Sốt", "Sốt về chiều", "Sốt lúc nóng lúc rét"] },
  { label: "2. Hãn (mồ hôi)", items: ["Vô hãn", "Tự hãn (ngày)", "Đạo hãn (đêm)", "Mồ hôi đầu", "Mồ hôi tay chân"] },
  { label: "3. Đầu – mình", items: ["Đau đầu", "Hoa mắt chóng mặt", "Đau mỏi vai gáy", "Đau lưng", "Đau khớp"] },
  { label: "4. Đại – Tiểu tiện", items: ["Táo bón", "Đại tiện lỏng", "Tiểu vàng", "Tiểu trong dài", "Tiểu đêm nhiều", "Tiểu buốt rắt"] },
  { label: "5. Ẩm thực", items: ["Ăn kém", "Ăn nhiều mau đói", "Khát nước", "Không khát", "Thích uống ấm", "Thích uống lạnh", "Ợ hơi", "Buồn nôn"] },
  { label: "6. Hung phúc", items: ["Tức ngực", "Hồi hộp", "Đầy bụng", "Đau bụng", "Sườn đau"] },
  { label: "7. Tẩm ngủ", items: ["Mất ngủ", "Khó vào giấc", "Hay mộng", "Ngủ nhiều"] },
  { label: "8. Tai – Mắt", items: ["Ù tai", "Điếc", "Khô mắt", "Nhìn mờ"] },
  { label: "9. Phụ nữ", items: ["Kinh sớm", "Kinh muộn", "Kinh ít", "Kinh nhiều", "Thống kinh", "Khí hư"] },
  { label: "10. Khác (Âm – Dương hư)", items: ["Lòng bàn tay chân nóng", "Ngũ tâm phiền nhiệt", "Sợ lạnh chân tay lạnh", "Mệt mỏi vô lực"] },
];

const CHIPS_THIET: ChipGroup[] = [
  { label: "Xúc chẩn da – chi", items: ["Chân tay lạnh", "Chân tay nóng", "Da lạnh ẩm", "Da nóng khô"] },
  { label: "Phúc chẩn (sờ bụng)", items: ["Bụng đầy chướng", "Bụng mềm", "Bụng cứng đau cự án", "Bụng đau thiện án", "Hòn cục"] },
  { label: "Du huyệt", items: ["Đau ấn Tâm du", "Đau ấn Can du", "Đau ấn Tỳ du", "Đau ấn Thận du"] },
];

const CHIPS_TONGUE: ChipGroup[] = [
  { label: "Chất lưỡi (sắc)", items: ["Lưỡi hồng nhạt (bình thường)", "Lưỡi nhợt", "Lưỡi đỏ", "Lưỡi đỏ sẫm (giáng)", "Lưỡi tím sạm"] },
  { label: "Hình lưỡi", items: ["Lưỡi bệu to", "Lưỡi gầy mỏng", "Có dấu răng", "Nứt lưỡi", "Điểm gai đỏ", "Điểm ứ huyết"] },
  { label: "Rêu lưỡi", items: ["Rêu trắng mỏng", "Rêu trắng dày", "Rêu vàng mỏng", "Rêu vàng dày", "Rêu vàng khô", "Rêu nhầy nhớt", "Rêu xám đen", "Bóc rêu", "Lưỡi gương (sạch trơn)"] },
];

const CHIPS_PULSE: ChipGroup[] = [
  { label: "Vị trí – Tần số", items: ["Phù", "Trầm", "Trì (chậm)", "Sác (nhanh)"] },
  { label: "Lực – Hình thái", items: ["Hư", "Thực", "Hồng", "Tế (nhỏ)", "Đại", "Nhu (mềm)", "Nhược"] },
  { label: "Trạng thái", items: ["Hoạt (trơn)", "Sáp (sít)", "Huyền (căng dây đàn)", "Khẩn (căng chặt)", "Kết (chậm gián)", "Đại nhịp (lỗi nhịp)"] },
];

const CHIPS_TANG: ChipGroup[] = [
  { label: "Ngũ tạng", items: ["Tâm", "Can", "Tỳ", "Phế", "Thận", "Tâm bào"] },
  { label: "Lục phủ", items: ["Tiểu trường", "Đởm", "Vị", "Đại trường", "Bàng quang", "Tam tiêu"] },
];

const CHIPS_KHI_HUYET: ChipGroup[] = [
  { label: "Khí", items: ["Khí hư", "Khí trệ", "Khí nghịch", "Khí hãm", "Khí thoát"] },
  { label: "Huyết", items: ["Huyết hư", "Huyết ứ", "Huyết nhiệt", "Huyết hàn", "Xuất huyết"] },
  { label: "Tân dịch – Đàm thấp", items: ["Tân dịch khuy tổn", "Thủy thấp đình", "Đàm thấp", "Đàm nhiệt", "Đàm ẩm"] },
];

const CHIPS_NGUYEN_NHAN: ChipGroup[] = [
  { label: "Lục dâm (ngoại nhân)", items: ["Phong", "Hàn", "Thử", "Thấp", "Táo", "Hỏa"] },
  { label: "Thất tình (nội nhân)", items: ["Nộ thương Can", "Hỉ thương Tâm", "Tư thương Tỳ", "Bi – Ưu thương Phế", "Khủng – Kinh thương Thận"] },
  { label: "Bất nội ngoại nhân", items: ["Ẩm thực thất điều", "Lao quyện", "Phòng lao quá độ", "Đàm ẩm", "Ứ huyết", "Trùng tích", "Ngoại thương"] },
];

const CHIPS_BAT_PHAP: ChipGroup[] = [
  { label: "Bát pháp – 8 pháp trị liệu YHCT", items: [
    "Hãn (làm ra mồ hôi, giải biểu)",
    "Thổ (gây nôn, tống tà thượng tiêu)",
    "Hạ (tẩy xổ, thông phủ)",
    "Hoà (hoà giải, điều hoà)",
    "Ôn (ôn ấm, trừ hàn)",
    "Thanh (thanh nhiệt, tả hoả)",
    "Bổ (bồi bổ khí – huyết – âm – dương)",
    "Tiêu (tiêu đàm, hoạt huyết, tiêu tích)",
  ]},
];

/* ──────────────── ChipPicker + AreaChips ──────────────── */

function ChipPicker({
  value, onChange, groups, sep = ", ",
}: { value: string; onChange: (v: string) => void; groups: ChipGroup[]; sep?: string }) {
  const tokens = value.split(sep).map((s) => s.trim()).filter(Boolean);
  const has = (t: string) => tokens.includes(t);
  const toggle = (t: string) => {
    const next = has(t) ? tokens.filter((x) => x !== t) : [...tokens, t];
    onChange(next.join(sep));
  };
  return (
    <div className="mt-2 space-y-1.5">
      {groups.map((g, i) => (
        <div key={i} className="flex flex-wrap items-center gap-1.5">
          {g.label && (
            <span className="mr-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {g.label}
            </span>
          )}
          {g.items.map((it) => {
            const active = has(it);
            return (
              <button
                key={it}
                type="button"
                onClick={() => toggle(it)}
                className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition ${
                  active
                    ? "border-accent bg-accent/20 text-accent shadow-[0_0_8px_color-mix(in_oklab,var(--accent)_30%,transparent)]"
                    : "border-border bg-card/40 text-muted-foreground hover:border-accent/50 hover:text-foreground"
                }`}
              >
                {active ? "✓ " : "+ "}
                {it}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function AreaChips({
  label, v, on, groups, placeholder, full,
}: {
  label: string;
  v: string;
  on: (v: string) => void;
  groups: ChipGroup[];
  placeholder?: string;
  full?: boolean;
}) {
  return (
    <div className={`block ${full ? "md:col-span-2" : ""}`}>
      <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <textarea
        value={v}
        onChange={(e) => on(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full rounded-lg border border-border bg-background/50 px-3 py-2 text-sm outline-none transition focus:border-accent/60 focus:ring-2 focus:ring-accent/20"
      />
      <ChipPicker value={v} onChange={on} groups={groups} />
    </div>
  );
}

/* ──────────────── BÁT CƯƠNG (đa chọn, auto-kết luận) ──────────────── */

const BAT_CUONG_PAIRS: { label: string; opts: { v: string; hint: string }[] }[] = [
  { label: "Vị trí bệnh", opts: [{ v: "Biểu", hint: "bệnh ở phần ngoài (da, kinh lạc)" }, { v: "Lý", hint: "bệnh ở phần trong (tạng phủ, khí huyết)" }] },
  { label: "Tính chất bệnh", opts: [{ v: "Hàn", hint: "sợ lạnh, lưỡi nhợt, mạch trì" }, { v: "Nhiệt", hint: "sốt, khát, lưỡi đỏ, mạch sác" }] },
  { label: "Chính khí – Tà khí", opts: [{ v: "Hư", hint: "chính khí suy" }, { v: "Thực", hint: "tà khí thịnh" }] },
  { label: "Tổng cương (Âm – Dương)", opts: [{ v: "Âm", hint: "âm hư / chứng âm" }, { v: "Dương", hint: "dương hư / chứng dương" }] },
];

const QUICK_SYNDROMES = [
  "Biểu · Thực · Hàn",
  "Biểu · Thực · Nhiệt",
  "Lý · Thực · Hàn",
  "Lý · Thực · Nhiệt",
  "Lý · Hư · Hàn",
  "Lý · Hư · Nhiệt",
  "Âm hư",
  "Dương hư",
  "Biểu Lý đồng bệnh",
  "Hàn nhiệt thác tạp",
  "Hư thực thác tạp",
  "Âm Dương lưỡng hư",
];

function deriveBatCuong(parts: string[]): { text: string; confidence: number } | null {
  if (parts.length === 0) return null;
  const has = (k: string) => parts.includes(k);
  const loc =
    has("Biểu") && has("Lý") ? "Biểu–Lý đồng bệnh" : has("Biểu") ? "Biểu" : has("Lý") ? "Lý" : "";
  const hu =
    has("Hư") && has("Thực") ? "Hư–Thực thác tạp" : has("Hư") ? "Hư" : has("Thực") ? "Thực" : "";
  const han =
    has("Hàn") && has("Nhiệt")
      ? "Hàn–Nhiệt thác tạp"
      : has("Hàn")
        ? "Hàn"
        : has("Nhiệt")
          ? "Nhiệt"
          : "";
  const ad =
    has("Âm") && has("Dương")
      ? "Âm Dương lưỡng hư"
      : has("Âm")
        ? "Âm hư"
        : has("Dương")
          ? "Dương hư"
          : "";
  const main = [loc, hu, han].filter(Boolean).join(" · ");
  const text = ad ? (main ? `${main} – ${ad}` : ad) : main;
  // Heuristic độ tin cậy: càng đủ 4 cặp + không thác tạp càng cao
  const pairsCovered = [loc, hu, han, ad].filter(Boolean).length;
  const conflicts =
    (has("Biểu") && has("Lý") ? 1 : 0) +
    (has("Hư") && has("Thực") ? 1 : 0) +
    (has("Hàn") && has("Nhiệt") ? 1 : 0);
  const confidence = Math.max(40, Math.min(95, 50 + pairsCovered * 12 - conflicts * 5));
  return { text: text || "(chưa rõ)", confidence };
}

function BatCuongPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const parts = value ? value.split("·").map((s) => s.trim()).filter(Boolean) : [];
  const has = (s: string) => parts.includes(s);

  const toggle = (v: string) => {
    const next = has(v) ? parts.filter((p) => p !== v) : [...parts, v];
    onChange(next.join(" · "));
  };

  const conclusion = deriveBatCuong(parts);

  return (
    <div className="rounded-xl border border-border/70 bg-background/40 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-accent">
            Biện chứng · Bát cương
          </div>
          <div className="text-xs text-muted-foreground">
            Có thể chọn cả 2 trong một cặp (Biểu–Lý đồng bệnh, Hàn nhiệt thác tạp…) hoặc bỏ trống.
          </div>
        </div>
        {value && (
          <button
            onClick={() => onChange("")}
            className="font-mono text-[10px] text-muted-foreground hover:text-destructive"
          >
            Xoá
          </button>
        )}
      </div>

      <div className="space-y-3">
        {BAT_CUONG_PAIRS.map((pair) => (
          <div key={pair.label}>
            <div className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {pair.label}
            </div>
            <div className="flex flex-wrap gap-2">
              {pair.opts.map((o) => {
                const active = has(o.v);
                return (
                  <button
                    key={o.v}
                    onClick={() => toggle(o.v)}
                    title={o.hint}
                    className={`rounded-lg border px-3.5 py-1.5 text-sm font-medium transition ${
                      active
                        ? "border-sky-400/70 bg-sky-400/15 text-sky-300 shadow-[0_0_12px_color-mix(in_oklab,oklch(0.85_0.18_85)_40%,transparent)]"
                        : "border-border bg-card/40 text-muted-foreground hover:border-accent/40 hover:text-foreground"
                    }`}
                  >
                    {o.v}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 border-t border-border/60 pt-3">
        <div className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Mẫu nhanh (hội chứng thường gặp)
        </div>
        <div className="flex flex-wrap gap-2">
          {QUICK_SYNDROMES.map((q) => (
            <button
              key={q}
              onClick={() => onChange(q)}
              className={`rounded-full border px-3 py-1 text-xs transition ${
                value === q
                  ? "border-primary/60 bg-primary/15 text-foreground"
                  : "border-border bg-card/40 text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      <div
        className={`mt-4 rounded-lg border p-3 transition ${
          conclusion
            ? "border-sky-400/40 bg-sky-400/10"
            : "border-accent/30 bg-accent/5"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="font-mono text-[10px] uppercase tracking-widest text-accent">
            Kết luận Bát cương (suy luận)
          </div>
          {conclusion && (
            <span className="rounded-full border border-sky-400/40 bg-sky-400/10 px-2 py-0.5 font-mono text-[10px] text-sky-300">
              Độ tin cậy ~ {conclusion.confidence}%
            </span>
          )}
        </div>
        <div className="mt-1 font-display text-lg font-semibold text-foreground">
          {conclusion ? (
            <>
              Hội chứng <span className="text-sky-300">{conclusion.text}</span>
              <span className="ml-2 font-mono text-xs font-normal text-muted-foreground">
                ({value})
              </span>
            </>
          ) : (
            <span className="text-muted-foreground">Chưa chọn yếu tố nào…</span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ========== RecordsBar: tra cứu bệnh nhân + lịch sử khám ========== */
function RecordsBar({
  records, currentId, compareIds,
  onNew, onSave, onExport, onOpenCompare,
  onLoad, onDelete, onToggleCompare,
}: {
  records: RecordItem[];
  currentId: string | null;
  compareIds: string[];
  onNew: () => void;
  onSave: () => void;
  onExport: () => void;
  onOpenCompare: () => void;
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleCompare: (id: string) => void;
}) {
  const [q, setQ] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  // Gom hồ sơ theo bệnh nhân (key = tên + năm sinh, không phân biệt hoa thường)
  const groups = useMemo(() => {
    const map = new Map<string, { key: string; name: string; year: string; gender: string; address: string; visits: RecordItem[] }>();
    for (const r of records) {
      const name = (r.b0.name || "(Chưa có tên)").trim();
      const year = (r.b0.year || "").trim();
      const key = `${name.toLowerCase()}|${year}`;
      const g = map.get(key) ?? { key, name, year, gender: r.b0.gender, address: r.b0.address, visits: [] };
      g.visits.push(r);
      map.set(key, g);
    }
    const list = Array.from(map.values()).map((g) => ({
      ...g,
      visits: [...g.visits].sort((a, b) => +new Date(b.savedAt) - +new Date(a.savedAt)),
    }));
    // Sắp xếp theo lần khám gần nhất
    list.sort((a, b) => +new Date(b.visits[0].savedAt) - +new Date(a.visits[0].savedAt));
    return list;
  }, [records]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return groups;
    return groups
      .map((g) => {
        const matchPatient =
          g.name.toLowerCase().includes(needle) ||
          g.year.includes(needle) ||
          (g.address || "").toLowerCase().includes(needle) ||
          (g.gender || "").toLowerCase().includes(needle);
        const matchedVisits = g.visits.filter((r) =>
          [r.b1.chief, r.b2.bat, r.b2.tang, r.b3.hoiChung, r.b3.phap, r.b4.phuong, r.b4.vi]
            .some((t) => (t || "").toLowerCase().includes(needle))
        );
        if (matchPatient) return g;
        if (matchedVisits.length) return { ...g, visits: matchedVisits };
        return null;
      })
      .filter(Boolean) as typeof groups;
  }, [groups, q]);

  // Tự bung bệnh nhân đang chỉnh sửa
  useEffect(() => {
    if (!currentId) return;
    const g = groups.find((x) => x.visits.some((v) => v.id === currentId));
    if (g) setExpanded(g.key);
  }, [currentId, groups]);

  return (
    <div className="glass mb-4 rounded-2xl p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="font-mono text-[10px] uppercase tracking-widest text-accent">
            Tra cứu bệnh nhân · {groups.length} BN · {records.length} lần khám
          </div>
          <div className="text-xs text-muted-foreground">
            {currentId ? "Đang chỉnh sửa hồ sơ đã lưu – bấm Cập nhật để ghi đè." : "Hồ sơ mới – bấm Lưu để tạo bản ghi."}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={onNew} className="rounded-full border border-border bg-card/50 px-3 py-1.5 text-xs hover:bg-card">+ Mới</button>
          <button onClick={onSave} className="glow-cyan rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground">
            {currentId ? "Cập nhật" : "Lưu hồ sơ"}
          </button>
          <button onClick={onExport} className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent hover:bg-accent/20">
            ⬇ Xuất Word
          </button>
          <button
            onClick={onOpenCompare}
            disabled={compareIds.length !== 2}
            className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs text-foreground disabled:opacity-40"
          >
            So sánh ({compareIds.length}/2)
          </button>
        </div>
      </div>

      {/* Thanh tra cứu */}
      <div className="relative mb-3">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">🔍</span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Tìm theo tên, năm sinh, địa chỉ, hội chứng, vị thuốc…"
          className="w-full rounded-xl border border-border bg-background/60 py-2 pl-9 pr-9 text-sm outline-none transition focus:border-accent"
        />
        {q && (
          <button
            onClick={() => setQ("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-2 py-0.5 text-xs text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        )}
      </div>

      {records.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border/60 p-4 text-center text-xs text-muted-foreground">
          Chưa có hồ sơ nào. Nhập dữ liệu và bấm <span className="text-accent">Lưu hồ sơ</span> để bắt đầu.
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border/60 p-4 text-center text-xs text-muted-foreground">
          Không tìm thấy bệnh nhân hoặc lần khám nào khớp với "<span className="text-accent">{q}</span>".
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((g) => {
            const open = expanded === g.key;
            const last = g.visits[0];
            return (
              <div key={g.key} className="rounded-xl border border-border bg-background/40">
                <button
                  onClick={() => setExpanded(open ? null : g.key)}
                  className="flex w-full items-center justify-between gap-3 p-3 text-left transition hover:bg-card/40"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{g.name}</span>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {g.year || "?"} · {g.gender || "?"}
                      </span>
                      <span className="rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 font-mono text-[10px] text-accent">
                        {g.visits.length} lần khám
                      </span>
                    </div>
                    <div className="mt-0.5 truncate font-mono text-[10px] text-muted-foreground">
                      Gần nhất: {new Date(last.savedAt).toLocaleString("vi-VN")}
                      {last.b3.hoiChung && <span className="ml-2 text-accent">→ {last.b3.hoiChung}</span>}
                    </div>
                  </div>
                  <span className={`font-mono text-xs text-muted-foreground transition-transform ${open ? "rotate-90 text-accent" : ""}`}>▶</span>
                </button>

                {open && (
                  <ol className="border-t border-border/60 px-3 py-2">
                    {g.visits.map((r, i) => {
                      const active = r.id === currentId;
                      const checked = compareIds.includes(r.id);
                      return (
                        <li
                          key={r.id}
                          className={`group relative flex items-start gap-3 rounded-lg px-2 py-2 transition ${
                            active ? "bg-accent/10 ring-1 ring-accent/40" : "hover:bg-card/40"
                          }`}
                        >
                          <div className="flex flex-col items-center pt-1">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-accent/40 bg-background font-mono text-[10px] text-accent">
                              {g.visits.length - i}
                            </span>
                            {i < g.visits.length - 1 && <span className="mt-1 w-px flex-1 bg-border" />}
                          </div>
                          <button onClick={() => onLoad(r.id)} className="min-w-0 flex-1 text-left">
                            <div className="flex flex-wrap items-baseline gap-x-2">
                              <span className="font-mono text-xs text-foreground">
                                {new Date(r.savedAt).toLocaleDateString("vi-VN")}
                              </span>
                              <span className="font-mono text-[10px] text-muted-foreground">
                                {new Date(r.savedAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                              </span>
                              {active && <span className="font-mono text-[10px] text-accent">● đang mở</span>}
                            </div>
                            {r.b1.chief && (
                              <div className="mt-0.5 truncate text-xs text-foreground">
                                <span className="text-muted-foreground">Lý do:</span> {r.b1.chief}
                              </div>
                            )}
                            {r.b3.hoiChung && (
                              <div className="mt-0.5 truncate text-xs text-accent">→ {r.b3.hoiChung}{r.b3.phap && <span className="text-muted-foreground"> · {r.b3.phap}</span>}</div>
                            )}
                            {r.b4.phuong && (
                              <div className="mt-0.5 truncate text-xs text-muted-foreground">💊 {r.b4.phuong}</div>
                            )}
                            {r.b4?.chamCuu?.huyetChinh && (
                              <div className="mt-0.5 truncate text-xs text-sky-300/90">🪡 {r.b4.chamCuu.huyetChinh}</div>
                            )}
                            {r.b4?.yhhd?.chanDoan && (
                              <div className="mt-0.5 truncate text-xs text-primary/90">🏥 {r.b4.yhhd.chanDoan}</div>
                            )}
                          </button>
                          <div className="flex flex-col items-end gap-1">
                            <label className="flex cursor-pointer items-center gap-1 font-mono text-[10px] text-muted-foreground">
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => onToggleCompare(r.id)}
                                className="h-3 w-3 accent-[var(--accent)]"
                              />
                              So sánh
                            </label>
                            <button
                              onClick={() => onDelete(r.id)}
                              className="font-mono text-[10px] text-muted-foreground opacity-0 transition hover:text-destructive group-hover:opacity-100"
                            >
                              Xoá
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}



