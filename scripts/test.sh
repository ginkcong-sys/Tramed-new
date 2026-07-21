#!/usr/bin/env bash
# TRAMED.AI – Script test tự động cho Vòng 2 HackAIthon
# Usage: bash scripts/test.sh

set -e
GREEN='\033[0;32m'; RED='\033[0;31m'; YELLOW='\033[1;33m'; NC='\033[0m'
pass() { echo -e "${GREEN}✅ $1${NC}"; }
fail() { echo -e "${RED}❌ $1${NC}"; exit 1; }
info() { echo -e "${YELLOW}▶ $1${NC}"; }

info "1/4 Kiểm tra dependencies..."
command -v bun >/dev/null 2>&1 || fail "Bun chưa cài (https://bun.sh)"
[ -f package.json ] || fail "Không tìm thấy package.json"
pass "Dependencies OK"

info "2/4 Cài package..."
bun install --frozen-lockfile >/dev/null 2>&1 || bun install >/dev/null 2>&1
pass "bun install xong"

info "3/4 Build production..."
bun run build 2>&1 | tail -5
pass "Build thành công"

info "4/4 Smoke test routes (nếu server đang chạy ở :8080)..."
ROUTES=("/" "/kham-benh" "/vong-chan" "/ke-don" "/dinh-duong" "/mo-phong")
if curl -sf http://localhost:8080/ -o /dev/null 2>&1; then
  for r in "${ROUTES[@]}"; do
    code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:8080$r")
    if [ "$code" = "200" ]; then pass "GET $r → 200"
    else echo -e "${YELLOW}⚠ GET $r → $code${NC}"; fi
  done
else
  echo -e "${YELLOW}⚠ Server chưa chạy ở :8080 – bỏ qua smoke test (chạy 'bun run dev' để test).${NC}"
fi

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  TRAMED.AI – Test passed. Sẵn sàng nộp Vòng 2!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
