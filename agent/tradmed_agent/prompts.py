"""Prompt builder + parser cho trắc nghiệm A/B/C/D."""
from __future__ import annotations

import re
from typing import Dict, List

SYSTEM = (
    "Bạn là chuyên gia Y học cổ truyền Việt Nam (TradMed Agent). "
    "Trả lời trắc nghiệm dựa trên kiến thức YHCT chính thống và bằng chứng "
    "trong NGỮ CẢNH. Suy luận ngắn gọn rồi kết luận bằng MỘT chữ cái A/B/C/D."
)


def build_mcq_prompt(question: str, options: Dict[str, str],
                     context: List[str]) -> str:
    ctx_block = "\n\n".join(f"[{i+1}] {c}" for i, c in enumerate(context))
    opt_block = "\n".join(f"{k}. {v}" for k, v in options.items())
    user = (
        f"NGỮ CẢNH:\n{ctx_block}\n\n"
        f"CÂU HỎI: {question}\n\n"
        f"LỰA CHỌN:\n{opt_block}\n\n"
        "Hãy suy luận ngắn (≤3 câu) rồi kết thúc bằng dòng:\n"
        "ĐÁP ÁN: <A|B|C|D>"
    )
    return (
        f"<|im_start|>system\n{SYSTEM}<|im_end|>\n"
        f"<|im_start|>user\n{user}<|im_end|>\n"
        f"<|im_start|>assistant\n"
    )


_CHOICE_RE = re.compile(r"ĐÁP\s*ÁN\s*[:：]\s*([ABCD])", re.IGNORECASE)
_FALLBACK_RE = re.compile(r"\b([ABCD])\b")


def parse_choice(text: str) -> str:
    m = _CHOICE_RE.search(text)
    if m:
        return m.group(1).upper()
    m = _FALLBACK_RE.search(text)
    return m.group(1).upper() if m else "A"
