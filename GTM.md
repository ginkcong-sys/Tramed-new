# Chiến lược triển khai & Go-To-Market – TRAMED.AI

## 1. Tóm tắt điều hành (Executive Summary)

**TRAMED.AI** là trợ lý AI đầu tiên tại Việt Nam dành riêng cho **Y học cổ truyền (YHCT)** –
hỗ trợ bác sĩ số hoá Tứ chẩn (Vọng – Văn – Vấn – Thiết), gợi ý bài thuốc cổ phương,
và tư vấn dinh dưỡng theo bệnh lý. Tích hợp **VNPT AI Platform** cho ảnh – giọng nói – OCR.

> **Tầm nhìn:** Mỗi phòng khám YHCT có một "đồng nghiệp AI" rút ngắn 60% thời gian
> ghi chép hồ sơ, đồng thời lưu giữ tri thức cổ truyền cho thế hệ kế tiếp.

## 2. Vấn đề & Cơ hội thị trường

### 2.1. Pain points
- ⏰ Bác sĩ YHCT mất **40–50% thời gian** ghi chép tay hồ sơ Tứ chẩn.
- 📚 Tri thức cổ phương (hơn 3.000 bài thuốc) rải rác, khó tra cứu nhanh.
- 👥 Thiếu hụt bác sĩ YHCT có kinh nghiệm – đặc biệt tuyến huyện/xã.
- 🍱 Tư vấn dinh dưỡng theo thể bệnh YHCT (hàn/nhiệt/hư/thực) gần như thủ công.

### 2.2. Quy mô thị trường (TAM/SAM/SOM)
| Tầng | Quy mô | Giá trị |
| --- | --- | --- |
| **TAM** – Toàn ngành YHCT VN | ~63 BV YHCT + 700 khoa YHCT + 11.000 phòng chẩn trị | ~**8.000 tỷ VND/năm** |
| **SAM** – Phòng khám tư + BV YHCT đã số hoá HSBA | ~2.500 cơ sở | ~**1.200 tỷ VND/năm** |
| **SOM (3 năm)** – 5% SAM | 125 cơ sở | ~**60 tỷ VND/năm** |

## 3. Phân khúc khách hàng

### 3.1. Khách hàng mục tiêu (Persona)

**Persona A – BS. Hoa, 45 tuổi, chủ phòng khám YHCT tư**
- Đau điểm: ghi chép tay, khó scale, mất khách trẻ vì thiếu công nghệ.
- Sẵn sàng trả: **2–5 triệu VND/tháng/phòng khám**.

**Persona B – BV Y học cổ truyền tỉnh** (50–200 giường)
- Đau điểm: HSBA giấy, khó báo cáo BHYT, đào tạo bác sĩ trẻ chậm.
- Sẵn sàng trả: **30–100 triệu VND/năm** (license + triển khai).

**Persona C – Trạm y tế xã có hoạt động YHCT** _(roadmap năm 3)_
- Đau điểm: thiếu bác sĩ chuyên môn, kê đơn cổ phương khó.
- Mô hình: subsidized – hợp tác Sở Y tế / Cục Quản lý YHCT.

### 3.2. Đối thủ & lợi thế

| Đối thủ | Điểm yếu | Lợi thế TRAMED.AI |
| --- | --- | --- |
| Phần mềm HIS đa khoa (Medcomm, eHospital) | Không hiểu YHCT, không biết Tứ chẩn | Chuyên sâu YHCT, ontology bài thuốc |
| Google/ChatGPT generic | Không tham chiếu bài thuốc VN | Cơ sở dữ liệu cổ phương + Qwen2.5 fine-tune YHCT |
| Ứng dụng kê đơn tây y | Không tích hợp vọng chẩn | Vọng chẩn AI từ ảnh lưỡi (unique) |

## 4. Mô hình doanh thu

### 4.1. SaaS B2B nhiều bậc (Tiered)

| Gói | Đối tượng | Giá | Tính năng |
| --- | --- | --- | --- |
| **Free** | BS cá nhân thử nghiệm | 0đ | 20 ca/tháng, watermark |
| **Pro** | Phòng khám 1-3 BS | **990k VND/BS/tháng** | Không giới hạn ca, vọng chẩn AI, kê đơn |
| **Clinic** | Phòng khám > 3 BS | **2.5M VND/tháng (5 BS)** | + Đa user, audit log, xuất BHYT |
| **Hospital** | BV / khoa YHCT | **30–100M VND/năm** | + On-premise, SLA 99.9%, đào tạo |
| **API** | Đối tác HIS / EMR | **0.5đ/request** | REST API trả về chẩn đoán YHCT |

### 4.2. Doanh thu phụ
- 💊 **Affiliate dược liệu** – kết nối với nhà thuốc YHCT chính hãng (10% commission).
- 🎓 **Học liệu trả phí** – khoá học cổ phương cho sinh viên YHCT (199k/khoá).
- 📊 **Insights B2B** – báo cáo xu hướng bệnh YHCT cho Bộ Y tế / hãng dược.

### 4.3. Dự phóng tài chính 3 năm

| | Năm 1 (2026) | Năm 2 (2027) | Năm 3 (2028) |
| --- | --- | --- | --- |
| Khách hàng trả phí | 50 PK | 300 PK + 5 BV | 1.000 PK + 25 BV |
| ARR (tỷ VND) | 1.2 | 12 | 45 |
| Gross margin | 65% | 75% | 80% |
| Break-even | – | Q3/2027 | – |

## 5. Lộ trình triển khai (Roadmap)

```
2026 Q3  ┃ Beta đóng – 10 PK đối tác (Hà Nội, TP.HCM)
2026 Q4  ┃ Ra mắt Pro/Clinic; tích hợp VNPT SmartCA cho ký số đơn thuốc
2027 Q1  ┃ Phiên bản BV (multi-tenant, HL7/FHIR export)
2027 Q2  ┃ App mobile (React Native) cho BS đi công tác
2027 Q3  ┃ Hợp tác Bộ Y tế – pilot tại 3 BV YHCT tỉnh
2027 Q4  ┃ Mở API marketplace cho EMR đối tác
2028     ┃ Mở rộng Lào, Campuchia (cộng đồng YHCT Đông Dương)
```

## 6. Chiến lược tiếp cận (Go-To-Market)

### 6.1. Kênh phân phối
1. **Direct sales** – đội sale tiếp cận BV YHCT tỉnh (top-down).
2. **PLG (Product-Led Growth)** – Free tier viral trong cộng đồng BS YHCT trẻ.
3. **Hợp tác hiệp hội** – Hội Đông y Việt Nam, Hội Châm cứu (co-branding).
4. **KOL/KOC** – PGS-TS đầu ngành YHCT làm cố vấn + endorsement.
5. **Sự kiện** – Hội nghị YHCT thường niên, hội chợ dược liệu.

### 6.2. Marketing
- 📱 **Content YHCT** TikTok/Facebook: "Lưỡi bạn nói gì?", "Bài thuốc 5 phút".
- 🎓 **Workshop** miễn phí tại 10 ĐH Y (Y Hà Nội, Y Dược TP.HCM, HV YDHCT).
- 📰 **PR**: VnExpress Sức khoẻ, Tuổi Trẻ Online.
- 🔍 **SEO** từ khoá: "kê đơn YHCT", "bài thuốc trị mất ngủ", "vọng chẩn lưỡi".

### 6.3. Customer Success
- Onboarding 1-1 trong 7 ngày đầu (Zoom + tài liệu).
- Hotline Zalo OA phản hồi < 2 giờ giờ hành chính.
- Cộng đồng Facebook Group "Bác sĩ YHCT số" – peer support.

## 7. KPI 12 tháng đầu

| KPI | Mục tiêu |
| --- | --- |
| MAU bác sĩ | 2.000 |
| Phòng khám trả phí | 50 |
| NPS | ≥ 50 |
| Churn hàng tháng | < 5% |
| Tổng ca khám xử lý qua TRAMED | 100.000 |

## 8. Rủi ro & giảm thiểu

| Rủi ro | Giảm thiểu |
| --- | --- |
| AI sai chẩn đoán → trách nhiệm pháp lý | Đặt nguyên tắc "AI hỗ trợ, BS quyết định"; disclaimer rõ + log audit |
| Bác sĩ lớn tuổi ngại công nghệ | UX siêu đơn giản; có chế độ "ghi âm → AI điền form" |
| Cạnh tranh từ HIS lớn | Tốc độ ra tính năng + chuyên sâu YHCT |
| Chi phí AI tăng | Caching, batch inference, dùng model nhỏ cho task đơn giản |

---

**Đội ngũ tin rằng**: kết hợp được tri thức cổ truyền + AI hiện đại + nền tảng
VNPT Made-in-Vietnam, TRAMED.AI có thể trở thành **hạ tầng số mặc định**
cho ngành YHCT Việt Nam trong 5 năm tới.
