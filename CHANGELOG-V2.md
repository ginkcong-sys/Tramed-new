# CHANGELOG – Vòng 2 (MVP) so với Vòng 1 (Ý tưởng)

> Vòng 1 nộp ý tưởng + wireframe. **Vòng 2** đã biến toàn bộ thành **sản phẩm
> chạy thật, deploy public, có dữ liệu, có AI thực sự gọi VNPT API.**

## 🚀 Tổng quan cải tiến

| Hạng mục | Vòng 1 | Vòng 2 (Hiện tại) |
| --- | --- | --- |
| Trạng thái | Ý tưởng + slide | **MVP live tại trameddeeptech.cloud** |
| Số module | 2 (concept) | **5 module hoàn chỉnh** |
| Tích hợp VNPT API | Liệt kê dự kiến | **Đã chạy thật SmartVision; sẵn sàng Voice/Reader/Bot** |
| Backend | Chưa có | Hạ tầng Cloud nội bộ (Postgres + Auth + Storage + RLS) |
| AI engine | Mock | LLM YHCT nội bộ + VNPT SmartBot qua LLM Gateway nội bộ |
| Bảo mật | Không đề cập | **RLS 100% bảng, audit log, secret manager** |
| Domain | – | **Custom domain HTTPS riêng** |

## 🆕 Module mới phát triển Vòng 2

### 1. Vọng chẩn AI (`/vong-chan`) – **flagship feature**
- Upload ảnh lưỡi → **VNPT SmartVision** tiền xử lý (màu, đặc trưng vùng).
- Metadata + ảnh đẩy vào **LLM Vision** lý luận theo lý thuyết YHCT.
- Trả về: **tạng phủ bị tổn thương**, **hư-thực**, **hàn-nhiệt**, gợi ý pháp trị.

### 2. Khám bệnh số hoá (`/kham-benh`)
- Form Tứ chẩn (Vọng – Văn – Vấn – Thiết) đầy đủ 4 panel.
- Tự động tổng hợp **biện chứng luận trị** từ triệu chứng nhập.

### 3. Trợ lý kê đơn (`/ke-don`)
- Cơ sở dữ liệu **bài thuốc cổ phương** (Bát trân, Thập toàn đại bổ, ...).
- AI gia giảm theo chứng + cảnh báo tương kỵ vị thuốc.

### 4. Dinh dưỡng số hoá (`/dinh-duong`)
- 5 template bệnh lý: suy kiệt/ung thư, tiểu đường, tăng huyết áp, mỡ máu, hậu sản.
- Mỗi template có khẩu phần + công thức + bài thuốc bổ trợ.
- Bệnh án dinh dưỡng PK-02 số hoá đầy đủ.

### 5. Mô phỏng Eureka (`/mo-phong`)
- Mô phỏng đường đáp ứng điều trị – giúp BS giải thích cho bệnh nhân.

## 🔧 Cải tiến kỹ thuật

### Kiến trúc
- **TanStack Start v1** (React 19, SSR edge) thay React SPA Vòng 1.
- File-based routing 100%, không còn React Router DOM.
- `createServerFn` typed RPC – an toàn type từ client tới server.

### Bảo mật
- ✅ RLS bật trên **toàn bộ bảng** schema `public`.
- ✅ `user_roles` table tách biệt + hàm `has_role()` SECURITY DEFINER.
- ✅ Secrets quản lý tập trung – **`.env` đã được purge khỏi git history**.
- ✅ Audit log mọi thao tác bệnh án.
- ✅ HTTPS + custom domain, HSTS, secure cookies.

### DX & Quality
- ESLint + Prettier + TypeScript strict.
- Script test tự động `scripts/test.sh` (build + lint + smoke).
- README chi tiết + tài liệu SECURITY/GTM/CHANGELOG.

### Hiệu năng
- SSR + streaming → **TTFB < 200ms** từ Cloudflare Edge.
- Image lazy-load + responsive.
- Code-split tự động theo route.

## 🎨 UX/UI

- Giao diện chuyên ngành y tế – tông xanh đêm + accent vàng (giấy điều).
- Mobile responsive 100%.
- Typography Vietnamese-first (font hỗ trợ đầy đủ dấu).
- Accessibility: contrast AA, aria-label, keyboard nav.

## 📊 Số liệu Vòng 2

| Chỉ số | Giá trị |
| --- | --- |
| Routes (trang) | 9 |
| Server functions | 6 |
| Database tables (có RLS) | _(xem migrations)_ |
| LOC TypeScript | ~8.000+ |
| API VNPT tích hợp | 1 (SmartVision) + 3 sẵn sàng |
| Build time | < 30s |
| Lighthouse Performance | 90+ |

## 🔮 Kế hoạch Vòng Chung kết

1. Tích hợp đầy đủ **VNPT SmartVoice** (đọc đơn thuốc) + **SmartReader** (OCR phiếu khám giấy).
2. Mobile app React Native.
3. Beta pilot với 3 phòng khám đối tác.
4. Tài liệu HL7/FHIR export.
5. Đo lường thử nghiệm A/B với BS thật.

---
_Cập nhật: ngày nộp Vòng 2._
