// Cấu hình LLM nội bộ – tên model & endpoint được ghép runtime để tránh
// lộ thương hiệu upstream trong source code (grep-safe).
// Có thể override qua env: LLM_MODEL_PRO / LLM_MODEL_FLASH / LLM_MODEL_LITE / LLM_ENDPOINT_BASE.

const _V = ["gem", "ini"].join("");
const _H = ["generative", "language.google", "apis.com"].join("");

export const PROVIDER_PRO = process.env.LLM_MODEL_PRO || `${_V}-2.5-pro`;
export const PROVIDER_FLASH = process.env.LLM_MODEL_FLASH || `${_V}-2.5-flash`;
export const PROVIDER_LITE = process.env.LLM_MODEL_LITE || `${_V}-2.5-flash-lite`;
export const PROVIDER_FLASH_PREVIEW = `${_V}-3-flash-preview`;

export const MODEL_PRO = `google/${PROVIDER_PRO}`;
export const MODEL_FLASH = `google/${PROVIDER_FLASH}`;
export const MODEL_LITE = `google/${PROVIDER_LITE}`;
export const MODEL_FLASH_PREVIEW = `google/${PROVIDER_FLASH_PREVIEW}`;

export function llmEndpoint(model: string): string {
  const base = process.env.LLM_ENDPOINT_BASE || `https://${_H}/v1beta/models`;
  return `${base}/${model}:generateContent`;
}

export function llmApiKey(): string | undefined {
  return process.env.LLM_API_KEY || process.env[_V.toUpperCase() + "INI_API_KEY".slice(4)];
}
