import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell,
} from "recharts";

export const Route = createFileRoute("/dinh-duong/")({
  head: () => ({
    meta: [
      { title: "Dashboard Dinh dưỡng | TRAMED" },
      { name: "description", content: "Báo cáo dinh dưỡng lâm sàng: tổng quan BN đang theo dõi, tỉ lệ SDD, nguy cơ refeeding, phân bố chẩn đoán dinh dưỡng." },
    ],
  }),
  component: Dashboard,
});

const KPIS = [
  { label: "BN đang theo dõi", value: 142, sub: "+8 tuần này", tone: "accent" },
  { label: "Tỉ lệ SDD (NRS≥3)", value: "37%", sub: "53/142 BN", tone: "amber" },
  { label: "Đã can thiệp", value: "89%", sub: "47/53 BN nguy cơ", tone: "emerald" },
  { label: "Refeeding nguy cơ cao", value: 11, sub: "Cần BS dinh dưỡng review", tone: "destructive" },
];

const diagDist = [
  { name: "Suy kiệt / K", v: 38 },
  { name: "ĐTĐ", v: 27 },
  { name: "Hậu phẫu", v: 24 },
  { name: "Thận", v: 18 },
  { name: "Xơ gan", v: 14 },
  { name: "Khác", v: 21 },
];

const dietUse = [
  { name: "DD01", v: 32 }, { name: "DD02", v: 18 }, { name: "DD06", v: 27 },
  { name: "DD11", v: 22 }, { name: "DD04", v: 15 }, { name: "DD07", v: 12 },
];

const recent = [
  { id: "BN-2401", name: "Nguyễn Văn A", dx: "K dạ dày sau cắt 2/3", nrs: 4, risk: "Cao", template: "suy-kiet" },
  { id: "BN-2402", name: "Trần Thị B", dx: "ĐTĐ T2 + suy thận GĐ 3", nrs: 3, risk: "Vừa", template: "tieu-duong" },
  { id: "BN-2403", name: "Lê Văn C", dx: "Hậu phẫu cắt đại tràng phải", nrs: 2, risk: "Thấp", template: "sau-phau" },
  { id: "BN-2404", name: "Phạm Thị D", dx: "Xơ gan mất bù Child B", nrs: 4, risk: "Cao", template: "suy-kiet" },
  { id: "BN-2405", name: "Hoàng Văn E", dx: "COPD đợt cấp + SDD", nrs: 3, risk: "Vừa", template: "suy-kiet" },
];

const COLORS = ["#5cc8d0", "#7fb3d5", "#9b8cd4", "#d49b9b", "#d4b95c", "#7fd4a0"];

function Dashboard() {
  return (
    <div className="min-h-screen">
      <header className="z-30 border-b border-accent/30 bg-background/85 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between px-6 py-3">
          <Link to="/" className="font-display text-lg">TRAMED</Link>
          <nav className="flex gap-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            <Link to="/dinh-duong" className="rounded-full px-3 py-1.5 text-accent">/ dashboard</Link>
            <Link to="/dinh-duong/benh-an" search={{}} className="rounded-full px-3 py-1.5 hover:bg-accent/10 hover:text-accent">/ bệnh án</Link>
            <Link to="/kham-benh" className="rounded-full px-3 py-1.5 hover:bg-accent/10 hover:text-accent">/ khám bệnh</Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-widest text-accent">/ dinh dưỡng · báo cáo</div>
            <h1 className="font-display text-3xl">Dashboard Dinh dưỡng lâm sàng</h1>
            <p className="text-sm text-muted-foreground">Tổng quan BN, sàng lọc SDD, nguy cơ refeeding, hiệu quả can thiệp. (dữ liệu demo)</p>
          </div>
          <div className="flex gap-2">
            <Link to="/dinh-duong/benh-an" search={{}}><Button className="glow-cyan">+ Tạo bệnh án mới</Button></Link>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-4">
          {KPIS.map((k) => (
            <Card key={k.label} className="border-accent/20 bg-card/50">
              <CardContent className="pt-5">
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{k.label}</div>
                <div className={`font-display text-3xl ${
                  k.tone === "accent" ? "text-accent" :
                  k.tone === "amber" ? "text-sky-300" :
                  k.tone === "emerald" ? "text-emerald-300" : "text-destructive"
                }`}>{k.value}</div>
                <div className="text-xs text-muted-foreground">{k.sub}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-5">
          <Card className="border-accent/20 bg-card/50 lg:col-span-3">
            <CardHeader><CardTitle className="font-mono text-xs uppercase tracking-widest text-accent">Sử dụng diet-code (30 ngày)</CardTitle></CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dietUse}>
                    <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={11} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                    <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)" }} />
                    <Bar dataKey="v" fill="var(--cyan)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border-accent/20 bg-card/50 lg:col-span-2">
            <CardHeader><CardTitle className="font-mono text-xs uppercase tracking-widest text-accent">Phân bố chẩn đoán</CardTitle></CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={diagDist} dataKey="v" nameKey="name" innerRadius={40} outerRadius={80} paddingAngle={2}>
                      {diagDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
                {diagDist.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="text-muted-foreground">{d.name}</span>
                    <span className="ml-auto font-mono">{d.v}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-4 border-accent/20 bg-card/50">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="font-mono text-xs uppercase tracking-widest text-accent">BN gần đây</CardTitle>
            <Link to="/dinh-duong/benh-an" search={{}} className="text-xs text-accent hover:underline">+ thêm</Link>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                  <tr><th className="py-2 pr-3">Mã</th><th className="pr-3">Họ tên</th><th className="pr-3">Chẩn đoán</th><th className="pr-3">NRS</th><th className="pr-3">Refeeding</th><th>Hành động</th></tr>
                </thead>
                <tbody>
                  {recent.map((r) => (
                    <tr key={r.id} className="border-b border-border/40">
                      <td className="py-2 pr-3 font-mono text-accent">{r.id}</td>
                      <td className="pr-3">{r.name}</td>
                      <td className="pr-3 text-muted-foreground">{r.dx}</td>
                      <td className="pr-3 font-mono">{r.nrs}</td>
                      <td className="pr-3">
                        <Badge variant="outline" className={`font-mono text-[10px] ${
                          r.risk === "Cao" ? "border-destructive/50 bg-destructive/15 text-destructive" :
                          r.risk === "Vừa" ? "border-sky-500/50 bg-sky-500/15 text-sky-300" :
                          "border-emerald-500/50 bg-emerald-500/15 text-emerald-300"
                        }`}>{r.risk}</Badge>
                      </td>
                      <td>
                        <Link to="/dinh-duong/template/$slug" params={{ slug: r.template }} className="text-xs text-accent hover:underline">
                          mở template →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {[
            { slug: "suy-kiet", title: "Suy kiệt / Ung thư", desc: "High-cal · ω-3 · Bát trân · Thập toàn đại bổ" },
            { slug: "tieu-duong", title: "Đái tháo đường", desc: "Low-GI · Carb counting · Lục vị · Bạch hổ" },
            { slug: "sau-phau", title: "Sau phẫu thuật", desc: "ERAS · Liquid→Soft→Regular · Tứ quân · Hương sa lục quân" },
          ].map((t) => (
            <Link key={t.slug} to="/dinh-duong/template/$slug" params={{ slug: t.slug }}
              className="group rounded-lg border border-accent/20 bg-card/50 p-4 transition hover:border-accent/60 hover:bg-accent/5">
              <div className="font-mono text-[10px] uppercase tracking-widest text-accent">template</div>
              <div className="mt-1 font-display text-lg group-hover:text-accent">{t.title}</div>
              <div className="text-xs text-muted-foreground">{t.desc}</div>
              <div className="mt-2 text-xs text-accent">mở phác đồ →</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
