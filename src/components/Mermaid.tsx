import { useEffect, useId, useRef, useState } from "react";

let mermaidLib: typeof import("mermaid").default | null = null;
let initialized = false;

async function getMermaid() {
  if (!mermaidLib) {
    const mod = await import("mermaid");
    mermaidLib = mod.default;
  }
  if (!initialized) {
    mermaidLib.initialize({
      startOnLoad: false,
      theme: "dark",
      securityLevel: "loose",
      fontFamily: "inherit",
      themeVariables: {
        background: "transparent",
        primaryColor: "#0e3b53",
        primaryTextColor: "#e6f6ff",
        primaryBorderColor: "#22d3ee",
        lineColor: "#22d3ee",
        secondaryColor: "#1f2a44",
        tertiaryColor: "#0b1320",
      },
    });
    initialized = true;
  }
  return mermaidLib!;
}

export function Mermaid({ code }: { code: string }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const ref = useRef<HTMLDivElement>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const m = await getMermaid();
        const { svg } = await m.render(`mmd-${id}`, code.trim());
        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg;
          setErr(null);
        }
      } catch (e) {
        if (!cancelled) setErr(e instanceof Error ? e.message : "Sơ đồ lỗi cú pháp");
      }
    })();
    return () => { cancelled = true; };
  }, [code, id]);

  if (err) {
    return (
      <div className="my-3 rounded-lg border border-sky-500/40 bg-sky-500/10 p-3 text-xs">
        <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-sky-300">Sơ đồ Mermaid lỗi</div>
        <pre className="overflow-auto text-sky-200/90">{code}</pre>
      </div>
    );
  }
  return <div ref={ref} className="my-3 flex justify-center overflow-x-auto rounded-lg border border-accent/30 bg-background/50 p-3" />;
}
