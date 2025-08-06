'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DOMPurify from 'dompurify';
import '@/public/css/style.css';
import '@/public/css/register-event.css';
import { useUser } from '@/context/UserContext';

interface SuKien {
  maSuKien: number;
  tenSuKien: string;
  moTa: string;
  anhSuKien: string | null;
  diaDiem: string;
  trangThaiSuKien: string;
  phiThamGia: number;
  luongChoNgoi: number;
  ngayBatDau: string;
  ngayKetThuc: string;
  occupiedSeat: string[];
}

export default function EventBookingPage() {
  const { maSuKien } = useParams();
  const router = useRouter();
  const [suKien, setSuKien] = useState<SuKien | null>(null);
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    const fetchSuKien = async () => {
      try {
        const res = await fetch(`http://localhost:5555/api/sukien/get/${maSuKien}`, {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Fetch error');

        const data = await res.json();
        const { trangThaiSuKien } = data;

        switch (trangThaiSuKien) {
          case 'Còn chỗ':
            setSuKien(data);
            break;
          case 'Hết chỗ':
            setStatusError('Sự kiện này đã hết chỗ.');
            break;
          case 'Hết hạn đăng ký':
            setStatusError('Sự kiện này đã hết hạn đăng ký.');
            break;
          case 'Đang diễn ra':
            setStatusError('Sự kiện này đang diễn ra.');
            break;
          case 'Đã kết thúc':
            setStatusError('Sự kiện này đã kết thúc.');
            break;
          case 'Hủy bỏ':
            setStatusError('Sự kiện này đã bị hủy bỏ.');
            break;
          default:
            setStatusError('Đã xảy ra lỗi không xác định.');
        }
      } catch (err) {
        setStatusError('Không thể tải sự kiện. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchSuKien();
  }, [maSuKien]);

  useEffect(() => {
    if (user && user.vaiTro !== 'KhachHang') {
      router.push('/');
    }
  }, [user]);  

  const isSeatBooked = (index: number): boolean => {
    return suKien?.occupiedSeat?.includes(index.toString()) ?? false;
  };

  const handleSeatClick = (seatNumber: number) => {
    if (isSeatBooked(seatNumber)) return;

    if (selectedSeat === seatNumber) {
      setSelectedSeat(null);
    } else {
      setSelectedSeat(seatNumber);
    }
  };

  const handleBooking = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!selectedSeat) {
      setBookingError('Vui lòng chọn một ghế.');
      return;
    }

    setIsSubmitting(true);
    setBookingError(null);

    try {
      const response = await fetch(`http://localhost:5555/api/sukien/dangky/${maSuKien}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          viTriGhe: selectedSeat.toString(),
          phuongThucThanhToan: 'Qua ngân hàng',
        }),
      });

      const result = await response.json();

      if (result.error) {
        setBookingError(result.error);
      } else if (result.url) {
        window.location.href = result.url;
      } else {
        setBookingError('Phản hồi không hợp lệ từ máy chủ.');
      }
    } catch (err) {
      setBookingError('Đã xảy ra lỗi khi gửi yêu cầu đăng ký.');
    } finally {
      setIsSubmitting(false);
    }
  };

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

  if (loading) return <p>Đang tải sự kiện...</p>;

  if (statusError) {
    return (
      <div className="container my-8 text-center text-red-600 font-semibold">
        <p>{statusError}</p>
      </div>
    );
  }

  if (!suKien) {
    return (
      <div className="container my-8 text-center text-red-600 font-semibold">
        <p>Không tìm thấy sự kiện.</p>
      </div>
    );
  }

  return (
    <main className="event-booking">
      <div className="containers">
        <h1>Đặt vé sự kiện</h1>

        <div className="event-info">
          <div className="event-details">
            <h2 id="event-title">{DOMPurify.sanitize(suKien.tenSuKien)}</h2>
            <p><strong>Bắt đầu:</strong> <span id="event-start">{formatDate(suKien.ngayBatDau)}</span></p>
            <p><strong>Kết thúc:</strong> <span id="event-end">{formatDate(suKien.ngayKetThuc)}</span></p>
            <p><strong>Địa điểm:</strong> <span id="event-location">{DOMPurify.sanitize(suKien.diaDiem)}</span></p>
            <p><strong>Giá vé:</strong> <span id="event-price">{suKien.phiThamGia} VND</span></p>
          </div>
        </div>

        <div className="seating-chart">
          <h2 className="seating-title">Sơ đồ chỗ ngồi</h2>
          <div className="stage">SÂN KHẤU</div>

          <div className="legend">
            <div className="legend-item">
              <div className="legend-color available"></div>
              <span>Còn trống</span>
            </div>
            <div className="legend-item">
              <div className="legend-color booked"></div>
              <span>Đã đặt</span>
            </div>
            <div className="legend-item">
              <div className="legend-color selected"></div>
              <span>Đang chọn</span>
            </div>
          </div>

          <div className="seats-containers" id="seatsContainers">
            {Array.from({ length: suKien.luongChoNgoi }, (_, i) => {
              const seatNumber = i + 1;
              const isBooked = isSeatBooked(seatNumber);
              const isSelected = selectedSeat === seatNumber;

              return (
                <div
                  key={seatNumber}
                  className={`seat ${isBooked ? 'booked' : ''} ${isSelected ? 'selected' : ''}`}
                  data-seat-number={seatNumber}
                  onClick={() => handleSeatClick(seatNumber)}
                >
                  {seatNumber}
                </div>
              );
            })}
          </div>

          {bookingError && (
            <div style={{color: 'red', marginBottom: '10px'}}>{bookingError}</div>
          )}

          <button
            id="bookButton"
            type="button"
            disabled={selectedSeat === null || isSubmitting}
            onClick={handleBooking}
          >
            {isSubmitting ? 'Đang xử lý...' : 'Đặt vé'}
          </button>
        </div>
      </div>
    </main>
  );
}
