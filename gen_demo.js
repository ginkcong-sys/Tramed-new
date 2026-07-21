const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, AlignmentType, WidthType, BorderStyle, ShadingType, LevelFormat, PageNumber, Header, Footer } = require('docx');
const fs = require('fs');

const ACCENT = "0E7490";
const DARK = "0F172A";
const MUTED = "64748B";
const BG = "F0FDFA";

const border = { style: BorderStyle.SINGLE, size: 4, color: "CBD5E1" };
const cellBorders = { top: border, bottom: border, left: border, right: border };

const P = (text, opts = {}) => new Paragraph({
  spacing: { after: 120, line: 320 },
  alignment: opts.align || AlignmentType.JUSTIFIED,
  children: [new TextRun({ text, bold: opts.bold, italics: opts.italic, size: opts.size || 24, color: opts.color, font: "Calibri" })],
  ...(opts.p || {}),
});

const H = (text, level = HeadingLevel.HEADING_2) => new Paragraph({
  heading: level,
  spacing: { before: 300, after: 160 },
  children: [new TextRun({ text, bold: true, color: ACCENT, size: level === HeadingLevel.HEADING_1 ? 40 : 30, font: "Calibri" })],
});

const bullet = (text, bold=false) => new Paragraph({
  numbering: { reference: "bullets", level: 0 },
  spacing: { after: 80 },
  children: [new TextRun({ text, size: 22, font: "Calibri", bold })],
});

const cell = (text, opts = {}) => new TableCell({
  borders: cellBorders,
  width: { size: opts.w, type: WidthType.DXA },
  shading: opts.shade ? { fill: opts.shade, type: ShadingType.CLEAR } : undefined,
  margins: { top: 100, bottom: 100, left: 140, right: 140 },
  children: (Array.isArray(text) ? text : [text]).map(t =>
    typeof t === "string"
      ? new Paragraph({ children: [new TextRun({ text: t, bold: opts.bold, color: opts.color, size: opts.size || 22, font: "Calibri" })] })
      : t
  ),
});

const scriptRow = (time, scene, voiceover, onScreen) => new TableRow({
  children: [
    cell(time, { w: 1200, bold: true, color: ACCENT }),
    cell(scene, { w: 2600, bold: true }),
    cell(voiceover, { w: 3400 }),
    cell(onScreen, { w: 2160, color: MUTED, size: 20 }),
  ],
});

const scriptTable = (rows) => new Table({
  width: { size: 9360, type: WidthType.DXA },
  columnWidths: [1200, 2600, 3400, 2160],
  rows: [
    new TableRow({
      tableHeader: true,
      children: [
        cell("Thời lượng", { w: 1200, bold: true, shade: ACCENT, color: "FFFFFF" }),
        cell("Cảnh quay", { w: 2600, bold: true, shade: ACCENT, color: "FFFFFF" }),
        cell("Lời thoại (Voice-over)", { w: 3400, bold: true, shade: ACCENT, color: "FFFFFF" }),
        cell("Hiển thị trên màn hình", { w: 2160, bold: true, shade: ACCENT, color: "FFFFFF" }),
      ],
    }),
    ...rows,
  ],
});

const doc = new Document({
  creator: "Pulse & Pixel",
  title: "Kịch bản Video Demo 3 phút - TradMed.AI",
  styles: {
    default: { document: { run: { font: "Calibri", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 40, bold: true, color: ACCENT, font: "Calibri" },
        paragraph: { spacing: { before: 320, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 30, bold: true, color: ACCENT, font: "Calibri" },
        paragraph: { spacing: { before: 280, after: 140 }, outlineLevel: 1 } },
    ]
  },
  numbering: {
    config: [{
      reference: "bullets",
      levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 480, hanging: 260 } } } }]
    }]
  },
  sections: [{
    properties: {
      page: { size: { width: 12240, height: 15840 }, margin: { top: 1200, right: 1200, bottom: 1200, left: 1200 } },
    },
    headers: {
      default: new Header({ children: [new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [new TextRun({ text: "TradMed.AI · Vietnamese Student HackAIthon 2026 · Đội Pulse & Pixel", size: 18, color: MUTED, font: "Calibri", italics: true })]
      })]})
    },
    footers: {
      default: new Footer({ children: [new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "Trang ", size: 18, color: MUTED, font: "Calibri" }), new TextRun({ children: [PageNumber.CURRENT], size: 18, color: MUTED, font: "Calibri" })]
      })]})
    },
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 80 },
        children: [new TextRun({ text: "KỊCH BẢN VIDEO DEMO 3 PHÚT", bold: true, size: 44, color: DARK, font: "Calibri" })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [new TextRun({ text: "TradMed.AI — Trợ lý Y học Cổ truyền ứng dụng AI Deep-Tech", size: 26, color: ACCENT, font: "Calibri", italics: true })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 240 },
        children: [new TextRun({ text: "Vòng Chung kết · Vietnamese Student HackAIthon 2026 · Đội Pulse & Pixel", size: 20, color: MUTED, font: "Calibri" })],
      }),

      // Info block
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2400, 6960],
        rows: [
          new TableRow({ children: [
            cell("Tổng thời lượng", { w: 2400, bold: true, shade: BG }),
            cell("03 phút 00 giây (180 giây)", { w: 6960 }),
          ]}),
          new TableRow({ children: [
            cell("Định dạng", { w: 2400, bold: true, shade: BG }),
            cell("MP4 · 1920×1080 · 30fps · H.264 · Âm thanh AAC 48kHz", { w: 6960 }),
          ]}),
          new TableRow({ children: [
            cell("Ngôn ngữ", { w: 2400, bold: true, shade: BG }),
            cell("Tiếng Việt (voice-over) · Phụ đề tiếng Việt & tiếng Anh", { w: 6960 }),
          ]}),
          new TableRow({ children: [
            cell("Mục tiêu", { w: 2400, bold: true, shade: BG }),
            cell("Trong 180 giây, thuyết phục BGK rằng TradMed.AI là giải pháp AI đầu tiên số hoá & biện chứng YHCT một cách khoa học, khả thi, có sản phẩm chạy thật.", { w: 6960 }),
          ]}),
          new TableRow({ children: [
            cell("Người dẫn", { w: 2400, bold: true, shade: BG }),
            cell("Giọng nữ trẻ, ấm, tốc độ 155–165 từ/phút — chuyên nghiệp nhưng gần gũi", { w: 6960 }),
          ]}),
          new TableRow({ children: [
            cell("Nhạc nền", { w: 2400, bold: true, shade: BG }),
            cell("Cinematic Tech nhẹ (BPM 90–100), fade-in 0–5s, giữ mức -22 LUFS dưới voice", { w: 6960 }),
          ]}),
        ]
      }),

      H("I. Ý tưởng tổng thể", HeadingLevel.HEADING_1),
      P("Video được xây dựng theo cấu trúc \"Vấn đề → Giải pháp → Chứng minh sản phẩm → Điểm khác biệt → Kêu gọi hành động\". Toàn bộ 3 phút chia thành 6 phân đoạn, mỗi phân đoạn phục vụ một tính năng đặc biệt của web trameddeeptech.cloud — không dàn trải, không kể lể, chỉ trình diễn."),
      P("Phong cách hình ảnh: nền tối navy #0F172A, điểm nhấn xanh ngọc #0E7490 và vàng đồng #D4A574 — gợi cảm giác vừa \"phòng khám hiện đại\" vừa \"thảo mộc phương Đông\". Chuyển cảnh mượt (cross-fade 400ms), zoom in-out nhẹ để dẫn mắt vào chi tiết UI. Mỗi tính năng có một chip nhãn ở góc phải: \"01 · Vọng chẩn AI\", \"02 · Kê đơn Quân–Thần–Tá–Sứ\"…"),

      H("II. Kịch bản chi tiết theo timeline", HeadingLevel.HEADING_1),

      H("Đoạn 1 · 0:00 – 0:20 · Mở đầu & Vấn đề"),
      scriptTable([
        scriptRow("0:00–0:05",
          "Cận cảnh: bàn tay thầy thuốc bắt mạch, cắt sang bệnh án giấy chi chít ghi chú Hán–Việt.",
          "\"Mỗi năm, hơn 30% người Việt tìm đến Y học cổ truyền. Nhưng tri thức ấy vẫn nằm trong hàng nghìn trang sách cổ — khó tra, khó truyền, khó số hoá.\"",
          "Text mờ: \"30% người Việt · YHCT\""),
        scriptRow("0:05–0:12",
          "Chồng ảnh: sinh viên Y lật giáo trình khuya, bác sĩ trẻ bối rối trước ca bệnh.",
          "\"Sinh viên mất 6 năm để nhớ 500 vị thuốc. Bác sĩ trẻ ra trường vẫn ngại kê đơn — vì sợ sai biện chứng.\"",
          "Text: \"500 vị · 12 kinh · 8 cương\""),
        scriptRow("0:12–0:20",
          "Fade to black. Logo TradMed.AI hiện lên với hiệu ứng \"lá cây phát sáng\".",
          "\"Chúng tôi xây TradMed.AI — trợ lý AI biện chứng luận trị đầu tiên cho Y học cổ truyền Việt Nam.\"",
          "Logo + tagline: \"Số hoá tinh hoa · Biện chứng bằng AI\""),
      ]),

      H("Đoạn 2 · 0:20 – 0:50 · Tính năng #1: Vọng chẩn AI qua ảnh lưỡi"),
      P("Đây là tính năng \"wow\" nhất — quay đầu tiên để giữ BGK không bỏ qua giây nào.", { italic: true, color: MUTED }),
      scriptTable([
        scriptRow("0:20–0:28",
          "Screen-record: mở trang /vong-chan trên web. Kéo-thả ảnh lưỡi bệnh nhân vào ô upload.",
          "\"Trong Tứ chẩn, Vọng chẩn là bước đầu tiên. TradMed.AI cho phép bác sĩ tải một tấm ảnh lưỡi — và AI trả về phân tích chuyên sâu trong vài giây.\"",
          "Chip: \"01 · Vọng chẩn AI\""),
        scriptRow("0:28–0:40",
          "Zoom vào các bước loading: \"Đang phân tích chất lưỡi… rêu lưỡi… định khu tạng phủ…\". Kết quả hiện dạng markdown có tiêu đề xanh.",
          "\"Hệ thống phân tích đồng thời chất lưỡi, rêu lưỡi, định khu tạng phủ theo bản đồ lưỡi YHCT, rồi tổng hợp thể bệnh và pháp điều trị — có trích dẫn nguồn giáo trình.\"",
          "Highlight khối kết quả: \"Thiệt chất · Thiệt đài · Tạng phủ · Pháp trị\""),
        scriptRow("0:40–0:50",
          "Bấm nút \"In báo cáo\" → cửa sổ preview A4 mở ra với logo, ảnh lưỡi, chữ ký thầy thuốc.",
          "\"Chỉ một cú nhấp, bệnh án in ra chuẩn A4 — có logo phòng khám, chữ ký thầy thuốc, sẵn sàng lưu hồ sơ.\"",
          "Cận cảnh báo cáo in ra"),
      ]),

      H("Đoạn 3 · 0:50 – 1:20 · Tính năng #2: Biện chứng & Kê đơn Quân–Thần–Tá–Sứ"),
      scriptTable([
        scriptRow("0:50–1:00",
          "Chuyển sang /kham-benh. Bác sĩ gõ triệu chứng: \"Nữ 45t, mệt mỏi, ăn kém, đại tiện lỏng, lưỡi nhợt rêu trắng, mạch trầm nhược\".",
          "\"Bác sĩ nhập triệu chứng bằng ngôn ngữ tự nhiên. AI biện chứng theo Bát cương — Tạng phủ — Khí huyết, đưa ra chẩn đoán YHCT có dẫn chứng.\"",
          "Chip: \"02 · Biện chứng AI\""),
        scriptRow("1:00–1:10",
          "Kết quả hiện: \"Tỳ Vị hư hàn · Pháp: Ôn trung kiện tỳ\". Bấm sang tab /ke-don.",
          "\"Từ pháp điều trị, hệ thống gợi ý bài thuốc cổ phương phù hợp — ví dụ Lý Trung Thang — kèm liều lượng chuẩn hoá theo cân nặng.\"",
          "Bảng thuốc hiện ra với 4 cột màu"),
        scriptRow("1:10–1:20",
          "Zoom vào bảng thuốc: 4 cột được tô 4 màu khác nhau — Quân (đỏ), Thần (cam), Tá (vàng), Sứ (xanh).",
          "\"Điểm đặc biệt: mỗi vị được phân vai Quân–Thần–Tá–Sứ đúng lý luận YHCT — điều mà chưa AI thương mại nào trên thế giới làm được cho tiếng Việt.\"",
          "Highlight: \"君 · 臣 · 佐 · 使\""),
      ]),

      H("Đoạn 4 · 1:20 – 1:50 · Tính năng #3: RAG trên 2.778 chunks giáo trình YHCT"),
      scriptTable([
        scriptRow("1:20–1:30",
          "Cắt sang màn hình chat. Bác sĩ hỏi: \"Bài Bát Trân Thang gồm những vị nào và chỉ định gì?\".",
          "\"Đằng sau mỗi câu trả lời là một cơ sở tri thức thật — chúng tôi đã số hoá 11 giáo trình chính thống của Y Hà Nội và Y Dược TP.HCM.\"",
          "Chip: \"03 · Cơ sở tri thức\""),
        scriptRow("1:30–1:42",
          "Split-screen: bên trái là câu trả lời AI, bên phải là bảng knowledge_chunks với 2.778 dòng dữ liệu thật, có trích nguồn \"Dược học cổ truyền — tr.234\".",
          "\"2.778 đoạn tri thức, lưu trong PostgreSQL + pgvector, truy vấn bằng cosine similarity. Mỗi câu trả lời đều có trích dẫn nguồn — chống ảo giác AI.\"",
          "Số đếm chạy: 0 → 2.778"),
        scriptRow("1:42–1:50",
          "Hover vào citation \"[Nguồn: Bệnh học Nội khoa YHCT]\" — tooltip hiện đoạn văn gốc.",
          "\"Bác sĩ có thể click vào từng trích dẫn để đọc nguyên văn giáo trình — minh bạch, có thể kiểm chứng.\"",
          "Tooltip nguồn gốc"),
      ]),

      H("Đoạn 5 · 1:50 – 2:20 · Tính năng #4: Dinh dưỡng theo thể bệnh + Mô phỏng châm cứu"),
      scriptTable([
        scriptRow("1:50–2:02",
          "Chuyển sang /dinh-duong. Chọn thể bệnh \"Tỳ Vị hư hàn\" — thực đơn 7 ngày hiện ra dưới dạng card.",
          "\"Không chỉ kê thuốc — TradMed.AI còn gợi ý thực đơn YHCT theo thể bệnh: nên ăn gì, kiêng gì, kèm gợi ý theo mùa.\"",
          "Chip: \"04 · Ẩm thực trị liệu\""),
        scriptRow("2:02–2:14",
          "Chuyển sang /mo-phong. Hiển thị hình người 3D với các huyệt vị phát sáng theo 12 kinh mạch.",
          "\"Với sinh viên và bác sĩ trẻ — module Mô phỏng châm cứu hiển thị 361 huyệt vị chuẩn theo WHO, tương tác 3D, tra cứu chỉ định trong tích tắc.\"",
          "Chip: \"05 · Mô phỏng châm cứu 3D\""),
        scriptRow("2:14–2:20",
          "Cắt nhanh 3 giây montage: các trang khác của web lướt qua như slideshow.",
          "\"Tất cả trong một nền tảng web — không cần cài đặt, hoạt động trên mọi thiết bị.\"",
          "Multi-device mockup: laptop · tablet · phone"),
      ]),

      H("Đoạn 6 · 2:20 – 3:00 · Điểm khác biệt, đội ngũ & Call-to-action"),
      scriptTable([
        scriptRow("2:20–2:32",
          "Infographic 4 ô so sánh: ChatGPT / Bard / DeepSeek / TradMed.AI trên 4 tiêu chí YHCT.",
          "\"So với các AI phổ thông — TradMed.AI vượt trội ở: biện chứng đúng lý luận, phân vai Quân–Thần–Tá–Sứ, trích nguồn giáo trình, và được cố vấn bởi bác sĩ YHCT thực thụ.\"",
          "Bảng so sánh 4×4, dấu ✓ xanh cho TradMed"),
        scriptRow("2:32–2:44",
          "Ảnh 4 thành viên đội Pulse & Pixel + 1 cố vấn YHCT, mỗi người kèm vai trò.",
          "\"Chúng tôi là Pulse & Pixel — 4 sinh viên Y & CNTT, đồng hành cùng bác sĩ YHCT. Đã có sản phẩm chạy thật tại trameddeeptech.cloud, đã pilot với sinh viên Y3–Y6.\"",
          "Card thành viên fade-in lần lượt"),
        scriptRow("2:44–2:55",
          "Zoom-out từ giao diện web, hiện dòng chữ lớn: \"Số hoá tinh hoa Y học cổ truyền Việt Nam\".",
          "\"TradMed.AI không thay thế thầy thuốc — chúng tôi đưa 4.000 năm tinh hoa YHCT vào tay mỗi bác sĩ trẻ, mỗi sinh viên Y Việt Nam.\"",
          "Slogan chính giữa"),
        scriptRow("2:55–3:00",
          "End card: logo + URL + QR code truy cập web.",
          "\"TradMed.AI — Trải nghiệm ngay tại trameddeeptech.cloud. Cảm ơn Ban Giám khảo.\"",
          "QR + URL + logo Pulse & Pixel"),
      ]),

      H("III. Danh sách các tính năng đặc biệt được trình diễn", HeadingLevel.HEADING_1),
      bullet("Vọng chẩn AI — phân tích ảnh lưỡi (chất lưỡi, rêu lưỡi, định khu tạng phủ) → xuất báo cáo A4 in được.", true),
      bullet("Biện chứng luận trị AI theo Bát cương – Tạng phủ – Khí huyết, dựa trên triệu chứng bác sĩ nhập.", true),
      bullet("Kê đơn Quân–Thần–Tá–Sứ — phân vai vị thuốc đúng lý luận YHCT, liều chuẩn hoá theo cân nặng.", true),
      bullet("RAG trên 2.778 chunks tri thức thật từ 11 giáo trình chính thống, chống ảo giác AI, có citation.", true),
      bullet("Ẩm thực trị liệu — thực đơn 7 ngày theo thể bệnh, kèm chỉ định nên/kiêng theo mùa.", true),
      bullet("Mô phỏng châm cứu 3D — 361 huyệt vị theo WHO, tra cứu chỉ định tương tác.", true),
      bullet("Báo cáo lâm sàng in A4 chuẩn — logo, chữ ký thầy thuốc, lưu hồ sơ cục bộ.", true),
      bullet("Responsive đa thiết bị — chạy trên web, không cần cài đặt.", true),

      H("IV. Hướng dẫn kỹ thuật quay & dựng", HeadingLevel.HEADING_1),
      H("A. Chuẩn bị trước khi quay"),
      bullet("Mở trước 6 tab: /vong-chan · /kham-benh · /ke-don · /dinh-duong · /mo-phong · /"),
      bullet("Đăng nhập sẵn tài khoản demo, xoá cache, ẩn thanh bookmark trình duyệt (Ctrl+Shift+B)."),
      bullet("Bật chế độ full-screen (F11) khi quay screen-record. Trỏ chuột dùng highlight cursor màu vàng."),
      bullet("Chuẩn bị sẵn 1 ảnh lưỡi mẫu (đã được đồng ý sử dụng) và 1 ca lâm sàng mẫu để nhập nhanh."),
      bullet("Kiểm tra LLM API nội bộ còn quota — chạy thử 3 lần từng tính năng để chắc không lỗi 429."),

      H("B. Thiết bị & phần mềm"),
      bullet("Screen-record: OBS Studio hoặc ScreenPal — 1920×1080 @ 30fps, bitrate 12 Mbps."),
      bullet("Micro: điều kiện tối thiểu là micro cài áo lavalier hoặc Rode NT-USB. Tránh mic laptop."),
      bullet("Dựng: CapCut Pro / DaVinci Resolve / Premiere Pro. Áp LUT \"Cinematic Teal-Orange\" nhẹ."),
      bullet("Voice-over: ghi trong phòng kín, xử lý noise-gate + de-esser + compressor tỉ số 3:1."),

      H("C. Nguyên tắc dựng"),
      bullet("Mỗi cảnh không quá 8 giây — nhịp nhanh giữ sự chú ý của BGK."),
      bullet("Luôn có \"chip nhãn\" góc phải màn hình để BGK biết đang xem tính năng số mấy."),
      bullet("Voice-over đi trước hình 200ms để tránh cảm giác \"đọc phụ đề\"."),
      bullet("Chèn phụ đề tiếng Việt lớn (font Inter Bold 42px, viền đen 3px) — quan trọng khi BGK xem không có loa."),
      bullet("Cuối video: fade-out nhạc trong 1 giây cuối, để câu \"Cảm ơn BGK\" nghe rõ."),

      H("V. Checklist trước khi nộp", HeadingLevel.HEADING_1),
      bullet("[ ] Thời lượng đúng 3:00 (±3 giây)."),
      bullet("[ ] Đã ẩn hoàn toàn mọi dấu hiệu công cụ dev (badge, watermark, extension trình duyệt)."),
      bullet("[ ] Đã che URL preview nội bộ — chỉ hiện trameddeeptech.cloud."),
      bullet("[ ] Đã kiểm tra không có API key, không có console error nào lộ trên video."),
      bullet("[ ] Phụ đề tiếng Việt đầy đủ, không sai chính tả thuật ngữ YHCT (Bát cương, Tứ chẩn, Quân–Thần–Tá–Sứ)."),
      bullet("[ ] Đã thêm intro logo (2s) và outro end-card (5s) trong tổng 180s."),
      bullet("[ ] Đã xuất bản MP4 dưới 200MB, kèm bản dự phòng 720p."),
      bullet("[ ] Đã upload lên YouTube (unlisted) làm bản dự phòng khi BGK không mở được file."),

      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 400 },
        children: [new TextRun({ text: "— Hết —", italics: true, color: MUTED, size: 22, font: "Calibri" })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 80 },
        children: [new TextRun({ text: "Đội Pulse & Pixel · TradMed.AI · Vietnamese Student HackAIthon 2026", size: 20, color: ACCENT, font: "Calibri", bold: true })],
      }),
    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  const out = "/mnt/documents/TradMed_KichBan_VideoDemo_3Phut_PulseAndPixel.docx";
  fs.writeFileSync(out, buf);
  console.log("OK", out, buf.length);
});
