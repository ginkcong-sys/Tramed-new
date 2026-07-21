import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Search, Sparkles, Utensils, Activity, Wind, Leaf, ShieldAlert, Stethoscope, Users, ChevronRight, Loader2, X, ArrowLeft, Newspaper, ExternalLink } from "lucide-react";
import { wellnessAnalyze } from "@/lib/wellness.functions";

export const Route = createFileRoute("/duong-sinh")({
  head: () => ({
    meta: [
      { title: "Dưỡng sinh cộng đồng – Ăn uống & bài tập theo thể bệnh | TRAMED" },
      { name: "description", content: "Giáo dục sức khoẻ cộng đồng theo Y học cổ truyền: ăn uống phù hợp thể bệnh, bài tập dưỡng sinh, xoa bóp huyệt an toàn. Có AI phân tích cá nhân hoá." },
      { property: "og:title", content: "Dưỡng sinh cộng đồng – TRAMED" },
      { property: "og:description", content: "Ăn uống theo Đông y, bài tập dưỡng sinh, tư vấn AI cho từng thể bệnh." },
    ],
  }),
  component: DuongSinhPage,
});

const GATE_KEY = "tramed.duongsinh.role";
type Role = "patient" | "clinician";

/* ================= DATA – chuẩn hoá tài liệu YHCT ================= */

type TheBenh = {
  id: string;
  name: string;
  aka: string;
  tone: string;
  color: string;
  short: string;
  signs: string[];
  eatYes: string[];
  eatNo: string[];
  meals: string[];
  exercise: string[];
  acu: string[];
  warn: string[];
};

const THE_BENH: TheBenh[] = [
  {
    id: "khi-hu",
    name: "Khí hư",
    aka: "Qi Deficiency",
    tone: "amber",
    color: "#f59e0b",
    short: "Mệt mỏi, hụt hơi, tiếng nói nhỏ, ra mồ hôi không do vận động, dễ cảm.",
    signs: ["Mệt sau ăn", "Đoản khí, ngại nói", "Chán ăn, đầy bụng", "Lưỡi bệu, rìa có dấu răng"],
    eatYes: ["Gạo tẻ, gạo nếp lứt", "Khoai lang, khoai từ, bí đỏ", "Thịt gà (hầm)", "Cá diêu hồng, cá lóc", "Nấm hương, đậu ván", "Táo tàu, long nhãn (ít)"],
    eatNo: ["Đồ sống lạnh, rau sống nhiều", "Nước đá, kem", "Đồ chiên rán nhiều dầu", "Trà đặc lúc đói", "Cải bẹ xanh, mướp đắng ăn nhiều"],
    meals: ["Cháo gà hầm nấm hương – bữa sáng", "Cơm gạo lứt + cá kho gừng + canh bí đỏ", "Chè đậu ván long nhãn – ấm bụng buổi chiều"],
    exercise: ["Bát đoạn cẩm – thức 1 & 2 (nâng trời, giương cung)", "Đi bộ chậm 20–30 phút/ngày, sau ăn 30 phút", "Thở bụng 4-7-8: hít 4s – giữ 7s – thở ra 8s × 5 lần"],
    acu: ["Xoa Túc tam lý (dưới đầu gối 3 thốn ngoài) 3 phút/bên – kiện tỳ ích khí", "Xoa Khí hải (dưới rốn 1,5 thốn) 2 phút – bổ khí"],
    warn: ["Nếu mệt tăng nhanh, khó thở, phù chân, tim đập nhanh → khám ngay để loại trừ tim mạch / thiếu máu."],
  },
  {
    id: "huyet-hu",
    name: "Huyết hư",
    aka: "Blood Deficiency",
    tone: "rose",
    color: "#f43f5e",
    short: "Da xanh, môi nhợt, chóng mặt, mất ngủ, kinh nguyệt ít, tóc rụng, móng khô.",
    signs: ["Hoa mắt khi đứng lên", "Ngủ mê, hay quên", "Kinh nguyệt ít, chậm", "Móng tay dễ gãy"],
    eatYes: ["Thịt bò nạc, gan (ít, 1-2 lần/tuần)", "Trứng gà, cá hồi", "Đậu đen, mè đen, đậu phộng", "Rau bina, cải bó xôi, cà rốt", "Long nhãn, táo đỏ, kỷ tử", "Củ dền, nho khô"],
    eatNo: ["Bỏ bữa, ăn kiêng khắc nghiệt", "Trà đặc / cà phê trong bữa ăn (giảm hấp thu sắt)", "Rượu bia"],
    meals: ["Canh gà hầm táo đỏ – kỷ tử (1 lần/tuần)", "Cháo mè đen long nhãn – bữa tối nhẹ", "Bò xào cải bó xôi + cơm gạo lứt"],
    exercise: ["Yin yoga / duỗi cơ nhẹ 15 phút trước ngủ", "Đi bộ 20 phút buổi sáng có nắng nhẹ", "Ngủ trước 23h – gan tàng huyết vào giờ Tý"],
    acu: ["Xoa Tam âm giao (mắt cá trong lên 3 thốn) 3 phút – bổ huyết ích âm (KHÔNG dùng cho thai phụ)", "Xoa Huyết hải (trên xương bánh chè 2 thốn trong) 2 phút"],
    warn: ["Da rất xanh, chóng mặt tăng, tim đập nhanh, phân đen → nghi thiếu máu / xuất huyết tiêu hoá, khám ngay."],
  },
  {
    id: "am-hu",
    name: "Âm hư",
    aka: "Yin Deficiency",
    tone: "sky",
    color: "#38bdf8",
    short: "Nóng trong, khô miệng, bốc hoả, ra mồ hôi đêm, mất ngủ, ù tai, táo bón.",
    signs: ["Bốc hoả về chiều", "Lòng bàn tay chân nóng", "Khô miệng, khát nước", "Lưỡi đỏ ít rêu"],
    eatYes: ["Lê, dưa hấu, dâu tây, mía", "Đậu xanh, đậu đen (chè loãng)", "Củ mài (hoài sơn), củ sen, ngân nhĩ", "Vịt (thanh nhiệt hơn gà)", "Rau má, rau diếp cá, khổ qua", "Trứng gà luộc, sữa chua"],
    eatNo: ["Cà phê, rượu bia, thuốc lá", "Ớt, tiêu, tỏi sống, gừng nhiều", "Đồ nướng cháy, chiên khô", "Nhãn, vải, sầu riêng (nhiều)"],
    meals: ["Chè ngân nhĩ – hạt sen – táo đỏ (buổi chiều)", "Canh vịt nấu củ mài", "Cháo bí đao – đậu xanh (ngày nóng)"],
    exercise: ["Thái cực quyền chậm 15–20 phút", "Thở bụng chậm, thiền chánh niệm 10 phút/ngày", "Tránh tập nặng buổi trưa nắng, không xông hơi lâu"],
    acu: ["Xoa Thái khê (sau mắt cá trong) 3 phút – bổ thận âm", "Xoa Chiếu hải (dưới mắt cá trong) 2 phút – dưỡng âm, an thần"],
    warn: ["Sốt kéo dài, sút cân nhanh, ho ra máu, đổ mồ hôi đêm nhiều tuần → khám loại trừ lao, cường giáp, bệnh lý ác tính."],
  },
  {
    id: "duong-hu",
    name: "Dương hư",
    aka: "Yang Deficiency",
    tone: "orange",
    color: "#fb923c",
    short: "Sợ lạnh, chân tay lạnh, tiểu đêm, tiêu chảy sáng sớm, lưng gối mỏi lạnh.",
    signs: ["Sợ lạnh hơn người khác", "Tiểu đêm ≥2 lần", "Đại tiện nát", "Lưỡi bệu nhợt, rêu trắng ướt"],
    eatYes: ["Gừng tươi, quế chi (ít)", "Thịt dê, thịt bò (hầm)", "Cá chép, cá hồi", "Hạt óc chó, hạt dẻ, hạt bí", "Hành, tỏi, hẹ (nấu chín)", "Nước ấm, trà gừng buổi sáng"],
    eatNo: ["Nước đá, sinh tố lạnh", "Dưa hấu, đậu xanh nguội", "Rau sống, gỏi sống", "Bia lạnh, hải sản sống"],
    meals: ["Cháo cá chép gừng hành – sáng sớm", "Thịt bò hầm quế – hành tây (2 lần/tuần)", "Trà gừng mật ong ấm sau khi thức dậy"],
    exercise: ["Bát đoạn cẩm buổi sáng ngoài nắng nhẹ 15 phút", "Chạy bộ chậm hoặc nhảy dây nhẹ", "Ngâm chân nước ấm + gừng 15 phút trước ngủ"],
    acu: ["Xoa Quan nguyên (dưới rốn 3 thốn) 3 phút – ôn bổ mệnh môn", "Cứu ngải (nếu có) Túc tam lý 5 phút – ôn dương ích khí"],
    warn: ["Phù toàn thân, khó thở khi nằm, tiểu rất ít → nghi suy tim / suy thận, khám ngay."],
  },
  {
    id: "dam-thap",
    name: "Đàm thấp",
    aka: "Phlegm-Damp",
    tone: "emerald",
    color: "#10b981",
    short: "Người nặng nề, béo phì, ngực bụng đầy, đờm nhiều, đầu nặng, lưỡi rêu dày nhớt.",
    signs: ["Cơ thể nặng nề buổi sáng", "Đờm trắng nhiều", "Miệng nhạt dính", "Đại tiện dính"],
    eatYes: ["Ý dĩ (bo bo), đậu đỏ, đậu ván", "Bí đao, bí xanh, mướp", "Trần bì (vỏ quýt khô) hãm trà", "Gừng, hành, tía tô", "Cá đồng, ức gà bỏ da", "Rau muống, rau ngót"],
    eatNo: ["Sữa nguyên kem, phô mai béo", "Đồ ngọt, bánh kem, trà sữa", "Đồ chiên rán, mỡ động vật", "Trái cây quá ngọt (mít, sầu riêng)"],
    meals: ["Nước ý dĩ – đậu đỏ (thay nước lọc 500ml/ngày)", "Canh bí đao – nấm rơm – ức gà", "Trà trần bì – gừng sau bữa ăn nhiều dầu"],
    exercise: ["Cardio 30–40 phút/ngày (đi bộ nhanh, đạp xe)", "Bát đoạn cẩm thức 3 (điều lý tỳ vị)", "Đổ mồ hôi vừa phải mỗi ngày, tắm nước ấm"],
    acu: ["Xoa Phong long (trước xương chày, giữa gối và mắt cá) 3 phút – hoá đàm", "Xoa Trung quản (giữa rốn và mỏm ức) 2 phút – kiện tỳ hoá thấp"],
    warn: ["Ho ra đờm lẫn máu, sút cân, sốt về chiều → khám loại trừ lao / u phổi."],
  },
  {
    id: "thap-nhiet",
    name: "Thấp nhiệt",
    aka: "Damp-Heat",
    tone: "yellow",
    color: "#eab308",
    short: "Da dầu mụn, miệng đắng hôi, nước tiểu vàng, đại tiện nóng rát, dễ viêm da.",
    signs: ["Mụn viêm, da dầu", "Miệng đắng, hôi", "Nước tiểu vàng sậm", "Ngứa vùng kín, huyết trắng vàng"],
    eatYes: ["Rau má, atisô, khổ qua", "Đậu xanh, đậu đen (chè loãng, không đường)", "Bí đao, dưa leo, cần tây", "Sữa chua không đường", "Cá đồng, ức gà luộc", "Trà xanh nhạt, nước đậu đen rang"],
    eatNo: ["Rượu bia, thuốc lá", "Ớt, tiêu, đồ cay", "Đồ nướng, chiên, xào nhiều dầu", "Đường tinh luyện, nước ngọt", "Hải sản khi đang có mụn viêm"],
    meals: ["Nước rau má – đậu xanh buổi sáng", "Canh khổ qua nhồi ức gà + cơm gạo lứt", "Trà atisô sau bữa trưa"],
    exercise: ["Bơi lội 2–3 lần/tuần", "Đi bộ / yoga buổi sáng sớm mát", "Tránh xông hơi khô, phòng tập bí"],
    acu: ["Xoa Khúc trì (khuỷu tay ngoài) 2 phút – thanh nhiệt", "Xoa Hợp cốc (kẽ ngón cái – trỏ) 2 phút – tả nhiệt (KHÔNG cho thai phụ)"],
    warn: ["Vàng da mắt, sốt cao, đau hạ sườn phải → khám gan mật ngay."],
  },
  {
    id: "khi-uat",
    name: "Khí uất",
    aka: "Qi Stagnation",
    tone: "violet",
    color: "#a78bfa",
    short: "Căng thẳng, tức ngực, hay thở dài, đau đầu 2 bên, kinh nguyệt không đều, dễ cáu.",
    signs: ["Tức nặng ngực sườn", "Hay thở dài", "Cảm xúc dao động", "Đau đầu vùng thái dương"],
    eatYes: ["Cam bergamot, quýt, bưởi (ăn cả tép trắng)", "Hoa cúc, hoa nhài hãm trà", "Củ cải trắng, bạc hà", "Hành hoa, hẹ", "Cá hồi, cá thu (Omega-3)", "Socola đen 70% (ít)"],
    eatNo: ["Cà phê nhiều, nước tăng lực", "Rượu bia khi stress", "Đồ ăn nhanh, đường tinh luyện", "Nhịn ăn dài, ăn quá no buổi tối"],
    meals: ["Trà hoa cúc – kỷ tử buổi chiều", "Canh củ cải trắng – hành hoa", "Cá hồi áp chảo + salad bơ chanh"],
    exercise: ["Đi bộ nhanh trong công viên 30 phút", "Yoga vặn xoắn (twist) 15 phút", "Thở 4-4-6: hít 4 – giữ 4 – thở 6 (giảm giao cảm)", "Viết nhật ký cảm xúc 5 phút/tối"],
    acu: ["Xoa Thái xung (mu bàn chân, kẽ ngón 1–2) 3 phút – sơ can lý khí", "Xoa Đản trung (giữa 2 núm vú) 2 phút – khoan ngực"],
    warn: ["Buồn chán kéo dài >2 tuần, có ý nghĩ tiêu cực → tìm chuyên gia tâm lý / bác sĩ tâm thần ngay."],
  },
  {
    id: "huyet-u",
    name: "Huyết ứ",
    aka: "Blood Stasis",
    tone: "purple",
    color: "#c084fc",
    short: "Đau nhói vị trí cố định, da xỉn, môi tím, kinh nguyệt có cục máu đông, dễ bầm.",
    signs: ["Đau như kim châm, cố định", "Môi lưỡi tím sẫm", "Da mặt xỉn, có nám", "Kinh có cục máu đông"],
    eatYes: ["Nghệ vàng (bột 1/2 thìa/ngày với sữa ấm)", "Gừng, hành, tỏi (chín)", "Sơn tra (táo mèo), giấm táo pha loãng", "Cá hồi, cá thu, hạt lanh", "Rau cải xanh, hành tây tím", "Đậu đen"],
    eatNo: ["Mỡ động vật nhiều", "Đồ chiên lại nhiều lần", "Đường tinh luyện", "Rượu bia"],
    meals: ["Sữa nghệ ấm buổi sáng (1/2 thìa nghệ + sữa ấm)", "Cá hồi nướng gừng + hành tây tím", "Trà sơn tra sau bữa nhiều dầu"],
    exercise: ["Đi bộ nhanh 30 phút/ngày (tăng vi tuần hoàn)", "Bát đoạn cẩm toàn bài", "Xoa bóp chân tay 5 phút trước ngủ"],
    acu: ["Xoa Huyết hải – Tam âm giao 3 phút mỗi bên", "Xoa Cách du (lưng, ngang T7) nếu có người hỗ trợ"],
    warn: ["Đau ngực dữ dội, tê nửa người, méo miệng, nói khó → GỌI 115 ngay (nghi nhồi máu / đột quỵ)."],
  },
];

const TOPICS = [
  { id: "tang-huyet-ap", name: "Tăng huyết áp", icon: Activity },
  { id: "tieu-duong", name: "Đái tháo đường", icon: Leaf },
  { id: "mat-ngu", name: "Mất ngủ", icon: Wind },
  { id: "roi-loan-tieu-hoa", name: "Rối loạn tiêu hoá", icon: Utensils },
  { id: "dau-lung", name: "Đau lưng – thoái hoá", icon: Activity },
  { id: "stress-lo-au", name: "Stress – lo âu", icon: Wind },
  { id: "man-kinh", name: "Tiền mãn kinh", icon: Sparkles },
  { id: "hau-covid", name: "Hồi phục hậu COVID/cúm", icon: ShieldAlert },
];

const EXERCISES = [
  {
    id: "bat-doan-cam",
    name: "Bát đoạn cẩm",
    time: "15 phút · sáng",
    level: "Cơ bản – mọi lứa tuổi",
    desc: "8 thức khí công cổ điển, tăng lưu thông khí huyết, kiện tỳ, mạnh gân cốt.",
    steps: [
      "Thức 1: Hai tay nâng trời điều tam tiêu",
      "Thức 2: Trái phải giương cung như bắn diều hâu",
      "Thức 3: Điều lý tỳ vị đơn cử thủ",
      "Thức 4: Ngũ lao thất thương ngoái nhìn sau",
      "Thức 5: Lắc đầu vẫy đuôi trừ tâm hoả",
      "Thức 6: Hai tay ôm chân bổ thận yêu",
      "Thức 7: Nắm tay trợn mắt tăng khí lực",
      "Thức 8: Nhún gót 7 lần trừ bách bệnh",
    ],
    goodFor: ["Khí hư", "Dương hư", "Đàm thấp", "Đau lưng"],
  },
  {
    id: "ngu-cam-hi",
    name: "Ngũ cầm hí",
    time: "20 phút",
    level: "Cơ bản",
    desc: "Mô phỏng 5 loài vật: Hổ – Hươu – Gấu – Vượn – Hạc, dưỡng ngũ tạng.",
    steps: [
      "Hổ hí – dưỡng Can, gân cốt",
      "Hươu hí – dưỡng Thận, thắt lưng",
      "Gấu hí – dưỡng Tỳ, tiêu hoá",
      "Vượn hí – dưỡng Tâm, nhanh nhẹn",
      "Hạc hí – dưỡng Phế, hô hấp",
    ],
    goodFor: ["Khí uất", "Mất ngủ", "Stress"],
  },
  {
    id: "thai-cuc",
    name: "Thái cực quyền 24 thức",
    time: "20–30 phút",
    level: "Cơ bản đến nâng cao",
    desc: "Chuyển động chậm, liên tục, thở sâu – điều hoà âm dương, giảm huyết áp, cải thiện thăng bằng.",
    steps: ["Khởi thức", "Dã mã phân tông", "Bạch hạc lượng xí", "Lâu tất áo bộ", "…"],
    goodFor: ["Tăng huyết áp", "Âm hư", "Mất ngủ", "Người cao tuổi"],
  },
  {
    id: "tho-bung",
    name: "Thở bụng chánh niệm",
    time: "5–10 phút",
    level: "Ai cũng làm được",
    desc: "Kỹ thuật thở 4-7-8 hoặc thở bụng sâu – hạ nhịp tim, giảm cortisol, cải thiện ngủ.",
    steps: [
      "Ngồi/nằm thoải mái, lưỡi chạm hàm trên",
      "Thở ra hết bằng miệng (âm 'phù')",
      "Hít bằng mũi 4 giây – phồng bụng",
      "Nín thở 7 giây",
      "Thở ra bằng miệng 8 giây – hóp bụng",
      "Lặp 4 chu kỳ × 2 lần/ngày",
    ],
    goodFor: ["Stress", "Mất ngủ", "Khí uất", "Tăng huyết áp"],
  },
];

const NEWS_ARTICLES = [
  {
    id: "vnexpress-yhct-hien-dai",
    title: "Lợi thế khi kết hợp y học cổ truyền và hiện đại",
    source: "VnExpress · Sức khỏe",
    date: "2024",
    summary: "Nhiều bệnh nhân đột quỵ phục hồi chỉ số vận động khi được kết hợp châm cứu cải tiến với tập vật lý trị liệu và dùng thuốc đông y.",
    url: "https://vnexpress.net/loi-the-khi-ket-hop-y-hoc-co-truyen-va-hien-dai-4854188.html",
    tag: "YHCT & Hiện đại",
  },
  {
    id: "vnexpress-ong-to-duong-sinh",
    title: "Ông tổ dưỡng sinh học Đào Công Chính",
    source: "VnExpress",
    date: "2023",
    summary: "Đào Công Chính được suy tôn là ông tổ ngành dưỡng sinh, ngang hàng Hải Thượng Lãn Ông Lê Hữu Trác và Thiền sư Tuệ Tĩnh.",
    url: "https://vnexpress.net/ong-to-duong-sinh-hoc-dao-cong-chinh-4710353.html",
    tag: "Lịch sử YHCT",
  },
  {
    id: "vnexpress-10-phut-duong-sinh",
    title: "10 phút dưỡng sinh mỗi sáng giúp sống khỏe, trẻ lâu",
    source: "VnExpress · Ngôi sao",
    date: "2025",
    summary: "Trong 10 phút đầu tiên sau khi thức dậy, khởi động nhẹ nhàng giúp điều hòa khí huyết, nâng cao sức khỏe, làm chậm lão hóa.",
    url: "https://ngoisao.vnexpress.net/10-phut-duong-sinh-moi-sang-giup-song-khoe-tre-lau-4892627.html",
    tag: "Bài tập buổi sáng",
  },
  {
    id: "tuoitre-duong-sinh-suc-khoe",
    title: "Dưỡng sinh cải thiện sức khỏe",
    source: "Tuổi Trẻ Online",
    date: "2024",
    summary: "Các bài tập dưỡng sinh giúp tăng cường tuần hoàn, cải thiện thăng bằng và phòng ngừa bệnh tật cho mọi lứa tuổi.",
    url: "https://tuoitre.vn/duong-sinh-cai-thien-suc-khoe-1054711.htm",
    tag: "Tổng quan",
  },
  {
    id: "tuoitre-luyen-tho",
    title: "Luyện thở cũng có thể dưỡng sinh thanh lọc cơ thể, đẩy lùi bệnh tật",
    source: "Tuổi Trẻ Online",
    date: "2024",
    summary: "Kỹ thuật thở sâu và chậm theo nguyên lý Đông y giúp điều hòa khí huyết, giảm căng thẳng và hỗ trợ miễn dịch.",
    url: "https://tuoitre.vn/luyen-tho-cung-co-the-duong-sinh-thanh-loc-co-the-day-lui-benh-tat-20240326223430235.htm",
    tag: "Thở & Thiền",
  },
  {
    id: "skds-bo-khi-ich-tho",
    title: "Bài thuốc bổ khí ích thọ, chống lão suy",
    source: "Sức khỏe & Đời sống",
    date: "2023",
    summary: "Bổ khí ích thọ là phương thuốc tăng cường thể chất, an ngũ tạng, kháng lão suy theo y học cổ truyền.",
    url: "https://suckhoedoisong.vn/bai-thuoc-bo-khi-ich-tho-chong-lao-suy-169230331012728201.htm",
    tag: "Dược liệu",
  },
  {
    id: "skds-bo-than-trang-duong",
    title: "Bài thuốc bổ thận tráng dương sinh ngũ tử",
    source: "Sức khỏe & Đời sống",
    date: "2021",
    summary: "Sinh ngũ tử là bài thuốc cổ được dùng để bổ thận, tráng dương, cải thiện sức khỏe sinh lý và tinh thần.",
    url: "https://suckhoedoisong.vn/bai-thuoc-bo-than-trang-duong-sinh-ngu-tu-169187684.htm",
    tag: "Dược liệu",
  },
  {
    id: "vietnamnet-an-uong-de-khang",
    title: "Bác sĩ y học cổ truyền chia sẻ bí quyết ăn uống tăng sức đề kháng mùa dịch",
    source: "VietNamNet · Infonet",
    date: "2021",
    summary: "Chế độ ăn theo Đông y giúp tăng cường chín khí, hỗ trợ đề kháng và phòng bệnh theo mùa.",
    url: "https://infonet.vietnamnet.vn/bac-si-y-hoc-co-truyen-chia-se-bi-quyet-an-uong-tang-suc-de-khang-mua-dich-290458.html",
    tag: "Dinh dưỡng",
  },
  {
    id: "vietnamnet-tho-dung-cach",
    title: "Thở đúng cách bí quyết dưỡng sinh tại nhà để sống thọ",
    source: "VietNamNet",
    date: "2024",
    summary: "Hướng dẫn thở đúng cách tại nhà – phương pháp dưỡng sinh đơn giản, không tốn kém và dễ duy trì lâu dài.",
    url: "https://vietnamnet.vn/tho-dung-cach-bi-quyet-duong-sinh-tai-nha-de-song-tho-2489071.html",
    tag: "Thở & Thiền",
  },
  {
    id: "vnexpress-du-lich-duong-sinh",
    title: "Du lịch dưỡng sinh nở rộ tại Trung Quốc",
    source: "VnExpress · Du lịch",
    date: "2025",
    summary: "Du lịch chăm sóc sức khỏe kết hợp thảo dược, khí công và dinh dưỡng đang trở thành xu hướng toàn cầu.",
    url: "https://vnexpress.net/du-lich-duong-sinh-no-ro-tai-trung-quoc-4887982.html",
    tag: "Xu hướng",
  },
];

/* ================= GATE ================= */

function Gate({ onChoose }: { onChoose: (r: Role) => void }) {
  const navigate = useNavigate();
  const [pending, setPending] = useState<Role | null>(null);
  const [agreed, setAgreed] = useState(false);

  const open = (r: Role) => {
    setPending(r);
    setAgreed(false);
  };

  const confirm = () => {
    if (!pending) return;
    onChoose(pending);
    setPending(null);
  };

  const close = () => {
    setPending(null);
    setAgreed(false);
  };

  return (
    <div className="min-h-[calc(100vh-100px)] bg-gradient-to-br from-sky-50 via-white to-emerald-50 px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <button
          onClick={() => navigate({ to: "/" })}
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-slate-600 transition hover:border-slate-400 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" /> trở về trang chủ
        </button>
        <div className="mb-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-sky-400/40 bg-sky-50 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-sky-700">
            <Users className="h-3 w-3" /> Cổng vào Dưỡng sinh cộng đồng
          </span>
          <h1 className="mt-5 font-display text-3xl font-black tracking-tight text-slate-900 md:text-5xl">
            Bạn đang truy cập với vai trò nào?
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            Không gian dưỡng sinh cộng đồng dành cho <strong>người dân, bệnh nhân</strong> – nội dung mang tính <strong>giáo dục sức khoẻ</strong>,
            KHÔNG thay thế khám chữa bệnh. Vui lòng xác nhận vai trò để hiển thị nội dung phù hợp.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {/* Bệnh nhân / cộng đồng */}
          <button
            onClick={() => open("patient")}
            className="group relative overflow-hidden rounded-3xl border-2 border-sky-200 bg-white p-8 text-left shadow-lg transition hover:-translate-y-1 hover:border-sky-400 hover:shadow-2xl"
          >
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-sky-100 blur-3xl transition group-hover:bg-sky-200" />
            <div className="relative">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
                <Users className="h-7 w-7" />
              </div>
              <h2 className="mt-5 font-display text-2xl font-bold text-slate-900">Tôi là bệnh nhân / người dân</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Xem nội dung giáo dục sức khoẻ: ăn uống theo thể bệnh, bài tập dưỡng sinh, xoa bóp huyệt an toàn,
                có AI trả lời câu hỏi thường gặp.
              </p>
              <div className="mt-5 flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-sky-600">
                Vào ngay <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </div>
            </div>
          </button>

          {/* Nhân viên y tế */}
          <button
            onClick={() => open("clinician")}
            className="group relative overflow-hidden rounded-3xl border-2 border-sky-200 bg-white p-8 text-left shadow-lg transition hover:-translate-y-1 hover:border-sky-400 hover:shadow-2xl"
          >
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-sky-100 blur-3xl transition group-hover:bg-sky-200" />
            <div className="relative">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                <Stethoscope className="h-7 w-7" />
              </div>
              <h2 className="mt-5 font-display text-2xl font-bold text-slate-900">Tôi là nhân viên y tế</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Duyệt tài liệu truyền thông chuẩn hoá để tư vấn cho bệnh nhân của bạn. AI trả lời với ngôn ngữ chuyên môn hơn.
                Cần kê đơn / biện chứng → vào tab <strong>Khám &amp; kê đơn</strong>.
              </p>
              <div className="mt-5 flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-sky-700">
                Vào với vai trò y tế <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </div>
            </div>
          </button>
        </div>

      </div>

      {/* MODAL xác nhận vai trò */}
      {pending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={close} />
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border bg-white shadow-2xl">
            <div className={`px-6 py-5 ${pending === "patient" ? "bg-sky-500" : "bg-sky-500"}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 text-white">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                    {pending === "patient" ? <Users className="h-5 w-5" /> : <Stethoscope className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest opacity-80">Xác nhận vai trò</p>
                    <h3 className="font-display text-xl font-bold">
                      {pending === "patient" ? "Bệnh nhân / Người dân" : "Nhân viên y tế"}
                    </h3>
                  </div>
                </div>
                <button onClick={close} className="rounded-full p-1 text-white/80 hover:bg-white/20 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="px-6 py-6">
              {pending === "patient" ? (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4">
                    <div className="flex items-start gap-3">
                      <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-sky-600" />
                      <div>
                        <p className="font-semibold text-sky-900">Cảnh báo quan trọng</p>
                        <p className="mt-1 text-sm leading-relaxed text-sky-800">
                          Nội dung tại đây chỉ mang tính chất <strong>giáo dục sức khoẻ và tham khảo</strong>,
                          không phải chẩn đoán, không thay thế khám – chữa bệnh hoặc đơn thuốc từ bác sĩ.
                        </p>
                      </div>
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex gap-2"><span className="text-emerald-500">✓</span> Tôi hiểu AI chỉ hỗ trợ thông tin chung, không kê đơn.</li>
                    <li className="flex gap-2"><span className="text-emerald-500">✓</span> Tôi sẽ tham khảo ý kiến bác sĩ / chuyên gia y tế trước khi áp dụng.</li>
                    <li className="flex gap-2"><span className="text-emerald-500">✓</span> Nếu có triệu chứng nặng, tôi sẽ đến cơ sở y tế ngay.</li>
                  </ul>
                  <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 p-3 transition hover:border-sky-300">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="mt-0.5 h-5 w-5 shrink-0 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                    />
                    <span className="text-sm leading-snug text-slate-700">
                      Tôi đã đọc, hiểu và <strong>đồng ý</strong> rằng thông tin này mang tính tham khảo, không thay thế khám chữa bệnh.
                    </span>
                  </label>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4">
                    <div className="flex items-start gap-3">
                      <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-sky-600" />
                      <div>
                        <p className="font-semibold text-sky-900">Xác nhận chuyên môn</p>
                        <p className="mt-1 text-sm leading-relaxed text-sky-800">
                          Khu vực này hiển thị tài liệu truyền thông chuẩn hoá dành cho <strong>nhân viên y tế</strong>.
                          Vui lòng chỉ sử dụng để tư vấn, giáo dục bệnh nhân và không tự ý kê đơn ngoài phạm vi cho phép.
                        </p>
                      </div>
                    </div>
                  </div>
                  <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 p-3 transition hover:border-sky-300">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="mt-0.5 h-5 w-5 shrink-0 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                    />
                    <span className="text-sm leading-snug text-slate-700">
                      Tôi xác nhận là <strong>nhân viên y tế / người có chuyên môn</strong> và sẽ sử dụng nội dung đúng mục đích.
                    </span>
                  </label>
                </div>
              )}

              <div className="mt-6 flex gap-3">
                <button
                  onClick={close}
                  className="flex-1 rounded-2xl border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Huỷ
                </button>
                <button
                  onClick={confirm}
                  disabled={!agreed}
                  className={`flex-1 rounded-2xl px-4 py-3 font-semibold text-white shadow-lg transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 ${
                    pending === "patient"
                      ? "bg-gradient-to-r from-sky-500 to-emerald-500 shadow-sky-500/25"
                      : "bg-gradient-to-r from-sky-500 to-orange-500 shadow-sky-500/25"
                  }`}
                >
                  {pending === "patient" ? "Tôi đồng ý, vào ngay" : "Xác nhận vai trò y tế"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= MAIN PAGE ================= */

function DuongSinhPage() {
  // Mỗi lần vào tab đều phải chọn vai trò & đồng ý lại — không lưu phiên trước
  const [role, setRole] = useState<Role | null>(null);

  const choose = (r: Role) => setRole(r);

  if (!role) return <Gate onChoose={choose} />;
  return <Content role={role} />;
}


/* ================= CONTENT ================= */

function Content({ role }: { role: Role }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"the-benh" | "topics" | "exercise" | "news">("the-benh");
  const [activeThe, setActiveThe] = useState<TheBenh | null>(null);
  const [q, setQ] = useState("");
  const [aiOpen, setAiOpen] = useState(false);
  const [aiContext, setAiContext] = useState<string>("");
  const [aiAnswer, setAiAnswer] = useState<string>("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const analyze = useServerFn(wellnessAnalyze);

  const askAI = async (question: string, context?: string) => {
    setAiOpen(true);
    setAiContext(context || "");
    setAiAnswer("");
    setAiError(null);
    setAiLoading(true);
    try {
      const res = await analyze({ data: { query: question, mode: role, context } });
      setAiAnswer(res.content);
    } catch (e) {
      setAiError((e as Error).message);
    } finally {
      setAiLoading(false);
    }
  };

  const filteredThe = useMemo(() => {
    if (!q.trim()) return THE_BENH;
    const s = q.toLowerCase();
    return THE_BENH.filter(
      (t) =>
        t.name.toLowerCase().includes(s) ||
        t.aka.toLowerCase().includes(s) ||
        t.short.toLowerCase().includes(s) ||
        t.signs.some((x) => x.toLowerCase().includes(s)) ||
        t.eatYes.some((x) => x.toLowerCase().includes(s)) ||
        t.eatNo.some((x) => x.toLowerCase().includes(s)),
    );
  }, [q]);

  return (
    <div className="min-h-screen bg-white">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-emerald-50/60 to-sky-50/50">
        <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(#38bdf822_1px,transparent_1px)] [background-size:22px_22px]" />
        <div className="container relative mx-auto px-6 py-10 md:py-14">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-50 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-emerald-700">
                <Leaf className="h-3 w-3" /> dưỡng sinh cộng đồng
              </span>
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-widest ${
                role === "patient"
                  ? "border-sky-400/40 bg-sky-50 text-sky-700"
                  : "border-sky-400/40 bg-sky-50 text-sky-700"
              }`}>
                {role === "patient" ? <><Users className="h-3 w-3" /> bệnh nhân · cộng đồng</> : <><Stethoscope className="h-3 w-3" /> nhân viên y tế</>}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate({ to: "/" })}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-slate-600 transition hover:border-slate-400 hover:text-slate-900"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> trở về
              </button>
            </div>
          </div>

          <h1 className="mt-6 font-display text-3xl font-black leading-[1.1] tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
            Ăn đúng thể bệnh. <span className="text-emerald-600">Tập đúng cơ thể.</span><br />
            Sống thuận theo Đông y.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600 md:text-lg">
            Nội dung được biên soạn theo Y học cổ truyền, chuẩn hoá từ giáo trình Trường ĐH Y Dược & Bộ Y tế.
            Bạn có thể tìm kiếm chủ đề, chọn thể bệnh, xem bài tập, và <strong>hỏi AI</strong> để nhận lời khuyên phù hợp.
          </p>

          {/* Search bar */}
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && q.trim()) askAI(q.trim());
                }}
                placeholder="Tìm: mất ngủ, hay lạnh tay chân, mụn trứng cá, huyết áp cao…"
                className="w-full rounded-2xl border border-slate-200 bg-white px-12 py-4 text-slate-900 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              />
            </div>
            <button
              onClick={() => q.trim() && askAI(q.trim())}
              disabled={!q.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-sky-500 px-6 py-4 font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:brightness-110 disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4" /> Đang research
            </button>
          </div>

          {/* Quick chips */}
          <div className="mt-4 flex flex-wrap gap-2">
            {["Tôi hay mất ngủ", "Tay chân lạnh về đêm", "Ăn gì cho da đỡ mụn", "Bài tập cho người cao huyết áp", "Món ăn cho người tiểu đường"].map((s) => (
              <button
                key={s}
                onClick={() => { setQ(s); askAI(s); }}
                className="rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-xs text-slate-700 backdrop-blur transition hover:border-emerald-400 hover:text-emerald-700"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* TABS */}
      <section className="border-y border-slate-200 bg-white/80 backdrop-blur sticky top-[92px] md:top-[84px] z-30">
        <div className="container mx-auto flex gap-1 overflow-x-auto px-6 py-2 font-mono text-[11px] font-semibold uppercase tracking-wider">
          {([
            ["the-benh", "8 Thể bệnh YHCT"],
            ["topics", "Theo bệnh thường gặp"],
            ["exercise", "Bài tập dưỡng sinh"],
            ["news", "Tin tức YHCT"],
          ] as const).map(([k, label]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`whitespace-nowrap rounded-full px-4 py-2 transition ${
                tab === k
                  ? "bg-emerald-500 text-white shadow"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* BODY */}
      <section className="container mx-auto px-6 py-10">
        {tab === "the-benh" && (
          <>
            <div className="mb-6 flex items-end justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold text-slate-900 md:text-3xl">8 Thể bệnh YHCT thường gặp</h2>
                <p className="text-sm text-slate-600">Chọn thể bệnh gần với biểu hiện của bạn để xem nên ăn gì, kiêng gì, tập gì.</p>
              </div>
              <span className="hidden font-mono text-xs uppercase tracking-widest text-slate-400 md:inline">{filteredThe.length}/{THE_BENH.length} thể</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredThe.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveThe(t)}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                  style={{ borderTopWidth: 4, borderTopColor: t.color }}
                >
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-display text-lg font-bold text-slate-900">{t.name}</h3>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400">{t.aka}</span>
                  </div>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">{t.short}</p>
                  <div className="mt-3 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-emerald-600">
                    Xem chi tiết <ChevronRight className="h-3 w-3 transition group-hover:translate-x-1" />
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {tab === "topics" && (
          <>
            <div className="mb-6">
              <h2 className="font-display text-2xl font-bold text-slate-900 md:text-3xl">Theo bệnh lý thường gặp</h2>
              <p className="text-sm text-slate-600">Bấm vào chủ đề để hỏi AI tư vấn dưỡng sinh phù hợp.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {TOPICS.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => askAI(`Người bị ${t.name.toLowerCase()} nên ăn gì, kiêng gì, tập bài gì theo Đông y? Cho ví dụ món ăn Việt cụ thể.`, t.name)}
                    className="group flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-emerald-400 hover:shadow-xl"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition group-hover:bg-emerald-100">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{t.name}</h3>
                      <p className="mt-1 text-xs text-slate-500">Tư vấn AI cá nhân hoá</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {tab === "exercise" && (
          <>
            <div className="mb-6">
              <h2 className="font-display text-2xl font-bold text-slate-900 md:text-3xl">Bài tập dưỡng sinh</h2>
              <p className="text-sm text-slate-600">Các bài tập cổ truyền &amp; kỹ thuật thở đã được nghiên cứu, an toàn cho cộng đồng.</p>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {EXERCISES.map((ex) => (
                <div key={ex.id} className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-emerald-50/40 p-6 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display text-xl font-bold text-slate-900">{ex.name}</h3>
                      <div className="mt-1 flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-widest">
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-700">{ex.time}</span>
                        <span className="rounded-full bg-sky-100 px-2 py-0.5 text-sky-700">{ex.level}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => askAI(`Hướng dẫn chi tiết bài ${ex.name} cho người mới, mỗi thức làm bao nhiêu lần, thời gian nào tập tốt nhất. Có video/tài liệu tham khảo nào?`, ex.name)}
                      className="shrink-0 rounded-full border border-emerald-400 bg-emerald-50 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-emerald-700 transition hover:bg-emerald-100"
                    >
                      hỏi AI
                    </button>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-slate-700">{ex.desc}</p>
                  <div className="mt-4">
                    <div className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-slate-500">Nội dung bài tập</div>
                    <ol className="space-y-1 text-sm text-slate-700">
                      {ex.steps.map((s, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="w-6 shrink-0 font-mono text-xs text-emerald-600">{String(i + 1).padStart(2, "0")}</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {ex.goodFor.map((g) => (
                      <span key={g} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">Tốt cho: {g}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "news" && (
          <>
            <div className="mb-6">
              <h2 className="font-display text-2xl font-bold text-slate-900 md:text-3xl">Tin tức & kiến thức YHCT</h2>
              <p className="text-sm text-slate-600">Tuyển chọn bài viết từ báo chí uy tín, có đường link gốc để bạn đọc thêm.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {NEWS_ARTICLES.map((a) => (
                <a
                  key={a.id}
                  href={a.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-emerald-400 hover:shadow-xl"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-emerald-700">
                      {a.tag}
                    </span>
                    <span className="shrink-0 rounded-full border border-slate-200 bg-white p-1.5 text-slate-400 transition group-hover:border-emerald-400 group-hover:text-emerald-600">
                      <ExternalLink className="h-3.5 w-3.5" />
                    </span>
                  </div>
                  <h3 className="mt-3 font-display text-lg font-bold leading-snug text-slate-900 group-hover:text-emerald-700">
                    {a.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">{a.summary}</p>
                  <div className="mt-auto flex items-center gap-2 pt-4 text-xs text-slate-500">
                    <Newspaper className="h-3.5 w-3.5" />
                    <span className="font-medium">{a.source}</span>
                    <span>·</span>
                    <span>{a.date}</span>
                  </div>
                </a>
              ))}
            </div>
          </>
        )}

        <p className="mt-10 rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-800">
          <strong>Lưu ý an toàn:</strong> Nội dung mang tính giáo dục sức khoẻ. Không tự ý ngưng thuốc đang dùng.
          Khi có triệu chứng nặng, mới, hoặc kéo dài – vui lòng đến cơ sở y tế để được thăm khám.
        </p>
      </section>

      {/* THE BENH DETAIL DRAWER */}
      {activeThe && (
        <div className="fixed inset-0 z-50 flex" onClick={() => setActiveThe(null)}>
          <div className="flex-1 bg-slate-900/60 backdrop-blur-sm" />
          <div
            className="w-full max-w-2xl overflow-y-auto bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="sticky top-0 z-10 flex items-center justify-between border-b bg-white/95 px-6 py-4 backdrop-blur"
              style={{ borderBottomColor: activeThe.color }}
            >
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Thể bệnh YHCT</div>
                <h3 className="font-display text-2xl font-black" style={{ color: activeThe.color }}>{activeThe.name}</h3>
              </div>
              <button onClick={() => setActiveThe(null)} className="rounded-full p-2 text-slate-500 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6 p-6">
              <p className="rounded-xl bg-slate-50 p-4 text-slate-700">{activeThe.short}</p>

              <Block title="Dấu hiệu nhận biết" color={activeThe.color}>
                <ul className="grid gap-1 sm:grid-cols-2">
                  {activeThe.signs.map((s) => (
                    <li key={s} className="flex gap-2 text-sm text-slate-700"><span>·</span>{s}</li>
                  ))}
                </ul>
              </Block>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4">
                  <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-emerald-700">Nên ăn</div>
                  <ul className="space-y-1 text-sm text-slate-800">
                    {activeThe.eatYes.map((s) => <li key={s}>✓ {s}</li>)}
                  </ul>
                </div>
                <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-4">
                  <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-rose-700">Nên tránh</div>
                  <ul className="space-y-1 text-sm text-slate-800">
                    {activeThe.eatNo.map((s) => <li key={s}>✗ {s}</li>)}
                  </ul>
                </div>
              </div>

              <Block title="Gợi ý thực đơn Việt" color={activeThe.color}>
                <ul className="space-y-1.5 text-sm text-slate-700">
                  {activeThe.meals.map((m) => <li key={m}>🍚 {m}</li>)}
                </ul>
              </Block>

              <Block title="Bài tập & sinh hoạt" color={activeThe.color}>
                <ul className="space-y-1.5 text-sm text-slate-700">
                  {activeThe.exercise.map((m) => <li key={m}>🧘 {m}</li>)}
                </ul>
              </Block>

              <Block title="Xoa bóp – bấm huyệt an toàn" color={activeThe.color}>
                <ul className="space-y-1.5 text-sm text-slate-700">
                  {activeThe.acu.map((m) => <li key={m}>👐 {m}</li>)}
                </ul>
              </Block>

              <div className="rounded-2xl border-l-4 border-sky-500 bg-sky-50 p-4">
                <div className="mb-1 flex items-center gap-2 font-semibold text-sky-800"><ShieldAlert className="h-4 w-4" /> Khi nào cần đi khám ngay</div>
                <ul className="space-y-1 text-sm text-sky-900">
                  {activeThe.warn.map((w) => <li key={w}>· {w}</li>)}
                </ul>
              </div>

              <button
                onClick={() => askAI(`Tôi thuộc thể ${activeThe.name} theo Đông y. Hãy tư vấn cụ thể một tuần thực đơn 7 ngày (sáng-trưa-tối) và lịch tập dưỡng sinh phù hợp với người Việt đi làm 8 tiếng.`, activeThe.name)}
                className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-sky-500 py-3 font-semibold text-white shadow-lg transition hover:brightness-110"
              >
                <Sparkles className="mr-2 inline h-4 w-4" /> Hỏi AI: Thực đơn 7 ngày cho thể {activeThe.name}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI PANEL */}
      {aiOpen && (
        <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-4">
          <div className="w-full max-w-3xl rounded-3xl border border-slate-200 bg-white/95 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-sky-500 text-white">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">TRAMED Dưỡng sinh · AI</div>
                  {aiContext && <div className="font-mono text-[10px] uppercase tracking-widest text-slate-400">ngữ cảnh: {aiContext}</div>}
                </div>
              </div>
              <button onClick={() => setAiOpen(false)} className="rounded-full p-2 text-slate-500 hover:bg-slate-100">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto px-5 py-4">
              {aiLoading && (
                <div className="flex items-center gap-2 text-slate-500">
                  <Loader2 className="h-4 w-4 animate-spin" /> AI đang phân tích chuẩn hoá theo Y học cổ truyền…
                </div>
              )}
              {aiError && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
                  Có lỗi: {aiError}
                </div>
              )}
              {aiAnswer && <SimpleMarkdown text={aiAnswer} />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Block({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full" style={{ background: color }} />
        <h4 className="font-display text-sm font-bold uppercase tracking-wider text-slate-900">{title}</h4>
      </div>
      {children}
    </div>
  );
}

/* Minimal markdown renderer for AI output */
function SimpleMarkdown({ text }: { text: string }) {
  const lines = text.split("\n");
  const out: React.ReactElement[] = [];
  let listBuf: string[] = [];
  const flush = () => {
    if (listBuf.length) {
      out.push(
        <ul key={out.length} className="my-2 ml-5 list-disc space-y-1 text-sm text-slate-700">
          {listBuf.map((l, i) => <li key={i}>{renderInline(l)}</li>)}
        </ul>,
      );
      listBuf = [];
    }
  };
  lines.forEach((raw, i) => {
    const line = raw.trimEnd();
    if (/^#{1,3}\s/.test(line)) {
      flush();
      const level = line.match(/^#+/)![0].length;
      const content = line.replace(/^#+\s*/, "");
      const cls = level === 1 ? "text-lg font-black" : level === 2 ? "text-base font-bold" : "text-sm font-bold";
      out.push(<div key={i} className={`mt-3 mb-1 text-slate-900 ${cls}`}>{renderInline(content)}</div>);
    } else if (/^[-*]\s/.test(line)) {
      listBuf.push(line.replace(/^[-*]\s+/, ""));
    } else if (line.trim() === "") {
      flush();
    } else {
      flush();
      out.push(<p key={i} className="my-1.5 text-sm leading-relaxed text-slate-700">{renderInline(line)}</p>);
    }
  });
  flush();
  return <div>{out}</div>;
}

function renderInline(s: string): React.ReactNode {
  const parts = s.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    /^\*\*[^*]+\*\*$/.test(p) ? <strong key={i} className="text-slate-900">{p.slice(2, -2)}</strong> : <span key={i}>{p}</span>,
  );
}
