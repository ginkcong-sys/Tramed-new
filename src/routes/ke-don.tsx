import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { tradmedChat, type ChatMsg } from "@/lib/tradmed.functions";
import { useSharedPatient, writeSharedPatient, clearSharedPatient } from "@/lib/shared-patient";
import logo from "@/assets/tramed-logo-official.png.asset.json";

export const Route = createFileRoute("/ke-don")({
  head: () => ({
    meta: [
      { title: "Trợ lý kê đơn YHCT – TRAMED" },
      { name: "description", content: "Nhập Tứ chẩn theo từng bước, biện chứng và kê đơn Quân-Thần-Tá-Sứ với cảnh báo tương tác Đông-Tây y." },
    ],
  }),
  component: KeDon,
});

type Patient = {
  name: string; year: string; gender: string; date: string; chief: string;
};
type TuChan = {
  vong: string; van: string; van_q: string; thiet: string; tongue: string; pulse: string;
};
type History = {
  past: string; allergy: string; meds: string; pregnant: string; labs: string;
};

const TABS = [
  { v: "ho-so", label: "1 · Hồ sơ" },
  { v: "tu-chan", label: "2 · Tứ chẩn" },
  { v: "tien-su", label: "3 · Tiền sử & Thuốc" },
  { v: "ai", label: "4 · Biện chứng & Kê đơn" },
  { v: "chat", label: "5 · Hỏi đáp tự do" },
] as const;

function KeDon() {
  const fn = useServerFn(tradmedChat);
  const [tab, setTab] = useState<string>("ho-so");

  const [p, setP] = useState<Patient>({ name: "", year: "", gender: "", date: new Date().toISOString().slice(0, 10), chief: "" });
  const [t, setT] = useState<TuChan>({ vong: "", van: "", van_q: "", thiet: "", tongue: "", pulse: "" });
  const [h, setH] = useState<History>({ past: "", allergy: "", meds: "", pregnant: "", labs: "" });

  const [aiOut, setAiOut] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // free chat
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  // === Liên kết hồ sơ bệnh nhân với tab Khám bệnh ===
  useSharedPatient((sp) => {
    if (!sp) return;
    setP((x) => ({
      ...x,
      name: sp.name ?? x.name,
      year: sp.year ?? x.year,
      gender: sp.gender ?? x.gender,
      date: sp.date ?? x.date,
      chief: sp.chief ?? x.chief,
    }));
  });
  useEffect(() => {
    writeSharedPatient({
      name: p.name, year: p.year, gender: p.gender, date: p.date, chief: p.chief,
    });
  }, [p.name, p.year, p.gender, p.date, p.chief]);

  const prompt = useMemo(() => buildPrompt(p, t, h), [p, t, h]);

  const runAnalysis = async () => {
    setErr(null); setLoading(true); setAiOut("");
    try {
      const { content } = await fn({ data: { messages: [{ role: "user", content: prompt }] } });
      setAiOut(content);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Lỗi không xác định");
    } finally { setLoading(false); }
  };

  const sendChat = async (text: string) => {
    const txt = text.trim(); if (!txt || loading) return;
    setErr(null);
    const ctx: ChatMsg = { role: "system", content: "Bối cảnh bệnh nhân:\n" + prompt };
    const next: ChatMsg[] = [...messages, { role: "user", content: txt }];
    setMessages(next); setInput(""); setLoading(true);
    try {
      const { content } = await fn({ data: { messages: [ctx, ...next] } });
      setMessages([...next, { role: "assistant", content }]);
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Lỗi không xác định");
    } finally { setLoading(false); }
  };

  const next = () => {
    const order = TABS.map(x => x.v) as string[];
    const i = order.indexOf(tab);
    if (i < order.length - 1) setTab(order[i + 1]);
  };
  const prev = () => {
    const order = TABS.map(x => x.v) as string[];
    const i = order.indexOf(tab);
    if (i > 0) setTab(order[i - 1]);
  };

  return (
    <div className="min-h-screen">
      <header className="container mx-auto flex items-center justify-between gap-3 px-6 py-5">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-card/50 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground transition hover:border-accent/50 hover:bg-accent/10 hover:text-accent"
          >
            <span className="transition-transform group-hover:-translate-x-0.5">←</span>
            <span>Trang chủ</span>
          </Link>
          <span className="hidden h-5 w-px bg-border md:block" />
          <Link to="/ke-don" className="flex items-center gap-3">
            <img src={logo.url} alt="TRAMED" className="h-10 w-10 rounded-md bg-white p-0.5 object-contain" />
            <div className="leading-tight">
              <div className="font-display text-lg font-semibold">TRAMED</div>
              <div className="text-xs text-muted-foreground">Phòng chẩn trị · Khám → Kê đơn</div>
            </div>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <nav className="hidden items-center gap-1 rounded-full border border-border/60 bg-card/40 px-1.5 py-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground md:flex">
            <Link to="/kham-benh" className="rounded-full px-3 py-1 transition hover:bg-accent/10 hover:text-accent">① Khám bệnh</Link>
            <span className="text-accent/50">→</span>
            <Link to="/ke-don" className="rounded-full bg-accent/15 px-3 py-1 text-accent">② Kê đơn thông minh</Link>
          </nav>
          <button
            onClick={() => {
              setP({ name: "", year: "", gender: "", date: new Date().toISOString().slice(0, 10), chief: "" });
              setT({ vong: "", van: "", van_q: "", thiet: "", tongue: "", pulse: "" });
              setH({ past: "", allergy: "", meds: "", pregnant: "", labs: "" });
              setAiOut(""); setMessages([]); setErr(null); setTab("ho-so");
              clearSharedPatient();
            }}
            className="rounded-md border border-border bg-card px-3 py-1.5 text-xs hover:bg-secondary"
          >Phiên mới</button>
        </div>
      </header>

      <main className="container mx-auto max-w-6xl px-6 pb-16">
        <div className="ink-border mb-6 rounded-xl bg-card/70 p-5">
          <div className="flex items-center justify-between">
            <h1 className="font-display text-2xl">Quy trình biện chứng & kê đơn</h1>
            <span className="seal text-sm">診</span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Đi qua 4 bước theo thứ tự: nhập Hồ sơ → Tứ chẩn → Tiền sử/Thuốc → biện chứng & kê đơn. Bạn có thể hỏi đáp tự do ở tab cuối.
          </p>
        </div>

        <Stepper current={tab} tabs={TABS as unknown as { v: string; label: string }[]} onChange={setTab} />

        <Tabs value={tab} onValueChange={setTab}>

          {/* TAB 1 – HỒ SƠ */}
          <TabsContent value="ho-so" className="mt-6">
            <Card title="Hồ sơ bệnh nhân" desc="Thông tin hành chính & lý do khám.">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Họ và tên" value={p.name} onChange={v => setP({ ...p, name: v })} placeholder="Nguyễn Văn A" />
                <Field label="Năm sinh" value={p.year} onChange={v => setP({ ...p, year: v })} placeholder="1965" />
                <Select label="Giới tính" value={p.gender} onChange={v => setP({ ...p, gender: v })} options={["Nam", "Nữ", "Khác"]} />
                <Field label="Ngày khám" type="date" value={p.date} onChange={v => setP({ ...p, date: v })} />
                <Area label="Lý do tới khám / triệu chứng chính" value={p.chief} onChange={v => setP({ ...p, chief: v })} className="md:col-span-2" placeholder="Đau đầu, chóng mặt, mất ngủ 2 tuần…" />
              </div>
            </Card>
            <Nav onPrev={prev} onNext={next} hidePrev />
          </TabsContent>

          {/* TAB 2 – TỨ CHẨN */}
          <TabsContent value="tu-chan" className="mt-6">
            <Card title="Tứ chẩn" desc="Vọng – Văn – Vấn – Thiết.">
              <div className="grid gap-4 md:grid-cols-2">
                <Area label="Vọng chẩn (sắc mặt, hình thái, thần sắc…)" value={t.vong} onChange={v => setT({ ...t, vong: v })} />
                <Area label="Văn chẩn (giọng nói, hơi thở, mùi…)" value={t.van} onChange={v => setT({ ...t, van: v })} />
                <Area label="Vấn chẩn (đau, hàn nhiệt, ăn ngủ, đại tiểu tiện, kinh nguyệt…)" value={t.van_q} onChange={v => setT({ ...t, van_q: v })} className="md:col-span-2" />
                <Field label="Lưỡi (chất – rêu)" value={t.tongue} onChange={v => setT({ ...t, tongue: v })} placeholder="Lưỡi đỏ, rêu vàng khô" />
                <Field label="Mạch" value={t.pulse} onChange={v => setT({ ...t, pulse: v })} placeholder="Huyền sác" />
                <Area label="Thiết chẩn khác (sờ nắn, ấn huyệt…)" value={t.thiet} onChange={v => setT({ ...t, thiet: v })} className="md:col-span-2" />
              </div>
            </Card>
            <Nav onPrev={prev} onNext={next} />
          </TabsContent>

          {/* TAB 3 – TIỀN SỬ & THUỐC */}
          <TabsContent value="tien-su" className="mt-6">
            <Card title="Tiền sử – Thuốc đang dùng" desc="Để cảnh báo tương tác Đông–Tây y chính xác.">
              <div className="grid gap-4 md:grid-cols-2">
                <Area label="Tiền sử bệnh nền" value={h.past} onChange={v => setH({ ...h, past: v })} placeholder="THA 10 năm, ĐTĐ type 2…" />
                <Area label="Dị ứng" value={h.allergy} onChange={v => setH({ ...h, allergy: v })} placeholder="Penicillin, hải sản…" />
                <Area label="Tân dược đang dùng (tên – liều)" value={h.meds} onChange={v => setH({ ...h, meds: v })} className="md:col-span-2" placeholder="Warfarin 5mg/ngày, Amlodipine 5mg…" />
                <Select label="Thai sản / cho con bú" value={h.pregnant} onChange={v => setH({ ...h, pregnant: v })} options={["Không", "Có thai", "Cho con bú", "Không áp dụng"]} />
                <Area label="Xét nghiệm/cận lâm sàng đáng chú ý" value={h.labs} onChange={v => setH({ ...h, labs: v })} placeholder="Creatinin 1.6, INR 2.3…" />
              </div>
            </Card>
            <Nav onPrev={prev} onNext={next} />
          </TabsContent>

          {/* TAB 4 – BIỆN CHỨNG */}
          <TabsContent value="ai" className="mt-6">
            <Card title="biện chứng & kê đơn" desc="Hệ thống sẽ phân tích Bát cương – Tạng phủ, đề xuất pháp trị và phương dược Quân-Thần-Tá-Sứ.">
              <details className="mb-4 rounded-md border border-border bg-secondary/40 p-3 text-xs">
                <summary className="cursor-pointer text-muted-foreground">Xem dữ liệu sẽ gửi đi phân tích</summary>
                <pre className="mt-2 whitespace-pre-wrap text-xs">{prompt}</pre>
              </details>
              <button
                onClick={runAnalysis}
                disabled={loading}
                className="rounded-md bg-accent px-5 py-3 text-sm font-medium text-accent-foreground shadow transition hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Đang biện chứng…" : "▶ Chạy biện chứng & kê đơn"}
              </button>

              {err && <div className="mt-4 rounded-md border border-destructive bg-destructive/10 px-4 py-3 text-sm text-destructive">{err}</div>}

              {aiOut && (
                <div className="ink-border mt-6 rounded-xl bg-card p-5">
                  <div className="prose prose-sm max-w-none prose-headings:font-display prose-headings:text-foreground prose-strong:text-accent">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{aiOut}</ReactMarkdown>
                  </div>
                </div>
              )}
            </Card>
            <Nav onPrev={prev} onNext={next} />
          </TabsContent>

          {/* TAB 5 – CHAT */}
          <TabsContent value="chat" className="mt-6">
            <Card title="Hỏi đáp tự do" desc="Hệ thống đã nắm bối cảnh bệnh nhân ở các tab trước. Bạn có thể hỏi gia giảm, kiêng kỵ, châm cứu phối hợp…">
              <div className="space-y-3">
                {messages.length === 0 && (
                  <div className="rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground">
                    Ví dụ: "Có nên thêm Đan sâm không?", "Tư vấn ăn uống kiêng kỵ", "Gợi ý huyệt châm cứu phối hợp".
                  </div>
                )}
                {messages.map((m, i) => (
                  <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                    <div className={m.role === "user"
                      ? "max-w-[85%] rounded-2xl rounded-tr-sm bg-primary px-4 py-3 text-sm text-primary-foreground shadow"
                      : "ink-border max-w-[90%] rounded-2xl rounded-tl-sm bg-card px-5 py-4 shadow-sm"}>
                      {m.role === "assistant" ? (
                        <div className="prose prose-sm max-w-none prose-headings:font-display prose-strong:text-accent">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                        </div>
                      ) : <div className="whitespace-pre-wrap">{m.content}</div>}
                    </div>
                  </div>
                ))}
                {loading && <div className="text-sm text-muted-foreground">Đang suy nghĩ…</div>}
                {err && <div className="rounded-md border border-destructive bg-destructive/10 px-4 py-3 text-sm text-destructive">{err}</div>}
                <div ref={endRef} />
              </div>

              <form onSubmit={(e) => { e.preventDefault(); sendChat(input); }} className="mt-4 flex gap-2">
                <input
                  value={input} onChange={e => setInput(e.target.value)}
                  placeholder="Nhập câu hỏi…"
                  className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
                />
                <button type="submit" disabled={loading || !input.trim()}
                  className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground shadow disabled:opacity-50">
                  Gửi
                </button>
              </form>
            </Card>
            <Nav onPrev={prev} hideNext />
          </TabsContent>
        </Tabs>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Đề xuất tham khảo – quyết định cuối cùng thuộc về thầy thuốc lâm sàng.
        </p>
      </main>
    </div>
  );
}

/* ---------- helpers ---------- */
function buildPrompt(p: Patient, t: TuChan, h: History) {
  return `## HỒ SƠ BỆNH NHÂN
- Họ tên: ${p.name || "(chưa nhập)"}
- Năm sinh: ${p.year || "?"} · Giới tính: ${p.gender || "?"}
- Ngày khám: ${p.date}
- Lý do khám / triệu chứng chính: ${p.chief || "(chưa nhập)"}

## TỨ CHẨN
- Vọng: ${t.vong || "-"}
- Văn: ${t.van || "-"}
- Vấn: ${t.van_q || "-"}
- Lưỡi: ${t.tongue || "-"} · Mạch: ${t.pulse || "-"}
- Thiết khác: ${t.thiet || "-"}

## TIỀN SỬ – THUỐC
- Tiền sử: ${h.past || "-"}
- Dị ứng: ${h.allergy || "-"}
- Tân dược đang dùng: ${h.meds || "-"}
- Thai sản: ${h.pregnant || "-"}
- Cận lâm sàng: ${h.labs || "-"}

YÊU CẦU: Hãy trình bày theo cấu trúc Markdown rõ ràng:
1. **Tóm tắt biện chứng** (Bát cương, Tạng phủ, Khí huyết – Tân dịch)
2. **Chẩn đoán YHCT** (thể bệnh)
3. **Pháp điều trị**
4. **Phương dược** – bảng gồm: Vị thuốc | Liều (g) | Vai trò (Quân/Thần/Tá/Sứ) | Tính-vị-quy kinh
5. **Gia giảm** theo triệu chứng đi kèm
6. **Cảnh báo tương tác & chống chỉ định** (Thập bát phản – Thập cửu úy – tương tác với tân dược đang dùng)
7. **Kiêng kỵ & lời dặn**
8. **Theo dõi tái khám**`;
}

function Card({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <section className="ink-border rounded-xl bg-card p-6 shadow-sm">
      <h2 className="font-display text-xl">{title}</h2>
      {desc && <p className="mt-1 text-sm text-muted-foreground">{desc}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}
function Field({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-xs font-medium text-muted-foreground">{label}</span>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent" />
    </label>
  );
}
function Area({ label, value, onChange, placeholder, className }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; className?: string }) {
  return (
    <label className={`block text-sm ${className || ""}`}>
      <span className="mb-1 block text-xs font-medium text-muted-foreground">{label}</span>
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3}
        className="w-full resize-y rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent" />
    </label>
  );
}
function Stepper({ current, tabs, onChange }: { current: string; tabs: readonly { readonly v: string; readonly label: string }[]; onChange: (v: string) => void }) {
  const order = tabs.map(t => t.v);
  const currentIndex = order.indexOf(current);
  return (
    <div className="mb-8 px-2">
      <div className="relative flex items-start justify-between">
        <div className="absolute left-0 right-0 top-[15px] h-[2px] bg-muted" />
        <div
          className="absolute left-0 top-[15px] h-[2px] bg-primary transition-all duration-500"
          style={{ width: `${(Math.max(0, currentIndex) / (order.length - 1)) * 100}%` }}
        />
        {tabs.map((tab, i) => {
          const completed = i < currentIndex;
          const active = i === currentIndex;
          const clickable = i <= currentIndex + 1;
          const labelOnly = tab.label.replace(/^\d+\s*·\s*/, "");
          return (
            <div key={tab.v} className="relative z-10 flex flex-col items-center" style={{ width: `${100 / tabs.length}%` }}>
              <button
                onClick={() => clickable && onChange(tab.v)}
                disabled={!clickable}
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-bold transition-all duration-300 ${
                  active
                    ? "border-primary bg-primary text-primary-foreground shadow-md ring-2 ring-primary/20"
                    : completed
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted bg-background text-muted-foreground"
                } ${!clickable ? "cursor-not-allowed opacity-40" : "cursor-pointer hover:scale-110"}`}
              >
                {completed ? "Hoàn thành" : i + 1}
              </button>
              <span className={`mt-2 text-center text-[11px] font-medium leading-tight transition-colors duration-300 md:text-xs ${
                active ? "text-foreground font-semibold" : completed ? "text-foreground" : "text-muted-foreground"
              }`}>
                {labelOnly}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-xs font-medium text-muted-foreground">{label}</span>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent">
        <option value="">-- Chọn --</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}
function Nav({ onPrev, onNext, hidePrev, hideNext }: { onPrev?: () => void; onNext?: () => void; hidePrev?: boolean; hideNext?: boolean }) {
  return (
    <div className="mt-4 flex justify-between">
      {!hidePrev ? (
        <button onClick={onPrev} className="rounded-md border border-border bg-card px-4 py-2 text-sm hover:bg-secondary">⬅ Quay lại</button>
      ) : <span />}
      {!hideNext ? (
        <button onClick={onNext} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">Tiếp tục →</button>
      ) : <span />}
    </div>
  );
}
