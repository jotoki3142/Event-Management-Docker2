'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import '@/public/css/index.css';
import '@/public/css/style.css';
import '@/public/css/account.css';
import '@/public/css/event.css';
import { useRouter, useSearchParams } from 'next/navigation';
import DOMPurify from 'dompurify';

interface DanhMuc {
  maDanhMuc: number;
  tenDanhMuc: string;
}

interface Event {
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
  maDanhMuc: number | null;
  rating: number;
}

function SuKienPageContent() {
  const [categories, setCategories] = useState<DanhMuc[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [price, setPrice] = useState(5000000);
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchParam = searchParams.get("search") ?? "";
  const trangThaiParam = searchParams.get("trangThai") ?? "";
  const categoryParam = searchParams.get("category") ?? "all";
  const costStartParam = searchParams.get("costStart") ?? "";
  const costEndParam = searchParams.get("costEnd") ?? "";
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetch('http://localhost:5555/api/danhmucsukien/get/all?size=100', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        setCategories(data.content || []);
      })
      .catch(err => console.error('Error fetching categories:', err));
  }, []);

  useEffect(() => {
    setPage(0);
  }, [searchParam, categoryParam, trangThaiParam, costStartParam, costEndParam]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const params = new URLSearchParams();
        params.set("page", page.toString());
        params.set("size", "12");

        if (searchParam) params.set("search", searchParam);
        if (categoryParam && categoryParam !== "all") {
          params.set("maDanhMuc", categoryParam);
        }
        if (trangThaiParam && trangThaiParam !== "all") {
          params.set("trangThai", trangThaiParam);
        }
        if (costStartParam) params.set("costStart", costStartParam);
        if (costEndParam) params.set("costEnd", costEndParam);

        const res = await fetch(
          `http://localhost:5555/api/sukien/get/all?${params.toString()}`,
          { credentials: "include" }
        );

        const data = await res.json();

        if (res.ok) {
          if (data.content.length === 0) {
            setErrorMsg("Không tìm thấy kết quả phù hợp");
          } else {
            setEvents(data.content);
            setTotalPages(data.totalPages);
            setErrorMsg("");
          }
        } else {
          setEvents([]);
          setTotalPages(0);
          setErrorMsg("Không tìm thấy kết quả phù hợp");
        }
      } catch (error) {
        console.error("Failed to fetch events:", error);
        setEvents([]);
        setTotalPages(0);
        setErrorMsg("Không tìm thấy kết quả phù hợp");
      }
    };

    fetchEvents();
  }, [page, searchParam, categoryParam, trangThaiParam, costStartParam, costEndParam]);

  const handleFilterByPrice = () => {
    const query = new URLSearchParams();
    if (categoryParam && categoryParam !== 'all') query.set('category', categoryParam);
    if (trangThaiParam) query.set('trangThai', trangThaiParam);
    query.set('costStart', '0');
    query.set('costEnd', price.toString());
    router.push(`/sukien?${query.toString()}`);
  };

  return (
    <main>
      <section className="event-listing-container">
        <div className="event-flex">
          <aside className="event-sidebar">
            <h3>Danh mục</h3>
            <ul className="event-categories">
              <li>
                <Link
                  href={`/sukien?category=all${trangThaiParam !== 'all' ? `&trangThai=${trangThaiParam}` : ''}${costEndParam ? `&costStart=0&costEnd=${costEndParam}` : ''}`}
                  className={categoryParam === 'all' ? 'active-filter' : ''}
                >
                  Tất cả
                </Link>
              </li>
              {categories.map((cat) => (
                <li key={cat.maDanhMuc}>
                  <Link
                    href={`/sukien?category=${cat.maDanhMuc}${trangThaiParam !== 'all' ? `&trangThai=${trangThaiParam}` : ''}${costEndParam ? `&costStart=0&costEnd=${costEndParam}` : ''}`}
                    className={categoryParam === cat.maDanhMuc.toString() ? 'active-filter' : ''}
                  >
                    {cat.tenDanhMuc}
                  </Link>
                </li>
              ))}
            </ul>

            <h3>Trạng thái</h3>
            <ul className="event-categories">
              <li>
                <Link
                  href={`/sukien?${categoryParam !== 'all' ? `category=${categoryParam}` : ''}${costEndParam ? `&costStart=0&costEnd=${costEndParam}` : ''}`}
                  className={!trangThaiParam ? 'active-filter' : ''}
                >
                  Tất cả
                </Link>
              </li>
              {[ 'Con cho', 'Het cho', 'Het han dang ky', 'Dang dien ra', 'Da ket thuc', 'Huy bo' ].map((status) => (
                <li key={status}>
                  <Link
                    href={`/sukien?trangThai=${encodeURIComponent(status)}${categoryParam !== 'all' ? `&category=${categoryParam}` : ''}${costEndParam ? `&costStart=0&costEnd=${costEndParam}` : ''}`}
                    className={trangThaiParam === status ? 'active-filter' : ''}
                  >
                    {status}
                  </Link>
                </li>
              ))}
            </ul>

            <h3>Lọc theo giá</h3>
            <input
              type="range"
              min="0"
              max="5000000"
              step="50000"
              value={price}
              onChange={(e) => setPrice(parseInt(e.target.value))}
            />
            <p>
              Giá tối đa: <span>{price.toLocaleString('vi-VN')}₫</span>
            </p>
            <button
              onClick={handleFilterByPrice}
              style={{
                marginTop: '10px',
                padding: '6px 12px',
                backgroundColor: '#0070f3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Lọc
            </button>
          </aside>

          <section className="event-grid" id="eventGrid">
  {errorMsg ? (
    <p style={{ gridColumn: "1 / -1", textAlign: "center" }}>
      {errorMsg}
    </p>
  ) : (events.map(event => (
    <div className="event-card" key={event.maSuKien}>
      <div className="event-image">
        <img id="event-img" src={event.anhSuKien === null ? 
              'https://cdn5.vectorstock.com/i/1000x1000/74/69/upcoming-events-neon-sign-on-brick-wall-background-vector-37057469.jpg' : 
              `http://localhost:5555/api/sukien/get${event.anhSuKien}`} alt="Ảnh sự kiện" />
      </div>
      <div className="event-info">
        <div className="event-meta">
          <span>
            <i className="fas fa-calendar-alt"></i>{' '}
            {new Date(event.ngayBatDau).toLocaleString('vi-VN')}
          </span>
          <br />
          <span>
            <i className="fas fa-calendar-check"></i>{' '}
            {new Date(event.ngayKetThuc).toLocaleString('vi-VN')}
          </span>
        </div>
        <h3 className="event-title">{DOMPurify.sanitize(event.tenSuKien)}</h3>
        <p className="event-location">
          <i className="fas fa-map-marker-alt"></i> {DOMPurify.sanitize(event.diaDiem)}
        </p>
        <div className="event-footer">
          <span className="event-price">
            {parseInt(event.phiThamGia.toString()).toLocaleString('vi-VN')}₫
          </span>
          <Link href={`/sukien/${event.maSuKien}`} className="btn-detail">
            Chi tiết
          </Link>
          <Link href={`/sukien/${event.maSuKien}`} className="btn-register">
            Đăng ký
          </Link>
        </div>
      </div>
    </div>
  )))}
</section>

        </div>
        <div className="pagination">
    <button disabled={page === 0} onClick={() => setPage(p => p - 1)}>
      Trang trước
    </button>
    <span>
      Trang {page + 1} / {totalPages}
    </span>
    <button disabled={page + 1 >= totalPages} onClick={() => setPage(p => p + 1)}>
      Trang sau
    </button>
  </div>
      </section>
      
    </main>
  );
}

export default function SukienPage() {
  return (
    <Suspense fallback={<div>Đang tải...</div>}>
      <SuKienPageContent />
    </Suspense>
  );
}
