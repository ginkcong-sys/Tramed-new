import { createServerFn } from "@tanstack/react-start";
import { hasVertex } from "./vertex.server";
import { PROVIDER_FLASH, llmEndpoint, llmApiKey } from "./llm-config.server";


// Cơ sở tri thức Thiệt chẩn YHCT – tổng hợp từ:
// (1) "Tài liệu thiệt chẩn cơ bản" – Nguyễn Phương, Học viện YHCT Việt Nam, 2020
// (2) "Đồ hình màu thiệt chẩn Đông y" – BS. Nguyễn Đức Huệ Tiên, lớp Quang Minh Đỉnh
const KNOWLEDGE = `
# CƠ SỞ TRI THỨC THIỆT CHẨN YHCT (dùng để biện chứng)

## A. NGUYÊN LÝ
- Lưỡi liên hệ tạng phủ qua kinh lạc: Tâm khai khiếu ra lưỡi (biệt lạc Thủ thiếu âm nối gốc lưỡi); Tỳ kinh thông cuống lưỡi, phân bố dưới lưỡi; Thận kinh, Can kinh chạy qua hầu họng liên lạc gốc lưỡi.
- "Thiệt vi Tâm chi miêu khiếu" – chất lưỡi (sắc, hình, thần) phản ánh Tâm – huyết mạch – thần chí.
- "Thiệt vi Tỳ chi ngoại hậu" – rêu lưỡi do Vị khí chưng hóa tinh hoa thủy cốc đưa lên, phản ánh Tỳ Vị, tân dịch, mức tà khí.
- Độ nhuận – táo của lưỡi/rêu phản ánh Tỳ – Thận và tân dịch.

## B. PHÂN KHU TẠNG PHỦ TRÊN LƯỠI
- Đầu lưỡi  → Thượng tiêu: Tâm – Phế.
- Giữa lưỡi → Trung tiêu: Tỳ – Vị.
- Rìa (cạnh) lưỡi → Can – Đởm (rìa trái thường ứng Can, rìa phải Đởm).
- Gốc lưỡi → Hạ tiêu: Thận (và Bàng quang, Đại – Tiểu trường ở vùng kề).
- Theo "vị quản": đầu = thượng quản, giữa = trung quản, gốc = hạ quản → dùng khi biện luận bệnh trường vị.

## C. LƯỠI BÌNH THƯỜNG ("Đạm hồng thiệt, bạc bạch đài")
Thân lưỡi mềm mại linh hoạt, to nhỏ vừa phải, sắc hồng nhuận sáng; rêu trắng mỏng đều, khô-ướt vừa đủ. Khí huyết tân dịch sung thịnh, tạng phủ điều hòa.

## D. VỌNG CHẤT LƯỠI (Thiệt chất)

### D1. THẦN của lưỡi
- Vinh (vinh nhuận, tươi sáng, linh hoạt) → Vị khí còn, tiên lượng tốt.
- Khô (khô héo, ám tối, cứng đờ) → tinh khí kiệt, tiên lượng xấu.

### D2. SẮC LƯỠI
1) Đạm hồng (đỏ nhạt hồng): bình thường hoặc bệnh nhẹ.
2) Đạm bạch (trắng nhợt):
   - Hư hàn / Khí huyết lưỡng hư / Dương hư.
   - Nhợt bệu, dấu răng → Tỳ Thận dương hư, đàm thấp.
   - Nhợt gầy mỏng → Khí huyết hư.
3) Hồng (đỏ): nhiệt chứng.
   - Đỏ toàn lưỡi, rêu vàng → thực nhiệt (Vị nhiệt, Phế nhiệt).
   - Đỏ ít rêu hoặc bóc rêu → âm hư hỏa vượng (Thận âm, Vị âm hư).
   - Đầu lưỡi đỏ → Tâm hỏa thượng viêm.
   - Rìa lưỡi đỏ → Can Đởm thực hỏa / uất nhiệt.
4) Giáng (đỏ sẫm): nhiệt nhập dinh – huyết; nhiệt thịnh thương âm (sốt cao kéo dài, ôn bệnh giai đoạn dinh-huyết).
5) Tím / xanh tím (thanh tử):
   - Tím sẫm khô → nhiệt cực, huyết ứ do nhiệt.
   - Tím nhợt ướt → hàn ngưng huyết ứ, dương hư.
   - Có điểm/mảng ứ huyết → huyết ứ cục bộ.

### D3. HÌNH LƯỠI
- Già (lão): chất thô, cứng, sẫm → thực chứng.
- Non (nộn): mềm bệu, sáng → hư chứng.
- Bệu to (bàng đại): thường có dấu răng → Tỳ hư thấp thịnh / Thận dương hư đàm ẩm; nếu kèm đỏ sẫm → thấp nhiệt đàm ẩm nội thịnh.
- Gầy mỏng (sấu bạc): khí huyết hư hoặc âm hư hỏa vượng (nếu đỏ).
- Có dấu răng (xỉ ngân): Tỳ hư, dương hư thủy thấp.
- Nứt (liệt văn):
   - Nứt + đỏ ít rêu → âm hư, tân dịch khuy tổn.
   - Nứt + nhợt bệu → huyết hư hoặc Tỳ hư (có thể bẩm sinh, không bệnh).
- Nổi gai/điểm đỏ (điểm thích): nhiệt độc thịnh – tùy vùng định tạng (đầu = Tâm hỏa, rìa = Can Đởm hỏa, giữa = Vị nhiệt).

### D4. TRẠNG THÁI LƯỠI
- Nuy nhuyễn (liệt mềm): khí huyết – âm dịch khuy hư cực độ.
- Cường ngạnh (đơ cứng): nhiệt nhập tâm bào, đàm trở kinh lạc, trúng phong tiền triệu.
- Oai tà (lệch): trúng phong / kinh lạc bị tà khí.
- Đoản súc (co rút): nguy chứng – hàn ngưng cân mạch, đàm trọc nội trở, nhiệt thịnh thương tân, khí huyết hư cực.
- Run (chiến động): khí huyết hư, can phong nội động, nhiệt cực sinh phong.
- Thổ lộng: tâm – tỳ tích nhiệt, động phong tiền triệu (trẻ em).
- Thiệt sang (lở), thiệt nục (chảy máu): Tâm – Vị hỏa vượng, huyết nhiệt.

## E. VỌNG RÊU LƯỠI (Thiệt đài)

### E1. CHẤT RÊU
- Dày – mỏng: mỏng → tà còn ở biểu / chính khí chưa hư; dày → tà thịnh, đàm thấp – thực tích nội đình.
- Nhuận – táo: nhuận → tân dịch còn; trơn ướt nhiều → hàn thấp, dương hư thủy đình; táo khô → nhiệt thịnh thương tân, âm dịch khuy.
- Hủ (vữa, hạt rời như đậu hũ) → thực tích, đàm trọc nội thịnh, Vị khí suy bại.
- Nhị (nhầy nhớt dính chặt) → thấp trọc, đàm ẩm, thực trệ.
- Bóc rêu (bác đài) / lưỡi gương (cảnh diện): Vị khí – Vị âm tổn thương nặng; bóc từng mảng đổi vị trí gọi là "lưỡi bản đồ" → khí âm lưỡng hư.
- Vô căn đài: rêu nổi trên mặt lưỡi như rắc bột, cạo đi không còn → Vị khí suy bại, bệnh nặng.

### E2. MÀU RÊU
1) Trắng (bạch):
   - Trắng mỏng nhuận → bình thường hoặc biểu chứng, biểu hàn.
   - Trắng mỏng trơn → ngoại cảm phong hàn.
   - Trắng dày nhầy → đàm ẩm, thấp trọc, thực tích.
   - Trắng nhầy hóa táo → thấp hóa táo thương âm.
   - Trắng như tích bột (tích phấn đài) → ôn dịch, nội ung.
2) Vàng (hoàng):
   - Vàng mỏng → biểu nhiệt hoặc phong hàn hóa nhiệt.
   - Vàng dày → lý nhiệt thực chứng.
   - Vàng nhầy → thấp nhiệt, đàm nhiệt nội uẩn (Tỳ Vị / Can Đởm thấp nhiệt).
   - Vàng táo / vàng cháy → nhiệt thịnh thương tân, dương minh phủ thực.
   - Vàng từng mảng → thực tích – nhiệt kết.
3) Xám – đen (hôi hắc):
   - Xám đen nhuận → hàn thịnh, dương hư hàn ngưng, đàm ẩm.
   - Đen táo nứt gai → nhiệt cực thương âm, thận âm khô kiệt (nguy chứng).
   - Xám bẩn nhầy → thấp trọc đàm trệ.

## F. TĨNH MẠCH DƯỚI LƯỠI (lạc mạch)
- Bình thường: tím đỏ nhạt, đường kính ≤ ~2,7mm, dài ≤ 3/5 từ đầu lưỡi đến gồ thịt dưới lưỡi, ngay ngắn, không phình – không gấp khúc.
- Phình to, sẫm tím, ngoằn ngoèo, có nốt ứ → huyết ứ (ứ trệ Can, Tâm mạch, phụ khoa, can xơ…).
- Nhợt mảnh → khí huyết hư.

## G. NGUYÊN TẮC BIỆN CHỨNG TỔNG HỢP
- Luôn kết hợp CHẤT LƯỠI + RÊU LƯỠI: chất phản ánh tạng phủ – khí huyết – âm dương gốc; rêu phản ánh tà khí, tân dịch, Vị khí.
- Khi mâu thuẫn: chất lưỡi phản ánh bản chất, rêu lưỡi phản ánh hiện trạng tà – chính.
- Đối chiếu Bát cương: Hàn/Nhiệt (sắc + nhuận-táo + màu rêu), Hư/Thực (thần + chất rêu dày mỏng + lực lưỡi), Biểu/Lý (rêu mỏng-dày), Âm/Dương (nhợt-bệu vs đỏ-gầy-nứt).
- Lưu ý "nhiễm thiệt": thức ăn/thuốc có màu (cà phê, củ dền, kẹo, sữa, kháng sinh) có thể làm sai lệch – cần loại trừ trước khi kết luận.
- Yếu tố sinh lý: tuổi, giới, thể chất bẩm sinh, khí hậu, ánh sáng khi quan sát.
`;

const SYSTEM = `Bạn là chuyên gia Vọng chẩn YHCT Việt Nam, biện chứng ảnh lưỡi dựa trên cơ sở tri thức kinh điển sau đây. Hãy DÙNG kiến thức này để miêu tả và giải thích chi tiết theo YHCT, không suy diễn ngoài phạm vi.

===== CƠ SỞ TRI THỨC =====
${KNOWLEDGE}
===== HẾT TRI THỨC =====

NHIỆM VỤ: Quan sát ảnh lưỡi và trả kết quả Markdown theo CẤU TRÚC bắt buộc dưới đây. Với mỗi mục, vừa MIÊU TẢ thấy gì trên ảnh, vừa GIẢI THÍCH ý nghĩa YHCT (trích nguyên lý phía trên: kinh lạc, tạng phủ, khí–huyết–tân dịch, hàn–nhiệt–hư–thực).

## 1. Tổng quan ấn tượng
- Thần lưỡi (vinh/khô), kích thước tổng thể, độ linh hoạt suy đoán qua hình ảnh.
- Kết luận sơ bộ: chính khí còn/suy.

## 2. Chất lưỡi (Thiệt chất)
- **Sắc lưỡi**: đạm hồng / nhợt / đỏ / giáng / tím xanh – mô tả vùng nào đậm nhạt.
- **Hình thể**: bệu / gầy / nứt (vị trí, hình thái) / dấu răng / điểm gai / ứ huyết.
- **Diễn giải YHCT**: liên hệ Tâm – Tỳ – Can – Thận, Khí – Huyết – Âm – Dương, dẫn nguyên lý từ tri thức trên.

## 3. Rêu lưỡi (Thiệt đài)
- **Màu rêu**: trắng / vàng / xám / đen / hỗn hợp + phân bố theo vùng.
- **Độ dày, độ phủ**: mỏng/dày/bóc/vô căn/lưỡi gương/lưỡi bản đồ.
- **Tính chất**: khô / nhuận / trơn / nhầy nhị / hủ vữa.
- **Diễn giải**: Biểu–Lý, Hàn–Nhiệt, mức tà khí, trạng thái Vị khí & tân dịch.

## 4. Định khu Tạng phủ (theo phân khu)
- Đầu lưỡi (Tâm–Phế): mô tả + ý nghĩa.
- Giữa lưỡi (Tỳ–Vị): …
- Rìa lưỡi (Can–Đởm): …
- Gốc lưỡi (Thận, Bàng quang): …
- Nêu rõ vùng nào BẤT THƯỜNG ⇒ tạng phủ liên đới.

## 5. Lạc mạch dưới lưỡi (nếu thấy được)
Nhận định ứ huyết / khí huyết hư, hoặc ghi "không quan sát rõ trong ảnh".

## 6. Biện chứng tổng hợp (Bát cương + tạng phủ)
- Hàn/Nhiệt – Hư/Thực – Biểu/Lý – Âm/Dương.
- Định vị tạng phủ chính – kiêm chứng.

## 7. Gợi ý thể bệnh YHCT (top 2–3)
Mỗi thể: tên thể bệnh + % độ phù hợp với hình ảnh + lý luận ngắn dựa trên dấu chứng đã mô tả.

## 8. Đề xuất Tứ chẩn bổ sung
Cần Văn – Vấn – Thiết những gì để xác chẩn (mạch tượng dự đoán, triệu chứng cần hỏi, dấu hiệu cần khám).

## 9. Pháp điều trị gợi ý
- Pháp trị (vd: Kiện tỳ trừ thấp, Tư âm giáng hỏa, Hoạt huyết hóa ứ…).
- 1–2 bài thuốc cổ phương phù hợp (chỉ tên bài, KHÔNG kê liều).
- Gợi ý châm cứu / huyệt chủ đạo (nếu phù hợp).

⚠️ Kết bằng: "Đây là gợi ý từ AI dựa trên ảnh lưỡi và lý luận thiệt chẩn cổ điển – cần Tứ chẩn đầy đủ và quyết định lâm sàng của thầy thuốc."

NẾU ảnh không phải ảnh lưỡi hoặc không đủ rõ (mờ, thiếu sáng, ánh sáng màu, bị nhiễm màu thức ăn) → CHỈ trả lời ngắn: "Ảnh không phù hợp để vọng chẩn lưỡi, vui lòng chụp lại: há miệng, thè lưỡi tự nhiên, ánh sáng ban ngày nhu hòa, không ăn uống có màu trước 30 phút."`;

// ============================================================================
// VNPT SmartVision API — TradMed.AI integration (Vietnamese Student HackAIthon 2026)
// Doc: /data-service/v1/smartvision/detect-people (VNPT AI Platform)
// Credentials cấp bởi VNPT AI Team cho đội Pulse & Pixel — dùng cho vòng thi.
// ============================================================================
const VNPT_SMARTVISION_ENDPOINT_DEFAULT =
  "https://smartvision.vnpt.vn/data-service/v1/smartvision/detect-people";
const VNPT_SMARTVISION_TOKEN_ID_DEFAULT =
  "54fcb750-baa6-53aa-e063-62199f0ae8ac";
const VNPT_SMARTVISION_TOKEN_KEY_DEFAULT =
  "MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKF71KkScKrgStOkZydxIemIrHE+CN52idkmTudkeiy8nN1weYPI1lvAc8UzRQn8aVOwkznEjFWeQky+vKbCLz0CAwEAAQ==";
const VNPT_SMARTVISION_ACCESS_TOKEN_DEFAULT =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0cmFuc2FjdGlvbl9pZCI6ImU0NjQxN2JmLTA2NWYtNDUxNC1iMzhlLTZmYTQxNGQ3MjlhOCIsInN1YiI6IjU0OTZhNWE2LWE3YjAtNmYwOC1lMDYzLTYyMTk5ZjBhN2NjZCIsImF1ZCI6WyJyZXN0c2VydmljZSJdLCJ1c2VyX25hbWUiOiJ0ZWFtLjEzQHZucHRhaS5pbyIsInNjb3BlIjpbInJlYWQiXSwiaXNzIjoiaHR0cHM6Ly9sb2NhbGhvc3QiLCJuYW1lIjoidGVhbS4xM0B2bnB0YWkuaW8iLCJ1dWlkX2FjY291bnQiOiI1NDk2YTVhNi1hN2IwLTZmMDgtZTA2My02MjE5OWYwYTdjY2QiLCJhdXRob3JpdGllcyI6WyJVU0VSIiwiVFJBQ0tfMSJdLCJqdGkiOiJiMDFlMDNmYi02Y2FjLTRlNzMtYjU4Ny02Mzk2NGY4NWI1ZGQiLCJjbGllbnRfaWQiOiJhZG1pbmFwcCJ9.XN8YoBcAkRrw0NheThffLtUfN_6picsgqx02yrEt00t5huA4ngB5kSSEa0z8XQZiFgnF8Ph9raU-xrHHkvp515lSS35YOLWEO4rlH_cR9eoNxOe2QFCyo-PLoF9eBmsoHCmXQxaWMC-4YfCis-dHVEoLIofQ1Rw2eZHA1geSBbN2Sw3e3MHrVWtHB55Xm-7v1Q4E0xKDElEUS6iJNunwEnyNmieIjQQsrqG7G7qxbd1I3RZ3RAkXw4QPpNj578dnou_nfT4sac0Pf6h8eII-OS9v-RA1blTOdoS2KZhB7b3yMqmzbwADytn3TP7euxCaQ3DdGlokK_GZvNnV4xR5Hw";

async function callSmartVision(imageBase64: string, mimeType: string): Promise<string | null> {
  const endpoint = process.env.VNPT_SMARTVISION_ENDPOINT || VNPT_SMARTVISION_ENDPOINT_DEFAULT;
  const tokenId = process.env.VNPT_SMARTVISION_TOKEN_ID || VNPT_SMARTVISION_TOKEN_ID_DEFAULT;
  const tokenKey = process.env.VNPT_SMARTVISION_TOKEN_KEY || VNPT_SMARTVISION_TOKEN_KEY_DEFAULT;
  const accessToken = process.env.VNPT_SMARTVISION_ACCESS_TOKEN || VNPT_SMARTVISION_ACCESS_TOKEN_DEFAULT;
  if (!endpoint || !tokenId || !tokenKey || !accessToken) return null;

  try {
    const buf = Buffer.from(imageBase64, "base64");
    const blob = new Blob([buf], { type: mimeType });
    const form = new FormData();
    form.append("image", blob, "tongue.jpg");
    form.append("token_id", tokenId);
    form.append("token_key", tokenKey);

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "token-id": tokenId,
        "token-key": tokenKey,
      },
      body: form,
    });
    if (!res.ok) {
      console.warn("[VNPT SmartVision] HTTP", res.status, (await res.text()).slice(0, 200));
      return null;
    }
    const json = await res.json().catch(() => null);
    if (!json) return null;

    const summary = JSON.stringify(json).slice(0, 1500);
    return `Kết quả tiền phân tích từ VNPT SmartVision (BTC): ${summary}`;
  } catch (e) {
    console.warn("[VNPT SmartVision] lỗi:", (e as Error).message);
    return null;
  }
}


export const phanTichLuoi = createServerFn({ method: "POST" })
  .inputValidator((d: { imageBase64: string; mimeType: string; note?: string }) => d)
  .handler(async ({ data }) => {
    // Tầng 1: VNPT SmartVision (API BTC) – metadata màu/đặc trưng ảnh
    const svMeta = await callSmartVision(data.imageBase64, data.mimeType);

    const baseAsk = "Hãy vọng chẩn ảnh lưỡi này theo đúng cấu trúc 9 mục đã quy định, vận dụng cơ sở tri thức thiệt chẩn YHCT.";
    const parts: string[] = [];
    if (data.note?.trim()) parts.push(`Thông tin lâm sàng kèm theo: ${data.note}`);
    if (svMeta) parts.push(svMeta);
    parts.push(baseAsk);
    const userText = parts.join("\n\n");


    const errors: string[] = [];

    // ===== 1) Vertex AI (ổn định nhất – không bị region/free tier) =====
    if (hasVertex()) {
      try {
        const { vertexImageChat } = await import("./vertex.server");
        const content = await vertexImageChat({
          system: SYSTEM,
          userText,
          imageBase64: data.imageBase64,
          mimeType: data.mimeType,
        });
        if (content) return { content };
      } catch (e) {
        const msg = (e as Error).message;
        console.warn("[vong-chan] Vertex lỗi, thử LLM Gateway nội bộ:", msg);
        errors.push("Vertex: " + msg);
      }
    }

    // ===== 2) LLM nội bộ (fallback) =====
    const llmKey = llmApiKey();
    if (llmKey) {
      try {
        const url = llmEndpoint(PROVIDER_FLASH);
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-goog-api-key": llmKey },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: SYSTEM }] },
            contents: [{
              role: "user",
              parts: [
                { text: userText },
                { inlineData: { mimeType: data.mimeType, data: data.imageBase64 } },
              ],
            }],
          }),
        });
        if (res.ok) {
          const json = await res.json();
          const content: string = json?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text || "").join("") ?? "";
          if (content) return { content };
          errors.push("LLM: trả về rỗng");
        } else {
          const t = await res.text();
          let detail = t.slice(0, 200);
          try { detail = JSON.parse(t)?.error?.message || detail; } catch { /* ignore */ }
          errors.push(`LLM ${res.status}: ${detail}`);
        }
      } catch (e) {
        errors.push("LLM: " + (e as Error).message);
      }
    }

    throw new Error(
      errors.length
        ? "Tất cả backend AI đều lỗi. Chi tiết:\n• " + errors.join("\n• ")
        : "Chưa cấu hình backend AI (cần GCP_SERVICE_ACCOUNT_JSON hoặc LLM_API_KEY).",
    );
  });
