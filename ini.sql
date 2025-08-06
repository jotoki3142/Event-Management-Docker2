-- Drop database if exist
DROP DATABASE IF EXISTS event_management_sys;

-- Create database
CREATE DATABASE sonar 
    DEFAULT CHARACTER SET utf8mb4 
    DEFAULT COLLATE utf8mb4_unicode_ci;

CREATE DATABASE IF NOT EXISTS event_management_sys
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE event_management_sys;

-- Create user and grant privileges
CREATE USER IF NOT EXISTS 'api_manager'@'%' IDENTIFIED BY 'StrongPassword123!';
GRANT ALL PRIVILEGES ON event_management_sys.* TO 'api_manager'@'%';
FLUSH PRIVILEGES;

-- Table: QuanLy
CREATE TABLE QuanLy (
    maQuanLy INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    hoTen VARCHAR(100) NOT NULL,
    diaChi VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    gioiTinh VARCHAR(10) NOT NULL,
    soTuoi INT NOT NULL
);

-- Table: NhanVien
CREATE TABLE NhanVien (
    maNhanVien INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    hoTen VARCHAR(100) NOT NULL,
    diaChi VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    gioiTinh VARCHAR(10) NOT NULL,
    soTuoi INT NOT NULL
);

-- Table: KhachHang
CREATE TABLE KhachHang (
    maKhachHang INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    hoTen VARCHAR(100) NOT NULL,
    diaChi VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    gioiTinh VARCHAR(10) NOT NULL,
    soTuoi INT NOT NULL
);

-- Table: TaiKhoan
CREATE TABLE TaiKhoan (
    maTaiKhoan VARCHAR(50) PRIMARY KEY NOT NULL,
    tenDangNhap VARCHAR(50) NOT NULL UNIQUE,
    matKhau VARCHAR(60) NOT NULL,
    ngayTao DATETIME DEFAULT CURRENT_TIMESTAMP,
    trangThai VARCHAR(50),
    vaiTro VARCHAR(20),
    xacMinhEmail BOOLEAN DEFAULT FALSE,
    maKhachHang INT,
    maQuanLy INT,
    maNhanVien INT,
    FOREIGN KEY (maKhachHang) REFERENCES KhachHang(maKhachHang),
    FOREIGN KEY (maQuanLy) REFERENCES QuanLy(maQuanLy),
    FOREIGN KEY (maNhanVien) REFERENCES NhanVien(maNhanVien)
);

-- Table: DanhMucSuKien
CREATE TABLE DanhMucSuKien (
    maDanhMuc INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    tenDanhMuc VARCHAR(50) NOT NULL
);

-- Table: SuKien
CREATE TABLE SuKien (
    maSuKien INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    tenSuKien VARCHAR(100) NOT NULL,
    moTa TEXT NOT NULL,
    anhSuKien VARCHAR(70),
    diaDiem VARCHAR(255) NOT NULL,
    trangThaiSuKien VARCHAR(30) DEFAULT 'Còn chỗ',
    phiThamGia DECIMAL(18,2) NOT NULL,
    luongChoNgoi INT NOT NULL,
    ngayTaoSuKien DATETIME DEFAULT CURRENT_TIMESTAMP,
    ngayBatDau DATETIME NOT NULL,
    ngayKetThuc DATETIME NOT NULL,
    maDanhMuc INT,
    FOREIGN KEY (maDanhMuc) REFERENCES DanhMucSuKien(maDanhMuc)
);

-- Table: DangKy
CREATE TABLE DangKy (
    maDangKy VARCHAR(50) PRIMARY KEY NOT NULL,
    ngayDangKy DATETIME DEFAULT CURRENT_TIMESTAMP,
    viTriGhe VARCHAR(10) NOT NULL,
    trangThaiDangKy VARCHAR(20) DEFAULT 'Đang xử lý',
    maKhachHang INT,
    maSuKien INT,
    FOREIGN KEY (maKhachHang) REFERENCES KhachHang(maKhachHang),
    FOREIGN KEY (maSuKien) REFERENCES SuKien(maSuKien)
);

-- Table: HoaDon
CREATE TABLE HoaDon (
    maHoaDon VARCHAR(50) PRIMARY KEY NOT NULL,
    ngayTao DATETIME DEFAULT CURRENT_TIMESTAMP,
    trangThaiHoaDon VARCHAR(20) DEFAULT 'Chưa thanh toán',
    tongTien DECIMAL(18,2),
    thoiGianHieuLuc DATETIME NOT NULL,
    thoiGianThanhCong DATETIME NOT NULL,
    phuongThucThanhToan VARCHAR(20) DEFAULT 'Qua ngân hàng',
    maKhachHang INT,
    maDangKy VARCHAR(50),
    FOREIGN KEY (maKhachHang) REFERENCES KhachHang(maKhachHang),
    FOREIGN KEY (maDangKy) REFERENCES DangKy(maDangKy)
);

-- Table: DanhGia
CREATE TABLE DanhGia (
    maDanhGia INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    loaiDanhGia INT,
    binhLuan TEXT NOT NULL,
    ngayDanhGia DATETIME DEFAULT CURRENT_TIMESTAMP,
    maKhachHang INT,
    maSuKien INT,
    FOREIGN KEY (maKhachHang) REFERENCES KhachHang(maKhachHang),
    FOREIGN KEY (maSuKien) REFERENCES SuKien(maSuKien)
);

-- Table: CauHoi
CREATE TABLE CauHoi (
    maCauHoi INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    noiDungCauHoi TEXT NOT NULL,
    noiDungTraLoi TEXT NOT NULL,
    trangThai VARCHAR(20) DEFAULT 'Chưa xử lý',
    maKhachHang INT,
    maNhanVien INT,
    maSuKien INT,
    FOREIGN KEY (maKhachHang) REFERENCES KhachHang(maKhachHang),
    FOREIGN KEY (maNhanVien) REFERENCES NhanVien(maNhanVien),
    FOREIGN KEY (maSuKien) REFERENCES SuKien(maSuKien)
);

-- Table: DiemDanh
CREATE TABLE DiemDanh (
    maDiemDanh VARCHAR(50) PRIMARY KEY NOT NULL,
    ngayTaove DATETIME DEFAULT CURRENT_TIMESTAMP,
    ngayDiemDanh DATETIME,
    trangThaiDiemDanh VARCHAR(20) DEFAULT 'Vắng mặt',
    viTriGheNgoi VARCHAR(10) NOT NULL,
    maDangKy VARCHAR(50),
    FOREIGN KEY (maDangKy) REFERENCES DangKy(maDangKy)
);

-- Table: Ticket
CREATE TABLE Ticket (
    maHoTro INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    tenKhachHang VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    noiDung TEXT NOT NULL,
    noiDungGiaiDap TEXT,
    trangThai VARCHAR(20) DEFAULT 'Chưa xử lý',
    maNhanVien INT,
    FOREIGN KEY (maNhanVien) REFERENCES NhanVien(maNhanVien)
);

-- Table Token
CREATE TABLE Token (
    maToken VARCHAR(50) PRIMARY KEY NOT NULL,
    loaiToken VARCHAR(60) NOT NULL,
    thoiDiemHetHan DATETIME,
    maTaiKhoan VARCHAR(50),
    FOREIGN KEY (maTaiKhoan) REFERENCES TaiKhoan(maTaiKhoan)
);

-- Insert test admin data
-- Insert into QuanLy
INSERT INTO QuanLy (hoTen, diaChi, email, phone, gioiTinh, soTuoi)
VALUES (
    'redacted',
    'redacted',
    'redacted@abuse.com',
    'redacted',
    'Nam',
    18
);

-- Insert into TaiKhoan
INSERT INTO TaiKhoan (
    maTaiKhoan,
    tenDangNhap,
    matKhau,
    trangThai,
    vaiTro,
    xacMinhEmail,
    maQuanLy
)
VALUES (
    '66a580dc-3400-479d-a0cd-3e0fedcdf8db',
    'admin',
    '$2a$10$fd8mAqdcMoQPn/4R7sxeJugSmslPKWjLh4ahB/Wqxeosi.CgK38Py',
    'Hoat dong',
    'QuanLy',
    TRUE,
    LAST_INSERT_ID()
);

-- Insert KhachHang + TaiKhoan
INSERT INTO KhachHang (hoTen, diaChi, email, phone, gioiTinh, soTuoi) VALUES
('Nguyen Van An', '123 Ly Thuong Kiet, Ha Noi', 'an.nguyen@example.com', '0938123456', 'Nam', 28),
('Tran Thi Bich', '456 Nguyen Trai, Da Nang', 'bich.tran@example.com', '0987654321', 'Nữ', 32),
('Pham Van Cuong', '789 Tran Hung Dao, HCM', 'cuong.pham@example.com', '0901234567', 'Nam', 45),
('Le Thi Dao', '11A Bach Dang, Hue', 'dao.le@example.com', '0971122334', 'Nữ', 21),
('Hoang Van Em', '22 Vo Thi Sau, Can Tho', 'em.hoang@example.com', '0945123789', 'Nam', 39),
('Do Thi Hoa', '99 Le Loi, Hai Phong', 'hoa.do@example.com', '0912345678', 'Nữ', 30),
('Vo Van Huy', '77 Pham Van Dong, Binh Dinh', 'huy.vo@example.com', '0923456781', 'Nam', 50),
('Nguyen Thi Khanh', '55 Dien Bien Phu, Nha Trang', 'khanh.nguyen@example.com', '0967894321', 'Nữ', 26),
('Pham Van Linh', '33 Ton Duc Thang, Vung Tau', 'linh.pham@example.com', '0934567890', 'Nam', 60),
('Tran Thi My', '44 Nguyen Hue, Quang Ngai', 'my.tran@example.com', '0953217890', 'Nữ', 22);

-- TaiKhoan for KhachHang
SET @first_khachhang_id = LAST_INSERT_ID();

INSERT INTO TaiKhoan (maTaiKhoan, tenDangNhap, matKhau, trangThai, vaiTro, xacMinhEmail, maKhachHang) VALUES
(UUID(), 'anuser', 'nologin', 'Hoat dong', 'KhachHang', TRUE, @first_khachhang_id + 0),
(UUID(), 'bichtran', 'nologin', 'Dung Hoat dong', 'KhachHang', TRUE, @first_khachhang_id + 1),
(UUID(), 'cuongpham', 'nologin', 'Hoat dong', 'KhachHang', TRUE, @first_khachhang_id + 2),
(UUID(), 'daole', 'nologin', 'Hoat dong', 'KhachHang', TRUE, @first_khachhang_id + 3),
(UUID(), 'hoangem', 'nologin', 'Dung Hoat dong', 'KhachHang', TRUE, @first_khachhang_id + 4),
(UUID(), 'hoado', 'nologin', 'Hoat dong', 'KhachHang', TRUE, @first_khachhang_id + 5),
(UUID(), 'huyvo', 'nologin', 'Hoat dong', 'KhachHang', TRUE, @first_khachhang_id + 6),
(UUID(), 'khanhng', 'nologin', 'Dung Hoat dong', 'KhachHang', TRUE, @first_khachhang_id + 7),
(UUID(), 'linhpham', 'nologin', 'Hoat dong', 'KhachHang', TRUE, @first_khachhang_id + 8),
(UUID(), 'mytran', 'nologin', 'Hoat dong', 'KhachHang', TRUE, @first_khachhang_id + 9);

-- Insert NhanVien + TaiKhoan
INSERT INTO NhanVien (hoTen, diaChi, email, phone, gioiTinh, soTuoi) VALUES
('Bui Van Nam', '101 Tran Phu, Ha Noi', 'nam.bui@example.com', '0938912345', 'Nam', 34),
('Ngo Thi Oanh', '202 Hai Ba Trung, Hue', 'oanh.ngo@example.com', '0977123456', 'Nữ', 29),
('Dang Van Phuc', '303 Le Van Sy, HCM', 'phuc.dang@example.com', '0911223344', 'Nam', 42),
('Nguyen Thi Que', '404 Nguyen Van Linh, Da Nang', 'que.nguyen@example.com', '0944556677', 'Nữ', 38),
('Tran Van Sang', '505 Dinh Tien Hoang, Binh Duong', 'sang.tran@example.com', '0966788990', 'Nam', 44),
('Pham Thi Thanh', '606 Ton That Tung, HCM', 'thanh.pham@example.com', '0955112233', 'Nữ', 25),
('Le Van Tien', '707 Nguyen Dinh Chieu, Can Tho', 'tien.le@example.com', '0933445566', 'Nam', 59),
('Ho Thi Uyen', '808 Le Lai, HCM', 'uyen.ho@example.com', '0988332211', 'Nữ', 31),
('Vo Van Vinh', '909 Cach Mang Thang Tam, Dong Nai', 'vinh.vo@example.com', '0922001122', 'Nam', 40),
('Nguyen Thi Xuan', '112 Nguyen Huu Canh, HCM', 'xuan.nguyen@example.com', '0944005566', 'Nữ', 36),
('Tran Van Yen', '113 Phan Dinh Phung, Ha Noi', 'yen.tran@example.com', '0911002233', 'Nam', 47);

SET @first_nhanvien_id = LAST_INSERT_ID();

-- TaiKhoan for NhanVien
INSERT INTO TaiKhoan (maTaiKhoan, tenDangNhap, matKhau, trangThai, vaiTro, xacMinhEmail, maNhanVien) VALUES
(UUID(), 'nambui', '$2a$10$3mTEbyhq7rAp9kCN/ZK9Auj92I/ekyDR43kimH4PbZqhhZiG/.mVu', 'Hoat dong', 'NhanVien', TRUE, @first_nhanvien_id + 0),
(UUID(), 'oanhngo', 'nologin', 'Dung Hoat dong', 'NhanVien', TRUE, @first_nhanvien_id + 1),
(UUID(), 'phucdang', 'nologin', 'Hoat dong', 'NhanVien', TRUE, @first_nhanvien_id + 2),
(UUID(), 'quenguyen', 'nologin', 'Hoat dong', 'NhanVien', TRUE, @first_nhanvien_id + 3),
(UUID(), 'sangtran', 'nologin', 'Dung Hoat dong', 'NhanVien', TRUE, @first_nhanvien_id + 4),
(UUID(), 'thanhpham', 'nologin', 'Hoat dong', 'NhanVien', TRUE, @first_nhanvien_id + 5),
(UUID(), 'tienle', 'nologin', 'Hoat dong', 'NhanVien', TRUE, @first_nhanvien_id + 6),
(UUID(), 'uyenho', 'nologin', 'Hoat dong', 'NhanVien', TRUE, @first_nhanvien_id + 7),
(UUID(), 'vinhvo', 'nologin', 'Dung Hoat dong', 'NhanVien', TRUE, @first_nhanvien_id + 8),
(UUID(), 'xuannguyen', 'nologin', 'Hoat dong', 'NhanVien', TRUE, @first_nhanvien_id + 9),
(UUID(), 'yentran', 'nologin', 'Hoat dong', 'NhanVien', TRUE, @first_nhanvien_id + 10);

-- Insert into DanhMucSuKien
INSERT INTO DanhMucSuKien (tenDanhMuc) VALUES
('Hoi Thao Cong Nghe'),
('Chuong Trinh Tu Thien'),
('Trien Lam Nghe Thuat'),
('Khoa Hoc Ky Nang'),
('Giai Dau The Thao');

