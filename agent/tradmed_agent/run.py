"""Entrypoint bảng C: /data/test.csv -> /output/pred.csv.

CSV schema giả định (theo format chuẩn của BTC):
    id, question, A, B, C, D
Output:
    id, pred  (A|B|C|D)
"""
from __future__ import annotations

import os
import sys
from pathlib import Path

import pandas as pd
from tqdm import tqdm

from .retriever import YhctRetriever
from .llm import QwenAgent
from .prompts import build_mcq_prompt, parse_choice

DATA_DIR = Path(os.environ.get("DATA_DIR", "/data"))
OUT_DIR = Path(os.environ.get("OUTPUT_DIR", "/output"))
INPUT_CSV = DATA_DIR / "test.csv"
OUTPUT_CSV = OUT_DIR / "pred.csv"


def main() -> int:
    if not INPUT_CSV.exists():
        print(f"[ERR] Không tìm thấy {INPUT_CSV}", file=sys.stderr)
        return 2

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    df = pd.read_csv(INPUT_CSV)
    print(f"[INFO] Loaded {len(df)} rows từ {INPUT_CSV}")

    retriever = YhctRetriever(
        kb_dir=Path(__file__).parent / "kb",
        index_dir=Path("/models/_index"),
    )
    agent = QwenAgent(model_path="/models/Qwen/Qwen2.5-7B-Instruct")

    preds: list[str] = []
    for _, row in tqdm(df.iterrows(), total=len(df), desc="inference"):
        ctx = retriever.search(row["question"], top_k=5)
        prompt = build_mcq_prompt(
            question=row["question"],
            options={k: row[k] for k in ("A", "B", "C", "D")},
            context=ctx,
        )
        resp = agent.generate(prompt, max_new_tokens=64)
        preds.append(parse_choice(resp))

    out = pd.DataFrame({"id": df["id"], "pred": preds})
    out.to_csv(OUTPUT_CSV, index=False)
    print(f"[OK] Wrote {OUTPUT_CSV}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
