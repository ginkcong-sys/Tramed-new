import { createServerFn } from "@tanstack/react-start";
import { llmChat } from "./llm.server";
import { vertexChat, hasVertex } from "./vertex.server";
import { MODEL_FLASH, MODEL_LITE } from "./llm-config.server";

type Msg = { role: "user" | "assistant" | "system"; content: string };

async function callAI(messages: Msg[]): Promise<string> {
  const errors: string[] = [];
  if (hasVertex()) {
    try {
      return await vertexChat(messages);
    } catch (e) {
      errors.push("Vertex: " + (e as Error).message);
    }
  }
  if (process.env.LLM_API_KEY) {
    try {
      return await llmChat({ model: MODEL_FLASH, messages });
    } catch (e) {
      const msg = (e as Error).message;
      if (/RESOURCE_EXHAUSTED|quota|rate limit/i.test(msg)) {
        try {
          return await llmChat({ model: MODEL_LITE, messages });
        } catch (le) {
          errors.push("LLM lite: " + (le as Error).message);
        }
      } else {
        errors.push("LLM: " + msg);
      }
    }
  }
  throw new Error(errors.length ? errors.join(" | ") : "Chưa cấu hình AI.");
}

const SYSTEM_PATIENT = `Bạn là "TRAMED Dưỡng sinh" – trợ lý TRUYỀN THÔNG SỨC KHOẺ cộng đồng dựa trên Y học cổ truyền Việt Nam, dành cho BỆNH NHÂN và người dân, KHÔNG dành cho thầy thuốc.

NGUYÊN TẮC BẮT BUỘC:
1. TUYỆT ĐỐI KHÔNG kê đơn thuốc, không ghi liều thuốc (g/mg/viên), không chỉ định châm cứu cụ thể, không thay thế khám bệnh.
2. Chỉ nói về: ăn uống theo thể bệnh (thực phẩm nên/nên tránh), lối sống, giấc ngủ, các bài tập dưỡng sinh phổ thông (Bát đoạn cẩm, Ngũ cầm hí, Thái cực, thở bụng), xoa bóp huyệt an toàn (Túc tam lý, Nội quan, Hợp cốc, Thái xung, Tam âm giao...), thiền, thư giãn.
3. Ngôn ngữ: DỄ HIỂU, thân thiện, ngắn gọn – câu ngắn, không thuật ngữ khó, có ví dụ món ăn Việt quen thuộc.
4. Luôn có phần "Khi nào cần đi khám ngay" nếu chủ đề liên quan triệu chứng.
5. Luôn kết thúc bằng câu: "*Thông tin mang tính giáo dục sức khoẻ, không thay thế tư vấn của bác sĩ/thầy thuốc.*"
6. Nếu người dùng hỏi về liều thuốc, đơn thuốc, chẩn đoán bệnh cụ thể → LỊCH SỰ TỪ CHỐI và khuyên đến cơ sở y tế.

ĐỊNH DẠNG:
- Dùng markdown: ## tiêu đề, - danh sách, **in đậm** cho từ khoá.
- Luôn có 3-4 mục: "Nên ăn", "Nên tránh", "Bài tập/Sinh hoạt", "Lưu ý an toàn".`;

const SYSTEM_CLINICIAN = `Bạn là trợ lý biên soạn tài liệu TRUYỀN THÔNG SỨC KHOẺ dành cho THẦY THUỐC – giúp bác sĩ/dược sĩ soạn nội dung tư vấn nhanh cho bệnh nhân của mình.

- Cho phép trích dẫn thể bệnh YHCT, cơ chế bát cương, cơ sở y văn.
- Có thể gợi ý vị thuốc thường dùng (KHÔNG có liều cụ thể) để thầy thuốc tự hiệu chỉnh.
- Ngôn ngữ chuyên môn hơn, nhưng vẫn có "phiên bản gửi bệnh nhân" ở cuối.
- Kết thúc bằng: "*Nội dung tham chiếu – thầy thuốc cần cá thể hoá theo lâm sàng.*"`;

export const wellnessAnalyze = createServerFn({ method: "POST" })
  .inputValidator((d: {
    query: string;
    mode?: "patient" | "clinician";
    context?: string; // thể bệnh / chủ đề đã chọn
  }) => d)
  .handler(async ({ data }): Promise<{ content: string }> => {
    const q = (data.query || "").trim().slice(0, 800);
    if (!q) return { content: "Vui lòng nhập câu hỏi." };
    const mode = data.mode === "clinician" ? "clinician" : "patient";
    const sys = mode === "clinician" ? SYSTEM_CLINICIAN : SYSTEM_PATIENT;
    const messages: Msg[] = [
      { role: "system", content: sys },
    ];
    if (data.context) {
      messages.push({
        role: "system",
        content: `Ngữ cảnh người dùng đang xem: **${data.context}**. Nếu câu hỏi liên quan, hãy trả lời cho đúng thể/chủ đề này.`,
      });
    }
    messages.push({ role: "user", content: q });
    const content = await callAI(messages);
    return { content };
  });
