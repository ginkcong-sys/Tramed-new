// ============================================================
// CƠ SỞ DỮ LIỆU Y KHOA – ICD-10 + Thuốc tân dược (VN, tóm tắt)
// Dùng cho gợi ý + cảnh báo tương tác/quá liều trong B4 · Đơn YHHĐ
// ============================================================

export type IcdItem = { code: string; name: string; keywords?: string[] };

export const ICD10: IcdItem[] = [
  // Hô hấp
  { code: "J02", name: "Viêm họng cấp", keywords: ["viem hong", "đau họng"] },
  { code: "J02.9", name: "Viêm họng cấp, không đặc hiệu", keywords: ["viem hong"] },
  { code: "J03", name: "Viêm amidan cấp", keywords: ["amidan"] },
  { code: "J04", name: "Viêm thanh quản và khí quản cấp", keywords: ["thanh quan"] },
  { code: "J06", name: "Nhiễm khuẩn hô hấp trên cấp", keywords: ["nhiem khuan ho hap", "cảm cúm"] },
  { code: "J18", name: "Viêm phổi không xác định tác nhân", keywords: ["viem phoi"] },
  { code: "J20", name: "Viêm phế quản cấp", keywords: ["viem phe quan"] },
  { code: "J30", name: "Viêm mũi dị ứng", keywords: ["viem mui di ung"] },
  { code: "J31", name: "Viêm mũi – họng mạn", keywords: ["viem mui hong man"] },
  { code: "J32", name: "Viêm xoang mạn", keywords: ["viem xoang"] },
  { code: "J45", name: "Hen phế quản", keywords: ["hen", "asthma"] },
  { code: "J44", name: "COPD – Bệnh phổi tắc nghẽn mạn tính", keywords: ["copd", "tac nghen"] },

  // Tim mạch
  { code: "I10", name: "Tăng huyết áp nguyên phát", keywords: ["tha", "tang huyet ap", "cao huyết áp"] },
  { code: "I11", name: "Bệnh tim do tăng huyết áp", keywords: ["tim do tha"] },
  { code: "I20", name: "Cơn đau thắt ngực", keywords: ["dau that nguc", "angina"] },
  { code: "I21", name: "Nhồi máu cơ tim cấp", keywords: ["nhoi mau co tim"] },
  { code: "I25", name: "Bệnh tim thiếu máu cục bộ mạn", keywords: ["thieu mau co tim"] },
  { code: "I48", name: "Rung nhĩ và cuồng nhĩ", keywords: ["rung nhi"] },
  { code: "I50", name: "Suy tim", keywords: ["suy tim"] },
  { code: "I63", name: "Nhồi máu não", keywords: ["nhoi mau nao", "đột quỵ"] },
  { code: "I64", name: "Đột quỵ không rõ xuất huyết hay nhồi máu", keywords: ["dot quy"] },
  { code: "I69", name: "Di chứng bệnh mạch máu não", keywords: ["di chung tai bien"] },

  // Nội tiết – Chuyển hoá
  { code: "E11", name: "Đái tháo đường type 2", keywords: ["dtd", "tieu duong", "diabetes"] },
  { code: "E10", name: "Đái tháo đường type 1", keywords: ["tieu duong type 1"] },
  { code: "E03", name: "Suy giáp", keywords: ["suy giap"] },
  { code: "E05", name: "Cường giáp", keywords: ["cuong giap", "basedow"] },
  { code: "E66", name: "Béo phì", keywords: ["beo phi"] },
  { code: "E78", name: "Rối loạn chuyển hoá lipid", keywords: ["mo mau", "lipid"] },
  { code: "E79", name: "Tăng acid uric / Gout chuyển hoá", keywords: ["acid uric", "gout"] },

  // Tiêu hoá
  { code: "K21", name: "Trào ngược dạ dày – thực quản (GERD)", keywords: ["gerd", "trao nguoc"] },
  { code: "K25", name: "Loét dạ dày", keywords: ["loet da day"] },
  { code: "K29", name: "Viêm dạ dày – tá tràng", keywords: ["viem da day"] },
  { code: "K30", name: "Khó tiêu chức năng", keywords: ["kho tieu"] },
  { code: "K58", name: "Hội chứng ruột kích thích (IBS)", keywords: ["ibs", "ruot kich thich"] },
  { code: "K59.0", name: "Táo bón", keywords: ["tao bon"] },
  { code: "K76", name: "Bệnh gan khác", keywords: ["gan"] },
  { code: "B18", name: "Viêm gan virus mạn", keywords: ["viem gan b", "viem gan c"] },

  // Cơ – Xương – Khớp
  { code: "M05", name: "Viêm khớp dạng thấp", keywords: ["viem khop dang thap", "rheumatoid"] },
  { code: "M10", name: "Gout", keywords: ["gout", "thong phong"] },
  { code: "M15", name: "Thoái hoá đa khớp", keywords: ["thoai hoa khop"] },
  { code: "M17", name: "Thoái hoá khớp gối", keywords: ["khop goi"] },
  { code: "M47", name: "Thoái hoá cột sống", keywords: ["thoai hoa cot song"] },
  { code: "M51", name: "Thoát vị đĩa đệm cột sống thắt lưng", keywords: ["thoat vi dia dem"] },
  { code: "M54.5", name: "Đau thắt lưng", keywords: ["dau lung", "lumbago"] },
  { code: "M54.2", name: "Đau cổ vai gáy", keywords: ["co vai gay", "vẹo cổ"] },
  { code: "M79.1", name: "Đau cơ", keywords: ["dau co", "myalgia"] },
  { code: "M81", name: "Loãng xương", keywords: ["loang xuong"] },

  // Thần kinh – Tâm thần
  { code: "G43", name: "Migraine", keywords: ["migraine", "đau nửa đầu"] },
  { code: "G44", name: "Đau đầu khác", keywords: ["dau dau"] },
  { code: "G47.0", name: "Mất ngủ", keywords: ["mat ngu", "insomnia"] },
  { code: "F32", name: "Trầm cảm", keywords: ["tram cam", "depression"] },
  { code: "F41", name: "Rối loạn lo âu", keywords: ["lo au", "anxiety"] },
  { code: "G62", name: "Bệnh thần kinh ngoại biên", keywords: ["te bi", "tk ngoai bien"] },
  { code: "G51", name: "Liệt dây VII ngoại biên", keywords: ["liet mat", "liet vii"] },

  // Tiết niệu – Sinh dục
  { code: "N18", name: "Bệnh thận mạn (CKD)", keywords: ["benh than man", "ckd"] },
  { code: "N20", name: "Sỏi thận – niệu quản", keywords: ["soi than"] },
  { code: "N39.0", name: "Nhiễm khuẩn tiết niệu", keywords: ["nktn", "viem tiet nieu"] },
  { code: "N40", name: "Phì đại tuyến tiền liệt", keywords: ["phi dai tien liet"] },

  // Phụ khoa
  { code: "N91", name: "Vô kinh / kinh thưa", keywords: ["vo kinh"] },
  { code: "N94", name: "Đau bụng kinh / rối loạn chu kỳ", keywords: ["dau bung kinh", "kinh nguyet"] },
  { code: "N95", name: "Rối loạn quanh mãn kinh", keywords: ["man kinh"] },

  // Da
  { code: "L20", name: "Viêm da cơ địa", keywords: ["viem da co dia", "chàm"] },
  { code: "L29", name: "Ngứa", keywords: ["ngua"] },
  { code: "L50", name: "Mày đay", keywords: ["may day", "noi me day"] },

  // Khác
  { code: "R51", name: "Đau đầu (triệu chứng)", keywords: ["đau đầu"] },
  { code: "R10", name: "Đau bụng", keywords: ["dau bung"] },
  { code: "R11", name: "Buồn nôn / nôn", keywords: ["non oi"] },
  { code: "R42", name: "Chóng mặt", keywords: ["chong mat", "vertigo"] },
  { code: "Z00", name: "Khám sức khoẻ tổng quát", keywords: ["kham tong quat"] },

  // === BỔ SUNG: Hô hấp ===
  { code: "J00", name: "Viêm mũi họng cấp (cảm thường)", keywords: ["cam cum", "cam lanh"] },
  { code: "J01", name: "Viêm xoang cấp", keywords: ["viem xoang cap"] },
  { code: "J11", name: "Cúm", keywords: ["cum", "influenza"] },
  { code: "J15", name: "Viêm phổi do vi khuẩn", keywords: ["viem phoi vk"] },
  { code: "J21", name: "Viêm tiểu phế quản cấp", keywords: ["viem tieu phe quan"] },
  { code: "J42", name: "Viêm phế quản mạn không đặc hiệu", keywords: ["viem pq man"] },
  { code: "J47", name: "Giãn phế quản", keywords: ["gian phe quan"] },
  { code: "J81", name: "Phù phổi", keywords: ["phu phoi"] },
  { code: "J90", name: "Tràn dịch màng phổi", keywords: ["tran dich mang phoi"] },
  { code: "J93", name: "Tràn khí màng phổi", keywords: ["tran khi mang phoi"] },
  { code: "J96", name: "Suy hô hấp", keywords: ["suy ho hap"] },
  { code: "A15", name: "Lao phổi có xác nhận vi khuẩn học", keywords: ["lao phoi"] },
  { code: "U07.1", name: "COVID-19, virus được định danh", keywords: ["covid", "sars-cov-2"] },

  // === BỔ SUNG: Tim mạch ===
  { code: "I26", name: "Thuyên tắc phổi", keywords: ["thuyen tac phoi", "pe"] },
  { code: "I35", name: "Bệnh van động mạch chủ", keywords: ["van dmc"] },
  { code: "I42", name: "Bệnh cơ tim", keywords: ["benh co tim"] },
  { code: "I49", name: "Loạn nhịp tim khác", keywords: ["loan nhip"] },
  { code: "I65", name: "Tắc/hẹp động mạch trước não", keywords: ["hep dm canh"] },
  { code: "I70", name: "Xơ vữa động mạch", keywords: ["xo vua dm"] },
  { code: "I73", name: "Bệnh mạch máu ngoại biên", keywords: ["mach mau ngoai bien"] },
  { code: "I80", name: "Viêm tĩnh mạch & huyết khối tĩnh mạch", keywords: ["huyet khoi tm"] },
  { code: "I83", name: "Giãn tĩnh mạch chi dưới", keywords: ["gian tinh mach"] },
  { code: "I84", name: "Trĩ", keywords: ["benh tri", "hemorrhoid"] },
  { code: "I88", name: "Viêm hạch không đặc hiệu", keywords: ["viem hach"] },

  // === BỔ SUNG: Nội tiết – Chuyển hoá – Dinh dưỡng ===
  { code: "E04", name: "Bướu giáp đơn thuần không độc", keywords: ["buou giap"] },
  { code: "E14", name: "Đái tháo đường không đặc hiệu", keywords: ["dtd"] },
  { code: "E16.2", name: "Hạ đường huyết", keywords: ["ha duong huyet"] },
  { code: "E27", name: "Rối loạn tuyến thượng thận", keywords: ["thuong than"] },
  { code: "E55", name: "Thiếu vitamin D", keywords: ["thieu vit d"] },
  { code: "E83", name: "Rối loạn chuyển hoá khoáng (K, Mg, Ca…)", keywords: ["roi loan khoang"] },
  { code: "E86", name: "Mất nước", keywords: ["mat nuoc"] },
  { code: "E87", name: "Rối loạn điện giải & toan kiềm", keywords: ["dien giai"] },

  // === BỔ SUNG: Tiêu hoá – Gan mật ===
  { code: "K35", name: "Viêm ruột thừa cấp", keywords: ["ruot thua"] },
  { code: "K40", name: "Thoát vị bẹn", keywords: ["thoat vi ben"] },
  { code: "K50", name: "Bệnh Crohn", keywords: ["crohn"] },
  { code: "K51", name: "Viêm loét đại tràng", keywords: ["viem loet dai trang"] },
  { code: "K57", name: "Bệnh túi thừa đại tràng", keywords: ["tui thua"] },
  { code: "K63", name: "Bệnh ruột khác", keywords: ["benh ruot khac"] },
  { code: "K70", name: "Bệnh gan do rượu", keywords: ["gan do ruou"] },
  { code: "K71", name: "Bệnh gan do thuốc", keywords: ["gan do thuoc"] },
  { code: "K73", name: "Viêm gan mạn", keywords: ["viem gan man"] },
  { code: "K74", name: "Xơ gan", keywords: ["xo gan"] },
  { code: "K80", name: "Sỏi mật", keywords: ["soi mat"] },
  { code: "K81", name: "Viêm túi mật", keywords: ["viem tui mat"] },
  { code: "K85", name: "Viêm tuỵ cấp", keywords: ["viem tuy cap"] },
  { code: "K92.2", name: "Xuất huyết tiêu hoá", keywords: ["xhth", "xuat huyet th"] },

  // === BỔ SUNG: Cơ – Xương – Khớp ===
  { code: "M06", name: "Viêm khớp dạng thấp khác", keywords: ["vkdt"] },
  { code: "M16", name: "Thoái hoá khớp háng", keywords: ["khop hang"] },
  { code: "M19", name: "Thoái hoá khớp khác", keywords: ["thoai hoa khop khac"] },
  { code: "M25.5", name: "Đau khớp", keywords: ["dau khop"] },
  { code: "M40", name: "Gù cột sống", keywords: ["gu cot song"] },
  { code: "M41", name: "Vẹo cột sống", keywords: ["veo cot song"] },
  { code: "M48", name: "Hẹp ống sống", keywords: ["hep ong song"] },
  { code: "M50", name: "Thoát vị đĩa đệm cổ", keywords: ["thoat vi co"] },
  { code: "M62.6", name: "Căng cơ", keywords: ["cang co"] },
  { code: "M75", name: "Tổn thương vai", keywords: ["dau vai", "vai dong"] },
  { code: "M77", name: "Viêm gân khác (khuỷu, gót…)", keywords: ["viem gan"] },
  { code: "M84", name: "Rối loạn liền xương / gãy bệnh lý", keywords: ["gay xuong benh ly"] },

  // === BỔ SUNG: Thần kinh – Tâm thần ===
  { code: "G20", name: "Bệnh Parkinson", keywords: ["parkinson"] },
  { code: "G30", name: "Bệnh Alzheimer", keywords: ["alzheimer", "sa sut tri tue"] },
  { code: "G40", name: "Động kinh", keywords: ["dong kinh", "epilepsy"] },
  { code: "G45", name: "TIA – Cơn thiếu máu não thoáng qua", keywords: ["tia"] },
  { code: "G54", name: "Bệnh rễ và đám rối thần kinh", keywords: ["re than kinh"] },
  { code: "G56", name: "Bệnh thần kinh chi trên (hội chứng ống cổ tay…)", keywords: ["ong co tay", "carpal"] },
  { code: "G81", name: "Liệt nửa người", keywords: ["liet nua nguoi"] },
  { code: "F20", name: "Tâm thần phân liệt", keywords: ["tam than phan liet"] },
  { code: "F33", name: "Trầm cảm tái diễn", keywords: ["tram cam tai dien"] },
  { code: "F43", name: "Phản ứng stress / điều chỉnh", keywords: ["stress"] },
  { code: "F51", name: "Rối loạn giấc ngủ không thực tổn", keywords: ["mat ngu chuc nang"] },

  // === BỔ SUNG: Tiết niệu – Sinh dục ===
  { code: "N17", name: "Suy thận cấp", keywords: ["suy than cap", "aki"] },
  { code: "N19", name: "Suy thận không xác định", keywords: ["suy than"] },
  { code: "N30", name: "Viêm bàng quang", keywords: ["viem bang quang"] },
  { code: "N41", name: "Viêm tuyến tiền liệt", keywords: ["viem tien liet"] },
  { code: "N45", name: "Viêm tinh hoàn / mào tinh", keywords: ["viem tinh hoan"] },
  { code: "N48", name: "Bệnh dương vật", keywords: ["roi loan cuong"] },
  { code: "N52", name: "Rối loạn cương dương", keywords: ["cuong duong"] },

  // === BỔ SUNG: Sản – Phụ khoa ===
  { code: "O14", name: "Tiền sản giật", keywords: ["tien san giat"] },
  { code: "O20", name: "Doạ sảy thai", keywords: ["doa say thai"] },
  { code: "O24", name: "ĐTĐ thai kỳ", keywords: ["dtd thai ky"] },
  { code: "O80", name: "Đẻ thường ngả âm đạo", keywords: ["de thuong"] },
  { code: "Z34", name: "Theo dõi thai kỳ bình thường", keywords: ["theo doi thai"] },
  { code: "N70", name: "Viêm phần phụ", keywords: ["viem phan phu"] },
  { code: "N73", name: "Viêm vùng chậu", keywords: ["viem vung chau"] },
  { code: "N76", name: "Viêm âm đạo", keywords: ["viem am dao"] },
  { code: "N80", name: "Lạc nội mạc tử cung", keywords: ["lac noi mac"] },
  { code: "N83", name: "U nang buồng trứng", keywords: ["u nang buong trung"] },
  { code: "N84", name: "Polyp tử cung", keywords: ["polyp tu cung"] },
  { code: "N92", name: "Rong kinh / kinh nhiều", keywords: ["rong kinh"] },
  { code: "D25", name: "U xơ tử cung", keywords: ["u xo tu cung"] },

  // === BỔ SUNG: Nhi khoa ===
  { code: "A08", name: "Tiêu chảy do virus", keywords: ["tieu chay virus", "rota"] },
  { code: "A09", name: "Tiêu chảy & viêm dạ dày – ruột nhiễm khuẩn", keywords: ["tieu chay nk"] },
  { code: "B01", name: "Thuỷ đậu", keywords: ["thuy dau", "varicella"] },
  { code: "B05", name: "Sởi", keywords: ["soi", "measles"] },
  { code: "B06", name: "Rubella", keywords: ["rubella"] },
  { code: "B26", name: "Quai bị", keywords: ["quai bi", "mumps"] },
  { code: "B34.9", name: "Nhiễm virus không xác định", keywords: ["sot virus"] },
  { code: "P59", name: "Vàng da sơ sinh", keywords: ["vang da so sinh"] },
  { code: "R50", name: "Sốt không xác định", keywords: ["sot khong ro"] },
  { code: "R62", name: "Chậm phát triển thể chất", keywords: ["cham tang can"] },

  // === BỔ SUNG: Tai – Mũi – Họng ===
  { code: "H60", name: "Viêm tai ngoài", keywords: ["viem tai ngoai"] },
  { code: "H65", name: "Viêm tai giữa không mủ", keywords: ["viem tai giua"] },
  { code: "H66", name: "Viêm tai giữa có mủ", keywords: ["viem tai giua mu"] },
  { code: "H81", name: "Rối loạn tiền đình (chóng mặt ngoại biên)", keywords: ["tien dinh"] },
  { code: "H90", name: "Giảm thính lực", keywords: ["giam thinh luc"] },
  { code: "J35", name: "Bệnh mạn tính amidan & VA", keywords: ["va", "amidan man"] },
  { code: "J38", name: "Bệnh dây thanh & thanh quản", keywords: ["khan tieng", "polyp day thanh"] },

  // === BỔ SUNG: Mắt ===
  { code: "H10", name: "Viêm kết mạc", keywords: ["viem ket mac", "dau mat do"] },
  { code: "H25", name: "Đục thuỷ tinh thể tuổi già", keywords: ["duc thuy tinh the"] },
  { code: "H40", name: "Glôcôm", keywords: ["glaucoma", "thien dau thong"] },
  { code: "H52", name: "Tật khúc xạ (cận / viễn / loạn)", keywords: ["can thi", "loan thi"] },
  { code: "H53", name: "Rối loạn thị giác", keywords: ["roi loan thi giac"] },

  // === BỔ SUNG: Da liễu ===
  { code: "L01", name: "Chốc", keywords: ["choc loet"] },
  { code: "L21", name: "Viêm da tiết bã", keywords: ["viem da tiet ba"] },
  { code: "L23", name: "Viêm da tiếp xúc dị ứng", keywords: ["viem da tiep xuc"] },
  { code: "L30", name: "Viêm da khác (chàm)", keywords: ["cham eczema"] },
  { code: "L40", name: "Vảy nến", keywords: ["vay nen", "psoriasis"] },
  { code: "L70", name: "Mụn trứng cá", keywords: ["mun trung ca", "acne"] },
  { code: "L80", name: "Bạch biến", keywords: ["bach bien"] },
  { code: "B35", name: "Nấm da", keywords: ["nam da", "hac lao"] },
  { code: "B86", name: "Ghẻ", keywords: ["ghe"] },

  // === BỔ SUNG: Huyết học ===
  { code: "D50", name: "Thiếu máu thiếu sắt", keywords: ["thieu mau thieu sat"] },
  { code: "D51", name: "Thiếu máu thiếu vitamin B12", keywords: ["thieu b12"] },
  { code: "D56", name: "Thalassemia", keywords: ["thalassemia"] },
  { code: "D64", name: "Thiếu máu khác", keywords: ["thieu mau khac"] },
  { code: "D69", name: "Xuất huyết / rối loạn cầm máu", keywords: ["xuat huyet", "giam tieu cau"] },

  // === BỔ SUNG: Ung bướu (mã chẩn đoán phổ biến) ===
  { code: "C16", name: "U ác dạ dày", keywords: ["ung thu da day"] },
  { code: "C18", name: "U ác đại tràng", keywords: ["ung thu dai trang"] },
  { code: "C22", name: "U ác gan", keywords: ["ung thu gan"] },
  { code: "C34", name: "U ác phế quản & phổi", keywords: ["ung thu phoi"] },
  { code: "C50", name: "U ác vú", keywords: ["ung thu vu"] },
  { code: "C53", name: "U ác cổ tử cung", keywords: ["ung thu co tc"] },
  { code: "C61", name: "U ác tuyến tiền liệt", keywords: ["ung thu tien liet"] },
  { code: "C73", name: "U ác tuyến giáp", keywords: ["ung thu giap"] },

  // === BỔ SUNG: Truyền nhiễm ===
  { code: "A41", name: "Nhiễm khuẩn huyết", keywords: ["nhiem khuan huyet", "sepsis"] },
  { code: "A90", name: "Sốt xuất huyết Dengue", keywords: ["sxh", "sot xuat huyet", "dengue"] },
  { code: "B20", name: "HIV", keywords: ["hiv"] },
  { code: "B16", name: "Viêm gan virus B cấp", keywords: ["viem gan b cap"] },

  // === BỔ SUNG: Chấn thương – Phục hồi ===
  { code: "S06", name: "Chấn thương sọ não", keywords: ["ctsn"] },
  { code: "S22", name: "Gãy xương sườn / cột sống ngực", keywords: ["gay suon"] },
  { code: "S32", name: "Gãy thắt lưng / khung chậu", keywords: ["gay khung chau"] },
  { code: "S42", name: "Gãy vai – cánh tay", keywords: ["gay xuong canh tay"] },
  { code: "S52", name: "Gãy xương cẳng tay", keywords: ["gay cang tay"] },
  { code: "S72", name: "Gãy xương đùi", keywords: ["gay xuong dui"] },
  { code: "S82", name: "Gãy xương cẳng chân", keywords: ["gay cang chan"] },
  { code: "T78.4", name: "Phản vệ / dị ứng không đặc hiệu", keywords: ["phan ve", "soc phan ve"] },
  { code: "Z51", name: "Chăm sóc y tế khác (PHCN, hoá trị…)", keywords: ["phuc hoi chuc nang", "phcn"] },
];

// ------------------------------------------------------------
// THUỐC TÂN DƯỢC – DB tóm tắt
// maxDailyMg: liều TỐI ĐA / 24h người lớn (cảnh báo khi vượt)
// ------------------------------------------------------------
export type DrugItem = {
  key: string;            // chuẩn hoá (không dấu, in thường)
  name: string;           // hoạt chất
  brand?: string;         // biệt dược phổ biến
  group: string;          // nhóm dược lý
  unit: string;           // đơn vị gợi ý (mg, IU, viên…)
  defaultDose: string;    // liều dùng mặc định gợi ý
  maxDailyMg?: number;    // tổng mg/24h tối đa (người lớn)
  warn?: string;          // cảnh báo chung
  indication?: string;    // chỉ định chính
  contraindication?: string; // chống chỉ định
  sideEffects?: string;   // tác dụng phụ thường gặp
  pregnancy?: string;     // thai kỳ / cho con bú (A/B/C/D/X)
};

export const DRUGS: DrugItem[] = [
  // Giảm đau – Hạ sốt – NSAIDs
  { key: "paracetamol", name: "Paracetamol", brand: "Panadol/Efferalgan", group: "Hạ sốt – Giảm đau", unit: "mg", defaultDose: "500mg × 3–4 lần/ngày", maxDailyMg: 4000, warn: "Suy gan: ≤2g/ngày. Tránh rượu." },
  { key: "ibuprofen", name: "Ibuprofen", brand: "Brufen", group: "NSAID", unit: "mg", defaultDose: "400mg × 3 lần/ngày sau ăn", maxDailyMg: 2400, warn: "Loét DD, suy thận, hen, thai 3 tháng cuối." },
  { key: "diclofenac", name: "Diclofenac", brand: "Voltaren", group: "NSAID", unit: "mg", defaultDose: "50mg × 2–3 lần/ngày", maxDailyMg: 150 },
  { key: "meloxicam", name: "Meloxicam", brand: "Mobic", group: "NSAID", unit: "mg", defaultDose: "7.5–15mg × 1 lần/ngày", maxDailyMg: 15 },
  { key: "celecoxib", name: "Celecoxib", brand: "Celebrex", group: "NSAID COX-2", unit: "mg", defaultDose: "200mg × 1–2 lần/ngày", maxDailyMg: 400 },
  { key: "aspirin", name: "Aspirin", brand: "Aspégic", group: "NSAID/Chống KTTC", unit: "mg", defaultDose: "81mg × 1 lần/ngày", maxDailyMg: 4000, warn: "Tránh trẻ <16t (HC Reye). Loét DD." },
  { key: "tramadol", name: "Tramadol", group: "Opioid yếu", unit: "mg", defaultDose: "50–100mg × 2–4 lần/ngày", maxDailyMg: 400 },

  // Kháng sinh
  { key: "amoxicillin", name: "Amoxicillin", group: "β-lactam", unit: "mg", defaultDose: "500mg × 3 lần/ngày × 7 ngày", maxDailyMg: 3000 },
  { key: "amoxicillin-clavulanic", name: "Amoxicillin + Acid clavulanic", brand: "Augmentin", group: "β-lactam + ức chế β-lactamase", unit: "mg", defaultDose: "625mg × 3 lần/ngày × 7 ngày", maxDailyMg: 2625 },
  { key: "cefuroxim", name: "Cefuroxim", group: "Cephalosporin 2", unit: "mg", defaultDose: "500mg × 2 lần/ngày × 7 ngày", maxDailyMg: 1000 },
  { key: "cefixim", name: "Cefixim", group: "Cephalosporin 3", unit: "mg", defaultDose: "200mg × 2 lần/ngày × 7 ngày", maxDailyMg: 400 },
  { key: "azithromycin", name: "Azithromycin", group: "Macrolid", unit: "mg", defaultDose: "500mg × 1 lần/ngày × 3–5 ngày", maxDailyMg: 500 },
  { key: "clarithromycin", name: "Clarithromycin", group: "Macrolid", unit: "mg", defaultDose: "500mg × 2 lần/ngày × 7 ngày", maxDailyMg: 1000 },
  { key: "ciprofloxacin", name: "Ciprofloxacin", group: "Quinolon", unit: "mg", defaultDose: "500mg × 2 lần/ngày × 7 ngày", maxDailyMg: 1500, warn: "Tránh trẻ em, thai phụ. Đứt gân Achilles." },
  { key: "levofloxacin", name: "Levofloxacin", group: "Quinolon", unit: "mg", defaultDose: "500mg × 1 lần/ngày × 7 ngày", maxDailyMg: 750 },
  { key: "metronidazol", name: "Metronidazol", group: "Nitroimidazol", unit: "mg", defaultDose: "500mg × 3 lần/ngày × 7 ngày", maxDailyMg: 4000, warn: "Tránh rượu (HC disulfiram)." },
  { key: "doxycyclin", name: "Doxycyclin", group: "Tetracyclin", unit: "mg", defaultDose: "100mg × 2 lần/ngày × 7 ngày", maxDailyMg: 200 },

  // Tim mạch – HA
  { key: "amlodipin", name: "Amlodipin", brand: "Norvasc", group: "Chẹn Ca", unit: "mg", defaultDose: "5mg × 1 lần/sáng", maxDailyMg: 10 },
  { key: "nifedipin", name: "Nifedipin", group: "Chẹn Ca", unit: "mg", defaultDose: "20mg × 2 lần/ngày", maxDailyMg: 120 },
  { key: "enalapril", name: "Enalapril", group: "ƯCMC", unit: "mg", defaultDose: "10mg × 1–2 lần/ngày", maxDailyMg: 40, warn: "Thai phụ chống chỉ định." },
  { key: "lisinopril", name: "Lisinopril", group: "ƯCMC", unit: "mg", defaultDose: "10mg × 1 lần/ngày", maxDailyMg: 80 },
  { key: "losartan", name: "Losartan", group: "ARB", unit: "mg", defaultDose: "50mg × 1 lần/ngày", maxDailyMg: 100, warn: "Thai phụ chống chỉ định." },
  { key: "telmisartan", name: "Telmisartan", group: "ARB", unit: "mg", defaultDose: "40mg × 1 lần/ngày", maxDailyMg: 80 },
  { key: "bisoprolol", name: "Bisoprolol", group: "Chẹn β", unit: "mg", defaultDose: "2.5–5mg × 1 lần/sáng", maxDailyMg: 10, warn: "Hen, COPD, AV block." },
  { key: "metoprolol", name: "Metoprolol", group: "Chẹn β", unit: "mg", defaultDose: "50mg × 2 lần/ngày", maxDailyMg: 400 },
  { key: "furosemid", name: "Furosemid", brand: "Lasix", group: "Lợi tiểu quai", unit: "mg", defaultDose: "40mg × 1 lần/sáng", maxDailyMg: 600 },
  { key: "spironolacton", name: "Spironolacton", group: "Lợi tiểu giữ K", unit: "mg", defaultDose: "25mg × 1 lần/ngày", maxDailyMg: 400, warn: "Theo dõi Kali máu." },
  { key: "atorvastatin", name: "Atorvastatin", group: "Statin", unit: "mg", defaultDose: "20mg × 1 lần/tối", maxDailyMg: 80, warn: "Theo dõi men gan, CK." },
  { key: "rosuvastatin", name: "Rosuvastatin", group: "Statin", unit: "mg", defaultDose: "10mg × 1 lần/tối", maxDailyMg: 40 },
  { key: "clopidogrel", name: "Clopidogrel", brand: "Plavix", group: "Chống KTTC", unit: "mg", defaultDose: "75mg × 1 lần/ngày", maxDailyMg: 75, warn: "Nguy cơ chảy máu." },
  { key: "warfarin", name: "Warfarin", group: "Chống đông VitK", unit: "mg", defaultDose: "Liều theo INR (2–3)", maxDailyMg: 10, warn: "Theo dõi INR. Nhiều tương tác." },
  { key: "rivaroxaban", name: "Rivaroxaban", brand: "Xarelto", group: "DOAC", unit: "mg", defaultDose: "20mg × 1 lần/ngày", maxDailyMg: 20 },

  // Tiêu hoá
  { key: "omeprazol", name: "Omeprazol", group: "PPI", unit: "mg", defaultDose: "20mg × 1 lần/sáng trước ăn", maxDailyMg: 40 },
  { key: "esomeprazol", name: "Esomeprazol", brand: "Nexium", group: "PPI", unit: "mg", defaultDose: "40mg × 1 lần/sáng", maxDailyMg: 40 },
  { key: "pantoprazol", name: "Pantoprazol", group: "PPI", unit: "mg", defaultDose: "40mg × 1 lần/sáng", maxDailyMg: 80 },
  { key: "domperidon", name: "Domperidon", brand: "Motilium-M", group: "Chống nôn", unit: "mg", defaultDose: "10mg × 3 lần/ngày trước ăn", maxDailyMg: 30 },
  { key: "loperamid", name: "Loperamid", group: "Chống tiêu chảy", unit: "mg", defaultDose: "2mg × 2–3 lần/ngày", maxDailyMg: 16 },

  // Nội tiết – ĐTĐ
  { key: "metformin", name: "Metformin", brand: "Glucophage", group: "Biguanid", unit: "mg", defaultDose: "850mg × 2 lần/ngày sau ăn", maxDailyMg: 2550, warn: "Ngưng khi GFR <30 hoặc cản quang." },
  { key: "gliclazid", name: "Gliclazid", brand: "Diamicron", group: "Sulfonylurea", unit: "mg", defaultDose: "30–60mg × 1 lần/sáng", maxDailyMg: 120 },
  { key: "empagliflozin", name: "Empagliflozin", brand: "Jardiance", group: "SGLT2i", unit: "mg", defaultDose: "10mg × 1 lần/sáng", maxDailyMg: 25 },
  { key: "levothyroxin", name: "Levothyroxin", group: "Hormone giáp", unit: "mcg", defaultDose: "50–100mcg × 1 lần/sáng đói", maxDailyMg: 0.3 },

  // Hô hấp – Dị ứng
  { key: "salbutamol", name: "Salbutamol", brand: "Ventolin", group: "β2 SABA", unit: "mcg", defaultDose: "100mcg × 2 nhát khi khó thở", maxDailyMg: 1.6 },
  { key: "budesonid", name: "Budesonid", group: "ICS", unit: "mcg", defaultDose: "200mcg × 2 lần/ngày", maxDailyMg: 1.6 },
  { key: "loratadin", name: "Loratadin", group: "Kháng H1 thế hệ 2", unit: "mg", defaultDose: "10mg × 1 lần/ngày", maxDailyMg: 10 },
  { key: "cetirizin", name: "Cetirizin", group: "Kháng H1 thế hệ 2", unit: "mg", defaultDose: "10mg × 1 lần/tối", maxDailyMg: 10 },
  { key: "prednisolon", name: "Prednisolon", group: "Corticoid", unit: "mg", defaultDose: "5–60mg/ngày tuỳ chỉ định", maxDailyMg: 80, warn: "Giảm liều từ từ. Loãng xương, tăng đường, loét DD." },

  // Thần kinh – Tâm thần
  { key: "diazepam", name: "Diazepam", group: "Benzodiazepin", unit: "mg", defaultDose: "5mg × 1–2 lần/ngày", maxDailyMg: 40, warn: "Nguy cơ lệ thuộc. Người già: giảm liều." },
  { key: "amitriptylin", name: "Amitriptylin", group: "TCA", unit: "mg", defaultDose: "25mg × 1 lần/tối", maxDailyMg: 150, warn: "Khô miệng, bí tiểu, an thần." },
  { key: "sertralin", name: "Sertralin", group: "SSRI", unit: "mg", defaultDose: "50mg × 1 lần/sáng", maxDailyMg: 200 },
  { key: "gabapentin", name: "Gabapentin", group: "Chống động kinh – đau TK", unit: "mg", defaultDose: "300mg × 3 lần/ngày", maxDailyMg: 3600 },

  // ========== GIẢM ĐAU – HẠ SỐT – NSAID (bổ sung) ==========
  { key: "naproxen", name: "Naproxen", group: "NSAID", unit: "mg", defaultDose: "250–500mg × 2 lần/ngày", maxDailyMg: 1000, indication: "Viêm khớp, đau cơ xương, đau bụng kinh", contraindication: "Loét DD, suy thận nặng, thai 3 tháng cuối", sideEffects: "Đau thượng vị, buồn nôn, phù", pregnancy: "C (D ở 3 tháng cuối)" },
  { key: "etoricoxib", name: "Etoricoxib", brand: "Arcoxia", group: "NSAID COX-2", unit: "mg", defaultDose: "60–90mg × 1 lần/ngày", maxDailyMg: 120, indication: "Thoái hoá khớp, viêm khớp dạng thấp, gout cấp", contraindication: "Bệnh tim mạch nặng, THA không kiểm soát", sideEffects: "Phù, THA, đau đầu", pregnancy: "C" },
  { key: "piroxicam", name: "Piroxicam", group: "NSAID", unit: "mg", defaultDose: "20mg × 1 lần/ngày", maxDailyMg: 20, indication: "Viêm khớp dạng thấp, thoái hoá khớp", sideEffects: "Loét DD, dị ứng da nặng" },
  { key: "ketorolac", name: "Ketorolac", group: "NSAID tiêm", unit: "mg", defaultDose: "30mg IM/IV × 3–4 lần/ngày, tối đa 5 ngày", maxDailyMg: 120, warn: "Không dùng >5 ngày, độc thận." },
  { key: "morphin", name: "Morphin", group: "Opioid mạnh", unit: "mg", defaultDose: "10mg SC/IV mỗi 4h", maxDailyMg: 60, warn: "Ức chế hô hấp, gây nghiện. Có Naloxone sẵn." },
  { key: "fentanyl", name: "Fentanyl", group: "Opioid mạnh", unit: "mcg", defaultDose: "25–100mcg/giờ (miếng dán)", warn: "Ức chế hô hấp. Chỉ định đau mạn ổn định." },
  { key: "codein", name: "Codein", group: "Opioid yếu", unit: "mg", defaultDose: "30mg × 4 lần/ngày", maxDailyMg: 240, warn: "Không dùng cho trẻ <12t." },
  { key: "nefopam", name: "Nefopam", brand: "Acupan", group: "Giảm đau không opioid", unit: "mg", defaultDose: "20mg IM × 3 lần/ngày", maxDailyMg: 120 },
  { key: "floctafenin", name: "Floctafenin", brand: "Idarac", group: "Giảm đau", unit: "mg", defaultDose: "200mg × 3 lần/ngày", maxDailyMg: 1200 },
  { key: "colchicin", name: "Colchicin", group: "Trị gout", unit: "mg", defaultDose: "0.5mg × 2–3 lần/ngày", maxDailyMg: 2, warn: "Độc tuỷ, tiêu chảy. Giảm liều suy gan/thận." },
  { key: "allopurinol", name: "Allopurinol", group: "Giảm acid uric", unit: "mg", defaultDose: "100–300mg × 1 lần/ngày", maxDailyMg: 800, warn: "HC Stevens-Johnson (HLA-B*5801)." },
  { key: "febuxostat", name: "Febuxostat", group: "Giảm acid uric", unit: "mg", defaultDose: "40–80mg × 1 lần/ngày", maxDailyMg: 120 },

  // ========== KHÁNG SINH (bổ sung) ==========
  { key: "penicillin-v", name: "Penicillin V", group: "Penicillin", unit: "mg", defaultDose: "500mg × 4 lần/ngày", maxDailyMg: 2000, indication: "Viêm họng liên cầu, dự phòng thấp tim" },
  { key: "ampicillin", name: "Ampicillin", group: "Aminopenicillin", unit: "mg", defaultDose: "500mg × 4 lần/ngày", maxDailyMg: 4000 },
  { key: "cloxacillin", name: "Cloxacillin", group: "Penicillin kháng penicillinase", unit: "mg", defaultDose: "500mg × 4 lần/ngày", maxDailyMg: 4000, indication: "Nhiễm tụ cầu vàng" },
  { key: "cefalexin", name: "Cefalexin", brand: "Keflex", group: "Cephalosporin 1", unit: "mg", defaultDose: "500mg × 4 lần/ngày", maxDailyMg: 4000 },
  { key: "cefaclor", name: "Cefaclor", group: "Cephalosporin 2", unit: "mg", defaultDose: "250–500mg × 3 lần/ngày", maxDailyMg: 1500 },
  { key: "ceftriaxon", name: "Ceftriaxon", group: "Cephalosporin 3 (tiêm)", unit: "g", defaultDose: "1–2g IV/IM × 1 lần/ngày", maxDailyMg: 4000 },
  { key: "cefotaxim", name: "Cefotaxim", group: "Cephalosporin 3 (tiêm)", unit: "g", defaultDose: "1–2g IV × 3 lần/ngày", maxDailyMg: 12000 },
  { key: "ceftazidim", name: "Ceftazidim", group: "Cephalosporin 3 (tiêm)", unit: "g", defaultDose: "1–2g IV × 3 lần/ngày", maxDailyMg: 6000, indication: "Nhiễm Pseudomonas" },
  { key: "cefepim", name: "Cefepim", group: "Cephalosporin 4", unit: "g", defaultDose: "1–2g IV × 2–3 lần/ngày", maxDailyMg: 6000 },
  { key: "meropenem", name: "Meropenem", group: "Carbapenem", unit: "g", defaultDose: "1g IV × 3 lần/ngày", maxDailyMg: 6000, indication: "Nhiễm khuẩn nặng đa kháng" },
  { key: "imipenem", name: "Imipenem + Cilastatin", group: "Carbapenem", unit: "g", defaultDose: "500mg IV × 4 lần/ngày", maxDailyMg: 4000 },
  { key: "vancomycin", name: "Vancomycin", group: "Glycopeptid", unit: "g", defaultDose: "15–20mg/kg IV × 2–3 lần/ngày", warn: "Theo dõi nồng độ đáy, độc thận, tai." },
  { key: "linezolid", name: "Linezolid", group: "Oxazolidinon", unit: "mg", defaultDose: "600mg × 2 lần/ngày", maxDailyMg: 1200, indication: "MRSA, VRE", warn: "Giảm tiểu cầu nếu dùng >2 tuần." },
  { key: "clindamycin", name: "Clindamycin", brand: "Dalacin", group: "Lincosamid", unit: "mg", defaultDose: "300mg × 4 lần/ngày", maxDailyMg: 1800, warn: "Viêm đại tràng giả mạc (C. difficile)." },
  { key: "erythromycin", name: "Erythromycin", group: "Macrolid", unit: "mg", defaultDose: "500mg × 4 lần/ngày", maxDailyMg: 4000 },
  { key: "moxifloxacin", name: "Moxifloxacin", group: "Quinolon", unit: "mg", defaultDose: "400mg × 1 lần/ngày", maxDailyMg: 400, warn: "QT kéo dài. Tránh thai phụ, trẻ em." },
  { key: "ofloxacin", name: "Ofloxacin", group: "Quinolon", unit: "mg", defaultDose: "400mg × 2 lần/ngày", maxDailyMg: 800 },
  { key: "tinidazol", name: "Tinidazol", group: "Nitroimidazol", unit: "mg", defaultDose: "2g × 1 lần/ngày × 3 ngày", maxDailyMg: 2000 },
  { key: "rifampicin", name: "Rifampicin", group: "Kháng lao", unit: "mg", defaultDose: "10mg/kg × 1 lần/sáng đói", maxDailyMg: 600, warn: "Nước tiểu đỏ, cảm ứng CYP450 mạnh." },
  { key: "isoniazid", name: "Isoniazid (INH)", group: "Kháng lao", unit: "mg", defaultDose: "5mg/kg × 1 lần/ngày", maxDailyMg: 300, warn: "Viêm gan, viêm TK ngoại biên (bổ sung B6)." },
  { key: "ethambutol", name: "Ethambutol", group: "Kháng lao", unit: "mg", defaultDose: "15mg/kg × 1 lần/ngày", warn: "Viêm TK thị giác." },
  { key: "pyrazinamid", name: "Pyrazinamid", group: "Kháng lao", unit: "mg", defaultDose: "25mg/kg × 1 lần/ngày", warn: "Viêm gan, tăng acid uric." },
  { key: "fluconazol", name: "Fluconazol", brand: "Diflucan", group: "Kháng nấm azol", unit: "mg", defaultDose: "150mg liều duy nhất (nấm âm đạo)", maxDailyMg: 400 },
  { key: "itraconazol", name: "Itraconazol", group: "Kháng nấm azol", unit: "mg", defaultDose: "100–200mg × 1 lần/ngày", maxDailyMg: 400 },
  { key: "ketoconazol", name: "Ketoconazol", group: "Kháng nấm", unit: "mg", defaultDose: "200mg × 1 lần/ngày", warn: "Độc gan – hạn chế đường uống." },
  { key: "terbinafin", name: "Terbinafin", brand: "Lamisil", group: "Kháng nấm allylamin", unit: "mg", defaultDose: "250mg × 1 lần/ngày × 6–12 tuần", maxDailyMg: 250 },
  { key: "nystatin", name: "Nystatin", group: "Kháng nấm polyene", unit: "IU", defaultDose: "500.000 IU × 4 lần/ngày", indication: "Nấm Candida miệng/ruột" },
  { key: "acyclovir", name: "Acyclovir", group: "Kháng virus", unit: "mg", defaultDose: "400mg × 5 lần/ngày × 7–10 ngày", maxDailyMg: 4000, indication: "Herpes, zona" },
  { key: "valacyclovir", name: "Valacyclovir", group: "Kháng virus", unit: "mg", defaultDose: "1g × 3 lần/ngày × 7 ngày (zona)", maxDailyMg: 3000 },
  { key: "oseltamivir", name: "Oseltamivir", brand: "Tamiflu", group: "Kháng virus cúm", unit: "mg", defaultDose: "75mg × 2 lần/ngày × 5 ngày", maxDailyMg: 150 },
  { key: "albendazol", name: "Albendazol", group: "Trị giun sán", unit: "mg", defaultDose: "400mg liều duy nhất", maxDailyMg: 800 },
  { key: "mebendazol", name: "Mebendazol", brand: "Fugacar", group: "Trị giun", unit: "mg", defaultDose: "500mg liều duy nhất", maxDailyMg: 500 },
  { key: "ivermectin", name: "Ivermectin", group: "Trị KST", unit: "mg", defaultDose: "200mcg/kg liều duy nhất", indication: "Ghẻ, giun lươn" },
  { key: "chloroquin", name: "Chloroquin", group: "Trị sốt rét", unit: "mg", defaultDose: "Theo phác đồ sốt rét", warn: "Bệnh võng mạc khi dùng kéo dài." },

  // ========== TIM MẠCH – HUYẾT ÁP (bổ sung) ==========
  { key: "perindopril", name: "Perindopril", brand: "Coversyl", group: "ƯCMC", unit: "mg", defaultDose: "5–10mg × 1 lần/sáng", maxDailyMg: 10, contraindication: "Thai kỳ, hẹp ĐM thận 2 bên", sideEffects: "Ho khan, tăng K, hạ HA", pregnancy: "D" },
  { key: "ramipril", name: "Ramipril", group: "ƯCMC", unit: "mg", defaultDose: "2.5–10mg × 1 lần/ngày", maxDailyMg: 10 },
  { key: "captopril", name: "Captopril", group: "ƯCMC", unit: "mg", defaultDose: "25mg × 2–3 lần/ngày", maxDailyMg: 150 },
  { key: "valsartan", name: "Valsartan", brand: "Diovan", group: "ARB", unit: "mg", defaultDose: "80–160mg × 1 lần/ngày", maxDailyMg: 320 },
  { key: "irbesartan", name: "Irbesartan", group: "ARB", unit: "mg", defaultDose: "150–300mg × 1 lần/ngày", maxDailyMg: 300 },
  { key: "candesartan", name: "Candesartan", group: "ARB", unit: "mg", defaultDose: "8–16mg × 1 lần/ngày", maxDailyMg: 32 },
  { key: "olmesartan", name: "Olmesartan", group: "ARB", unit: "mg", defaultDose: "20–40mg × 1 lần/ngày", maxDailyMg: 40 },
  { key: "felodipin", name: "Felodipin", group: "Chẹn Ca", unit: "mg", defaultDose: "5–10mg × 1 lần/ngày", maxDailyMg: 10 },
  { key: "lercanidipin", name: "Lercanidipin", group: "Chẹn Ca", unit: "mg", defaultDose: "10–20mg × 1 lần/ngày", maxDailyMg: 20 },
  { key: "diltiazem", name: "Diltiazem", group: "Chẹn Ca non-DHP", unit: "mg", defaultDose: "60mg × 3 lần/ngày", maxDailyMg: 360, warn: "AV block, suy tim." },
  { key: "verapamil", name: "Verapamil", group: "Chẹn Ca non-DHP", unit: "mg", defaultDose: "80mg × 3 lần/ngày", maxDailyMg: 480, warn: "Không phối hợp chẹn β IV." },
  { key: "atenolol", name: "Atenolol", group: "Chẹn β1", unit: "mg", defaultDose: "50–100mg × 1 lần/sáng", maxDailyMg: 100 },
  { key: "carvedilol", name: "Carvedilol", group: "Chẹn α-β", unit: "mg", defaultDose: "3.125–25mg × 2 lần/ngày", maxDailyMg: 50, indication: "Suy tim mạn (titrate từ liều thấp)" },
  { key: "nebivolol", name: "Nebivolol", group: "Chẹn β1 chọn lọc", unit: "mg", defaultDose: "5mg × 1 lần/sáng", maxDailyMg: 10 },
  { key: "hydrochlorothiazid", name: "Hydrochlorothiazid (HCTZ)", group: "Lợi tiểu thiazid", unit: "mg", defaultDose: "12.5–25mg × 1 lần/sáng", maxDailyMg: 50, warn: "Hạ K, tăng acid uric, tăng đường." },
  { key: "indapamid", name: "Indapamid", brand: "Natrilix", group: "Lợi tiểu giống thiazid", unit: "mg", defaultDose: "1.5mg SR × 1 lần/sáng", maxDailyMg: 2.5 },
  { key: "torasemid", name: "Torasemid", group: "Lợi tiểu quai", unit: "mg", defaultDose: "5–20mg × 1 lần/sáng", maxDailyMg: 200 },
  { key: "eplerenon", name: "Eplerenon", group: "Đối kháng aldosteron", unit: "mg", defaultDose: "25–50mg × 1 lần/ngày", maxDailyMg: 50 },
  { key: "ivabradin", name: "Ivabradin", brand: "Procoralan", group: "Ức chế kênh If", unit: "mg", defaultDose: "5mg × 2 lần/ngày", maxDailyMg: 15, indication: "Suy tim, đau thắt ngực ổn định" },
  { key: "trimetazidin", name: "Trimetazidin", brand: "Vastarel", group: "Chống thiếu máu cơ tim chuyển hoá", unit: "mg", defaultDose: "20mg × 3 lần/ngày", maxDailyMg: 60 },
  { key: "nitroglycerin", name: "Nitroglycerin", brand: "Nitromint", group: "Nitrat", unit: "mg", defaultDose: "0.5mg ngậm dưới lưỡi khi đau ngực", warn: "Hạ HA tư thế. Không phối Sildenafil." },
  { key: "isosorbid", name: "Isosorbid mononitrat", brand: "Imdur", group: "Nitrat", unit: "mg", defaultDose: "30–60mg × 1 lần/sáng", maxDailyMg: 240 },
  { key: "digoxin", name: "Digoxin", group: "Glycosid trợ tim", unit: "mg", defaultDose: "0.125–0.25mg × 1 lần/ngày", warn: "Khoảng điều trị hẹp – theo dõi nồng độ." },
  { key: "amiodaron", name: "Amiodaron", brand: "Cordarone", group: "Chống loạn nhịp", unit: "mg", defaultDose: "200mg × 1–3 lần/ngày", warn: "Độc giáp, gan, phổi, lắng giác mạc." },
  { key: "propafenon", name: "Propafenon", group: "Chống loạn nhịp IC", unit: "mg", defaultDose: "150mg × 3 lần/ngày", maxDailyMg: 900 },
  { key: "sotalol", name: "Sotalol", group: "Chống loạn nhịp III", unit: "mg", defaultDose: "80mg × 2 lần/ngày", warn: "QT kéo dài." },
  { key: "simvastatin", name: "Simvastatin", group: "Statin", unit: "mg", defaultDose: "20–40mg × 1 lần/tối", maxDailyMg: 80, warn: "Tránh phối Amiodaron, Diltiazem liều cao." },
  { key: "fenofibrat", name: "Fenofibrat", brand: "Lipanthyl", group: "Fibrat", unit: "mg", defaultDose: "145mg × 1 lần/ngày", maxDailyMg: 200, indication: "Tăng triglycerid" },
  { key: "ezetimib", name: "Ezetimib", group: "Ức chế hấp thu cholesterol", unit: "mg", defaultDose: "10mg × 1 lần/ngày", maxDailyMg: 10 },
  { key: "dabigatran", name: "Dabigatran", brand: "Pradaxa", group: "DOAC", unit: "mg", defaultDose: "150mg × 2 lần/ngày", maxDailyMg: 300 },
  { key: "apixaban", name: "Apixaban", brand: "Eliquis", group: "DOAC", unit: "mg", defaultDose: "5mg × 2 lần/ngày", maxDailyMg: 10 },
  { key: "enoxaparin", name: "Enoxaparin", brand: "Lovenox", group: "Heparin TLPT thấp", unit: "mg", defaultDose: "1mg/kg SC × 2 lần/ngày", warn: "Giảm liều suy thận GFR<30." },
  { key: "ticagrelor", name: "Ticagrelor", brand: "Brilinta", group: "Chống KTTC P2Y12", unit: "mg", defaultDose: "90mg × 2 lần/ngày", maxDailyMg: 180 },

  // ========== TIÊU HOÁ – GAN MẬT (bổ sung) ==========
  { key: "rabeprazol", name: "Rabeprazol", group: "PPI", unit: "mg", defaultDose: "20mg × 1 lần/sáng", maxDailyMg: 40 },
  { key: "lansoprazol", name: "Lansoprazol", group: "PPI", unit: "mg", defaultDose: "30mg × 1 lần/sáng", maxDailyMg: 60 },
  { key: "ranitidin", name: "Ranitidin", group: "Kháng H2", unit: "mg", defaultDose: "150mg × 2 lần/ngày", maxDailyMg: 600 },
  { key: "famotidin", name: "Famotidin", group: "Kháng H2", unit: "mg", defaultDose: "20–40mg × 2 lần/ngày", maxDailyMg: 80 },
  { key: "sucralfat", name: "Sucralfat", group: "Bảo vệ niêm mạc DD", unit: "g", defaultDose: "1g × 4 lần/ngày trước ăn", maxDailyMg: 4000 },
  { key: "bismuth", name: "Bismuth subcitrat", group: "Bảo vệ niêm mạc DD", unit: "mg", defaultDose: "120mg × 4 lần/ngày", indication: "Phác đồ tiệt trừ HP" },
  { key: "metoclopramid", name: "Metoclopramid", group: "Chống nôn – tăng nhu động", unit: "mg", defaultDose: "10mg × 3 lần/ngày trước ăn", maxDailyMg: 30, warn: "Triệu chứng ngoại tháp." },
  { key: "ondansetron", name: "Ondansetron", group: "Kháng 5HT3", unit: "mg", defaultDose: "8mg × 2 lần/ngày", maxDailyMg: 24, indication: "Nôn do hoá trị, sau mổ", warn: "QT kéo dài." },
  { key: "simethicon", name: "Simethicon", group: "Chống đầy hơi", unit: "mg", defaultDose: "80mg × 3 lần/ngày sau ăn", maxDailyMg: 500 },
  { key: "drotaverin", name: "Drotaverin", brand: "No-Spa", group: "Chống co thắt", unit: "mg", defaultDose: "40–80mg × 3 lần/ngày", maxDailyMg: 240 },
  { key: "hyoscin", name: "Hyoscin butylbromid", brand: "Buscopan", group: "Kháng cholin chống co thắt", unit: "mg", defaultDose: "10mg × 3–5 lần/ngày", maxDailyMg: 100 },
  { key: "mebeverin", name: "Mebeverin", brand: "Duspatalin", group: "Chống co thắt ruột", unit: "mg", defaultDose: "135mg × 3 lần/ngày trước ăn", maxDailyMg: 405 },
  { key: "smectit", name: "Diosmectit", brand: "Smecta", group: "Hấp phụ tiêu chảy", unit: "g", defaultDose: "3g × 3 lần/ngày", maxDailyMg: 9000 },
  { key: "racecadotril", name: "Racecadotril", brand: "Hidrasec", group: "Chống tiêu chảy", unit: "mg", defaultDose: "100mg × 3 lần/ngày", maxDailyMg: 300 },
  { key: "lactulose", name: "Lactulose", brand: "Duphalac", group: "Nhuận tràng thẩm thấu", unit: "ml", defaultDose: "15–30ml × 1–2 lần/ngày", indication: "Táo bón, bệnh não gan" },
  { key: "bisacodyl", name: "Bisacodyl", brand: "Dulcolax", group: "Nhuận tràng kích thích", unit: "mg", defaultDose: "5–10mg uống tối", maxDailyMg: 30 },
  { key: "polyethylenglycol", name: "Macrogol (PEG)", brand: "Forlax", group: "Nhuận tràng thẩm thấu", unit: "g", defaultDose: "10g × 1–2 gói/ngày", maxDailyMg: 20000 },
  { key: "ursodeoxycholic", name: "Acid ursodeoxycholic", brand: "Ursolvan", group: "Bảo vệ gan – tan sỏi mật", unit: "mg", defaultDose: "10mg/kg/ngày chia 2–3 lần", maxDailyMg: 1500 },
  { key: "silymarin", name: "Silymarin", brand: "Legalon", group: "Bảo vệ tế bào gan", unit: "mg", defaultDose: "140mg × 3 lần/ngày", maxDailyMg: 420 },
  { key: "rifaximin", name: "Rifaximin", brand: "Normix", group: "Kháng sinh đường ruột", unit: "mg", defaultDose: "200mg × 3 lần/ngày", maxDailyMg: 1200, indication: "Tiêu chảy NK, bệnh não gan" },
  { key: "loperamid-simethicon", name: "Loperamid + Simethicon", group: "Chống tiêu chảy phối hợp", unit: "mg", defaultDose: "2 viên × tối đa 4 lần/ngày" },
  { key: "saccharomyces", name: "Saccharomyces boulardii", brand: "Ultra-Levure/Enterogermina", group: "Men vi sinh", unit: "tỷ", defaultDose: "1–2 gói × 2 lần/ngày" },

  // ========== NỘI TIẾT – ĐÁI THÁO ĐƯỜNG (bổ sung) ==========
  { key: "glimepirid", name: "Glimepirid", brand: "Amaryl", group: "Sulfonylurea", unit: "mg", defaultDose: "1–4mg × 1 lần/sáng", maxDailyMg: 8, warn: "Hạ đường huyết, đặc biệt người già." },
  { key: "glibenclamid", name: "Glibenclamid", group: "Sulfonylurea", unit: "mg", defaultDose: "2.5–5mg × 1–2 lần/ngày", maxDailyMg: 20 },
  { key: "sitagliptin", name: "Sitagliptin", brand: "Januvia", group: "DPP-4i", unit: "mg", defaultDose: "100mg × 1 lần/ngày", maxDailyMg: 100 },
  { key: "linagliptin", name: "Linagliptin", brand: "Trajenta", group: "DPP-4i", unit: "mg", defaultDose: "5mg × 1 lần/ngày", maxDailyMg: 5 },
  { key: "vildagliptin", name: "Vildagliptin", brand: "Galvus", group: "DPP-4i", unit: "mg", defaultDose: "50mg × 2 lần/ngày", maxDailyMg: 100 },
  { key: "dapagliflozin", name: "Dapagliflozin", brand: "Forxiga", group: "SGLT2i", unit: "mg", defaultDose: "10mg × 1 lần/sáng", maxDailyMg: 10, warn: "Nhiễm khuẩn tiết niệu, DKA." },
  { key: "canagliflozin", name: "Canagliflozin", group: "SGLT2i", unit: "mg", defaultDose: "100–300mg × 1 lần/ngày", maxDailyMg: 300 },
  { key: "liraglutid", name: "Liraglutid", brand: "Victoza", group: "GLP-1 RA", unit: "mg", defaultDose: "0.6→1.8mg SC × 1 lần/ngày", warn: "Buồn nôn, viêm tuỵ." },
  { key: "semaglutid", name: "Semaglutid", brand: "Ozempic", group: "GLP-1 RA", unit: "mg", defaultDose: "0.25→1mg SC × 1 lần/tuần" },
  { key: "insulin-regular", name: "Insulin Regular", brand: "Actrapid", group: "Insulin tác dụng nhanh", unit: "IU", defaultDose: "Theo phác đồ – tiêm trước ăn 30 phút" },
  { key: "insulin-aspart", name: "Insulin Aspart", brand: "NovoRapid", group: "Insulin analog tác dụng nhanh", unit: "IU", defaultDose: "Tiêm ngay trước ăn" },
  { key: "insulin-glargin", name: "Insulin Glargin", brand: "Lantus", group: "Insulin nền", unit: "IU", defaultDose: "1 lần/ngày, cùng giờ" },
  { key: "insulin-mix", name: "Insulin Mixtard 30/70", brand: "Mixtard/NovoMix", group: "Insulin hỗn hợp", unit: "IU", defaultDose: "Tiêm 2 lần/ngày trước bữa sáng – tối" },
  { key: "levothyroxin-na", name: "Levothyroxin Natri", brand: "Berlthyrox", group: "Hormone giáp", unit: "mcg", defaultDose: "1.6mcg/kg × 1 lần/sáng đói" },
  { key: "thiamazol", name: "Thiamazol (Methimazol)", brand: "Thyrozol", group: "Kháng giáp tổng hợp", unit: "mg", defaultDose: "10–30mg/ngày chia 2–3 lần", warn: "Mất bạch cầu hạt, độc gan." },
  { key: "propylthiouracil", name: "PTU", group: "Kháng giáp", unit: "mg", defaultDose: "100mg × 3 lần/ngày", indication: "Cường giáp 3 tháng đầu thai" },
  { key: "calcitriol", name: "Calcitriol", brand: "Rocaltrol", group: "Vitamin D hoạt hoá", unit: "mcg", defaultDose: "0.25–0.5mcg × 1 lần/ngày" },
  { key: "alendronat", name: "Alendronat", brand: "Fosamax", group: "Bisphosphonat", unit: "mg", defaultDose: "70mg × 1 lần/tuần (sáng đói)", warn: "Viêm thực quản – uống nước, đứng 30p." },
  { key: "raloxifen", name: "Raloxifen", group: "SERM", unit: "mg", defaultDose: "60mg × 1 lần/ngày", indication: "Loãng xương sau mãn kinh" },

  // ========== HÔ HẤP – DỊ ỨNG (bổ sung) ==========
  { key: "fexofenadin", name: "Fexofenadin", brand: "Telfast", group: "Kháng H1 thế hệ 2", unit: "mg", defaultDose: "180mg × 1 lần/ngày", maxDailyMg: 180 },
  { key: "desloratadin", name: "Desloratadin", brand: "Aerius", group: "Kháng H1 thế hệ 2", unit: "mg", defaultDose: "5mg × 1 lần/ngày", maxDailyMg: 5 },
  { key: "levocetirizin", name: "Levocetirizin", brand: "Xyzal", group: "Kháng H1 thế hệ 2", unit: "mg", defaultDose: "5mg × 1 lần/tối", maxDailyMg: 5 },
  { key: "chlopheniramin", name: "Chlorpheniramin", group: "Kháng H1 thế hệ 1", unit: "mg", defaultDose: "4mg × 3 lần/ngày", maxDailyMg: 24, warn: "Gây buồn ngủ – không lái xe." },
  { key: "diphenhydramin", name: "Diphenhydramin", group: "Kháng H1 thế hệ 1", unit: "mg", defaultDose: "25–50mg × 3 lần/ngày", maxDailyMg: 300 },
  { key: "montelukast", name: "Montelukast", brand: "Singulair", group: "Kháng leukotrien", unit: "mg", defaultDose: "10mg × 1 lần/tối", maxDailyMg: 10 },
  { key: "fluticason", name: "Fluticason", brand: "Flixotide", group: "ICS xịt", unit: "mcg", defaultDose: "100–500mcg × 2 lần/ngày" },
  { key: "beclomethason", name: "Beclomethason", group: "ICS xịt", unit: "mcg", defaultDose: "100–400mcg × 2 lần/ngày" },
  { key: "formoterol", name: "Formoterol", group: "β2 LABA", unit: "mcg", defaultDose: "12mcg × 2 lần/ngày" },
  { key: "salmeterol", name: "Salmeterol", brand: "Serevent", group: "β2 LABA", unit: "mcg", defaultDose: "50mcg × 2 lần/ngày" },
  { key: "ipratropium", name: "Ipratropium", brand: "Atrovent", group: "Kháng cholin xịt", unit: "mcg", defaultDose: "20–40mcg × 4 lần/ngày" },
  { key: "tiotropium", name: "Tiotropium", brand: "Spiriva", group: "LAMA", unit: "mcg", defaultDose: "18mcg × 1 lần/ngày" },
  { key: "theophyllin", name: "Theophyllin", group: "Methylxanthin", unit: "mg", defaultDose: "200–300mg × 2 lần/ngày", warn: "Khoảng điều trị hẹp." },
  { key: "n-acetylcystein", name: "N-Acetylcystein", brand: "Acemuc", group: "Tiêu nhầy", unit: "mg", defaultDose: "200mg × 3 lần/ngày", maxDailyMg: 600 },
  { key: "ambroxol", name: "Ambroxol", brand: "Mucosolvan", group: "Tiêu nhầy", unit: "mg", defaultDose: "30mg × 3 lần/ngày", maxDailyMg: 120 },
  { key: "bromhexin", name: "Bromhexin", group: "Tiêu nhầy", unit: "mg", defaultDose: "8mg × 3 lần/ngày", maxDailyMg: 48 },
  { key: "carbocystein", name: "Carbocystein", group: "Tiêu nhầy", unit: "mg", defaultDose: "750mg × 3 lần/ngày", maxDailyMg: 2700 },
  { key: "dextromethorphan", name: "Dextromethorphan", group: "Chống ho TKTW", unit: "mg", defaultDose: "15mg × 4 lần/ngày", maxDailyMg: 120 },
  { key: "codein-terpin", name: "Terpin + Codein", group: "Chống ho long đờm", unit: "mg", defaultDose: "1 viên × 3 lần/ngày" },
  { key: "pseudoephedrin", name: "Pseudoephedrin", group: "Co mạch mũi", unit: "mg", defaultDose: "60mg × 4 lần/ngày", maxDailyMg: 240, warn: "Tăng HA, mất ngủ." },
  { key: "xylometazolin", name: "Xylometazolin", brand: "Otrivin", group: "Co mạch mũi xịt", unit: "%", defaultDose: "0.05–0.1% xịt × 2–3 lần/ngày", warn: "Không dùng >7 ngày (nghẹt mũi phản hồi)." },

  // ========== CORTICOID & ỨC CHẾ MD ==========
  { key: "methylprednisolon", name: "Methylprednisolon", brand: "Medrol", group: "Corticoid", unit: "mg", defaultDose: "4–48mg/ngày tuỳ chỉ định", warn: "Giảm liều từ từ. Tăng đường, loét DD." },
  { key: "dexamethason", name: "Dexamethason", group: "Corticoid", unit: "mg", defaultDose: "0.5–10mg/ngày", indication: "Phù não, kháng viêm mạnh" },
  { key: "hydrocortison", name: "Hydrocortison", group: "Corticoid", unit: "mg", defaultDose: "100mg IV mỗi 6–8h (sốc)" },
  { key: "betamethason", name: "Betamethason", group: "Corticoid", unit: "mg", defaultDose: "0.5–8mg/ngày" },
  { key: "azathioprin", name: "Azathioprin", brand: "Imurel", group: "Ức chế MD", unit: "mg", defaultDose: "1–3mg/kg/ngày", warn: "Giảm BC, độc gan." },
  { key: "methotrexat", name: "Methotrexat", group: "Ức chế MD/Kháng folate", unit: "mg", defaultDose: "7.5–25mg × 1 lần/tuần", warn: "Bổ sung Folic. Độc gan, tuỷ, phổi." },
  { key: "cyclosporin", name: "Cyclosporin", group: "Ức chế MD", unit: "mg", defaultDose: "2.5–5mg/kg/ngày chia 2 lần", warn: "Độc thận, THA." },

  // ========== THẦN KINH – TÂM THẦN (bổ sung) ==========
  { key: "alprazolam", name: "Alprazolam", brand: "Xanax", group: "Benzodiazepin", unit: "mg", defaultDose: "0.25–0.5mg × 3 lần/ngày", warn: "Nguy cơ lệ thuộc." },
  { key: "bromazepam", name: "Bromazepam", brand: "Lexomil", group: "Benzodiazepin", unit: "mg", defaultDose: "1.5–3mg × 2–3 lần/ngày" },
  { key: "lorazepam", name: "Lorazepam", group: "Benzodiazepin", unit: "mg", defaultDose: "1–2mg × 2–3 lần/ngày" },
  { key: "midazolam", name: "Midazolam", group: "Benzodiazepin tiêm", unit: "mg", defaultDose: "0.05mg/kg IV tiền mê" },
  { key: "zolpidem", name: "Zolpidem", brand: "Stilnox", group: "Thuốc ngủ", unit: "mg", defaultDose: "10mg uống tối", maxDailyMg: 10 },
  { key: "fluoxetin", name: "Fluoxetin", brand: "Prozac", group: "SSRI", unit: "mg", defaultDose: "20mg × 1 lần/sáng", maxDailyMg: 80 },
  { key: "paroxetin", name: "Paroxetin", group: "SSRI", unit: "mg", defaultDose: "20mg × 1 lần/sáng", maxDailyMg: 50 },
  { key: "escitalopram", name: "Escitalopram", brand: "Lexapro", group: "SSRI", unit: "mg", defaultDose: "10mg × 1 lần/sáng", maxDailyMg: 20 },
  { key: "venlafaxin", name: "Venlafaxin", brand: "Effexor", group: "SNRI", unit: "mg", defaultDose: "75mg × 1 lần/ngày", maxDailyMg: 225 },
  { key: "mirtazapin", name: "Mirtazapin", brand: "Remeron", group: "NaSSA", unit: "mg", defaultDose: "15–30mg uống tối", maxDailyMg: 45 },
  { key: "olanzapin", name: "Olanzapin", brand: "Zyprexa", group: "Loạn thần thế hệ 2", unit: "mg", defaultDose: "5–20mg × 1 lần/tối", maxDailyMg: 20, warn: "Tăng cân, ĐTĐ." },
  { key: "risperidon", name: "Risperidon", brand: "Risperdal", group: "Loạn thần thế hệ 2", unit: "mg", defaultDose: "1–6mg/ngày chia 1–2 lần", maxDailyMg: 16 },
  { key: "quetiapin", name: "Quetiapin", brand: "Seroquel", group: "Loạn thần thế hệ 2", unit: "mg", defaultDose: "150–800mg/ngày" },
  { key: "haloperidol", name: "Haloperidol", group: "Loạn thần thế hệ 1", unit: "mg", defaultDose: "2–10mg/ngày", warn: "Ngoại tháp, QT kéo dài." },
  { key: "carbamazepin", name: "Carbamazepin", brand: "Tegretol", group: "Chống động kinh", unit: "mg", defaultDose: "200mg × 2 lần/ngày", maxDailyMg: 1600, warn: "HC Stevens-Johnson (HLA-B*1502)." },
  { key: "valproat", name: "Acid valproic", brand: "Depakine", group: "Chống động kinh", unit: "mg", defaultDose: "500–1500mg/ngày chia 2–3 lần", warn: "Quái thai. Độc gan." },
  { key: "phenytoin", name: "Phenytoin", group: "Chống động kinh", unit: "mg", defaultDose: "300mg/ngày chia 3 lần", warn: "Tăng sản lợi, rung giật nhãn cầu." },
  { key: "levetiracetam", name: "Levetiracetam", brand: "Keppra", group: "Chống động kinh", unit: "mg", defaultDose: "500mg × 2 lần/ngày", maxDailyMg: 3000 },
  { key: "lamotrigin", name: "Lamotrigin", group: "Chống động kinh", unit: "mg", defaultDose: "25→200mg/ngày", warn: "HC Stevens-Johnson – tăng liều chậm." },
  { key: "pregabalin", name: "Pregabalin", brand: "Lyrica", group: "Chống đau thần kinh", unit: "mg", defaultDose: "75mg × 2 lần/ngày", maxDailyMg: 600 },
  { key: "levodopa-carbidopa", name: "Levodopa + Carbidopa", brand: "Sinemet/Madopar", group: "Trị Parkinson", unit: "mg", defaultDose: "1 viên × 3 lần/ngày sau ăn" },
  { key: "donepezil", name: "Donepezil", brand: "Aricept", group: "Ức chế cholinesterase", unit: "mg", defaultDose: "5–10mg × 1 lần/tối", indication: "Alzheimer" },
  { key: "piracetam", name: "Piracetam", brand: "Nootropil", group: "Hướng não", unit: "mg", defaultDose: "800mg × 3 lần/ngày", maxDailyMg: 4800 },
  { key: "cinnarizin", name: "Cinnarizin", brand: "Stugeron", group: "Chống chóng mặt", unit: "mg", defaultDose: "25mg × 3 lần/ngày", maxDailyMg: 225 },
  { key: "betahistin", name: "Betahistin", brand: "Serc", group: "Chống chóng mặt (Meniere)", unit: "mg", defaultDose: "16mg × 3 lần/ngày", maxDailyMg: 48 },
  { key: "flunarizin", name: "Flunarizin", brand: "Sibelium", group: "Chẹn Ca thần kinh", unit: "mg", defaultDose: "5–10mg × 1 lần/tối", indication: "Phòng đau nửa đầu, chóng mặt" },

  // ========== SẢN PHỤ KHOA – TIẾT NIỆU ==========
  { key: "oxytocin", name: "Oxytocin", group: "Hormone tử cung", unit: "IU", defaultDose: "5–10 IU IM/IV sau sổ rau" },
  { key: "misoprostol", name: "Misoprostol", brand: "Cytotec", group: "Prostaglandin E1", unit: "mcg", defaultDose: "200–600mcg đặt/ngậm", warn: "CCĐ thai sống. Sảy thai." },
  { key: "mifepriston", name: "Mifepriston", group: "Đối kháng progesteron", unit: "mg", defaultDose: "200mg uống (theo phác đồ)" },
  { key: "dydrogesteron", name: "Dydrogesteron", brand: "Duphaston", group: "Progestin", unit: "mg", defaultDose: "10mg × 2 lần/ngày", indication: "Dọa sảy, kinh nguyệt không đều" },
  { key: "progesterone", name: "Progesteron", brand: "Utrogestan", group: "Hormone sinh dục", unit: "mg", defaultDose: "100–200mg đặt âm đạo/uống" },
  { key: "ethinylestradiol-levonorgestrel", name: "EE + Levonorgestrel", brand: "Marvelon/Rigevidon", group: "Thuốc tránh thai phối hợp", unit: "viên", defaultDose: "1 viên × 1 lần/ngày" },
  { key: "tamsulosin", name: "Tamsulosin", brand: "Harnal", group: "Chẹn α1 chọn lọc TLT", unit: "mg", defaultDose: "0.4mg × 1 lần/tối", maxDailyMg: 0.4, indication: "Phì đại lành TLT" },
  { key: "finasterid", name: "Finasterid", brand: "Proscar", group: "Ức chế 5α-reductase", unit: "mg", defaultDose: "5mg × 1 lần/ngày", indication: "Phì đại TLT" },
  { key: "sildenafil", name: "Sildenafil", brand: "Viagra", group: "PDE5i", unit: "mg", defaultDose: "50mg trước QH 1h", maxDailyMg: 100, warn: "CCĐ phối nitrat." },
  { key: "solifenacin", name: "Solifenacin", brand: "Vesicare", group: "Kháng muscarinic BQ", unit: "mg", defaultDose: "5mg × 1 lần/ngày", indication: "Bàng quang tăng hoạt" },
  { key: "trimethoprim-sulfamethoxazol", name: "Cotrimoxazol", brand: "Bactrim", group: "Sulfamid + Trimethoprim", unit: "mg", defaultDose: "960mg × 2 lần/ngày", indication: "NK tiết niệu, PCP" },
  { key: "nitrofurantoin", name: "Nitrofurantoin", group: "Kháng sinh tiết niệu", unit: "mg", defaultDose: "100mg × 4 lần/ngày × 5 ngày" },
  { key: "fosfomycin", name: "Fosfomycin", brand: "Monurol", group: "Kháng sinh tiết niệu", unit: "g", defaultDose: "3g uống liều duy nhất", indication: "Viêm BQ không biến chứng" },

  // ========== HUYẾT HỌC – VITAMIN ==========
  { key: "ferrous-sulfat", name: "Sắt sulfat", group: "Bổ sung sắt", unit: "mg", defaultDose: "200mg × 2–3 lần/ngày", warn: "Phân đen, táo bón." },
  { key: "acid-folic", name: "Acid folic", group: "Vitamin B9", unit: "mg", defaultDose: "5mg × 1 lần/ngày", indication: "Thiếu máu, thai kỳ" },
  { key: "vitamin-b12", name: "Vitamin B12 (Cyanocobalamin)", group: "Vitamin", unit: "mcg", defaultDose: "1000mcg IM × 1 lần/tuần" },
  { key: "vitamin-b1", name: "Vitamin B1 (Thiamin)", group: "Vitamin", unit: "mg", defaultDose: "100mg × 1 lần/ngày" },
  { key: "vitamin-b6", name: "Vitamin B6 (Pyridoxin)", group: "Vitamin", unit: "mg", defaultDose: "25–50mg × 1 lần/ngày" },
  { key: "vitamin-c", name: "Vitamin C", group: "Vitamin", unit: "mg", defaultDose: "500–1000mg × 1 lần/ngày", maxDailyMg: 2000 },
  { key: "vitamin-d3", name: "Vitamin D3 (Cholecalciferol)", group: "Vitamin", unit: "IU", defaultDose: "1000–2000 IU × 1 lần/ngày" },
  { key: "vitamin-k1", name: "Vitamin K1 (Phytomenadion)", group: "Vitamin", unit: "mg", defaultDose: "10mg IM (xuất huyết do warfarin)" },
  { key: "calci-carbonat", name: "Calci carbonat", group: "Khoáng chất", unit: "mg", defaultDose: "500–1000mg × 1–2 lần/ngày" },
  { key: "magnesi-b6", name: "Magnesi + Vitamin B6", brand: "Magne B6", group: "Khoáng + Vitamin", unit: "viên", defaultDose: "1 viên × 3 lần/ngày" },
  { key: "kali-clorid", name: "Kali clorid (KCl)", group: "Bù điện giải", unit: "mmol", defaultDose: "40–80mmol/ngày uống", warn: "Pha loãng khi tiêm. Không bolus IV." },
  { key: "erythropoietin", name: "Erythropoietin", brand: "Eprex", group: "Kích thích tạo HC", unit: "IU", defaultDose: "50–150 IU/kg SC × 3 lần/tuần", indication: "Thiếu máu suy thận mạn" },
  { key: "filgrastim", name: "Filgrastim (G-CSF)", brand: "Neupogen", group: "Kích thích tạo BC", unit: "mcg", defaultDose: "5mcg/kg SC × 1 lần/ngày" },

  // ========== DA LIỄU – BÔI NGOÀI ==========
  { key: "betamethason-bôi", name: "Betamethason (kem)", group: "Corticoid bôi", unit: "%", defaultDose: "Bôi 1–2 lần/ngày, không quá 2 tuần" },
  { key: "hydrocortison-bôi", name: "Hydrocortison (kem 1%)", group: "Corticoid bôi nhẹ", unit: "%", defaultDose: "Bôi 2–3 lần/ngày" },
  { key: "fucidic-acid", name: "Acid Fusidic (kem)", brand: "Fucidin", group: "Kháng sinh bôi", unit: "%", defaultDose: "Bôi 3 lần/ngày" },
  { key: "mupirocin", name: "Mupirocin (kem)", brand: "Bactroban", group: "Kháng sinh bôi", unit: "%", defaultDose: "Bôi 3 lần/ngày" },
  { key: "clotrimazol", name: "Clotrimazol (kem)", group: "Kháng nấm bôi", unit: "%", defaultDose: "Bôi 2–3 lần/ngày × 2–4 tuần" },
  { key: "ketoconazol-bôi", name: "Ketoconazol (kem/dầu gội)", brand: "Nizoral", group: "Kháng nấm bôi", unit: "%", defaultDose: "Bôi/gội 2 lần/tuần" },
  { key: "tretinoin", name: "Tretinoin", brand: "Retin-A", group: "Retinoid bôi", unit: "%", defaultDose: "Bôi 1 lần/tối", warn: "CCĐ thai phụ. Kích ứng da." },
  { key: "isotretinoin", name: "Isotretinoin", brand: "Roaccutane", group: "Retinoid uống", unit: "mg", defaultDose: "0.5–1mg/kg/ngày", warn: "Quái thai – tránh thai bắt buộc." },
  { key: "adapalen", name: "Adapalen (gel)", brand: "Differin", group: "Retinoid bôi", unit: "%", defaultDose: "Bôi 1 lần/tối" },
  { key: "permethrin", name: "Permethrin 5%", group: "Trị ghẻ", unit: "%", defaultDose: "Bôi toàn thân từ cổ trở xuống, để 8–14h" },
  { key: "calamin", name: "Calamin lotion", group: "Làm dịu da", unit: "%", defaultDose: "Bôi nhiều lần/ngày" },

  // ========== MẮT – TAI MŨI HỌNG ==========
  { key: "ofloxacin-mat", name: "Ofloxacin nhỏ mắt", brand: "Oflovid", group: "Kháng sinh mắt", unit: "%", defaultDose: "1–2 giọt × 4–6 lần/ngày" },
  { key: "tobramycin-mat", name: "Tobramycin nhỏ mắt", brand: "Tobrex", group: "Kháng sinh mắt", unit: "%", defaultDose: "1–2 giọt × 4 lần/ngày" },
  { key: "natri-cromoglycat", name: "Natri cromoglycat (mắt)", group: "Kháng dị ứng mắt", unit: "%", defaultDose: "1 giọt × 4 lần/ngày" },
  { key: "timolol-mat", name: "Timolol nhỏ mắt", group: "Chẹn β trị glaucoma", unit: "%", defaultDose: "1 giọt × 2 lần/ngày" },
  { key: "latanoprost", name: "Latanoprost", brand: "Xalatan", group: "Prostaglandin trị glaucoma", unit: "%", defaultDose: "1 giọt × 1 lần/tối" },
  { key: "natri-clorid-mui", name: "Natri clorid 0.9% xịt mũi", group: "Rửa mũi", unit: "%", defaultDose: "Xịt nhiều lần/ngày" },

  // ========== HUYẾT THANH – DỊCH TRUYỀN ==========
  { key: "ringer-lactat", name: "Ringer Lactat", group: "Dịch truyền", unit: "ml", defaultDose: "Theo nhu cầu dịch" },
  { key: "natri-clorid-09", name: "NaCl 0.9%", group: "Dịch truyền", unit: "ml", defaultDose: "Theo nhu cầu" },
  { key: "glucose-5", name: "Glucose 5%", group: "Dịch truyền", unit: "ml", defaultDose: "Theo nhu cầu năng lượng" },
  { key: "albumin-human", name: "Albumin Human 20%", group: "Dịch keo", unit: "g", defaultDose: "100ml IV (sốc, xơ gan)" },

  // ========== CẤP CỨU ==========
  { key: "adrenalin", name: "Adrenalin (Epinephrin)", group: "Cấp cứu sốc phản vệ", unit: "mg", defaultDose: "0.3–0.5mg IM (1:1000) mặt ngoài đùi" },
  { key: "noradrenalin", name: "Noradrenalin", group: "Vận mạch", unit: "mcg", defaultDose: "0.05–2mcg/kg/phút truyền TM" },
  { key: "atropin", name: "Atropin", group: "Kháng cholin cấp cứu", unit: "mg", defaultDose: "0.5–1mg IV mỗi 3–5p (nhịp chậm)" },
  { key: "naloxon", name: "Naloxon", group: "Đối kháng opioid", unit: "mg", defaultDose: "0.4–2mg IV/IM" },
  { key: "flumazenil", name: "Flumazenil", group: "Đối kháng BZD", unit: "mg", defaultDose: "0.2mg IV, lặp lại đến 1mg" },
  { key: "than-hoat", name: "Than hoạt", group: "Hấp phụ độc chất", unit: "g", defaultDose: "1g/kg uống/sonde" },
  { key: "n-acetylcystein-iv", name: "N-Acetylcystein (NAC) IV", group: "Giải độc Paracetamol", unit: "mg", defaultDose: "Phác đồ 150-50-100mg/kg" },
];


// ------------------------------------------------------------
// CẶP TƯƠNG TÁC THUỐC NGUY HIỂM (cảnh báo ĐỎ)
// ------------------------------------------------------------
export type Interaction = { a: string; b: string; level: "high" | "med"; note: string };
export type InteractionFinding = {
  pair: [string, string];
  interaction: Interaction;
  indices: [number, number];
  drugs: [DrugItem, DrugItem];
};

export const INTERACTIONS: Interaction[] = [
  // Warfarin – nhiều tương tác
  { a: "warfarin", b: "aspirin", level: "high", note: "↑↑ nguy cơ chảy máu nặng (chống đông + chống KTTC)." },
  { a: "warfarin", b: "ibuprofen", level: "high", note: "NSAID + chống đông → xuất huyết tiêu hoá." },
  { a: "warfarin", b: "diclofenac", level: "high", note: "NSAID + chống đông → xuất huyết." },
  { a: "warfarin", b: "meloxicam", level: "high", note: "NSAID + chống đông → xuất huyết." },
  { a: "warfarin", b: "metronidazol", level: "high", note: "↑ INR mạnh – nguy cơ chảy máu." },
  { a: "warfarin", b: "ciprofloxacin", level: "high", note: "↑ INR – chảy máu." },
  { a: "warfarin", b: "azithromycin", level: "med", note: "↑ tác dụng warfarin." },
  { a: "warfarin", b: "clarithromycin", level: "high", note: "↑ INR mạnh." },
  { a: "warfarin", b: "atorvastatin", level: "med", note: "Có thể ↑ INR – theo dõi." },
  { a: "warfarin", b: "tramadol", level: "med", note: "↑ INR – theo dõi." },

  // Aspirin/clopidogrel + NSAID/PPI
  { a: "aspirin", b: "ibuprofen", level: "med", note: "Ibuprofen làm giảm tác dụng chống KTTC của Aspirin." },
  { a: "clopidogrel", b: "omeprazol", level: "med", note: "Omeprazol giảm hoạt hoá Clopidogrel – ưu tiên Pantoprazol." },
  { a: "clopidogrel", b: "esomeprazol", level: "med", note: "Giảm hiệu lực Clopidogrel – đổi PPI khác." },
  { a: "clopidogrel", b: "aspirin", level: "med", note: "Phối hợp DAPT – tăng nguy cơ chảy máu, cân nhắc chỉ định." },

  // NSAID + ƯCMC/ARB + Lợi tiểu = bộ ba độc thận
  { a: "ibuprofen", b: "enalapril", level: "high", note: "Bộ ba độc thận (NSAID + ƯCMC + lợi tiểu) – AKI." },
  { a: "ibuprofen", b: "lisinopril", level: "high", note: "Giảm hiệu lực HA, độc thận." },
  { a: "ibuprofen", b: "losartan", level: "high", note: "NSAID + ARB – độc thận." },
  { a: "diclofenac", b: "enalapril", level: "high", note: "Độc thận, ↑K máu." },
  { a: "meloxicam", b: "losartan", level: "high", note: "Độc thận." },
  { a: "ibuprofen", b: "furosemid", level: "med", note: "NSAID làm giảm hiệu lực lợi tiểu." },

  // ƯCMC/ARB + K-sparing
  { a: "enalapril", b: "spironolacton", level: "high", note: "Tăng kali máu nặng – theo dõi K, ECG." },
  { a: "lisinopril", b: "spironolacton", level: "high", note: "Tăng kali máu." },
  { a: "losartan", b: "spironolacton", level: "high", note: "Tăng kali máu." },

  // Statin + Macrolid/Fibrate
  { a: "atorvastatin", b: "clarithromycin", level: "high", note: "↑ nguy cơ tiêu cơ vân." },
  { a: "atorvastatin", b: "azithromycin", level: "med", note: "Cân nhắc – theo dõi CK." },

  // QT kéo dài
  { a: "azithromycin", b: "amitriptylin", level: "med", note: "QT kéo dài – xoắn đỉnh." },
  { a: "clarithromycin", b: "amitriptylin", level: "high", note: "QT kéo dài." },
  { a: "ciprofloxacin", b: "amitriptylin", level: "med", note: "QT kéo dài." },
  { a: "levofloxacin", b: "amitriptylin", level: "med", note: "QT kéo dài." },

  // Metronidazol – disulfiram (xem cảnh báo "Tránh rượu" trong warn của thuốc)

  // SSRI + Tramadol
  { a: "sertralin", b: "tramadol", level: "high", note: "Hội chứng serotonin." },
  { a: "sertralin", b: "amitriptylin", level: "high", note: "Hội chứng serotonin." },

  // Benzodiazepin + Opioid
  { a: "diazepam", b: "tramadol", level: "high", note: "Ức chế hô hấp – an thần sâu." },

  // ĐTĐ
  { a: "metformin", b: "furosemid", level: "med", note: "Theo dõi chức năng thận – ngưng metformin nếu AKI." },
];

// ------------------------------------------------------------
// HELPERS
// ------------------------------------------------------------
const norm = (s: string) =>
  s.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .trim();

export function searchIcd(q: string, limit = 8): IcdItem[] {
  const k = norm(q);
  if (!k) return [];
  return ICD10.filter(
    (it) =>
      norm(it.code).includes(k) ||
      norm(it.name).includes(k) ||
      (it.keywords || []).some((kw) => norm(kw).includes(k))
  ).slice(0, limit);
}

export function searchDrug(q: string, limit = 8): DrugItem[] {
  const k = norm(q);
  if (!k) return [];
  return DRUGS.filter(
    (d) =>
      norm(d.name).includes(k) ||
      norm(d.key).includes(k) ||
      (d.brand && norm(d.brand).includes(k)) ||
      norm(d.group).includes(k)
  ).slice(0, limit);
}

export function findDrugByName(name: string): DrugItem | undefined {
  const k = norm(name);
  return DRUGS.find((d) => k.includes(norm(d.name)) || (d.brand && k.includes(norm(d.brand))));
}

// Parse 1 dòng đơn → { drug, doseMg, freq, totalMgPerDay }
// Hỗ trợ cú pháp tự do: "Amlodipin 5mg × 2 lần/ngày × 30 ngày"
export type ParsedLine = {
  raw: string;
  drug?: DrugItem;
  doseMg?: number;
  perDose?: string;     // "5mg"
  timesPerDay?: number;
  totalPerDay?: number; // mg/24h
  overdose?: boolean;
};

export function parseDrugLine(line: string): ParsedLine {
  const raw = line.trim();
  const drug = findDrugByName(raw);
  // Liều mg
  const mgMatch = raw.match(/(\d+(?:[.,]\d+)?)\s*(mg|mcg|g|iu)/i);
  let doseMg: number | undefined;
  if (mgMatch) {
    const v = parseFloat(mgMatch[1].replace(",", "."));
    const u = mgMatch[2].toLowerCase();
    doseMg = u === "g" ? v * 1000 : u === "mcg" ? v / 1000 : v;
  }
  // Số lần/ngày
  let times: number | undefined;
  const xMatch = raw.match(/[x×]\s*(\d+)\s*(?:lần|nhát|viên)?\s*(?:\/?\s*ngày|\/?\s*day)?/i);
  if (xMatch) times = parseInt(xMatch[1], 10);
  const lanMatch = raw.match(/(\d+)\s*lần\s*\/?\s*ngày/i);
  if (lanMatch) times = parseInt(lanMatch[1], 10);
  const total = doseMg && times ? doseMg * times : doseMg;
  const overdose = !!(drug?.maxDailyMg && total && total > drug.maxDailyMg);
  return {
    raw,
    drug,
    doseMg,
    perDose: mgMatch ? mgMatch[0] : undefined,
    timesPerDay: times,
    totalPerDay: total,
    overdose,
  };
}

// Nhóm thuốc KHÔNG được phối hợp trùng lặp trong 1 toa (Dược thư QG VN 2022, BNF 86, NICE/BNF – "Therapeutic duplication")
const DUP_CLASS_RULES: Array<{ match: (g: string) => boolean; label: string; level: "high" | "med"; note: string }> = [
  { match: (g) => /NSAID/i.test(g), label: "NSAID", level: "high", note: "Trùng nhóm NSAID → cộng độc tính DẠ DÀY – THẬN – TIM MẠCH, KHÔNG tăng hiệu quả giảm đau. Nguyên tắc an toàn: tránh dùng đồng thời >1 NSAID/toa." },
  { match: (g) => /Chống đông|Anticoag|VitK|DOAC|Heparin/i.test(g), label: "chống đông", level: "high", note: "Phối hợp 2 chống đông → xuất huyết nặng." },
  { match: (g) => /Chống KTTC|Antiplatelet/i.test(g), label: "chống kết tập tiểu cầu", level: "high", note: "Trùng nhóm chống KTTC → tăng xuất huyết." },
  { match: (g) => /Opioid|Morphin|Á phiện/i.test(g), label: "opioid", level: "high", note: "Trùng opioid → ức chế hô hấp." },
  { match: (g) => /Benzodiazepin/i.test(g), label: "benzodiazepine", level: "high", note: "Trùng BZD → an thần quá mức, ngã, ức chế hô hấp." },
  { match: (g) => /SSRI|SNRI|IMAO|MAOI/i.test(g), label: "serotonergic", level: "high", note: "Trùng nhóm serotonergic → hội chứng serotonin." },
  { match: (g) => /Corticoid|Glucocorticoid/i.test(g), label: "corticoid", level: "med", note: "Trùng corticoid → cộng tác dụng phụ (loét, tăng đường, suy thượng thận)." },
  { match: (g) => /ƯCMC|ACEi/i.test(g), label: "ƯCMC", level: "med", note: "Trùng ƯCMC → tụt HA, tăng K+, độc thận." },
  { match: (g) => /\bARB\b|Sartan/i.test(g), label: "ARB", level: "med", note: "Trùng ARB → tụt HA, tăng K+." },
  { match: (g) => /Statin/i.test(g), label: "statin", level: "med", note: "Trùng statin → tiêu cơ vân." },
  { match: (g) => /\bPPI\b/i.test(g), label: "PPI", level: "med", note: "Trùng PPI – không cần thiết." },
  { match: (g) => /Macrolid|Quinolon/i.test(g), label: "kháng sinh kéo dài QT", level: "med", note: "Trùng nhóm kéo dài QT → nguy cơ xoắn đỉnh." },
];

const hasGroup = (d: DrugItem, re: RegExp) => re.test(d.group || "");
const either = (a: DrugItem, b: DrugItem, left: (d: DrugItem) => boolean, right: (d: DrugItem) => boolean) =>
  (left(a) && right(b)) || (left(b) && right(a));

const CLASS_INTERACTION_RULES: Array<{ match: (a: DrugItem, b: DrugItem) => boolean; level: "high" | "med"; note: (a: DrugItem, b: DrugItem) => string }> = [
  {
    match: (a, b) => either(a, b, (d) => hasGroup(d, /NSAID/i), (d) => hasGroup(d, /Chống đông|VitK|DOAC|Heparin/i)),
    level: "high",
    note: (a, b) => `NSAID + thuốc chống đông (${a.name} + ${b.name}) → tăng mạnh nguy cơ xuất huyết, đặc biệt xuất huyết tiêu hoá.`,
  },
  {
    match: (a, b) => either(a, b, (d) => hasGroup(d, /NSAID/i), (d) => hasGroup(d, /Chống KTTC/i)),
    level: "high",
    note: (a, b) => `NSAID + chống kết tập tiểu cầu (${a.name} + ${b.name}) → tăng nguy cơ chảy máu/loét dạ dày.`,
  },
  {
    match: (a, b) => either(a, b, (d) => hasGroup(d, /NSAID/i), (d) => hasGroup(d, /ƯCMC|\bARB\b/i)),
    level: "high",
    note: (a, b) => `NSAID + ƯCMC/ARB (${a.name} + ${b.name}) → giảm hiệu quả hạ áp, tăng nguy cơ độc thận/tăng kali máu; cần kiểm tra chức năng thận.`,
  },
  {
    match: (a, b) => either(a, b, (d) => hasGroup(d, /NSAID/i), (d) => hasGroup(d, /Lợi tiểu/i)),
    level: "med",
    note: (a, b) => `NSAID + lợi tiểu (${a.name} + ${b.name}) → giảm hiệu lực lợi tiểu và tăng nguy cơ suy thận, nhất là người lớn tuổi/mất nước.`,
  },
  {
    match: (a, b) => either(a, b, (d) => hasGroup(d, /NSAID/i), (d) => hasGroup(d, /Corticoid|Glucocorticoid/i)),
    level: "high",
    note: (a, b) => `NSAID + corticoid (${a.name} + ${b.name}) → tăng nguy cơ loét/xuất huyết tiêu hoá.`,
  },
  {
    match: (a, b) => either(a, b, (d) => hasGroup(d, /SSRI|SNRI/i), (d) => hasGroup(d, /NSAID|Chống đông|Chống KTTC/i)),
    level: "med",
    note: (a, b) => `SSRI/SNRI phối hợp thuốc tăng chảy máu (${a.name} + ${b.name}) → tăng nguy cơ xuất huyết; cân nhắc bảo vệ dạ dày/theo dõi.`,
  },
  {
    match: (a, b) => either(a, b, (d) => hasGroup(d, /ƯCMC/i), (d) => hasGroup(d, /\bARB\b/i)),
    level: "high",
    note: (a, b) => `ƯCMC + ARB (${a.name} + ${b.name}) → tăng nguy cơ suy thận, tăng kali máu, tụt huyết áp; thường tránh phối hợp thường quy.`,
  },
];

export function findInteractions(lines: ParsedLine[]): InteractionFinding[] {
  const out: InteractionFinding[] = [];
  const items = lines
    .map((line, index) => ({ index, drug: line.drug }))
    .filter((item): item is { index: number; drug: DrugItem } => !!item.drug);

  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const left = items[i], right = items[j];
      const a = left.drug, b = right.drug;
      const indices: [number, number] = [left.index, right.index];
      const pushFinding = (interaction: Interaction) => {
        out.push({ pair: [a.key, b.key], interaction, indices, drugs: [a, b] });
      };

      // 1) Kê trùng chính xác cùng hoạt chất/biệt dược: luôn cảnh báo, kể cả chưa quá liều.
      if (a.key === b.key) {
        pushFinding({
          a: a.key,
          b: b.key,
          level: hasGroup(a, /NSAID|Chống đông|DOAC|Heparin|Opioid|Benzodiazepin/i) ? "high" : "med",
          note: `KÊ TRÙNG HOẠT CHẤT (${a.name}) ở dòng #${left.index + 1} và #${right.index + 1}. Cần gộp về 1 dòng/1 phác đồ, cộng tổng liều 24h và tránh cấp trùng.`,
        });
        continue;
      }

      // 2) Cặp tương tác tường minh theo hoạt chất.
      const explicit = INTERACTIONS.find(
        (x) => (x.a === a.key && x.b === b.key) || (x.a === b.key && x.b === a.key)
      );
      if (explicit) {
        pushFinding(explicit);
        continue;
      }

      // 3) Trùng nhóm dược lý (therapeutic duplication): NSAID, chống đông, statin, PPI...
      const duplicateRule = DUP_CLASS_RULES.find((rule) => rule.match(a.group || "") && rule.match(b.group || ""));
      if (duplicateRule) {
        pushFinding({
          a: a.key,
          b: b.key,
          level: duplicateRule.level,
          note: `TRÙNG NHÓM ${duplicateRule.label.toUpperCase()} (${a.name} + ${b.name}). ${duplicateRule.note}`,
        });
        continue;
      }

      // 4) Luật tương tác theo nhóm để không bỏ sót hoạt chất cùng lớp chưa khai báo tường minh.
      const classRule = CLASS_INTERACTION_RULES.find((rule) => rule.match(a, b));
      if (classRule) {
        pushFinding({ a: a.key, b: b.key, level: classRule.level, note: classRule.note(a, b) });
      }
    }
  }

  return out;
}
