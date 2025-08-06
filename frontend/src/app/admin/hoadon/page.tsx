'use client';

import { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import '@/public/admin_css/style.css';
import '@/public/admin_css/danhmuc.css';
import Modal from '@/components/Modal';

interface HoaDon {
  maHoaDon: number;
  trangThaiHoaDon: string;
  tongTien: number;
  thoiGianThanhCong: string;
  phuongThucThanhToan: string;
  tenKhachHang: string;
  tenSuKien: string;
}

export default function HoaDonPage() {
  const [hoaDons, setHoaDons] = useState<HoaDon[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedHoaDonId, setSelectedHoaDonId] = useState<number | null>(null);
  const [selectedHoaDon, setSelectedHoaDon] = useState<any>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState('');
  const [sortField, setSortField] = useState<null | 'tenKhachHang' | 'tenSuKien' | 'trangThaiHoaDon' | 'tongTien'>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectedTrangThaiHoaDon, setSelectedTrangThaiHoaDon] = useState('');
  const pageSize = 10;

  useEffect(() => {
    fetchData();
  }, [page, search, selectedTrangThaiHoaDon]);  

  const fetchData = async () => {
    try {
      const url = new URL('http://localhost:5555/api/hoadon/get/all');
      url.searchParams.append('page', page.toString());
      url.searchParams.append('size', pageSize.toString());
  
      if (search.trim()) {
        url.searchParams.append('search', search.trim());
      }
  
      if (selectedTrangThaiHoaDon) {
        url.searchParams.append('trangThaiSuKien', selectedTrangThaiHoaDon);
      }
  
      const res = await fetch(url.toString(), { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setHoaDons(data.content);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
      }
    } catch (err) {
      console.error('Lỗi kết nối:', err);
    }
  };   

  const getStatusBadge = (status: string) => {
    const base = 'badge ';
    switch (status) {
      case 'Chưa thanh toán':
        return base + 'badge-pending';
      case 'Đã thanh toán':
        return base + 'badge-success';
      case 'Đã hủy':
        return base + 'badge-cancelled';
      default:
        return base + 'badge-default';
    }
  };

  const handleDetailClick = async (maHoaDon: number) => {
    setDetailModalOpen(true);
    setSelectedHoaDonId(maHoaDon);
    setSelectedHoaDon(null);
    setLoadingDetail(true);
    setDetailError('');
  
    try {
      const res = await fetch(`http://localhost:5555/api/hoadon/get/${maHoaDon}`, {
        credentials: 'include'
      });
  
      const data = await res.json();
  
      if (res.ok) {
        setSelectedHoaDon(data);
      } else {
        setDetailError(data.error || 'Lỗi khi tải chi tiết hóa đơn');
      }
    } catch (err) {
      setDetailError('Không thể kết nối máy chủ');
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortAsc((prev) => !prev);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const sortedHoaDons = [...hoaDons].sort((a, b) => {
    if (!sortField) return 0;
  
    const aValue = a[sortField];
    const bValue = b[sortField];
  
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortAsc ? aValue - bValue : bValue - aValue;
    }
  
    return sortAsc
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue));
  });  
  
  return (
    <main className="main-content">
      <h1>Quản lý Hóa Đơn</h1>

      <table className="admin-table">
        <thead>
        <tr className="table-search-row">
        <th colSpan={6}>
        <div className="search-wrapper">
  <input
    type="text"
    placeholder="🔍 Tìm theo tên khách hàng..."
    value={searchInput}
    onChange={(e) => setSearchInput(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === 'Enter') {
        setSearch(searchInput.trim());
        setPage(0);
      }
    }}
    className="search-input"
  />
  <select
    value={selectedTrangThaiHoaDon}
    onChange={(e) => {
      setSelectedTrangThaiHoaDon(e.target.value);
      setPage(0);
    }}
    className="filter-select"
    style={{ marginLeft: '8px' }}
  >
    <option value="">-- Trạng thái sự kiện --</option>
    <option value="Còn chỗ">Còn chỗ</option>
    <option value="Hết chỗ">Hết chỗ</option>
    <option value="Hết hạn đăng ký">Hết hạn đăng ký</option>
    <option value="Đang diễn ra">Đang diễn ra</option>
    <option value="Đã kết thúc">Đã kết thúc</option>
    <option value="Hủy bỏ">Hủy bỏ</option>
  </select>
  {(search || selectedTrangThaiHoaDon) && (
    <button
      onClick={() => {
        setSearch('');
        setSearchInput('');
        setSelectedTrangThaiHoaDon('');
        setPage(0);
      }}
      style={{ marginLeft: '8px' }}
    >
      Đặt lại
    </button>
  )}
</div>

        </th>
        </tr>

        <tr>
            <th>STT</th>
            <th onClick={() => handleSort('tenKhachHang')} className="sortable">Tên khách hàng ▲▼</th>
            <th onClick={() => handleSort('tenSuKien')} className="sortable">Tên sự kiện ▲▼</th>
            <th onClick={() => handleSort('trangThaiHoaDon')} className="sortable">Trạng thái ▲▼</th>
            <th onClick={() => handleSort('tongTien')} className="sortable">Tổng tiền ▲▼</th>
            <th>Hành động</th>
        </tr>
        </thead>
        <tbody>
          {sortedHoaDons.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>
                Không có dữ liệu
              </td>
            </tr>
          ) : (
            sortedHoaDons.map((hd, index) => (
              <tr key={hd.maHoaDon} className={index % 2 === 0 ? 'even' : 'odd'}>
                <td>{page * pageSize + index + 1}</td>
                <td>{DOMPurify.sanitize(hd.tenKhachHang)}</td>
                <td>{DOMPurify.sanitize(hd.tenSuKien)}</td>
                <td>
                  <span className={getStatusBadge(hd.trangThaiHoaDon)}>
                    {DOMPurify.sanitize(hd.trangThaiHoaDon)}
                  </span>
                </td>
                <td>{DOMPurify.sanitize(hd.tongTien.toLocaleString())} VND</td>
                <td>
                  <button className="edit-btn" onClick={() => handleDetailClick(hd.maHoaDon)}>Chi tiết</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="table-footer">
        <span>
          Trang {page + 1} / {totalPages} &nbsp;|&nbsp; Hiển thị {hoaDons.length} / {totalElements}
        </span>

        <div className="pagination-buttons">
          <button disabled={page === 0} className="pagination-btn" onClick={() => setPage(p => p - 1)}>
            Trước
          </button>
          <button disabled={page + 1 >= totalPages} className="pagination-btn" onClick={() => setPage(p => p + 1)}>
            Sau
          </button>
        </div>
      </div>
      {detailModalOpen && (
        <Modal
            isOpen={detailModalOpen}
            onClose={() => setDetailModalOpen(false)}
            title="Chi tiết Hóa đơn"
        >
            {loadingDetail ? (
            <p>Đang tải...</p>
            ) : detailError ? (
            <p className="error-text">{detailError}</p>
            ) : selectedHoaDon ? (
            <div>
                <p><strong>Mã hóa đơn:</strong> {DOMPurify.sanitize(String(selectedHoaDon.maHoaDon))}</p>
                <p><strong>Khách hàng:</strong> {DOMPurify.sanitize(selectedHoaDon.tenKhachHang)}</p>
                <p><strong>Sự kiện:</strong> {DOMPurify.sanitize(selectedHoaDon.tenSuKien)}</p>
                <p><strong>Trạng thái:</strong> <span className={getStatusBadge(selectedHoaDon.trangThaiHoaDon)}>{DOMPurify.sanitize(selectedHoaDon.trangThaiHoaDon)}</span> </p>
                <p><strong>Tổng tiền:</strong> {Number(selectedHoaDon.tongTien).toLocaleString('vi-VN')} VND</p>
                <p><strong>Phương thức thanh toán:</strong> {DOMPurify.sanitize(selectedHoaDon.phuongThucThanhToan)}</p>
                {selectedHoaDon.trangThaiHoaDon === 'Đã thanh toán' &&
                <p>
                <strong>Thời gian thanh toán:</strong>{' '}
                {selectedHoaDon.thoiGianThanhCong
                    ? new Date(selectedHoaDon.thoiGianThanhCong).toLocaleString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                    })
                    : 'Không có'}
            </p>}

            </div>
            ) : (
            <p>Không tìm thấy dữ liệu.</p>
            )}
        </Modal>
      )}
    </main>
  );
}
