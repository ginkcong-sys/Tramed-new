const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle, HeadingLevel } = require('docx');

const AUTHOR = "Tiết Thành Công";
const TEAM = "Pulse & Pixel";
const WORK = "TRAMED.AI – Hệ thống trợ lý Y học cổ truyền ứng dụng trí tuệ nhân tạo";
const OWNER = "Trường Đại học Nguyễn Tất Thành";
const OWNER_ADDR = "Số 300A Nguyễn Tất Thành, Phường 13, Quận 4, TP. Hồ Chí Minh";
const OWNER_PHONE = "(028) 3941 5399";
const OWNER_EMAIL = "info@ntt.edu.vn";
const OWNER_LICENSE = "Quyết định thành lập số 621/QĐ-TTg ngày 26/4/2011 của Thủ tướng Chính phủ";
const TODAY = "…../…../2026";
const DONE_DATE = "…../…../2026";

const noBorder = { top:{style:BorderStyle.NONE,size:0,color:"FFFFFF"}, bottom:{style:BorderStyle.NONE,size:0,color:"FFFFFF"}, left:{style:BorderStyle.NONE,size:0,color:"FFFFFF"}, right:{style:BorderStyle.NONE,size:0,color:"FFFFFF"} };

function P(text, opts={}) {
  return new Paragraph({
    alignment: opts.align || AlignmentType.LEFT,
    spacing: { after: 100 },
    children: [new TextRun({ text, bold: !!opts.bold, italics: !!opts.italics, size: opts.size || 24, font: "Times New Roman" })]
  });
}
function PR(runs, opts={}) {
  return new Paragraph({
    alignment: opts.align || AlignmentType.LEFT,
    spacing: { after: 100 },
    children: runs.map(r => new TextRun({ text: r.t, bold: !!r.b, italics: !!r.i, size: r.s || 24, font: "Times New Roman" }))
  });
}
function H(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 200 },
    children: [new TextRun({ text, bold: true, size: 32, font: "Times New Roman" })]
  });
}

// Common header block
function quocHieu() {
  return [
    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM", bold: true, size: 24, font: "Times New Roman" })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing:{after:200}, children: [new TextRun({ text: "Độc lập - Tự do - Hạnh phúc", bold: true, size: 24, font: "Times New Roman" })] }),
  ];
}

// Signature table (2 columns) - left blank, right label
function sigTable(rightTop, rightName) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [4680, 4680],
    rows: [
      new TableRow({ children: [
        new TableCell({ borders: noBorder, width:{size:4680,type:WidthType.DXA}, children:[P("")] }),
        new TableCell({ borders: noBorder, width:{size:4680,type:WidthType.DXA}, children:[
          new Paragraph({ alignment: AlignmentType.CENTER, children:[new TextRun({ text: rightTop, italics:true, size:24, font:"Times New Roman"})]}),
          new Paragraph({ alignment: AlignmentType.CENTER, spacing:{after:600}, children:[new TextRun({ text: "HIỆU TRƯỞNG", bold:true, size:24, font:"Times New Roman"})]}),
          new Paragraph({ alignment: AlignmentType.CENTER, children:[new TextRun({ text: rightName, bold:true, size:24, font:"Times New Roman"})]}),
        ]}),
      ]})
    ]
  });
}

// ============== FILE 1: TỜ KHAI ==============
const doc1 = new Document({
  styles: { default: { document: { run: { font: "Times New Roman", size: 24 } } } },
  sections: [{
    properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
    children: [
      ...quocHieu(),
      H("TỜ KHAI ĐĂNG KÝ QUYỀN TÁC GIẢ ĐỐI VỚI:"),
      H("TÁC PHẨM MỸ THUẬT ỨNG DỤNG"),
      P("Kính gửi: Cục Bản quyền tác giả, Bộ Văn hóa, Thể thao và Du lịch", { align: AlignmentType.CENTER, italics:true }),
      P(""),
      P("• Nộp Tờ khai đăng ký quyền tác giả cho: ☒ Chủ sở hữu quyền tác giả"),
      P(""),
      PR([{t:"1. Thông tin về tác phẩm mỹ thuật ứng dụng:", b:true}]),
      PR([{t:"Tên tác phẩm: ", b:true},{t: WORK}]),
      PR([{t:"Ngày, tháng, năm hoàn thành tác phẩm: ", b:true},{t: DONE_DATE}]),
      PR([{t:"Công bố tác phẩm: ", b:true},{t:"☒ Đã công bố    ☐ Chưa công bố"}]),
      P("- Ngày, tháng, năm công bố: …../…../2026"),
      P("- Hình thức công bố: Công bố trên môi trường mạng Internet dưới hình thức ứng dụng phần mềm (website)."),
      P("- Nơi công bố: TP. Hồ Chí Minh, Việt Nam.    Nước: Việt Nam."),
      P("- Đường link địa chỉ trang điện tử: https://www.trameddeeptech.cloud"),
      P(""),
      PR([{t:"Nêu tóm tắt về tác phẩm:", b:true}]),
      P("TRAMED.AI là tác phẩm mỹ thuật ứng dụng bao gồm hệ thống nhận diện thương hiệu (bộ biểu trưng, biểu tượng, bảng màu, hệ chữ, ký hiệu đồ họa) và giao diện người dùng của nền tảng trợ lý Y học cổ truyền (YHCT) ứng dụng trí tuệ nhân tạo. Tác phẩm được thiết kế nhằm gắn liền với sản phẩm phần mềm hữu ích phục vụ bác sĩ, sinh viên và người bệnh trong lĩnh vực YHCT."),
      P(""),
      PR([{t:"- Nội dung chính của tác phẩm:", b:true}]),
      P("Bộ nhận diện thương hiệu và giao diện đồ họa của hệ thống TRAMED.AI, gồm: (1) biểu trưng (logo) chính hình chiếc lá cách điệu kết hợp mạch nhịp – biểu tượng cho sự hoà quyện giữa dược liệu cổ truyền và công nghệ số; (2) biểu tượng ứng dụng (app icon) dạng khối tròn với nét lá nội tuyến; (3) hệ thống màu sắc chủ đạo xanh dược liệu – vàng đồng – trắng ngà; (4) hệ chữ hiển thị và hệ chữ nội dung; (5) các cụm giao diện chức năng: Vọng chẩn, Khám bệnh, Kê đơn, Dinh dưỡng, Mô phỏng huyệt đạo 3D; (6) hệ thống biểu tượng thao tác (icon set) đồng bộ."),
      P(""),
      PR([{t:"- Mô tả đường nét, màu sắc, hình khối, bố cục, tính năng hữu ích:", b:true}]),
      P("• Đường nét: mềm mại, bo tròn, sử dụng nét đơn liên tục gợi hình chiếc lá và nhịp mạch, thể hiện sự tinh gọn và cảm giác chữa lành."),
      P("• Màu sắc: chủ đạo xanh lục dược liệu (#0F3B2E, #1F6B4A), điểm nhấn vàng đồng (#C9A24B), nền trắng ngà (#F7F4EC) và mực đen (#0B0B0B) tạo cảm giác uy tín – truyền thống – hiện đại."),
      P("• Hình khối: kết hợp hình chiếc lá cách điệu, đường nhịp tim và khối tròn bao ngoài; các mảng giao diện dạng thẻ (card) bo góc mềm."),
      P("• Bố cục: đối xứng trục dọc cho biểu trưng; giao diện phần mềm bố cục dạng lưới 12 cột, phân cấp thông tin rõ ràng theo mô hình Header – Sidebar – Content."),
      P("• Tính năng hữu ích: bộ nhận diện và giao diện gắn với phần mềm trợ lý YHCT, hỗ trợ nhận diện thương hiệu, tương tác trực quan giữa người dùng (bác sĩ/bệnh nhân) và hệ thống trong các nghiệp vụ vọng chẩn, biện chứng, kê đơn Quân – Thần – Tá – Sứ, tư vấn dinh dưỡng và mô phỏng huyệt đạo 3D."),
      P(""),
      PR([{t:"- Công cụ, ứng dụng dùng để sáng tạo tác phẩm:", b:true}]),
      P("Adobe Illustrator, Adobe Photoshop, Figma, Blender (dựng mô hình 3D huyệt đạo), cùng các công cụ mã nguồn mở phục vụ dựng giao diện (React, TailwindCSS). Toàn bộ ý tưởng, phác thảo, thiết kế đường nét, hình khối, bố cục và bảng màu do tác giả tự thực hiện."),
      P(""),
      PR([{t:"- Tác phẩm được tạo ra để gắn liền với đồ vật hữu ích nào (nếu có):", b:true}]),
      P("Tác phẩm được gắn liền với sản phẩm phần mềm hữu ích “Hệ thống trợ lý Y học cổ truyền TRAMED.AI” (website và ứng dụng), được sản xuất theo phương thức công nghiệp phần mềm."),
      P(""),
      PR([{t:"Cam đoan về việc sáng tạo tác phẩm:", b:true, i:true}]),
      P("Nội dung tác phẩm do tác giả tự sáng tạo, không sao chép từ tác phẩm của người khác, không vi phạm các quy định của pháp luật Việt Nam.", { italics:true }),
      P(""),
      PR([{t:"2. Thông tin về tác giả:", b:true}]),
      PR([{t:"2.1 Họ và tên: ", b:true},{t:"TIẾT THÀNH CÔNG"},{t:"   -   Vai trò: ", b:true},{t:"Chủ nhiệm nhóm tác giả – thiết kế ý tưởng tổng thể, biểu trưng (logo), biểu tượng ứng dụng, hệ thống màu sắc, hệ chữ và bố cục giao diện chính của tác phẩm."}]),
      PR([{t:"Quốc tịch: ",b:true},{t:"Việt Nam    "},{t:"Bút danh: ",b:true},{t:"Không"}]),
      PR([{t:"Sinh ngày: ",b:true},{t:"…../…../……    "},{t:"Số CCCD: ",b:true},{t:"…………………………"}]),
      PR([{t:"Ngày cấp: ",b:true},{t:"…../…../……    "},{t:"tại: ",b:true},{t:"Cục Cảnh sát QLHC về TTXH"}]),
      PR([{t:"Địa chỉ: ",b:true},{t:"………………………………………………………………………"}]),
      PR([{t:"Số điện thoại: ",b:true},{t:"…………………    "},{t:"Email: ",b:true},{t:"…………………………"}]),
      P(""),
      PR([{t:"2.2 Họ và tên: ", b:true},{t:"(Thành viên nhóm Pulse & Pixel – bổ sung nếu có)"},{t:"   -   Vai trò: ", b:true},{t:"Đồng thiết kế các cụm giao diện chức năng và bộ biểu tượng thao tác."}]),
      PR([{t:"Quốc tịch: ",b:true},{t:"Việt Nam    "},{t:"Bút danh: ",b:true},{t:"Không"}]),
      PR([{t:"Sinh ngày: ",b:true},{t:"…../…../……    "},{t:"Số CCCD: ",b:true},{t:"…………………………"}]),
      PR([{t:"Ngày cấp: ",b:true},{t:"…../…../……    "},{t:"tại: ",b:true},{t:"…………………………"}]),
      PR([{t:"Địa chỉ: ",b:true},{t:"………………………………………………………………………"}]),
      PR([{t:"Số điện thoại: ",b:true},{t:"…………………    "},{t:"Email: ",b:true},{t:"…………………………"}]),
      P(""),
      PR([{t:"3. Thông tin về chủ sở hữu quyền tác giả:", b:true}]),
      P("Chủ sở hữu quyền tác giả là: ☒ Tổ chức"),
      PR([{t:"Tên tổ chức: ",b:true},{t: OWNER}]),
      PR([{t:"Số Quyết định thành lập: ",b:true},{t: OWNER_LICENSE}]),
      PR([{t:"Ngày cấp: ",b:true},{t:"26/4/2011    "},{t:"tại: ",b:true},{t:"Thủ tướng Chính phủ nước CHXHCN Việt Nam"}]),
      PR([{t:"Địa chỉ: ",b:true},{t: OWNER_ADDR}]),
      PR([{t:"Số điện thoại: ",b:true},{t: OWNER_PHONE + "    "},{t:"Email: ",b:true},{t: OWNER_EMAIL}]),
      P(""),
      PR([{t:"Cơ sở phát sinh sở hữu quyền: ",b:true},{t:"☒ Khác, nêu rõ: "},{t:"Giấy xác nhận giao nhiệm vụ của Trường Đại học Nguyễn Tất Thành đối với nhóm tác giả (đội Pulse & Pixel) thực hiện đề tài nghiên cứu khoa học sinh viên năm học 2025 – 2026.", i:true}]),
      P(""),
      PR([{t:"4. Trường hợp tác phẩm đăng ký là tác phẩm phái sinh: ",b:true},{t:"Không."}]),
      PR([{t:"5. Trường hợp cấp lại, cấp đổi Giấy chứng nhận đăng ký quyền tác giả: ",b:true},{t:"Không."}]),
      PR([{t:"6. Bên được ủy quyền nộp hồ sơ đăng ký (nếu có): ",b:true},{t:"Trường Đại học Nguyễn Tất Thành – Phòng Khoa học Công nghệ."}]),
      P(""),
      P("Tôi/Chúng tôi cam đoan những lời khai trên là đúng sự thật, nếu sai tôi/chúng tôi xin chịu trách nhiệm trước pháp luật./.", { italics:true }),
      P(""),
      sigTable("Thành phố Hồ Chí Minh, ngày …. tháng …. năm 2026", "………………………"),
    ]
  }]
});

Packer.toBuffer(doc1).then(buf => {
  fs.writeFileSync('/mnt/documents/TRAMED_1_ToKhai_MyThuatUngDung_PulseAndPixel.docx', buf);
  console.log('OK 1');
});

// ============== FILE 2: GIẤY XÁC NHẬN NHIỆM VỤ ==============
const doc2 = new Document({
  styles: { default: { document: { run: { font: "Times New Roman", size: 24 } } } },
  sections: [{
    properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
    children: [
      ...quocHieu(),
      H("GIẤY XÁC NHẬN"),
      P("Trường Đại học Nguyễn Tất Thành xác nhận đã giao nhiệm vụ cho:", { align: AlignmentType.LEFT }),
      P(""),
      PR([{t:"1. Tôi tên: ", b:true},{t:"TIẾT THÀNH CÔNG"},{t:"   -   Vai trò: ", b:true},{t:"Chủ nhiệm nhóm tác giả – thiết kế ý tưởng tổng thể, biểu trưng, biểu tượng ứng dụng, hệ thống màu sắc, hệ chữ và bố cục giao diện chính của tác phẩm TRAMED.AI."}]),
      PR([{t:"Quốc tịch: ",b:true},{t:"Việt Nam    "},{t:"Bút danh: ",b:true},{t:"Không"}]),
      PR([{t:"Sinh ngày: ",b:true},{t:"…../…../……    "},{t:"Số CCCD: ",b:true},{t:"…………………………"}]),
      PR([{t:"Ngày cấp: ",b:true},{t:"…../…../……    "},{t:"tại: ",b:true},{t:"Cục Cảnh sát QLHC về TTXH"}]),
      PR([{t:"Địa chỉ: ",b:true},{t:"………………………………………………………………………"}]),
      PR([{t:"Số điện thoại: ",b:true},{t:"…………………    "},{t:"Email: ",b:true},{t:"…………………………"}]),
      P(""),
      PR([{t:"2. Tôi tên: ", b:true},{t:"(Thành viên đội Pulse & Pixel – bổ sung nếu có)"},{t:"   -   Vai trò: ", b:true},{t:"Đồng thiết kế các cụm giao diện chức năng (Vọng chẩn, Khám bệnh, Kê đơn, Dinh dưỡng, Mô phỏng huyệt đạo 3D) và bộ biểu tượng thao tác."}]),
      PR([{t:"Quốc tịch: ",b:true},{t:"Việt Nam    "},{t:"Bút danh: ",b:true},{t:"Không"}]),
      PR([{t:"Sinh ngày: ",b:true},{t:"…../…../……    "},{t:"Số CCCD: ",b:true},{t:"…………………………"}]),
      PR([{t:"Ngày cấp: ",b:true},{t:"…../…../……    "},{t:"tại: ",b:true},{t:"…………………………"}]),
      PR([{t:"Địa chỉ: ",b:true},{t:"………………………………………………………………………"}]),
      PR([{t:"Số điện thoại: ",b:true},{t:"…………………    "},{t:"Email: ",b:true},{t:"…………………………"}]),
      P(""),
      PR([{t:"Là tác giả thực hiện: ",b:true},{t:"“" + WORK + "”.", i:true}]),
      P("Vào ngày ….. tháng ….. năm 2025 và đã hoàn thành nhiệm vụ trên vào ngày ….. tháng ….. năm 2026."),
      P(""),
      P("Nhiệm vụ được giao trong khuôn khổ đề tài nghiên cứu khoa học sinh viên năm học 2025 – 2026 do Trường Đại học Nguyễn Tất Thành chủ trì. Toàn bộ quyền tài sản đối với tác phẩm nêu trên thuộc về Trường Đại học Nguyễn Tất Thành theo quy định của Luật Sở hữu trí tuệ."),
      P(""),
      sigTable("TP. Hồ Chí Minh, ngày …. tháng …. năm 2026", "………………………"),
    ]
  }]
});
Packer.toBuffer(doc2).then(buf => {
  fs.writeFileSync('/mnt/documents/TRAMED_2_GiayXacNhanNhiemVu_PulseAndPixel.docx', buf);
  console.log('OK 2');
});

// ============== FILE 3: BẢN CAM KẾT ==============
const doc3 = new Document({
  styles: { default: { document: { run: { font: "Times New Roman", size: 24 } } } },
  sections: [{
    properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
    children: [
      ...quocHieu(),
      H("BẢN CAM KẾT"),
      P("Kính gửi: Cục Bản quyền tác giả", { align: AlignmentType.CENTER, italics:true }),
      P(""),
      P("Hôm nay, ngày ….. tháng ….. năm 2026, tại Thành phố Hồ Chí Minh, chúng tôi gồm:"),
      P(""),
      PR([{t:"1. Tôi tên: ",b:true},{t:"TIẾT THÀNH CÔNG"},{t:"   -   Vai trò: ",b:true},{t:"Thiết kế toàn bộ biểu trưng, biểu tượng, hệ thống nhận diện và giao diện chính của tác phẩm."}]),
      PR([{t:"Quốc tịch: ",b:true},{t:"Việt Nam    "},{t:"Bút danh: ",b:true},{t:"Không"}]),
      PR([{t:"Sinh ngày: ",b:true},{t:"…../…../……    "},{t:"Số CCCD: ",b:true},{t:"…………………………"}]),
      PR([{t:"Ngày cấp: ",b:true},{t:"…../…../……    "},{t:"tại: ",b:true},{t:"Cục Cảnh sát QLHC về TTXH"}]),
      PR([{t:"Địa chỉ: ",b:true},{t:"………………………………………………………………………"}]),
      PR([{t:"Số điện thoại: ",b:true},{t:"…………………    "},{t:"Email: ",b:true},{t:"…………………………"}]),
      P(""),
      PR([{t:"2. Tôi tên: ",b:true},{t:"(Thành viên đội Pulse & Pixel – bổ sung nếu có)"},{t:"   -   Vai trò: ",b:true},{t:"Đồng thiết kế các cụm giao diện chức năng và bộ biểu tượng thao tác."}]),
      PR([{t:"Quốc tịch: ",b:true},{t:"Việt Nam    "},{t:"Bút danh: ",b:true},{t:"Không"}]),
      PR([{t:"Sinh ngày: ",b:true},{t:"…../…../……    "},{t:"Số CCCD: ",b:true},{t:"…………………………"}]),
      PR([{t:"Ngày cấp: ",b:true},{t:"…../…../……    "},{t:"tại: ",b:true},{t:"…………………………"}]),
      PR([{t:"Địa chỉ: ",b:true},{t:"………………………………………………………………………"}]),
      PR([{t:"Số điện thoại: ",b:true},{t:"…………………    "},{t:"Email: ",b:true},{t:"…………………………"}]),
      P(""),
      PR([{t:"Là tác giả của tác phẩm: ",b:true},{t:"“" + WORK + "”",b:true}]),
      P("theo nhiệm vụ được Trường Đại học Nguyễn Tất Thành giao. Nay, chúng tôi bàn giao tác phẩm nêu trên về lại cho Trường Đại học Nguyễn Tất Thành là chủ sở hữu quyền tác giả đối với tác phẩm nêu trên."),
      P(""),
      PR([{t:"Nay chúng tôi cam kết", b:true}], { align: AlignmentType.CENTER }),
      P(""),
      P("1. Tác phẩm do chúng tôi tự sáng tạo (phần nội dung và phần hình ảnh) không sao chép, không xâm phạm quyền tác giả, quyền liên quan của cá nhân, tổ chức khác, không vi phạm các quy định của pháp luật Việt Nam;"),
      P("2. Trong tác phẩm chúng tôi trực tiếp sáng tạo không có nội dung, hình ảnh vi phạm chủ quyền, lãnh thổ, biên giới quốc gia, xuyên tạc lịch sử gây ảnh hưởng đến danh dự, uy tín, lợi ích của cá nhân, tổ chức, Nhà nước Việt Nam;"),
      P("3. Tuân thủ mọi quy định về quyền tác giả, quyền liên quan theo Luật Sở hữu trí tuệ năm 2005, Luật sửa đổi, bổ sung một số điều của Luật Sở hữu trí tuệ năm 2009, 2019, 2022 và văn bản pháp luật Việt Nam khác có liên quan;"),
      P("4. Toàn bộ công cụ, phần mềm sử dụng để tạo lập tác phẩm đều là công cụ hợp pháp; các thư viện đồ họa, phông chữ, biểu tượng sử dụng đều có giấy phép sử dụng hợp lệ hoặc do chính chúng tôi thiết kế."),
      P(""),
      P("Chúng tôi xin chịu trách nhiệm trước pháp luật về cam kết của mình./.", { italics:true }),
      P(""),
      P(""),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [4680, 4680],
        rows: [
          new TableRow({ children: [
            new TableCell({ borders: noBorder, width:{size:4680,type:WidthType.DXA}, children:[
              new Paragraph({alignment:AlignmentType.CENTER, children:[new TextRun({text:"TÁC GIẢ", bold:true, size:24, font:"Times New Roman"})]}),
              new Paragraph({alignment:AlignmentType.CENTER, children:[new TextRun({text:"(Ký, ghi rõ họ tên)", italics:true, size:22, font:"Times New Roman"})]}),
              new Paragraph({alignment:AlignmentType.CENTER, spacing:{before:800}, children:[new TextRun({text:"TIẾT THÀNH CÔNG", bold:true, size:24, font:"Times New Roman"})]}),
            ]}),
            new TableCell({ borders: noBorder, width:{size:4680,type:WidthType.DXA}, children:[
              new Paragraph({alignment:AlignmentType.CENTER, children:[new TextRun({text:"TÁC GIẢ", bold:true, size:24, font:"Times New Roman"})]}),
              new Paragraph({alignment:AlignmentType.CENTER, children:[new TextRun({text:"(Ký, ghi rõ họ tên)", italics:true, size:22, font:"Times New Roman"})]}),
              new Paragraph({alignment:AlignmentType.CENTER, spacing:{before:800}, children:[new TextRun({text:"………………………", bold:true, size:24, font:"Times New Roman"})]}),
            ]}),
          ]})
        ]
      })
    ]
  }]
});
Packer.toBuffer(doc3).then(buf => {
  fs.writeFileSync('/mnt/documents/TRAMED_3_BanCamKetTacGia_PulseAndPixel.docx', buf);
  console.log('OK 3');
});
