'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import '@/public/css/style.css';
import '@/public/css/event-detail.css';
import { useUser } from '@/context/UserContext';
import Link from 'next/link';
import DOMPurify from 'dompurify';

interface SuKien {
  maSuKien: number;
  tenSuKien: string;
  moTa: string;
  anhSuKien: string;
  diaDiem: string;
  trangThaiSuKien: string;
  phiThamGia: number;
  luongChoNgoi: number;
  ngayBatDau: string;
  ngayKetThuc: string;
}

interface Review {
  maDanhGia: number;
  loaiDanhGia: number;
  binhLuan: string;
  ngayDanhGia: string;
  tenKhachHang: string;
  tenSuKien: string;
}

export default function EventDetailPage() {
  const params = useParams();
  const maSuKien = Number(params?.maSuKien);


  const [event, setEvent] = useState<SuKien | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isAfterEvent, setIsAfterEvent] = useState(false);
  const { user } = useUser();
  const [stars, setStars] = useState('');
  const [content, setContent] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!maSuKien) return;

    fetch(`http://localhost:5555/api/sukien/get/${maSuKien}`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        setEvent(data);

        const now = new Date();
        const endTime = new Date(data.ngayKetThuc);
        if (data.trangThaiSuKien === 'Đã kết thúc') setIsAfterEvent(true);
      })
      .catch((err) => console.error('Failed to fetch event:', err));
  }, [maSuKien]);

  useEffect(() => {
    if (!maSuKien || !isAfterEvent) return;

    fetch(`http://localhost:5555/api/danhgia/sukien/${maSuKien}/get/all`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => setReviews(data.content || []))
      .catch((err) => console.error('Failed to fetch reviews:', err));
  }, [maSuKien, isAfterEvent]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('vi-VN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  const formatCurrency = (amount: number) =>
    amount.toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND',
    });

  if (!event) {
    return (
      <main>
        <div className="event-detail-container">Đang tải sự kiện...</div>
      </main>
    );
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackMessage(null);
  
    if (!stars || !content.trim()) {
      setFeedbackMessage({ type: 'error', text: 'Vui lòng nhập đầy đủ đánh giá.' });
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      const res = await fetch(`http://localhost:5555/api/danhgia/${event.maSuKien}/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          loaiDanhGia: Number(stars),
          binhLuan: content.trim(),
        }),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.error || 'Gửi đánh giá thất bại.');
      }
  
      // Add to frontend list without re-fetch
      const newReview = {
        maDanhGia: Date.now(),
        loaiDanhGia: Number(stars),
        binhLuan: content.trim(),
        ngayDanhGia: new Date().toISOString(),
        tenKhachHang: user?.hoTen || user?.tenDangNhap || 'Ẩn danh',
        tenSuKien: event.tenSuKien,
      };
  
      setReviews((prev) => [...prev, newReview]);
      setStars('');
      setContent('');
      setFeedbackMessage({ type: 'success', text: data.message || 'Gửi đánh giá thành công!' });
    } catch (err: any) {
      setFeedbackMessage({ type: 'error', text: err.message || 'Lỗi khi gửi đánh giá.' });
    } finally {
      setIsSubmitting(false);
    }
  };  
  return (
    <main>
      <div className="event-detail-container">
        <Link href="/sukien" className="back-link">← Quay lại</Link>

        <div className="event-detail-wrapper">
          <div className="event-image">
            <img id="event-img" src={event.anhSuKien === null ? 
              'https://cdn5.vectorstock.com/i/1000x1000/74/69/upcoming-events-neon-sign-on-brick-wall-background-vector-37057469.jpg' : 
              `http://localhost:5555/api/sukien/get${event.anhSuKien}`} alt="Ảnh sự kiện" />
          </div>
          <div className="event-info">
            <h1 id="event-title">{DOMPurify.sanitize(event.tenSuKien)}</h1>
            <p><strong>Bắt đầu:</strong> <span id="event-start">{formatDate(event.ngayBatDau)}</span></p>
            <p><strong>Kết thúc:</strong> <span id="event-end">{formatDate(event.ngayKetThuc)}</span></p>
            <p><strong>Địa điểm:</strong> <span id="event-location">{DOMPurify.sanitize(event.diaDiem)}</span></p>
            <p><strong>Giá vé:</strong> <span id="event-price">{formatCurrency(event.phiThamGia)}</span></p>
            <p><strong>Mô tả:</strong></p>
            <p id="event-description">{event.moTa}</p>
            <p><strong>Ghế ngồi:</strong> <span id="event-seats">{event.luongChoNgoi}</span></p>
            <p><strong>Trạng thái:</strong> <span id="event-status">{event.trangThaiSuKien}</span></p>
            {event.trangThaiSuKien === 'Còn chỗ' ? (
              <Link href={`/dangky/${event.maSuKien}`} className="nostyle">
                <button id="register-link" className="btn-register">Đăng ký</button>
              </Link>
            ) : (
              <button id="register-link" className="btn-register" disabled>
                Đăng ký
              </button>
            )}
          </div>
        </div>

        {isAfterEvent && (
          <div id="review-section" style={{ marginTop: '40px' }}>
            <h3>Đánh giá sự kiện</h3>
            {/* (Form logic can go here later if needed) */}
            {user?.vaiTro === 'KhachHang' ? (
  <form id="review-form" onSubmit={handleSubmitReview}>
    <label>Chọn số sao:</label><br />
    <select
      id="review-stars"
      required
      value={stars}
      onChange={(e) => setStars(e.target.value)}
      disabled={isSubmitting}
    >
      <option value="">-- Chọn --</option>
      <option value="5">5 - Tuyệt vời</option>
      <option value="4">4 - Tốt</option>
      <option value="3">3 - Bình thường</option>
      <option value="2">2 - Tạm được</option>
      <option value="1">1 - Tệ</option>
    </select><br /><br />

    <label>Đánh giá chi tiết:</label><br />
    <textarea
      id="review-content"
      rows={4}
      required
      value={content}
      onChange={(e) => setContent(e.target.value)}
      disabled={isSubmitting}
    ></textarea><br /><br />

    <button type="submit" disabled={isSubmitting}>
      {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
    </button>

    {feedbackMessage && (
      <p style={{ color: feedbackMessage.type === 'error' ? 'red' : 'green', marginTop: '10px' }}>
        {feedbackMessage.text}
      </p>
    )}
  </form>
) : (
  <p style={{ color: 'gray', marginTop: '10px' }}>
    🔒 Chỉ người đã đăng nhập và tham gia sự kiện mới được đánh giá.
  </p>
)}


            <div id="review-list" style={{ marginTop: '20px' }}>
              <h4>Đánh giá từ người khác:</h4>
              {reviews.length === 0 ? (
                <p>Chưa có đánh giá nào cho sự kiện này.</p>
              ) : (
                reviews.map((r) => (
                  <div key={r.maDanhGia} className="review-item">
                    <p><strong>{DOMPurify.sanitize(r.tenKhachHang)}</strong> - {r.loaiDanhGia} ⭐</p>
                    <p>{DOMPurify.sanitize(r.binhLuan)}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
