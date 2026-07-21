import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/mo-phong")({
  head: () => ({
    meta: [
      { title: "Mô phỏng số liệu dự đoán – TRAMED Eureka" },
      { name: "description", content: "Nhập tham số đầu vào và mô phỏng Accuracy, F1, Cohen's Kappa, AUC theo công thức trong đề cương NCKH Eureka." },
    ],
  }),
  component: MoPhongPage,
});

type Row = {
  module: string;
  tp: number;
  fp: number;
  fn: number;
  tn: number;
  // For Kappa (agreement with expert) and AUC (ROC) we use independent params
  poExpert: number; // observed agreement
  peExpert: number; // expected agreement (chance)
  auc: number;
};

const DEFAULTS: Row[] = [
  { module: "Chẩn đoán bát cương", tp: 78, fp: 12, fn: 10, tn: 100, poExpert: 0.87, peExpert: 0.50, auc: 0.92 },
  { module: "Biện chứng tạng phủ", tp: 72, fp: 15, fn: 13, tn: 100, poExpert: 0.84, peExpert: 0.48, auc: 0.90 },
  { module: "Kê đơn Quân–Thần–Tá–Sứ", tp: 80, fp: 10, fn: 10, tn: 100, poExpert: 0.88, peExpert: 0.50, auc: 0.93 },
  { module: "Phân tích lưỡi (vọng chẩn)", tp: 85, fp: 8, fn: 7, tn: 100, poExpert: 0.90, peExpert: 0.52, auc: 0.95 },
  { module: "Tư vấn dinh dưỡng YHCT", tp: 76, fp: 14, fn: 10, tn: 100, poExpert: 0.86, peExpert: 0.50, auc: 0.91 },
];

function calc(r: Row) {
  const { tp, fp, fn, tn } = r;
  const total = tp + fp + fn + tn;
  const accuracy = total ? (tp + tn) / total : 0;
  const precision = tp + fp ? tp / (tp + fp) : 0;
  const recall = tp + fn ? tp / (tp + fn) : 0;
  const f1 = precision + recall ? (2 * precision * recall) / (precision + recall) : 0;
  const kappa = r.peExpert < 1 ? (r.poExpert - r.peExpert) / (1 - r.peExpert) : 0;
  return { accuracy, precision, recall, f1, kappa, auc: r.auc };
}

const pct = (x: number) => (x * 100).toFixed(1) + "%";
const num = (x: number) => x.toFixed(3);

function MoPhongPage() {
  const [rows, setRows] = useState<Row[]>(DEFAULTS);

  const results = useMemo(() => rows.map(calc), [rows]);

  const avg = useMemo(() => {
    const n = results.length || 1;
    const sum = (k: keyof ReturnType<typeof calc>) => results.reduce((s, r) => s + r[k], 0) / n;
    return {
      accuracy: sum("accuracy"),
      precision: sum("precision"),
      recall: sum("recall"),
      f1: sum("f1"),
      kappa: sum("kappa"),
      auc: sum("auc"),
    };
  }, [results]);

  const update = (i: number, key: keyof Row, val: string) => {
    setRows(prev => {
      const next = [...prev];
      const v = key === "module" ? val : Number(val);
      next[i] = { ...next[i], [key]: v } as Row;
      return next;
    });
  };

  return (
    <div className="min-h-screen px-6 py-10 max-w-7xl mx-auto" style={{ color: "var(--ink)" }}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold" style={{ color: "#38BDF8" }}>
          Mô phỏng số liệu dự đoán – Eureka NCKH
        </h1>
        <Link to="/" className="underline opacity-80 hover:opacity-100">← Trang chủ</Link>
      </div>

      <section className="mb-6 rounded-xl border border-white/10 p-4 bg-white/5">
        <h2 className="text-xl font-semibold mb-2">Công thức áp dụng</h2>
        <ul className="list-disc pl-6 space-y-1 text-sm leading-relaxed">
          <li><b>Accuracy</b> = (TP + TN) / (TP + FP + FN + TN)</li>
          <li><b>Precision</b> = TP / (TP + FP); <b>Recall</b> = TP / (TP + FN)</li>
          <li><b>F1</b> = 2·Precision·Recall / (Precision + Recall)</li>
          <li><b>Cohen's Kappa</b> κ = (P<sub>o</sub> − P<sub>e</sub>) / (1 − P<sub>e</sub>) – đồng thuận với chuyên gia YHCT</li>
          <li><b>AUC</b> = diện tích dưới đường ROC (nhập trực tiếp từ thực nghiệm/mô phỏng)</li>
        </ul>
      </section>

      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-white/10">
            <tr>
              <th className="p-2 text-left">Module</th>
              <th className="p-2">TP</th>
              <th className="p-2">FP</th>
              <th className="p-2">FN</th>
              <th className="p-2">TN</th>
              <th className="p-2">P<sub>o</sub></th>
              <th className="p-2">P<sub>e</sub></th>
              <th className="p-2">AUC</th>
              <th className="p-2 bg-sky-500/10">Accuracy</th>
              <th className="p-2 bg-sky-500/10">F1</th>
              <th className="p-2 bg-sky-500/10">Kappa</th>
              <th className="p-2 bg-sky-500/10">AUC</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const c = results[i];
              return (
                <tr key={i} className="border-t border-white/10">
                  <td className="p-1">
                    <input className="w-56 bg-transparent border border-white/15 rounded px-2 py-1"
                      value={r.module} onChange={e => update(i, "module", e.target.value)} />
                  </td>
                  {(["tp","fp","fn","tn"] as const).map(k => (
                    <td key={k} className="p-1">
                      <input type="number" className="w-16 bg-transparent border border-white/15 rounded px-2 py-1 text-center"
                        value={r[k]} onChange={e => update(i, k, e.target.value)} />
                    </td>
                  ))}
                  <td className="p-1">
                    <input type="number" step="0.01" min={0} max={1}
                      className="w-20 bg-transparent border border-white/15 rounded px-2 py-1 text-center"
                      value={r.poExpert} onChange={e => update(i, "poExpert", e.target.value)} />
                  </td>
                  <td className="p-1">
                    <input type="number" step="0.01" min={0} max={1}
                      className="w-20 bg-transparent border border-white/15 rounded px-2 py-1 text-center"
                      value={r.peExpert} onChange={e => update(i, "peExpert", e.target.value)} />
                  </td>
                  <td className="p-1">
                    <input type="number" step="0.01" min={0} max={1}
                      className="w-20 bg-transparent border border-white/15 rounded px-2 py-1 text-center"
                      value={r.auc} onChange={e => update(i, "auc", e.target.value)} />
                  </td>
                  <td className="p-2 text-center font-mono">{pct(c.accuracy)}</td>
                  <td className="p-2 text-center font-mono">{num(c.f1)}</td>
                  <td className="p-2 text-center font-mono">{num(c.kappa)}</td>
                  <td className="p-2 text-center font-mono">{num(c.auc)}</td>
                </tr>
              );
            })}
            <tr className="border-t-2 border-sky-500/40 bg-sky-500/5 font-semibold">
              <td className="p-2 text-right" colSpan={8}>Trung bình toàn hệ thống</td>
              <td className="p-2 text-center font-mono">{pct(avg.accuracy)}</td>
              <td className="p-2 text-center font-mono">{num(avg.f1)}</td>
              <td className="p-2 text-center font-mono">{num(avg.kappa)}</td>
              <td className="p-2 text-center font-mono">{num(avg.auc)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex gap-3">
        <button
          onClick={() => setRows(DEFAULTS)}
          className="px-4 py-2 rounded border border-white/20 hover:bg-white/10"
        >Reset về dữ liệu mặc định trong đề cương</button>
        <button
          onClick={() => {
            const csv = ["module,TP,FP,FN,TN,Po,Pe,AUC_in,Accuracy,Precision,Recall,F1,Kappa,AUC"]
              .concat(rows.map((r, i) => {
                const c = results[i];
                return [r.module, r.tp, r.fp, r.fn, r.tn, r.poExpert, r.peExpert, r.auc,
                  c.accuracy.toFixed(4), c.precision.toFixed(4), c.recall.toFixed(4),
                  c.f1.toFixed(4), c.kappa.toFixed(4), c.auc.toFixed(4)].join(",");
              })).join("\n");
            const blob = new Blob([csv], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url; a.download = "mo-phong-eureka.csv"; a.click();
            URL.revokeObjectURL(url);
          }}
          className="px-4 py-2 rounded border border-sky-500/40 text-sky-300 hover:bg-sky-500/10"
        >Xuất CSV</button>
      </div>

      <p className="mt-6 text-xs opacity-70">
        * Bảng tính dùng đúng công thức nêu trong Chương 4 đề cương. Các giá trị mặc định là dự đoán
        cơ sở (baseline) trùng với bảng kết quả dự kiến – bạn có thể chỉnh TP/FP/FN/TN, P<sub>o</sub>, P<sub>e</sub>, AUC để
        mô phỏng các kịch bản khác nhau (tốt nhất / xấu nhất / kỳ vọng).
      </p>
    </div>
  );
}
