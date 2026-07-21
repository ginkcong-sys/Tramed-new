import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { phanTichLuoi } from "@/lib/vong-chan.functions";
import logoAsset from "@/assets/tramed-logo-official.png.asset.json";


export const Route = createFileRoute("/vong-chan")({
  head: () => ({
    meta: [
      { title: "Vọng chẩn thông minh – Phân tích ảnh lưỡi YHCT | TRAMED" },
      { name: "description", content: "Tải ảnh lưỡi, Phân tích chất lưỡi – rêu lưỡi – định khu tạng phủ và gợi ý thể bệnh YHCT trong vài giây." },
    ],
  }),
  component: VongChan,
});

const STEPS = [
  "Đang nhận diện vùng lưỡi…",
  "Phân tích chất lưỡi (Thiệt chất)…",
  "Phân tích rêu lưỡi (Thiệt đài)…",
  "Định khu Tạng phủ theo bản đồ lưỡi…",
  "Tổng hợp thể bệnh & pháp điều trị…",
];
const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));


function useStepTimer(active: boolean) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!active) { setStep(0); return; }
    setStep(0);
    const timers = STEPS.map((_, i) =>
      setTimeout(() => setStep(i), i * 1800)
    );
    return () => timers.forEach(clearTimeout);
  }, [active]);
  return step;
}

function VongChan() {
  const fn = useServerFn(phanTichLuoi);
  const [preview, setPreview] = useState<string | null>(null);
  const [imgB64, setImgB64] = useState<string | null>(null);
  const [mime, setMime] = useState<string>("image/jpeg");
  const [note, setNote] = useState("");
  const [out, setOut] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [saves, setSaves] = useState<Array<{ id: string; at: string; note: string; content: string }>>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const articleRef = useRef<HTMLElement>(null);
  const step = useStepTimer(loading);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("vong-chan:saves");
      if (raw) setSaves(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  const persistSaves = (next: typeof saves) => {
    setSaves(next);
    try { localStorage.setItem("vong-chan:saves", JSON.stringify(next)); } catch { /* ignore */ }
  };

  const startEdit = () => { setDraft(out); setEditing(true); };
  const cancelEdit = () => { setEditing(false); setDraft(""); };
  const applyEdit = () => { setOut(draft); setEditing(false); };

  const printReport = () => {
    if (!out.trim()) return;
    const rec = { id: crypto.randomUUID(), at: new Date().toISOString(), note, content: out };
    persistSaves([rec, ...saves].slice(0, 50));
    const logoUrl = new URL(logoAsset.url, window.location.origin).href;
    const imgUrl = preview ?? "";
    const bodyHtml = articleRef.current?.innerHTML ?? "";
    const noteHtml = note.trim() ? `<div class="note"><strong>Ghi chú lâm sàng:</strong> ${escapeHtml(note)}</div>` : "";
    const now = new Date().toLocaleString("vi-VN");
    const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8"/>
<title>Báo cáo Vọng chẩn thông minh – TRAMED</title>
<style>
  @page { size: A4; margin: 18mm 16mm; }
  * { box-sizing: border-box; }
  body { font-family: 'Inter','Plus Jakarta Sans',system-ui,sans-serif; color:#0f172a; margin:0; line-height:1.55; font-size:12.5pt; }
  .header { display:flex; align-items:center; justify-content:space-between; padding-bottom:14px; border-bottom:2px solid #0e7490; margin-bottom:18px; }
  .brand { display:flex; align-items:center; gap:12px; }
  .brand img { height:48px; width:auto; }
  .brand .name { font-weight:700; font-size:16pt; letter-spacing:-0.01em; color:#0e7490; }
  .brand .tag { font-size:9pt; color:#64748b; text-transform:uppercase; letter-spacing:0.18em; }
  .meta { text-align:right; font-size:9pt; color:#475569; }
  h1.title { font-size:20pt; margin:0 0 6px; letter-spacing:-0.02em; color:#0f172a; }
  .subtitle { color:#64748b; font-size:10pt; text-transform:uppercase; letter-spacing:0.25em; margin-bottom:18px; }
  .grid { display:grid; grid-template-columns: 220px 1fr; gap:18px; margin-bottom:18px; }
  .photo { border:1px solid #e2e8f0; border-radius:8px; overflow:hidden; background:#f8fafc; }
  .photo img { width:100%; display:block; }
  .photo .cap { font-size:8.5pt; color:#64748b; padding:6px 8px; border-top:1px solid #e2e8f0; background:#fff; text-align:center; }
  .note { background:#ecfeff; border-left:3px solid #06b6d4; padding:10px 14px; border-radius:4px; font-size:11pt; }
  .report { margin-top:6px; }
  .report h1,.report h2,.report h3 { color:#0e7490; margin-top:18px; margin-bottom:6px; font-weight:600; }
  .report h1 { font-size:15pt; }
  .report h2 { font-size:13pt; }
  .report h3 { font-size:11.5pt; }
  .report p { margin:6px 0; }
  .report ul,.report ol { margin:6px 0 6px 20px; }
  .report li { margin:2px 0; }
  .report strong { color:#0f172a; }
  .report blockquote { border-left:3px solid #0e7490; background:#f0fdfa; padding:8px 12px; margin:8px 0; color:#0f172a; }
  .report table { border-collapse:collapse; width:100%; margin:8px 0; font-size:10.5pt; }
  .report th,.report td { border:1px solid #cbd5e1; padding:6px 8px; text-align:left; }
  .report th { background:#f1f5f9; }
  .footer { margin-top:24px; padding-top:12px; border-top:1px solid #e2e8f0; font-size:8.5pt; color:#64748b; display:flex; justify-content:space-between; }
  .stamp { margin-top:32px; display:flex; justify-content:flex-end; }
  .stamp .box { width:240px; text-align:center; font-size:10pt; color:#475569; }
  .stamp .box .line { height:60px; }
  .stamp .box .label { border-top:1px solid #94a3b8; padding-top:6px; }
  @media print { .noprint { display:none !important; } body { padding-top:24px !important; } }
  .toolbar { position:fixed; top:14px; right:16px; display:flex; gap:10px; z-index:9999; background:rgba(255,255,255,0.95); padding:8px; border-radius:10px; box-shadow:0 4px 16px rgba(15,23,42,0.12); backdrop-filter:blur(6px); }
  .toolbar button { background:#0e7490; color:#fff; border:0; padding:9px 16px; border-radius:6px; font-size:11pt; cursor:pointer; font-weight:600; white-space:nowrap; }
  .toolbar button:hover { background:#155e75; }
  .toolbar button.ghost { background:#fff; color:#0e7490; border:1px solid #0e7490; }
  .toolbar button.ghost:hover { background:#f0fdfa; }
  body { padding-top:72px; }
</style></head><body>
  <div class="toolbar noprint">
    <button onclick="window.print()">🖨️ In báo cáo</button>
    <button type="button" class="ghost" onclick="window.close()">✕ Đóng</button>
  </div>

  <div class="header">
    <div class="brand">
      <img src="${logoUrl}" alt="TRAMED"/>
      <div>
        <div class="name">TRAMED</div>
        <div class="tag">Y học cổ truyền · Deep-Tech</div>
      </div>
    </div>
    <div class="meta">
      Báo cáo Vọng chẩn thông minh<br/>
      Ngày in: ${now}
    </div>
  </div>
  <div class="subtitle">Tứ chẩn · Vọng · Phân tích ảnh lưỡi</div>
  <h1 class="title">Kết quả Vọng chẩn lưỡi theo YHCT</h1>
  <div class="grid">
    <div class="photo">
      ${imgUrl ? `<img src="${imgUrl}" alt="Ảnh lưỡi bệnh nhân"/>` : ""}
      <div class="cap">Ảnh lưỡi bệnh nhân</div>
    </div>
    <div>${noteHtml}</div>
  </div>
  <div class="report">${bodyHtml}</div>
  <div class="stamp">
    <div class="box">
      <div class="line"></div>
      <div class="label">Chữ ký thầy thuốc</div>
    </div>
  </div>
  <div class="footer">
    <div>TRAMED © ${new Date().getFullYear()} – trameddeeptech.cloud</div>
    <div>Báo cáo có giá trị tham khảo, cần đối chiếu Tứ chẩn lâm sàng.</div>
  </div>
  <script>window.addEventListener('load',()=>setTimeout(()=>window.print(),400));</script>
</body></html>`;
    const w = window.open("", "_blank", "width=900,height=1100");
    if (!w) { alert("Trình duyệt chặn cửa sổ in. Vui lòng cho phép pop-up."); return; }
    w.document.open(); w.document.write(html); w.document.close();
  };

  const loadRecord = (r: { note: string; content: string }) => {
    setNote(r.note); setOut(r.content); setEditing(false); setErr(null);
  };

  const deleteRecord = (id: string) => persistSaves(saves.filter((s) => s.id !== id));

  const onFile = async (f: File | undefined) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) { setErr("Vui lòng chọn file ảnh."); return; }
    if (f.size > 8 * 1024 * 1024) { setErr("Ảnh quá lớn (tối đa 8MB)."); return; }
    setErr(null);
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setPreview(dataUrl);
      const [, b64] = dataUrl.split(",");
      setImgB64(b64);
      setMime(f.type);
      setOut("");
    };
    reader.readAsDataURL(f);
  };

  const analyze = async () => {
    if (!imgB64) { setErr("Hãy tải ảnh lưỡi trước."); return; }
    setLoading(true); setErr(null); setOut(""); setEditing(false);
    try {
      const r = await fn({ data: { imageBase64: imgB64, mimeType: mime, note } });
      setOut(r.content);
    } catch (e: any) {
      setErr(e?.message ?? "Lỗi không xác định");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setPreview(null); setImgB64(null); setOut(""); setErr(null); setNote(""); setCopied(false); setEditing(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const copyResult = async () => {
    if (!out) return;
    await navigator.clipboard.writeText(out);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    onFile(f);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="z-30 border-b border-border/40 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="font-mono text-sm tracking-tight text-muted-foreground hover:text-foreground">← TRAMED</Link>
          <nav className="flex gap-4 text-xs font-mono text-muted-foreground">
            <Link to="/kham-benh" className="hover:text-foreground">/ khám bệnh</Link>
            <Link to="/ke-don" className="hover:text-foreground">/ kê đơn</Link>
            <Link to="/vong-chan" className="text-foreground">/ vọng chẩn</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">Tứ chẩn · Vọng</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">
            Phân tích ảnh lưỡi <span className="text-accent">tự động</span>
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Tải ảnh lưỡi của bệnh nhân – Hệ thống sẽ vọng chẩn theo cấu trúc YHCT: <b>chất lưỡi · rêu lưỡi · định khu tạng phủ · gợi ý thể bệnh · pháp điều trị</b>. Ảnh không lưu trên máy chủ.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          {/* LEFT: upload & preview */}
          <section className="flex flex-col gap-5 rounded-2xl border border-border/60 bg-card/40 p-5">
            <h2 className="text-sm font-mono uppercase tracking-widest text-muted-foreground">Bước 1 · Tải ảnh lưỡi</h2>

            <label
              htmlFor="tongue-file"
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              className={`relative flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-3 overflow-hidden rounded-xl border-2 border-dashed transition ${
                dragOver ? "border-accent bg-accent/10" : "border-border/60 bg-background/40 hover:border-accent/60 hover:bg-accent/5"
              }`}
            >
              {preview ? (
                <img src={preview} alt="Ảnh lưỡi" className="h-full w-full object-cover" />
              ) : (
                <>
                  <div className="text-center">
                    <p className="font-medium">Bấm chọn hoặc kéo thả ảnh vào đây</p>
                    <p className="mt-1 text-xs text-muted-foreground">JPG/PNG, tối đa 8MB</p>
                  </div>
                </>
              )}
              <input
                id="tongue-file"
                ref={inputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => onFile(e.target.files?.[0])}
              />
            </label>

            {preview && (
              <div className="rounded-lg border border-border/40 bg-background/40 p-3">
                <p className="text-xs font-medium text-foreground">Ảnh đã tải lên</p>
                <p className="mt-1 text-xs text-muted-foreground">{mime.replace("image/", ".")} · sẵn sàng phân tích</p>
              </div>
            )}

            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Ghi chú lâm sàng (tuỳ chọn)</label>
              <textarea
                className="mt-2 h-24 w-full rounded-lg border border-border/60 bg-background/60 p-3 text-sm outline-none focus:border-accent"
                placeholder="Vd: BN nữ 45t, mệt mỏi, ăn kém, đại tiện lỏng 1 tuần…"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <button
                disabled={!imgB64 || loading}
                onClick={analyze}
                className="flex-1 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground transition hover:opacity-90 disabled:opacity-40"
              >
                {loading ? "Đang vọng chẩn…" : "🔍 Vọng chẩn ảnh lưỡi"}
              </button>
              {preview && (
                <button onClick={reset} className="rounded-lg border border-border/60 px-3 py-2.5 text-sm hover:bg-accent/10">
                  Xoá
                </button>
              )}
            </div>

            <div className="rounded-lg border border-border/40 bg-background/40 p-3 text-xs text-muted-foreground">
              <p className="mb-1 font-semibold text-foreground">💡 Mẹo chụp ảnh lưỡi chuẩn:</p>
              <ul className="ml-4 list-disc space-y-0.5">
                <li>Há miệng to, thè lưỡi tự nhiên (không gồng)</li>
                <li>Ánh sáng ban ngày, không dùng flash</li>
                <li>Tránh ăn uống có màu (cà phê, củ dền…) 30' trước</li>
                <li>Chụp thẳng, lưỡi chiếm ~70% khung hình</li>
              </ul>
            </div>
          </section>

          {/* RIGHT: result */}
          <section className="flex flex-col rounded-2xl border border-border/60 bg-card/40 p-5">
            <div className="mb-4 flex items-center justify-between gap-2">
              <h2 className="text-sm font-mono uppercase tracking-widest text-muted-foreground">Bước 2 · Kết quả phân tích</h2>
              {out && (
                <div className="flex flex-wrap items-center gap-1.5">
                  {!editing ? (
                    <>
                      <button
                        onClick={startEdit}
                        className="rounded-md border border-border/60 px-2.5 py-1 text-xs font-medium hover:bg-accent/10"
                      >
                        ✎ Chỉnh sửa
                      </button>
                      <button
                        onClick={printReport}
                        className="rounded-md border border-accent/40 bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent transition hover:bg-accent/20"
                      >
                        🖨️ In báo cáo
                      </button>
                      <button
                        onClick={copyResult}
                        className={`rounded-md border px-2.5 py-1 text-xs font-medium transition ${
                          copied ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-400" : "border-border/60 hover:bg-accent/10"
                        }`}
                      >
                        {copied ? "Đã sao chép" : "Sao chép"}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={applyEdit}
                        className="rounded-md border border-accent/40 bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent hover:bg-accent/20"
                      >
                        ✓ Áp dụng
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="rounded-md border border-border/60 px-2.5 py-1 text-xs font-medium hover:bg-accent/10"
                      >
                        Huỷ
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {err && (
              <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">{err}</div>
            )}

            {!out && !loading && !err && (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 py-16 text-center text-muted-foreground">
                <div className="text-6xl opacity-30">🔬</div>
                <p>Kết quả vọng chẩn sẽ hiện ở đây</p>
                <p className="max-w-xs text-xs">Tải ảnh lưỡi bên trái, thêm ghi chú lâm sàng nếu có, rồi bấm "Vọng chẩn ảnh lưỡi".</p>
              </div>
            )}

            {loading && (
              <div className="flex flex-1 flex-col items-center justify-center gap-6 py-16 text-center">
                <div className="relative h-12 w-12">
                  <div className="absolute inset-0 animate-spin rounded-full border-2 border-accent/30 border-t-accent" />
                  <div className="absolute inset-2 animate-spin rounded-full border-2 border-accent/20 border-b-accent" style={{ animationDirection: "reverse", animationDuration: "1.2s" }} />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Đang vọng chẩn</p>
                  <div className="mx-auto max-w-xs space-y-1.5">
                    {STEPS.map((s, i) => (
                      <div key={s} className={`flex items-center gap-2 text-xs transition-opacity ${i <= step ? "text-muted-foreground opacity-100" : "opacity-30"}`}>
                        <span className={`inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${i < step ? "bg-cyan-500/20 text-cyan-400" : i === step ? "bg-accent/20 text-accent" : "bg-border/40 text-muted-foreground"}`}>
                          {i < step ? "✓" : i + 1}
                        </span>
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {out && editing && (
              <div className="flex flex-1 flex-col gap-2">
                <p className="text-xs text-muted-foreground">
                  Chỉnh sửa chẩn đoán (Markdown). Bấm <b>Áp dụng</b> để xem trước, rồi <b>Lưu</b> để lưu hồ sơ.
                </p>
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  className="min-h-[420px] flex-1 rounded-lg border border-accent/40 bg-background/80 p-3 font-mono text-xs leading-relaxed outline-none focus:border-accent"
                />
              </div>
            )}

            {out && !editing && (
              <article ref={articleRef} className="prose prose-sm prose-invert max-w-none flex-1 overflow-y-auto prose-headings:text-accent prose-strong:text-foreground prose-blockquote:border-l-accent/60 prose-blockquote:bg-accent/5 prose-blockquote:py-1 prose-blockquote:pl-4">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{out}</ReactMarkdown>
              </article>
            )}

            {saves.length > 0 && (
              <div className="mt-5 border-t border-border/40 pt-4">
                <p className="mb-2 text-xs font-mono uppercase tracking-widest text-muted-foreground">
                  Hồ sơ đã lưu ({saves.length})
                </p>
                <ul className="max-h-48 space-y-1.5 overflow-y-auto">
                  {saves.map((r) => (
                    <li key={r.id} className="flex items-center justify-between gap-2 rounded-md border border-border/40 bg-background/40 px-2.5 py-1.5 text-xs">
                      <button onClick={() => loadRecord(r)} className="flex-1 truncate text-left hover:text-accent">
                        <span className="font-medium">{new Date(r.at).toLocaleString("vi-VN")}</span>
                        {r.note && <span className="ml-2 text-muted-foreground">· {r.note.slice(0, 60)}</span>}
                      </button>
                      <button onClick={() => deleteRecord(r.id)} className="text-muted-foreground hover:text-destructive" title="Xoá">✕</button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

        </div>
      </main>
    </div>
  );
}

