'use client';

import '@/public/css/style.css';
import '@/public/css/about1.css';
import Link from 'next/link';

export default function AboutPage() {
    return (
      <>
  {/* Hero Section */}
  <section className="hero-section">
    <div className="hero-container">
      <h1 className="hero-title">Câu Chuyện Của Chúng Tôi</h1>
      <p className="hero-subtitle">Sáng tạo - Chuyên nghiệp - Tận tâm</p>
      <Link href="#about" className="hero-btn">
        Khám Phá
      </Link>
    </div>
  </section>
  {/* About Section */}
  <section id="about" className="about-section">
    <div className="about-container">
      <div className="about-flex">
        <div className="about-content">
          <h2 className="about-title">Về Chúng Tôi</h2>
          <p className="about-desc">
            EventPro được thành lập năm 2010 với sứ mệnh mang đến những trải
            nghiệm sự kiện đáng nhớ nhất cho khách hàng.
          </p>
          <p className="about-desc">
            Với hơn 12 năm kinh nghiệm trong ngành tổ chức sự kiện, chúng tôi tự
            hào đã thực hiện thành công hơn 500 sự kiện lớn nhỏ khác nhau, từ
            hội nghị doanh nghiệp, tiệc cưới sang trọng đến các chương trình ra
            mắt sản phẩm.
          </p>
          <div className="about-stats">
            <div className="about-stat">500+ Sự kiện</div>
            <div className="about-stat">50+ Đối tác</div>
            <div className="about-stat">98% Hài lòng</div>
          </div>
          <Link href="/lienhe" className="about-btn">
            Liên Hệ Ngay
          </Link>
        </div>
        <div className="about-image">
          <img
            src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/795d8adb-4d50-47d8-8f80-e23ba23ab10f.png"
            alt="Nhóm EventPro đang làm việc tại một sự kiện với khách hàng trong không gian văn phòng hiện đại"
            className="about-img"
          />
        </div>
      </div>
    </div>
  </section>
  {/* Team Section */}
  <section className="team-section">
    <div className="team-container">
      <div className="team-header">
        <h2 className="team-title">Đội Ngũ Chuyên Gia</h2>
        <p className="team-desc">
          Đội ngũ giàu kinh nghiệm với niềm đam mê tạo nên những sự kiện hoàn
          hảo
        </p>
      </div>
      <div className="team-grid">
        <div className="team-card">
          <div className="team-avatar">
            <img
              src="https://avatar.iran.liara.run/public/21"
              alt="Giám đốc sáng tạo nam với phong cách chuyên nghiệp, đeo kính và mỉm cười"
              className="team-img"
            />
          </div>
          <h3 className="team-name">guyn123</h3>
          <p className="team-role">Giám Đốc Sáng Tạo</p>
          <p className="team-info">12 năm kinh nghiệm tổ chức sự kiện lớn</p>
        </div>
        <div className="team-card">
          <div className="team-avatar">
            <img
              src="https://avatar.iran.liara.run/public/13"
              alt="Trưởng phòng tổ chức sự kiện nữ với nụ cười thân thiện và trang phục công sở"
              className="team-img"
            />
          </div>
          <h3 className="team-name">anhtrauluoi</h3>
          <p className="team-role">Trưởng Phòng Tổ Chức</p>
          <p className="team-info">Chuyên gia logistics sự kiện</p>
        </div>
        <div className="team-card">
          <div className="team-avatar">
            <img
              src="https://avatar.iran.liara.run/public/22"
              alt="Chuyên gia thiết kế sự kiện trẻ tuổi với phong cách cá tính và sáng tạo"
              className="team-img"
            />
          </div>
          <h3 className="team-name">Washroom7130</h3>
          <p className="team-role">Chuyên Gia Thiết Kế</p>
          <p className="team-info">Thiết kế không gian sự kiện độc đáo</p>
        </div>
        <div className="team-card">
          <div className="team-avatar">
            <img
              src="https://avatar.iran.liara.run/public/27"
              alt="Quản lý khách hàng nữ với phong cách chuyên nghiệp và năng động"
              className="team-img"
            />
          </div>
          <h3 className="team-name">jotoki3142</h3>
          <p className="team-role">Quản Lý Khách Hàng</p>
          <p className="team-info">Chăm sóc khách hàng tận tâm</p>
        </div>
      </div>
    </div>
  </section>
  {/* Values Section */}
  <section className="value-section">
    <div className="value-container">
      <div className="value-header">
        <h2 className="value-title">Giá Trị Cốt Lõi</h2>
        <p className="value-desc">
          Những nguyên tắc làm nên thương hiệu EventPro
        </p>
      </div>
      <div className="value-grid">
        <div className="value-card">
          <div className="value-icon">
            <svg
              className="icon-svg"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h3 className="value-name">Sáng Tạo</h3>
          <p className="value-info">
            Luôn đổi mới và sáng tạo trong mọi ý tưởng tổ chức sự kiện
          </p>
        </div>
        <div className="value-card">
          <div className="value-icon">
            <svg
              className="icon-svg"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <h3 className="value-name">Chuyên Nghiệp</h3>
          <p className="value-info">
            Quy trình làm việc bài bản với đội ngũ giàu kinh nghiệm
          </p>
        </div>
        <div className="value-card">
          <div className="value-icon">
            <svg
              className="icon-svg"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <h3 className="value-name">Tận Tâm</h3>
          <p className="value-info">
            Đặt khách hàng làm trung tâm trong mọi quyết định
          </p>
        </div>
      </div>
    </div>
  </section>
  {/* CTA Section */}
  <section className="cta-section">
    <div className="cta-container">
      <h2 className="cta-title">Sẵn Sàng Tạo Nên Sự Kiện Đáng Nhớ?</h2>
      <p className="cta-desc">
        Hãy để chúng tôi biến ý tưởng của bạn thành hiện thực
      </p>
      <Link href="/lienhe" className="cta-btn">
        Liên Hệ Ngay
      </Link>
    </div>
  </section>
</>

    );
}