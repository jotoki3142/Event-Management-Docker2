USE event_management_sys;

INSERT INTO SuKien (tenSuKien, moTa, diaDiem, trangThaiSuKien, phiThamGia, luongChoNgoi, ngayBatDau, ngayKetThuc, maDanhMuc) VALUES
('TechTalk 2024', 'Su kien chia se cong nghe AI va Blockchain', 'TP.HCM, Innovation Hub', 'Con cho', 100000, 100, '2024-05-10', '2024-05-12', 1),
('Dem Nhac Gai Quy', 'Chuong trinh ca nhac quyen gop tu thien', 'Ha Noi, Nha hat Lon', 'Het cho', 0, 200, '2024-06-01', '2024-06-01', 2),
('Art Expo 2025', 'Trien lam cac tac pham hoi hoa hien dai', 'Da Nang, Bao tang My thuat', 'Da ket thuc', 50000, 150, '2025-03-20', '2025-03-22', 3),
('Workshop Giao Tiep', 'Khoa hoc cai thien ky nang giao tiep ca nhan', 'Can Tho, Trung tam Hoi nghi', 'Het han dang ki', 150000, 50, '2024-11-05', '2024-11-07', 4),
('Giai Bong Da Sinh Vien', 'Giai dau bong da danh cho sinh vien khu vuc mien Trung', 'Hue, San van dong Tu Do', 'Dang dien ra', 0, 250, '2025-07-01', '2025-07-10', 5),
('Startup Bootcamp', 'Trai huan luyen khoi nghiep keo dai 3 ngay', 'Ha Noi, Tech Square', 'Con cho', 200000, 60, '2024-09-15', '2024-09-17', 1),
('Hoi Nghi An Ninh Mang', 'Thao luan cac xu huong bao mat 2025', 'TP.HCM, Saigon Conference Center', 'Huy bo', 120000, 80, '2025-01-10', '2025-01-11', 1),
('Chien Dich Mua He Xanh', 'Tinh nguyen vien ho tro cong dong vung sau', 'Tay Ninh', 'Da ket thuc', 0, 100, '2024-07-01', '2024-07-15', 2),
('Trien Lam Game 2025', 'Cap nhat cac xu huong game moi nhat', 'Ha Noi, Game Expo Center', 'Con cho', 100000, 300, '2025-10-01', '2025-10-03', 3),
('Lop Ky Nang Thuyet Trinh', 'Nang cao ky nang thuyet trinh truoc dam dong', 'Ha Noi, SoftSkills Academy', 'Het han dang ki', 80000, 40, '2025-02-05', '2025-02-06', 4),
('Marathon TP.HCM', 'Chay bo gai quy vi cong dong', 'TP.HCM, Cong vien Tao Dan', 'Con cho', 50000, 200, '2024-12-01', '2024-12-01', 5),
('Coding Day 2025', 'Cuoc thi lap trinh 1 ngay cho sinh vien', 'Ha Noi, Dai hoc Bach Khoa', 'Dang dien ra', 0, 120, '2025-06-15', '2025-06-15', 1),
('Trai He Thieu Nhi', 'Chuong trinh vui choi hoc tap cho tre', 'Da Lat', 'Huy bo', 70000, 80, '2024-07-20', '2024-07-25', NULL),
('Charity Gala Dinner', 'Bua toi gai quy voi su gop mat cua nguoi noi tieng', 'TP.HCM, Khach san Rex', 'Het cho', 200000, 70, '2025-04-10', '2025-04-10', 2),
('Hoi Cho Am Thuc', 'Quang ba am thuc cac vung mien Viet Nam', 'Hoi An', 'Da ket thuc', 30000, 100, '2024-08-01', '2024-08-03', NULL),
('Khoa Hoc Thiet Ke Do Hoa', 'Ky nang thiet ke co ban bang Adobe', 'TP.HCM, DH My Thuat', 'Con cho', 150000, 60, '2025-03-05', '2025-03-07', 4),
('Giai Cau Long Mo Rong', 'Giai dau danh cho cac CLB toan quoc', 'Binh Duong, Nha thi dau TDTT', 'Dang dien ra', 100000, 200, '2025-05-10', '2025-05-12', 5),
('Tech for Kids', 'Cong nghe vui choi va hoc tap cho tre em', 'Ha Noi, Trung tam Hoi nghi Quoc Gia', 'Con cho', 50000, 90, '2024-10-20', '2024-10-21', 1),
('Chien Dich Ao Am', 'Phat ao am cho tre em mien nui', 'Ha Giang', 'Het han dang ki', 0, 100, '2024-12-10', '2024-12-15', 2),
('Nghe Thuat Duong Pho', 'Bieu dien nghe thuat duong pho mo rong', 'TP.HCM, Pho di bo Nguyen Hue', 'Huy bo', 0, 150, '2025-11-01', '2025-11-02', 3),
('Thuyet Trinh Tranh Bien', 'Su kien danh cho cac doi tranh bien tre', 'Hue, Dai hoc Khoa hoc', 'Con cho', 60000, 50, '2024-09-01', '2024-09-03', 4),
('Giai Boi Loi Toan Quoc', 'Thi dau boi loi cac do tuoi', 'Da Nang, Ho boi The thao', 'Het cho', 80000, 220, '2025-07-20', '2025-07-22', 5),
('Code Hackathon 2024', 'Phat trien phan mem trong 48 gio lien tuc', 'TP.HCM, TMA Innovation Park', 'Da ket thuc', 0, 100, '2024-06-10', '2024-06-12', NULL),
('Trai Doc Sach Mua He', 'Thuc day van hoa doc cho hoc sinh', 'Hai Phong, Thu vien thanh pho', 'Con cho', 30000, 70, '2024-08-15', '2024-08-17', NULL),
('Dien Dan Kinh Te Tre', 'Thao luan chinh sach kinh te voi chuyen gia', 'TP.HCM, SECC', 'Con cho', 100000, 150, '2025-01-20', '2025-01-21', 1),
('Giai Co Vua Hoc Sinh', 'Thi dau tri tue cap hoc sinh toan quoc', 'Ha Noi, Truong THPT Chuyen', 'Dang dien ra', 50000, 180, '2025-02-10', '2025-02-12', NULL);

-- Insert DangKy + HoaDon (30 entries)

-- Prepare helper variables
SET @khachhang_max = (SELECT MAX(maKhachHang) FROM KhachHang);
SET @sukien_max = (SELECT MAX(maSuKien) FROM SuKien);

INSERT INTO DangKy (maDangKy, ngayDangKy, viTriGhe, trangThaiDangKy, maKhachHang, maSuKien)
VALUES 
-- Entry 1
(UUID(), NOW(), FLOOR(1 + RAND() * 300), 'Thành công', FLOOR(1 + RAND() * @khachhang_max), FLOOR(1 + RAND() * @sukien_max)),
(UUID(), NOW(), FLOOR(1 + RAND() * 300), 'Đã điểm danh', FLOOR(1 + RAND() * @khachhang_max), FLOOR(1 + RAND() * @sukien_max)),
(UUID(), NOW(), FLOOR(1 + RAND() * 300), 'Đang xử lý', FLOOR(1 + RAND() * @khachhang_max), FLOOR(1 + RAND() * @sukien_max)),
(UUID(), NOW(), FLOOR(1 + RAND() * 300), 'Đã hủy', FLOOR(1 + RAND() * @khachhang_max), FLOOR(1 + RAND() * @sukien_max)),
(UUID(), NOW(), FLOOR(1 + RAND() * 300), 'Thành công', FLOOR(1 + RAND() * @khachhang_max), FLOOR(1 + RAND() * @sukien_max)),
(UUID(), NOW(), FLOOR(1 + RAND() * 300), 'Đã điểm danh', FLOOR(1 + RAND() * @khachhang_max), FLOOR(1 + RAND() * @sukien_max)),
(UUID(), NOW(), FLOOR(1 + RAND() * 300), 'Đã hủy', FLOOR(1 + RAND() * @khachhang_max), FLOOR(1 + RAND() * @sukien_max)),
(UUID(), NOW(), FLOOR(1 + RAND() * 300), 'Thành công', FLOOR(1 + RAND() * @khachhang_max), FLOOR(1 + RAND() * @sukien_max)),
(UUID(), NOW(), FLOOR(1 + RAND() * 300), 'Đã điểm danh', FLOOR(1 + RAND() * @khachhang_max), FLOOR(1 + RAND() * @sukien_max)),
(UUID(), NOW(), FLOOR(1 + RAND() * 300), 'Đang xử lý', FLOOR(1 + RAND() * @khachhang_max), FLOOR(1 + RAND() * @sukien_max)),
(UUID(), NOW(), FLOOR(1 + RAND() * 300), 'Đang xử lý', FLOOR(1 + RAND() * @khachhang_max), FLOOR(1 + RAND() * @sukien_max)),
(UUID(), NOW(), FLOOR(1 + RAND() * 300), 'Thành công', FLOOR(1 + RAND() * @khachhang_max), FLOOR(1 + RAND() * @sukien_max)),
(UUID(), NOW(), FLOOR(1 + RAND() * 300), 'Đã điểm danh', FLOOR(1 + RAND() * @khachhang_max), FLOOR(1 + RAND() * @sukien_max)),
(UUID(), NOW(), FLOOR(1 + RAND() * 300), 'Đã hủy', FLOOR(1 + RAND() * @khachhang_max), FLOOR(1 + RAND() * @sukien_max)),
(UUID(), NOW(), FLOOR(1 + RAND() * 300), 'Thành công', FLOOR(1 + RAND() * @khachhang_max), FLOOR(1 + RAND() * @sukien_max)),
(UUID(), NOW(), FLOOR(1 + RAND() * 300), 'Đã hủy', FLOOR(1 + RAND() * @khachhang_max), FLOOR(1 + RAND() * @sukien_max)),
(UUID(), NOW(), FLOOR(1 + RAND() * 300), 'Thành công', FLOOR(1 + RAND() * @khachhang_max), FLOOR(1 + RAND() * @sukien_max)),
(UUID(), NOW(), FLOOR(1 + RAND() * 300), 'Đã điểm danh', FLOOR(1 + RAND() * @khachhang_max), FLOOR(1 + RAND() * @sukien_max)),
(UUID(), NOW(), FLOOR(1 + RAND() * 300), 'Đang xử lý', FLOOR(1 + RAND() * @khachhang_max), FLOOR(1 + RAND() * @sukien_max)),
(UUID(), NOW(), FLOOR(1 + RAND() * 300), 'Đang xử lý', FLOOR(1 + RAND() * @khachhang_max), FLOOR(1 + RAND() * @sukien_max)),
(UUID(), NOW(), FLOOR(1 + RAND() * 300), 'Đã điểm danh', FLOOR(1 + RAND() * @khachhang_max), FLOOR(1 + RAND() * @sukien_max)),
(UUID(), NOW(), FLOOR(1 + RAND() * 300), 'Đã hủy', FLOOR(1 + RAND() * @khachhang_max), FLOOR(1 + RAND() * @sukien_max)),
(UUID(), NOW(), FLOOR(1 + RAND() * 300), 'Thành công', FLOOR(1 + RAND() * @khachhang_max), FLOOR(1 + RAND() * @sukien_max)),
(UUID(), NOW(), FLOOR(1 + RAND() * 300), 'Đang xử lý', FLOOR(1 + RAND() * @khachhang_max), FLOOR(1 + RAND() * @sukien_max)),
(UUID(), NOW(), FLOOR(1 + RAND() * 300), 'Đã điểm danh', FLOOR(1 + RAND() * @khachhang_max), FLOOR(1 + RAND() * @sukien_max)),
(UUID(), NOW(), FLOOR(1 + RAND() * 300), 'Đã hủy', FLOOR(1 + RAND() * @khachhang_max), FLOOR(1 + RAND() * @sukien_max)),
(UUID(), NOW(), FLOOR(1 + RAND() * 300), 'Thành công', FLOOR(1 + RAND() * @khachhang_max), FLOOR(1 + RAND() * @sukien_max)),
(UUID(), NOW(), FLOOR(1 + RAND() * 300), 'Đã hủy', FLOOR(1 + RAND() * @khachhang_max), FLOOR(1 + RAND() * @sukien_max)),
(UUID(), NOW(), FLOOR(1 + RAND() * 300), 'Thành công', FLOOR(1 + RAND() * @khachhang_max), FLOOR(1 + RAND() * @sukien_max)),
(UUID(), NOW(), FLOOR(1 + RAND() * 300), 'Đã điểm danh', FLOOR(1 + RAND() * @khachhang_max), FLOOR(1 + RAND() * @sukien_max));

-- Now insert corresponding HoaDon based on DangKy status
INSERT INTO HoaDon (maHoaDon, ngayTao, trangThaiHoaDon, tongTien, thoiGianHieuLuc, thoiGianThanhCong, phuongThucThanhToan, maKhachHang, maDangKy)
SELECT
    UUID(),
    NOW(),
    CASE 
        WHEN d.trangThaiDangKy IN ('Thành công', 'Đã điểm danh') THEN 'Đã thanh toán'
        WHEN d.trangThaiDangKy = 'Đang xử lý' THEN 'Chưa thanh toán'
        ELSE 'Đã hủy'
    END,
    FLOOR(RAND() * 200001),
    TIMESTAMP(DATE_ADD('2024-01-01', INTERVAL FLOOR(RAND() * 730) DAY)),
    TIMESTAMP(DATE_ADD('2024-01-01', INTERVAL FLOOR(RAND() * 730) DAY)),
    'Qua ngân hàng',
    d.maKhachHang,
    d.maDangKy
FROM DangKy d
ORDER BY d.ngayDangKy DESC
LIMIT 30;

-- Insert CauHoi
INSERT INTO CauHoi (noiDungCauHoi, noiDungTraLoi, trangThai, maKhachHang, maNhanVien, maSuKien) VALUES
('Sự kiện này có miễn phí không?', 'Có, sự kiện hoàn toàn miễn phí.', 'Đã xử lý', FLOOR(1 + RAND() * @khachhang_max), FLOOR(1 + RAND() * @first_nhanvien_id), FLOOR(1 + RAND() * @sukien_max)),
('Thời gian bắt đầu sự kiện là khi nào?', 'Sự kiện bắt đầu vào 10 giờ sáng.', 'Đã xử lý', FLOOR(1 + RAND() * @khachhang_max), FLOOR(1 + RAND() * @first_nhanvien_id), FLOOR(1 + RAND() * @sukien_max)),
('Có thể đăng ký trực tuyến không?', 'Có, bạn có thể đăng ký trên website.', 'Đã xử lý', FLOOR(1 + RAND() * @khachhang_max), FLOOR(1 + RAND() * @first_nhanvien_id), FLOOR(1 + RAND() * @sukien_max)),
('Ai là diễn giả chính của sự kiện?', 'Diễn giả chính là ông Nguyễn Văn A.', 'Đã xử lý', FLOOR(1 + RAND() * @khachhang_max), FLOOR(1 + RAND() * @first_nhanvien_id), FLOOR(1 + RAND() * @sukien_max)),
('Sự kiện này có dành cho mọi lứa tuổi không?', 'Có, mọi lứa tuổi đều có thể tham gia.', 'Đã xử lý', FLOOR(1 + RAND() * @khachhang_max), FLOOR(1 + RAND() * @first_nhanvien_id), FLOOR(1 + RAND() * @sukien_max)),
('Có cần mang theo giấy tờ gì không?', 'Bạn không cần mang theo giấy tờ.', 'Đã xử lý', FLOOR(1 + RAND() * @khachhang_max), FLOOR(1 + RAND() * @first_nhanvien_id), FLOOR(1 + RAND() * @sukien_max)),
('Sẽ có bao nhiêu người tham gia?', 'Dự kiến có khoảng 200 người.', 'Đã xử lý', FLOOR(1 + RAND() * @khachhang_max), FLOOR(1 + RAND() * @first_nhanvien_id), FLOOR(1 + RAND() * @sukien_max)),
('Có chỗ đậu xe không?', 'Có, bạn có thể đậu xe tại khu vực gần đó.', 'Đã xử lý', FLOOR(1 + RAND() * @khachhang_max), FLOOR(1 + RAND() * @first_nhanvien_id), FLOOR(1 + RAND() * @sukien_max)),
('Có phục vụ đồ ăn không?', 'Có, sẽ có đồ ăn nhẹ phục vụ.', 'Đã xử lý', FLOOR(1 + RAND() * @khachhang_max), FLOOR(1 + RAND() * @first_nhanvien_id), FLOOR(1 + RAND() * @sukien_max)),
('Nơi sự kiện diễn ra có địa chỉ chính xác không?', 'Địa chỉ chính xác sẽ được gửi qua email.', 'Đã xử lý', FLOOR(1 + RAND() * @khachhang_max), FLOOR(1 + RAND() * @first_nhanvien_id), FLOOR(1 + RAND() * @sukien_max)),
('Sẽ có quà tặng cho người tham gia không?', 'Có, sẽ có quà tặng cho tất cả người tham gia.', 'Đã xử lý', FLOOR(1 + RAND() * @khachhang_max), FLOOR(1 + RAND() * @first_nhanvien_id), FLOOR(1 + RAND() * @sukien_max)),
('Có thể mang theo trẻ em không?', 'Có, trẻ em cũng rất hoan nghênh.', 'Đã xử lý', FLOOR(1 + RAND() * @khachhang_max), FLOOR(1 + RAND() * @first_nhanvien_id), FLOOR(1 + RAND() * @sukien_max)),
('Có cần phải đăng ký trước không?', 'Có, vui lòng đăng ký trước để đảm bảo chỗ.', 'Đã xử lý', FLOOR(1 + RAND() * @khachhang_max), FLOOR(1 + RAND() * @first_nhanvien_id), FLOOR(1 + RAND() * @sukien_max)),
('Sẽ có ai giải đáp thắc mắc trong sự kiện không?', 'Có, sẽ có người giải đáp thắc mắc.', 'Đã xử lý', FLOOR(1 + RAND() * @khachhang_max), FLOOR(1 + RAND() * @first_nhanvien_id), FLOOR(1 + RAND() * @sukien_max)),
('Có ai điều hành sự kiện không?', 'Có, sẽ có người điều hành sự kiện.', 'Đã xử lý', FLOOR(1 + RAND() * @khachhang_max), FLOOR(1 + RAND() * @first_nhanvien_id), FLOOR(1 + RAND() * @sukien_max)),
('Sự kiện có diễn ra vào cuối tuần không?', 'Có, sự kiện diễn ra vào thứ Bảy.', 'Đã xử lý', FLOOR(1 + RAND() * @khachhang_max), FLOOR(1 + RAND() * @first_nhanvien_id), FLOOR(1 + RAND() * @sukien_max)),
('Có thể tham gia sự kiện này nhiều lần không?', 'Có, bạn có thể tham gia nhiều lần.', 'Đã xử lý', FLOOR(1 + RAND() * @khachhang_max), FLOOR(1 + RAND() * @first_nhanvien_id), FLOOR(1 + RAND() * @sukien_max)),
('Có ai chụp ảnh trong sự kiện không?', 'Có, sẽ có nhiếp ảnh gia chụp ảnh.', 'Đã xử lý', FLOOR(1 + RAND() * @khachhang_max), FLOOR(1 + RAND() * @first_nhanvien_id), FLOOR(1 + RAND() * @sukien_max)),
('Có cần mang theo laptop không?', 'Nếu bạn có nhu cầu, có thể mang theo.', 'Đã xử lý', FLOOR(1 + RAND() * @khachhang_max), FLOOR(1 + RAND() * @first_nhanvien_id), FLOOR(1 + RAND() * @sukien_max)),
('Sự kiện kéo dài bao lâu?', 'Sự kiện kéo dài khoảng 3 giờ.', 'Đã xử lý', FLOOR(1 + RAND() * @khachhang_max), FLOOR(1 + RAND() * @first_nhanvien_id), FLOOR(1 + RAND() * @sukien_max)),
('Có ai trình bày về chủ đề khác không?', 'Chủ đề chính là công nghệ, nhưng có thể có thêm thông tin về các lĩnh vực khác.', 'Đã xử lý', FLOOR(1 + RAND() * @khachhang_max), FLOOR(1 + RAND() * @first_nhanvien_id), FLOOR(1 + RAND() * @sukien_max));

-- Insert DiemDanh
INSERT INTO DiemDanh
SELECT 
    UUID(),
    NOW(),
    TIMESTAMP(DATE_ADD('2024-01-01', INTERVAL FLOOR(RAND() * 730) DAY)),
    'Vắng mặt',
    FLOOR(1 + RAND() * 300),
    d.maDangKy
FROM DangKy d
ORDER BY d.ngayDangKy DESC
LIMIT 10;

INSERT INTO DiemDanh
SELECT 
    UUID(),
    NOW(),
    TIMESTAMP(DATE_ADD('2024-01-01', INTERVAL FLOOR(RAND() * 730) DAY)),
    'Có mặt',
    FLOOR(1 + RAND() * 300),
    d.maDangKy
FROM DangKy d
ORDER BY d.ngayDangKy ASC
LIMIT 10;

-- Insert into DanhGia with balanced feedback
INSERT INTO DanhGia (loaiDanhGia, binhLuan, maKhachHang, maSuKien) VALUES
(1, 'Sự kiện rất thú vị và bổ ích!', FLOOR(1 + RAND() * 10), 3),
(4, 'Tôi đã học được nhiều điều mới!', FLOOR(1 + RAND() * 10), 8),
(5, 'Địa điểm tổ chức rất đẹp!', FLOOR(1 + RAND() * 10), 15),
(4, 'Tôi sẽ tham gia lần sau!', FLOOR(1 + RAND() * 10), 23),
(2, 'Chương trình cần cải thiện phần âm thanh.', FLOOR(1 + RAND() * 10), 3),
(3, 'Cảm ơn vì đã tổ chức sự kiện này!', FLOOR(1 + RAND() * 10), 8),
(4, 'Diễn giả rất chuyên nghiệp!', FLOOR(1 + RAND() * 10), 15),
(1, 'Sự kiện không như mong đợi.', FLOOR(1 + RAND() * 10), 23),
(4, 'Rất hài lòng với trải nghiệm!', FLOOR(1 + RAND() * 10), 3),
(2, 'Hy vọng có sự kiện tương tự trong tương lai!', FLOOR(1 + RAND() * 10), 8),
(2, 'Cần nhiều hoạt động hơn cho người tham gia.', FLOOR(1 + RAND() * 10), 15),
(3, 'Tôi đã có những kỷ niệm đẹp!', FLOOR(1 + RAND() * 10), 23),
(5, 'Sự kiện rất thành công!', FLOOR(1 + RAND() * 10), 3),
(3, 'Mong muốn có thêm nhiều thông tin!', FLOOR(1 + RAND() * 10), 8),
(1, 'Thời gian tổ chức cần xem xét lại.', FLOOR(1 + RAND() * 10), 15),
(4, 'Rất vui khi được tham gia!', FLOOR(1 + RAND() * 10), 23),
(1, 'Cảm ơn tất cả những người đã tham gia!', FLOOR(1 + RAND() * 10), 3),
(3, 'Nên có thêm quà tặng cho người tham gia.', FLOOR(1 + RAND() * 10), 8),
(4, 'Hy vọng sẽ được tham dự lần tới!', FLOOR(1 + RAND() * 10), 15),
(5, 'Đã có những trải nghiệm tuyệt vời!', FLOOR(1 + RAND() * 10), 23),
(1, 'Nơi tổ chức rất thuận tiện.', FLOOR(1 + RAND() * 10), 3);

-- Insert into Ticket
INSERT INTO Ticket (tenKhachHang, email, noiDung, noiDungGiaiDap, trangThai, maNhanVien) VALUES
('Nguyen Van A', 'nguyenvana@example.com', 'Tôi không thể tìm thấy thông tin sự kiện.', 'Đã gửi thông tin đến bạn.', 'Đã xử lý', FLOOR(1 + RAND() * 11)),
('Tran Thi B', 'tranthib@example.com', 'Thời gian sự kiện có thể thay đổi không?', 'Thời gian đã được xác nhận.', 'Đã xử lý', FLOOR(1 + RAND() * 11)),
('Pham Minh C', 'phammc@example.com', 'Tôi muốn biết thêm về địa điểm tổ chức.', 'Địa điểm đã được cập nhật trong email.', 'Đã xử lý', FLOOR(1 + RAND() * 11)),
('Le Thi D', 'lethid@example.com', 'Có thể đăng ký tham gia trực tiếp không?', 'Có thể, vui lòng đến sớm.', 'Đã xử lý', FLOOR(1 + RAND() * 11)),
('Nguyen Thi E', 'nguyenthi.e@example.com', 'Tôi không thể đăng nhập vào tài khoản của mình.', 'Đã reset mật khẩu cho bạn.', 'Đã xử lý', FLOOR(1 + RAND() * 11)),
('Hoang Van F', 'hoangf@example.com', 'Sự kiện có miễn phí không?', 'Sự kiện này hoàn toàn miễn phí!', 'Đã xử lý', FLOOR(1 + RAND() * 11)),
('Tran Van G', 'tranvag@example.com', 'Có cần mang theo giấy tờ gì không?', 'Không cần mang theo giấy tờ.', 'Đã xử lý', FLOOR(1 + RAND() * 11)),
('Pham Van H', 'phamvh@example.com', 'Tôi đã đăng ký nhưng chưa nhận được xác nhận.', 'Đã gửi lại xác nhận cho bạn.', 'Đã xử lý', FLOOR(1 + RAND() * 11)),
('Bui Thi I', 'buithi.i@example.com', 'Có thể tham gia sự kiện với trẻ em không?', 'Có, trẻ em cũng rất hoan nghênh.', 'Đã xử lý', FLOOR(1 + RAND() * 11)),
('Ngo Van J', 'ngovj@example.com', 'Tôi muốn biết thêm về diễn giả của sự kiện.', 'N/A', 'Chưa xử lý', FLOOR(1 + RAND() * 11));