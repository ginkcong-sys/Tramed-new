# TradMed Agent — Bảng C (VSHC 2026)

Multi-task AI Agent YHCT, đóng gói Docker theo đúng spec bảng C:

- Đọc `/data/test.csv` → ghi `/output/pred.csv` (cột `id, pred` ∈ {A,B,C,D})
- LLM: **Qwen2.5-7B-Instruct** (≤9B, hợp lệ)
- Embedding: **BGE-m3** · Reranker: **Qwen2-1.5B-Reranker**
- RAG: FAISS trên knowledge base YHCT (`tradmed_agent/kb/*.jsonl`)
- Backend: vLLM (GPU), fallback HuggingFace nếu không có GPU

## Build

```bash
cd agent
docker build -t tradmed-agent:1.0 .
```

Model (~18GB) được pre-tải vào image trong bước `download_models.py` → chấm thi **offline**.

## Run (theo format BTC)

```bash
docker run --rm --gpus all \
  -v $(pwd)/data:/data \
  -v $(pwd)/output:/output \
  tradmed-agent:1.0
```

`data/test.csv` schema:

```
id,question,A,B,C,D
1,"Bát cương biện chứng gồm mấy cương?","6","7","8","10"
```

Output `output/pred.csv`:

```
id,pred
1,C
```

## Mở rộng KB

Thêm file `tradmed_agent/kb/<tên>.jsonl`, mỗi dòng `{"text": "..."}`. Index FAISS tự build ở lần chạy đầu, cache vào `/models/_index`.

## Cấu trúc

```
agent/
├── Dockerfile
├── requirements.txt
├── scripts/download_models.py
└── tradmed_agent/
    ├── run.py          # entrypoint
    ├── llm.py          # Qwen wrapper (vLLM/HF)
    ├── retriever.py    # BGE-m3 + FAISS + reranker
    ├── prompts.py      # MCQ prompt + parser A/B/C/D
    └── kb/             # knowledge base YHCT
```

## Test nhanh không GPU

```bash
pip install -r requirements.txt
python scripts/download_models.py
DATA_DIR=./sample OUTPUT_DIR=./out python -m tradmed_agent.run
```
