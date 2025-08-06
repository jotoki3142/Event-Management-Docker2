'use client';

import '@/public/css/style.css';
import '@/public/css/contact.css';
import { useState } from 'react';

export default function LienHePage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReset = () => {
    setName('');
    setEmail('');
    setContent('');
    setMessage('');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsSubmitting(true);

    try {
      const res = await fetch('http://localhost:5555/api/ticket/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tenKhachHang: name,
          email,
          noiDung: content,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || 'Gửi liên hệ thành công!');
        // Delay reset to let the user see the message
        setTimeout(() => {
          handleReset();
        }, 10000);
      } else {
        setError(data.error || 'Đã xảy ra lỗi khi gửi liên hệ.');
      }
    } catch (err) {
      setError('Không thể kết nối đến máy chủ.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <div className="container">
        <div className="contact-container">
          {/* Contact Info */}
          <div className="contact-info">
            <div className="info-item">
              <div className="icon">
                <i className="fa-solid fa-location-dot"></i>
              </div>
              <div className="info-content">
                <h3>ĐỊA CHỈ</h3>
                <p>372B Xã Đàn, Nam Đồng, Đống Đa, Hà Nội</p>
              </div>
            </div>

            <div className="info-item">
              <div className="icon">
                <i className="fa-solid fa-phone"></i>
              </div>
              <div className="info-content">
                <h3>ĐIỆN THOẠI</h3>
                <p>082 8061 555</p>
              </div>
            </div>

            <div className="info-item">
              <div className="icon">
                <i className="fa-solid fa-envelope"></i>
              </div>
              <div className="info-content">
                <h3>EMAIL</h3>
                <p>sukien@gmail.com</p>
              </div>
            </div>

            <div className="info-item">
              <div className="icon">
                <i className="fa-solid fa-globe"></i>
              </div>
              <div className="info-content">
                <h3>WEBSITE</h3>
                <p>event.com</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-container">
            <h2>GỬI THÔNG TIN LIÊN HỆ ĐẾN TRUNG TÂM SỰ KIỆN</h2>

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name"><i className="fas fa-user"></i></label>
                <input
                  type="text"
                  id="name"
                  placeholder="Họ tên (*)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email"><i className="fas fa-envelope"></i></label>
                <input
                  type="email"
                  id="email"
                  placeholder="Email (*)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="content"><i className="fas fa-comment-alt"></i></label>
                <textarea
                  id="content"
                  placeholder="Nội dung (*)"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
              </div>

              <div className="form-note">
                <p>(*): là các phần quý khách hàng bắt buộc phải điền. Xin cảm ơn!</p>
              </div>

              {message && <p style={{ color: 'green', marginTop: 10, marginBottom: 10 }}>{message}</p>}
              {error && <p style={{ color: 'red', marginTop: 10, marginBottom: 10 }}>{error}</p>}

              <div className="form-buttons">
                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? 'Đang gửi...' : 'GỬI LIÊN HỆ'}
                </button>
                <button type="button" className="reset-btn" onClick={handleReset}>
                  Xóa nội dung
                </button>
              </div>
            </form>
          </div>

          {/* Map */}
          <div className="map-container">
            <iframe
              src="https://maps.google.com/maps?q=21.017346,105.829918&z=16&output=embed"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            />
            <div className="map-info">
              <h3>TRUNG TÂM SỰ KIỆN N3</h3>
              <p>372B P. Xã Đàn, Nam Đồng, Đống Đa<br />Hà Nội 100000</p>
              <a
                href="https://www.google.com/maps?q=21.017346,105.829918&z=16"
                target="_blank"
                className="view-reviews"
                rel="noreferrer"
              >
                Xem bản đồ lớn hơn
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
