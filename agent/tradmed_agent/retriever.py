"""RAG retriever: BGE-m3 embedding + FAISS + Qwen reranker."""
from __future__ import annotations

import json
import pickle
from pathlib import Path
from typing import List

import numpy as np


class YhctRetriever:
    def __init__(self, kb_dir: Path, index_dir: Path,
                 emb_model: str = "/models/BAAI/bge-m3",
                 rerank_model: str = "/models/Qwen/Qwen2-1.5B-Reranker"):
        from FlagEmbedding import BGEM3FlagModel
        import faiss

        self._faiss = faiss
        self.kb_dir = Path(kb_dir)
        self.index_dir = Path(index_dir)
        self.index_dir.mkdir(parents=True, exist_ok=True)

        self.emb = BGEM3FlagModel(emb_model, use_fp16=True)
        self._load_or_build_index()

        # Reranker (optional, lazy load)
        self._rerank_model_path = rerank_model
        self._reranker = None

    def _load_or_build_index(self) -> None:
        idx_path = self.index_dir / "faiss.index"
        meta_path = self.index_dir / "meta.pkl"
        if idx_path.exists() and meta_path.exists():
            self.index = self._faiss.read_index(str(idx_path))
            with open(meta_path, "rb") as f:
                self.chunks = pickle.load(f)
            return

        chunks: list[str] = []
        for jsonl in sorted(self.kb_dir.glob("*.jsonl")):
            for line in jsonl.read_text("utf-8").splitlines():
                if not line.strip():
                    continue
                obj = json.loads(line)
                chunks.append(obj["text"])
        if not chunks:
            chunks = ["(empty knowledge base)"]
        emb = self.emb.encode(chunks, batch_size=32)["dense_vecs"]
        emb = np.asarray(emb, dtype="float32")
        self._faiss.normalize_L2(emb)
        self.index = self._faiss.IndexFlatIP(emb.shape[1])
        self.index.add(emb)
        self.chunks = chunks
        self._faiss.write_index(self.index, str(idx_path))
        with open(meta_path, "wb") as f:
            pickle.dump(chunks, f)

    def search(self, query: str, top_k: int = 5) -> List[str]:
        q = self.emb.encode([query])["dense_vecs"]
        q = np.asarray(q, dtype="float32")
        self._faiss.normalize_L2(q)
        scores, ids = self.index.search(q, top_k * 3)
        cands = [self.chunks[i] for i in ids[0] if i >= 0]
        return self._rerank(query, cands, top_k)

    def _rerank(self, query: str, cands: List[str], top_k: int) -> List[str]:
        if not cands:
            return []
        try:
            if self._reranker is None:
                from FlagEmbedding import FlagReranker
                self._reranker = FlagReranker(self._rerank_model_path,
                                              use_fp16=True)
            pairs = [[query, c] for c in cands]
            scores = self._reranker.compute_score(pairs)
            order = np.argsort(scores)[::-1][:top_k]
            return [cands[i] for i in order]
        except Exception as e:
            print(f"[WARN] rerank skipped: {e}")
            return cands[:top_k]
