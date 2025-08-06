'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import Link from 'next/link';
import DOMPurify from 'dompurify';

interface Event {
  maSuKien: number;
  tenSuKien: string;
  moTa: string;
  anhSuKien: string;
  diaDiem: string;
  phiThamGia: number;
  ngayBatDau: string;
  ngayKetThuc: string;
}

const faqs = [
  {
    id: 'collapseOne',
    headingId: 'headingOne',
    question: 'Sự kiện có yêu cầu đăng ký trước không?',
    answer: 'Thông thường, các sự kiện sẽ yêu cầu đăng ký trước để đảm bảo chỗ ngồi và chuẩn bị tài liệu cần thiết cho người tham dự.',
  },
  {
    id: 'collapseTwo',
    headingId: 'headingTwo',
    question: 'Tôi có thể hủy đăng ký sự kiện nếu không tham gia được không?',
    answer: 'Bạn nên kiểm tra chính sách hủy đăng ký của sự kiện. Nhiều sự kiện cho phép hủy miễn phí trong một khoảng thời gian nhất định trước ngày diễn ra.',
  },
  {
    id: 'collapseThree',
    headingId: 'headingThree',
    question: 'Tôi có nhận được chứng nhận khi tham dự sự kiện không?',
    answer: 'Một số sự kiện (đặc biệt là hội thảo, khóa đào tạo) sẽ cấp chứng nhận tham dự, hãy hỏi rõ khi đăng ký.',
  },
  {
    id: 'collapse_4',
    headingId: 'heading_4',
    question: 'Tham dự sự kiện có mất phí không?',
    answer: 'Tùy vào loại sự kiện. Có sự kiện hoàn toàn miễn phí, nhưng cũng có những sự kiện yêu cầu mua vé hoặc đóng phí đăng ký.',
  },
];

export default function HomePage() {

  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:5555/api/sukien/get/all?size=3');
        const data = await response.json();
        setEvents(data.content || []);
      } catch (error) {
        console.error('Error fetching featured events:', error);
      }
    };

    fetchEvents();
  }, []);

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const [openId, setOpenId] = useState('collapseOne'); // default opened item

  const toggleCollapse = (id: string) => {
    setOpenId((prev) => (prev === id ? '' : id));
  };

  return (
    <>
      {/* Hero Slider Section */}
      <section className="slider-container">
        <div className="hero-slider-section">
        <Swiper
  modules={[Autoplay, EffectFade]}
  autoplay={{
    delay: 3000,
    disableOnInteraction: false,
  }}
  loop={true}
  effect="fade"
  fadeEffect={{ crossFade: true }}
  className="hero-slider-active swiper-container"
  style={{ minHeight: '400px' }}
>
  <SwiperSlide>
    <div className="hero-single-slider-item">
      <div className="hero-slider-bg">
        <img
          src="/img/1-van-lang-17030396662872128757935.jpg"
          alt="Slide 1"
          width={1200}
          height={600}
        />
      </div>
      <div className="hero-slider-wrapper">
        <div className="container">
          <div className="row">
            <div className="col-auto">
              <div className="hero-slider-content">
                <Link href="/sukien" className="cta-button">Tham gia ngay</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </SwiperSlide>

  <SwiperSlide>
    <div className="hero-single-slider-item">
      <div className="hero-slider-bg">
        <img
          src="/img/nghien-cuu-khoa-hoc-sinh-vien-truong-dai-hoc-cmc-19.jpg"
          alt="Slide 2"
          width={1200}
          height={600}
        />
      </div>
      <div className="hero-slider-wrapper">
        <div className="container">
          <div className="row">
            <div className="col-auto">
              <div className="hero-slider-content">
                <Link href="/sukien" className="cta-button">Tham gia ngay</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </SwiperSlide>
</Swiper>

        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Tại sao chọn chúng tôi?</h2>
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">
                <Image src="/img/banners/su_kien_phong_phu.png" alt="Đa dạng" width={80} height={80} />
              </div>
              <h3>SỰ KIỆN ĐA DẠNG</h3>
              <p>Chúng tôi tổ chức nhiều loại sự kiện khác nhau như hội thảo, workshop, networking, triển lãm với nội dung phong phú, phù hợp với nhiều lĩnh vực.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <Image src="/img/banners/service-promo-7.png" alt="An toàn" width={80} height={80} />
              </div>
              <h3>ĐĂNG KÝ AN TOÀN</h3>
              <p>Hệ thống đăng ký sự kiện bảo mật, thanh toán trực tuyến an toàn, xác nhận nhanh chóng qua email hoặc SMS.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <Image src="/img/banners/thoi_gian_linh_hoat.png" alt="Thời gian" width={80} height={80} />
              </div>
              <h3>THỜI GIAN LINH HOẠT</h3>
              <p>Lịch trình được thiết kế linh hoạt, phù hợp với các khung giờ trong tuần, đảm bảo thuận tiện cho người tham dự.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <Image src="/img/banners/service-promo-4.png" alt="Quà tặng" width={80} height={80} />
              </div>
              <h3>QUÀ TẶNG HẤP DẪN</h3>
              <p>Người tham dự nhận được voucher, tài liệu chuyên môn và các phần quà lưu niệm độc quyền từ ban tổ chức.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Speaker Section */}
      <div className="team-wrapper">
        <h3 className="section-title">MỘT SỐ DIỄN GIẢ ĐÁNG CHÚ Ý</h3>
        <div className="team-row">
          {[
            { name: 'Tim Cook', title: 'CEO của Apple - Lãnh đạo công nghệ toàn cầu', img: '/img/timcook.jpg' },
            { name: 'Elon Musk', title: 'CEO Tesla & SpaceX - Tầm nhìn công nghệ tương lai', img: '/img/USAFA_Hosts_Elon_Musk.jpg' },
            { name: 'Putin', title: 'Tổng thống Nga - Ảnh hưởng địa chính trị toàn cầu', img: '/img/putin.jpg' },
            { name: 'Sơn Tùng M-TP', title: 'Ca sĩ & Nhà sáng tạo âm nhạc', img: '/img/MTP.jpg' }
          ].map((speaker, i) => (
            <div className="team-single" key={i}>
              <div className="team-img">
                <Image src={speaker.img} alt={speaker.name} width={300} height={300} />
              </div>
              <h6 className="team-name">{speaker.name}</h6>
              <span className="team-title">{speaker.title}</span>
              <ul className="team-social">
                {/* {[...Array(5)].map((_, j) => (
                  <li key={j}><a href="#"><i className="ion-social-facebook"></i></a></li>
                ))} */}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Events Placeholder */}
      <div className="event-section">
      <div className="featured-events">
        <h2>Sự kiện nổi bật</h2>
      </div>
      <div className="event-grid" id="featured-events-container">
        {events.map((event) => (
          <div className="event-card" key={event.maSuKien}>
            <div className="event-image">
            <img id="event-img" src={event.anhSuKien === null ? 
              'https://cdn5.vectorstock.com/i/1000x1000/74/69/upcoming-events-neon-sign-on-brick-wall-background-vector-37057469.jpg' : 
              `http://localhost:5555/api/sukien/get${event.anhSuKien}`} alt="Ảnh sự kiện" />
            </div>
            <div className="event-info">
              <div className="event-meta">
                <span className="event-date-start">
                  <i className="fas fa-calendar-alt"></i> Bắt đầu: {formatDate(event.ngayBatDau)}
                </span>
                <span className="event-date-end">
                  <i className="fas fa-calendar-check"></i> Kết thúc: {formatDate(event.ngayKetThuc)}
                </span>
              </div>
              <h3 className="event-title">{DOMPurify.sanitize(event.tenSuKien)}</h3>
              <p className="event-location">
                <i className="fas fa-map-marker-alt"></i> {DOMPurify.sanitize(event.diaDiem)}
              </p>
              <div className="event-footer">
                <span className="event-price">{event.phiThamGia.toLocaleString()}₫</span>
                <Link href={`/sukien/${event.maSuKien}`} className="btn-detail">Xem chi tiết</Link>
                <Link href={`/sukien/${event.maSuKien}`} className="btn-register">Đăng ký</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

      {/* FAQ Section Placeholder */}
      <div className="faq_area">
      <div className="container">
        <div className="row">
          <div className="col-xl-12">
            <div className="serction_title_large mb-95">
              <h3>Frequently Ask</h3>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xl-12">
            <div id="accordion">
              {faqs.map((faq) => (
                <div className="card" key={faq.id}>
                  <div className="card-header" id={faq.headingId}>
                    <h5 className="mb-0">
                      <button
                        className={`btn btn-link ${openId === faq.id ? '' : 'collapsed'}`}
                        onClick={() => toggleCollapse(faq.id)}
                        aria-expanded={openId === faq.id}
                        aria-controls={faq.id}
                      >
                        <img src="/img/banners/info.png" alt="" /> {faq.question}
                      </button>
                    </h5>
                  </div>
                  <div
                    id={faq.id}
                    className={`collapse ${openId === faq.id ? 'show' : ''}`}
                    aria-labelledby={faq.headingId}
                    data-parent="#accordion"
                  >
                    <div className="card-body">{faq.answer}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
