# Phương án bảo mật dữ liệu – TRAMED.AI

> Dữ liệu y tế là dữ liệu cá nhân nhạy cảm theo **Luật Khám chữa bệnh 2023** và
> **Nghị định 13/2023/NĐ-CP** về bảo vệ dữ liệu cá nhân. Toàn bộ thiết kế của
> TRAMED.AI tuân thủ nguyên tắc *Privacy by Design* và *Defense in Depth*.

## 1. Mô hình mối đe doạ (Threat Model)

| Đối tượng | Rủi ro chính | Biện pháp |
| --- | --- | --- |
| Tấn công ngoài | Lộ bệnh án, đánh cắp ảnh lưỡi | TLS 1.3, RLS, rate-limit |
| Người dùng nội bộ | Bác sĩ A đọc bệnh án của bác sĩ B | RLS theo `auth.uid()` |
| LLM provider | Dữ liệu y tế rò rỉ qua prompt | De-identify trước khi gửi |
| Lập trình viên | Lộ key qua Git | Secrets quản lý qua Hạ tầng Cloud nội bộ, `.env` không commit |

## 2. Kiểm soát truy cập

### 2.1. Xác thực
- Đăng nhập bằng **Supabase Auth** (email/password + Google OAuth).
- JWT lưu trong **httpOnly cookie** + auto-refresh; client không truy cập trực tiếp.
- Phiên hết hạn sau **24h**; refresh-token rotation bật.

### 2.2. Phân quyền – Role-based
- Vai trò lưu ở bảng riêng `public.user_roles` (KHÔNG đặt trên `profiles`).
- Enum `app_role`: `admin | doctor | nurse | patient`.
- Kiểm tra qua hàm `has_role()` **SECURITY DEFINER** để tránh recursive RLS.

### 2.3. Row Level Security (RLS)
- **Bật RLS trên 100% bảng** trong schema `public`.
- Mỗi bảng có policy theo `auth.uid()`:

```sql
-- Ví dụ: bệnh án chỉ chủ sở hữu + admin được đọc
create policy "doctor reads own records"
on public.benh_an for select to authenticated
using (auth.uid() = doctor_id or public.has_role(auth.uid(), 'admin'));
```

## 3. Mã hoá dữ liệu

| Lớp | Cơ chế |
| --- | --- |
| **In transit** | TLS 1.3 end-to-end (Cloudflare Edge → Origin) |
| **At rest** | AES-256 (Supabase Postgres + Storage mặc định) |
| **Ảnh lưỡi / phiếu khám** | Lưu Supabase Storage bucket *private*, signed URL TTL 5 phút |
| **Cột nhạy cảm** _(roadmap)_ | `pgcrypto` `pgp_sym_encrypt` cho mã BHYT, CCCD |

## 4. Bảo mật API & Edge Functions

- **Server functions** (`createServerFn` + `requireSupabaseAuth` middleware) – mọi
  request đều phải có Bearer token hợp lệ; không có đường tắt từ client.
- **Public webhook** (`/api/public/*`) verify HMAC SHA-256 trước khi xử lý.
- **Service-role key** chỉ dùng trong `*.server.ts`, **không bao giờ** lộ ra
  bundle client (import-protected bởi TanStack).
- **Rate limit**: 60 req/phút/IP cho endpoint AI (chống abuse credit LLM nội bộ/VNPT).

## 5. Quản lý secrets

- **0 secrets trong code**. Mọi key (TRAMED AI, VNPT SmartVision/Voice/Reader/Bot)
  lưu trong **Vault secrets nội bộ** – chỉ inject vào server runtime.
- `.env` đã được **xoá khỏi GitHub** và đưa vào `.gitignore`.
- Repo GitHub đặt **private**; chỉ chia sẻ BTC khi cần chấm bài.
- Rotation policy: key VNPT đổi sau mỗi vòng thi; LLM_GATEWAY_API_KEY rotate qua tool nội bộ.

## 6. Bảo vệ dữ liệu khi dùng LLM

Trước khi gửi prompt sang LLM nội bộ / VNPT Smartbot:
1. **De-identify** – thay tên bệnh nhân, CCCD, SĐT bằng placeholder `[BN]`, `[ID]`.
2. **Minimisation** – chỉ gửi trường cần thiết cho lý luận YHCT (triệu chứng, mạch, lưỡi).
3. **Logging tối thiểu** – không log full prompt chứa PII; chỉ log hash request-id.
4. **Tuỳ chọn opt-out training** – dùng endpoint LLM nội bộ có `no-training` flag.

## 7. Tuân thủ & ghi log audit

- Mọi thao tác `INSERT/UPDATE/DELETE` bệnh án ghi vào bảng `audit_log` (trigger Postgres):
  `actor_id, action, table, row_id, before, after, ip, ua, ts`.
- Log lưu tối thiểu **2 năm** theo quy định lưu trữ hồ sơ y tế.
- Cấu hình **backup tự động** hàng ngày (Supabase PITR – Point In Time Recovery 7 ngày).

## 8. Quyền của chủ thể dữ liệu (NĐ 13/2023)

- ✅ Quyền truy cập / sao chép – endpoint `/api/me/export` xuất JSON.
- ✅ Quyền chỉnh sửa – form chỉnh sửa hồ sơ.
- ✅ Quyền xoá / được lãng quên – soft-delete 30 ngày → hard-delete + xoá Storage.
- ✅ Quyền rút lại đồng ý – toggle trong Settings.

## 9. Quy trình phản hồi sự cố (Incident Response)

1. **T+0 phút**: phát hiện qua alerting Supabase / Cloudflare WAF.
2. **T+15 phút**: cô lập – revoke token, đổi service-role key.
3. **T+1 giờ**: đánh giá phạm vi qua `audit_log`.
4. **T+24 giờ**: thông báo người dùng bị ảnh hưởng (theo NĐ 13/2023 điều 23).
5. **T+72 giờ**: báo cáo Cục An ninh mạng – Bộ Công an (nếu rò rỉ ≥ PII).

## 10. Roadmap bảo mật

- [ ] SOC 2 Type I (Q4/2026)
- [ ] HIPAA-ready BAA với Hạ tầng Cloud nội bộ
- [ ] Cột mã hoá pgcrypto cho CCCD/BHYT
- [ ] WAF rule chống prompt-injection
- [ ] Pen-test bên thứ 3

---
_Tài liệu này được duy trì bởi đội TRAMED và rà soát mỗi lần nâng cấp major._
