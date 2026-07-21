"""Wrapper Qwen2.5-7B-Instruct qua vLLM (batch nhanh) hoặc transformers fallback."""
from __future__ import annotations

from typing import Optional


class QwenAgent:
    def __init__(self, model_path: str, max_model_len: int = 8192):
        try:
            from vllm import LLM, SamplingParams  # type: ignore

            self._backend = "vllm"
            self._llm = LLM(model=model_path, max_model_len=max_model_len,
                            gpu_memory_utilization=0.85, dtype="bfloat16")
            self._SamplingParams = SamplingParams
        except Exception as e:  # CPU / no-GPU fallback
            print(f"[WARN] vLLM unavailable ({e}); fallback transformers")
            from transformers import AutoModelForCausalLM, AutoTokenizer
            import torch

            self._backend = "hf"
            self._tok = AutoTokenizer.from_pretrained(model_path)
            self._model = AutoModelForCausalLM.from_pretrained(
                model_path, torch_dtype=torch.bfloat16, device_map="auto"
            )

    def generate(self, prompt: str, max_new_tokens: int = 128,
                 temperature: float = 0.0) -> str:
        if self._backend == "vllm":
            sp = self._SamplingParams(temperature=temperature,
                                      max_tokens=max_new_tokens)
            out = self._llm.generate([prompt], sp)
            return out[0].outputs[0].text.strip()
        # HF fallback
        inp = self._tok(prompt, return_tensors="pt").to(self._model.device)
        out = self._model.generate(**inp, max_new_tokens=max_new_tokens,
                                   do_sample=temperature > 0,
                                   temperature=max(temperature, 0.01))
        text = self._tok.decode(out[0][inp.input_ids.shape[1]:],
                                skip_special_tokens=True)
        return text.strip()
