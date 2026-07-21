"""Pre-tải model vào image để chấm thi offline."""
from huggingface_hub import snapshot_download

MODELS = [
    "Qwen/Qwen2.5-7B-Instruct",   # LLM ≤9B theo luật bảng C
    "BAAI/bge-m3",                 # Embedding
    "Qwen/Qwen2-1.5B-Reranker",   # Reranker (thay cho Qwen-Rerank lớn)
]

for m in MODELS:
    print(f"==> {m}")
    snapshot_download(repo_id=m, local_dir=f"/models/{m}",
                      local_dir_use_symlinks=False)
print("Done.")
