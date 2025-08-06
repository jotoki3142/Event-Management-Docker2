'use client';

import { useEffect, useState } from 'react';
import '@/public/css/style.css';
import '@/public/css/order.css';
import DOMPurify from 'dompurify';

interface HoaDon {
  maHoaDon: string;
  trangThaiHoaDon: string;
  tongTien: number;
  thoiGianThanhCong: string;
  phuongThucThanhToan: string;
  tenKhachHang: string;
  tenSuKien: string;
  maSuKien: string;
  maDiemDanh: string;
}

interface ApiResponse {
  content: HoaDon[];
  totalPages: number;
  number: number;
}

interface CauHoiResponse {
  noiDungCauHoi: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<HoaDon[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [questions, setQuestions] = useState<Record<string, string>>({});
  const [orderDetails, setOrderDetails] = useState<Record<string, any>>({});

  const fetchOrders = async (page: number) => {
    try {
      const res = await fetch(`http://localhost:5555/api/hoadon/get/all?page=${page}&size=5`, {
        credentials: 'include',
      });
      const data: ApiResponse = await res.json();
      setOrders(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error('Error fetching orders', err);
    }
  };

  const fetchCauHoi = async (maSuKien: string, maHoaDon: string) => {
    try {
      const res = await fetch(`http://localhost:5555/api/cauhoi/get/sukien/${maSuKien}`, {
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('No question data');
      }

      const data: CauHoiResponse = await res.json();
      setQuestions((prev) => ({ ...prev, [maHoaDon]: DOMPurify.sanitize(data.noiDungCauHoi) }));
    } catch (err) {
      setQuestions((prev) => ({
        ...prev,
        [maHoaDon]: 'Bạn đã không đặt câu hỏi cho sự kiện này',
      }));
    }
  };

  const fetchOrderDetails = async (maDiemDanh: string, maHoaDon: string) => {
    try {
      const res = await fetch(`http://localhost:5555/api/diemdanh/get/${maDiemDanh}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch order details');
  
      const data = await res.json();
      setOrderDetails((prev) => ({ ...prev, [maHoaDon]: data }));
    } catch (err) {
      console.error('Failed to load ticket info:', err);
    }
  };

  useEffect(() => {
    fetchOrders(page);
  }, [page]);

  const toggleDropdown = (order: HoaDon) => {
    const isExpanding = expanded !== order.maHoaDon;
    setExpanded(isExpanding ? order.maHoaDon : null);
  
    if (isExpanding && order.trangThaiHoaDon === 'Đã thanh toán') {
      if (!questions[order.maHoaDon]) {
        fetchCauHoi(order.maSuKien, order.maHoaDon);
      }
      if (order.maDiemDanh && !orderDetails[order.maHoaDon]) {
        fetchOrderDetails(order.maDiemDanh, order.maHoaDon);
      }
    }
  };
  

  return (
    <section className="orders-container">
      <h2 className="orders-title">Hóa đơn của tôi</h2>

      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.maHoaDon} className="order-card">
            <button
              className="order-header"
              onClick={() => toggleDropdown(order)}
            >
              <div className="order-summary">
                <div className="order-title">{DOMPurify.sanitize(order.tenSuKien)}</div>
                <div className="order-info">
                  Tổng tiền: {order.tongTien.toLocaleString()} VND
                </div>
                <span className={`badge ${
                  order.trangThaiHoaDon === 'Chưa thanh toán'
                    ? 'chua-thanh-toan'
                    : order.trangThaiHoaDon === 'Đã thanh toán'
                    ? 'da-thanh-toan'
                    : 'da-huy'
                }`}>
                  {order.trangThaiHoaDon}
                </span>
              </div>
              <div className="order-toggle">{expanded === order.maHoaDon ? '▲' : '▼'}</div>
            </button>

            {expanded === order.maHoaDon && (
  <div className="order-details">
    {order.trangThaiHoaDon === 'Đã thanh toán' ? (
      <>
        <h1>Thông tin vé</h1>
        {orderDetails[order.maHoaDon] ? (
          <>
            <strong>Họ tên: </strong>  {DOMPurify.sanitize(orderDetails[order.maHoaDon].tenKhachHang)}<br/>
            <strong>Ghế: </strong>  {DOMPurify.sanitize(orderDetails[order.maHoaDon].viTriGheNgoi)}<br/>
            <strong>Ngày đặt: </strong> {new Date(orderDetails[order.maHoaDon].ngayTaoVe).toLocaleString('vi-VN')}<br/>
            <strong>Câu hỏi đã đặt: </strong>{questions[order.maHoaDon] && questions[order.maHoaDon]}
          </>
        ) : (
          <p>Đang tải thông tin vé...</p>
        )}
      </>
    ) : (
      <p>Không có dữ liệu vé cho hóa đơn này</p>
    )}
  </div>
)}

          </div>
        ))}
      </div>

      <div className="pagination">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 0))}
          disabled={page === 0}
        >
          Trang trước
        </button>

        <span className="current-page">
          Trang {page + 1} / {totalPages}
        </span>

        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
          disabled={page >= totalPages - 1}
        >
          Trang sau
        </button>
      </div>
    </section>
  );
}
