# 📦 Hồ sơ nộp Vòng 2 – Bảng B – HackAIthon 2026

> Tài liệu tổng hợp – copy-paste trực tiếp vào form nộp BTC.

---

## 🏷️ Thông tin sản phẩm

| Trường | Nội dung |
| --- | --- |
| **Tên sản phẩm** | TRAMED.AI – Trợ lý AI Y học cổ truyền |
| **Bảng dự thi** | Bảng B |
| **Đội** | _(điền tên đội)_ |
| **Trưởng nhóm** | _(họ tên + email + SĐT)_ |

---

## 🔗 1. Link sản phẩm / MVP

```
https://www.trameddeeptech.cloud
```

**Backup:** `https://www.trameddeeptech.cloud`

---

## 💻 2. GitHub / Repo

```
(điền link repo GitHub – đặt private, mời tài khoản BTC làm collaborator)
```

Trạng thái:
- ✅ Repo private (đã ẩn `.env`).
- ✅ Có README + SECURITY + GTM + CHANGELOG-V2.
- ✅ Có script test tự động `scripts/test.sh`.

---

## 🎬 3. Video demo

```
(điền link YouTube hoặc Google Drive – để chế độ public hoặc anyone-with-link)
```

**Kịch bản đề xuất 3 phút:**
1. (0:00–0:20) Vấn đề – BS YHCT ghi chép tay, mất thời gian.
2. (0:20–1:00) Demo /vong-chan – upload ảnh lưỡi → SmartVision → LLM nội bộ trả kết quả.
3. (1:00–1:40) Demo /kham-benh + /ke-don – Tứ chẩn + gợi ý bài thuốc.
4. (1:40–2:15) Demo /dinh-duong – template thực đơn theo bệnh lý.
5. (2:15–2:45) Bảo mật + kiến trúc (1 slide).
6. (2:45–3:00) GTM + lời kêu gọi.

---

## 🔌 4. API VNPT đã tích hợp

| API | Module | Trạng thái |
| --- | --- | --- |
| **VNPT SmartVision** | Vọng chẩn (`/vong-chan`) – tiền xử lý ảnh lưỡi | ✅ Đã chạy thật |
| **VNPT SmartVoice (TTS)** | Đọc đơn thuốc / kết quả khám | 🟡 Sẵn sàng, bật khi có token |
| **VNPT SmartReader (OCR)** | Bóc tách phiếu khám / đơn giấy | 🟡 Sẵn sàng |
| **VNPT Smartbot** | Chatbot tư vấn bệnh nhân | 🟡 Sẵn sàng |

Code tích hợp ở `src/lib/vong-chan.functions.ts` – hàm `callSmartVision()`.

---

## 🛠️ 5. Hướng dẫn cài đặt / chạy thử

### Cách nhanh nhất – dùng link live
Truy cập `https://www.trameddeeptech.cloud` (đã deploy sẵn).

### Chạy local – 1 lệnh
```bash
git clone <repo> && cd tramed && bun install && bun run dev
```
→ Mở `http://localhost:8080`.

### Build production
```bash
bun run build && bun run preview
```

### Chạy test tự động
```bash
bash scripts/test.sh
```

Yêu cầu: Node 20+, Bun ≥ 1.1, file `.env` (template tại `.env.example`).

Chi tiết: xem `README.md`.

---

## 🔒 6. Phương án bảo mật dữ liệu

Tóm tắt (chi tiết: [SECURITY.md](./SECURITY.md)):

1. **Auth**: Supabase Auth + JWT httpOnly + Google OAuth.
2. **Phân quyền**: `user_roles` table riêng + hàm `has_role()` SECURITY DEFINER.
3. **RLS**: bật 100% bảng `public`, policy theo `auth.uid()`.
4. **Mã hoá**: TLS 1.3 in-transit; AES-256 at-rest; signed URL ảnh y tế TTL 5p.
5. **Secrets**: 0 key trong code; quản lý qua Vault secrets nội bộ; `.env` đã purge khỏi git.
6. **LLM safety**: de-identify PII trước khi gửi LLM nội bộ/VNPT; opt-out training.
7. **Audit log**: trigger Postgres log mọi thao tác bệnh án (lưu 2 năm).
8. **Tuân thủ**: NĐ 13/2023, Luật Khám chữa bệnh 2023; quyền truy cập/xoá/rút consent.
9. **Incident response**: SLA 24h thông báo người dùng, 72h báo Cục An ninh mạng.

---

## 🎯 7. Chiến lược triển khai / GTM

Tóm tắt (chi tiết: [GTM.md](./GTM.md)):

- **Khách hàng**: BV YHCT, phòng khám YHCT tư, trạm y tế xã.
- **Mô hình**: SaaS tiered – Free / Pro (990k/BS/tháng) / Clinic / Hospital (30–100M/năm) / API.
- **TAM/SAM/SOM**: 8.000 tỷ / 1.200 tỷ / 60 tỷ VND/năm.
- **Doanh thu phụ**: affiliate dược liệu, học liệu, insights B2B.
- **GTM**: direct sales BV + PLG bác sĩ trẻ + hợp tác Hội Đông y + KOL.
- **Roadmap 3 năm**: 50 PK (Y1) → 300 PK + 5 BV (Y2) → 1.000 PK + 25 BV (Y3) = **45 tỷ ARR**.

---

## 🆕 8. Cải tiến so với Vòng 1

Tóm tắt (chi tiết: [CHANGELOG-V2.md](./CHANGELOG-V2.md)):

| Hạng mục | V1 | V2 |
| --- | --- | --- |
| Trạng thái | Ý tưởng | MVP live có domain riêng |
| Module | 2 concept | 5 module chạy thật |
| VNPT API | Đề xuất | SmartVision đã chạy + 3 API ready |
| Backend | Không | Hạ tầng Cloud nội bộ + RLS + Audit |
| AI | Mock | LLM Vision + Vertex AI thật |
| Bảo mật | – | RLS 100%, secrets manager, custom HTTPS domain |

---

## 📋 Checklist hoàn tất trước khi nhấn nộp

- [x] README.md
- [x] SECURITY.md
- [x] GTM.md
- [x] CHANGELOG-V2.md
- [x] SUBMISSION.md (file này)
- [x] scripts/test.sh
- [x] .env.example (không chứa secret thật)
- [x] .gitignore đã có `.env`
- [x] Live URL chạy ổn định
- [x] Custom domain HTTPS hoạt động
- [ ] **Video demo upload + lấy link**
- [ ] **Mời tài khoản GitHub của BTC vào repo (collaborator)**
- [ ] **Điền form nộp của BTC**
- [ ] **Thông tin liên hệ trưởng nhóm trong README**

---

🍀 **Chúc đội mình lọt Top 6 vào Chung kết!**
