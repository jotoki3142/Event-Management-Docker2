'use client';

import { useEffect, useState } from 'react';
import '@/public/admin_css/style.css';
import '@/public/admin_css/dangky.css';
import Modal from '@/components/Modal';
import DOMPurify from 'dompurify';

interface DangKy {
  maDangKy: number;
  ngayDangKy: string;
  viTriGhe: string;
  trangThaiDangKy: string;
  tenKhachHang: string;
  tenSuKien: string;
}

export default function DangKyPage() {
  const [dangKys, setDangKys] = useState<DangKy[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedDangKyId, setSelectedDangKyId] = useState<number | null>(null);
  const [selectedDangKy, setSelectedDangKy] = useState<DangKy | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState('');
  const [sortField, setSortField] = useState<null | 'tenKhachHang' | 'tenSuKien' | 'viTriGhe' | 'trangThaiDangKy'>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const pageSize = 10;
  const [selectedTrangThaiSuKien, setSelectedTrangThaiSuKien] = useState('');

  useEffect(() => {
    fetchData();
  }, [page, searchKeyword, selectedTrangThaiSuKien]);  

  const fetchData = async () => {
    try {
      const query = new URLSearchParams({
        page: String(page),
        size: String(pageSize),
      });
  
      if (searchKeyword.trim()) {
        query.append('search', searchKeyword.trim());
      }
  
      if (selectedTrangThaiSuKien) {
        query.append('trangThaiSuKien', selectedTrangThaiSuKien);
      }
  
      const res = await fetch(`http://localhost:5555/api/dangky/get/all?${query.toString()}`, {
        credentials: 'include',
      });
  
      if (res.ok) {
        const data = await res.json();
        setDangKys(data.content);
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
      case 'Đang xử lý':
        return base + 'badge-processing';
      case 'Đã hủy':
        return base + 'badge-cancelled';
      case 'Thành công':
        return base + 'badge-success';
      case 'Đã điểm danh':
        return base + 'badge-checkedin';
      default:
        return base + 'badge-default';
    }
  };

  const handleDetailClick = async (maDangKy: number) => {
    setDetailModalOpen(true);
    setSelectedDangKyId(maDangKy);
    setSelectedDangKy(null);
    setLoadingDetail(true);
    setDetailError('');
  
    try {
      const res = await fetch(`http://localhost:5555/api/dangky/get/${maDangKy}`, {
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok) {
        setSelectedDangKy(data);
      } else {
        setDetailError(data.error || 'Lỗi khi tải chi tiết');
      }
    } catch (err) {
      setDetailError('Không thể kết nối máy chủ');
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      // Toggle direction
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const sortedDangKys = [...dangKys].sort((a, b) => {
    if (!sortField) return 0;
  
    const aVal = a[sortField] || '';
    const bVal = b[sortField] || '';
  
    return sortAsc
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });
  
  return (
    <main className="main-content">
      <h1>Quản lý Đăng ký Sự kiện</h1>
      <table className="admin-table">
        <thead>
          {/* Search row */}
          <tr className="table-search-row">
            <th colSpan={6}>
            <div className="search-wrapper">
  <input
    type="text"
    placeholder="🔍 Tìm kiếm khách hàng hoặc sự kiện..."
    value={searchInput}
    onChange={(e) => setSearchInput(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === 'Enter') {
        setSearchKeyword(searchInput.trim());
        setPage(0);
      }
    }}
    className="search-input"
  />
  <select
    value={selectedTrangThaiSuKien}
    onChange={(e) => {
      setSelectedTrangThaiSuKien(e.target.value);
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
  {searchKeyword && (
    <button
      onClick={() => {
        setSearchKeyword('');
        setSearchInput('');
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

          {/* Column header row */}
          <tr>
            <th>STT</th>
            <th onClick={() => handleSort('tenSuKien')} className="sortable">
            Tên sự kiện {sortField === 'tenSuKien' ? (sortAsc ? '▲' : '▼') : '↕'}
            </th>
            <th onClick={() => handleSort('tenKhachHang')} className="sortable">
            Tên khách hàng {sortField === 'tenKhachHang' ? (sortAsc ? '▲' : '▼') : '↕'}
            </th>
            <th onClick={() => handleSort('trangThaiDangKy')} className="sortable">
            Trạng thái {sortField === 'trangThaiDangKy' ? (sortAsc ? '▲' : '▼') : '↕'}
            </th>
            <th onClick={() => handleSort('viTriGhe')} className="sortable">
            Vị trí ghế {sortField === 'viTriGhe' ? (sortAsc ? '▲' : '▼') : '↕'}
            </th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {sortedDangKys.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>
                Không có dữ liệu
              </td>
            </tr>
          ) : (sortedDangKys.map((dk, index) => (
            <tr key={dk.maDangKy} className={index % 2 === 0 ? 'even' : 'odd'}>
              <td>{page * pageSize + index + 1}</td>
              <td>{DOMPurify.sanitize(dk.tenSuKien)}</td>
              <td>{DOMPurify.sanitize(dk.tenKhachHang)}</td>
              <td>
                <span className={getStatusBadge(dk.trangThaiDangKy)}>
                  {DOMPurify.sanitize(dk.trangThaiDangKy)}
                </span>
              </td>
              <td>{DOMPurify.sanitize(dk.viTriGhe)}</td>
              <td>
                <button className="edit-btn" onClick={() => handleDetailClick(dk.maDangKy)}>Chi tiết</button>
              </td>
            </tr>
          )))}
        </tbody>
      </table>

      <div className="table-footer">
        <span>
          Trang {page + 1} / {totalPages} | Hiển thị {dangKys.length} / {totalElements}
        </span>
        <div className="pagination-buttons">
          <button
            disabled={page === 0}
            className="pagination-btn"
            onClick={() => setPage((p) => p - 1)}
          >
            Trước
          </button>
          <button
            disabled={page + 1 >= totalPages}
            className="pagination-btn"
            onClick={() => setPage((p) => p + 1)}
          >
            Sau
          </button>
        </div>
      </div>

      {detailModalOpen && (
        <Modal
            isOpen={detailModalOpen}
            onClose={() => {
            setDetailModalOpen(false);
            setSelectedDangKy(null);
            setSelectedDangKyId(null);
            setDetailError('');
            }}
            title="Chi tiết đăng ký"
        >
            {loadingDetail ? (
            <p>Đang tải...</p>
            ) : detailError ? (
            <p className="error-text">{detailError}</p>
            ) : selectedDangKy ? (
            <div className="detail-info">
                <p><strong>Mã Đăng ký:</strong> {DOMPurify.sanitize(String(selectedDangKy.maDangKy))}</p>
                <p><strong>Tên sự kiện:</strong> {DOMPurify.sanitize(selectedDangKy.tenSuKien)}</p>
                <p><strong>Tên khách hàng:</strong> {DOMPurify.sanitize(selectedDangKy.tenKhachHang)}</p>
                <p><strong>Ngày đăng ký:</strong> {' '}
                    {selectedDangKy.ngayDangKy
                        ? new Date(selectedDangKy.ngayDangKy).toLocaleString('vi-VN', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false,
                        })
                        : 'Không có'}</p>
                <p><strong>Vị trí ghế:</strong> {DOMPurify.sanitize(selectedDangKy.viTriGhe)}</p>
                <p><strong>Trạng thái:</strong> <span className={getStatusBadge(selectedDangKy.trangThaiDangKy)}>
                {DOMPurify.sanitize(selectedDangKy.trangThaiDangKy)}
                </span></p>
            </div>
            ) : (
            <p>Dữ liệu không tồn tại</p>
            )}
        </Modal>
      )}

    </main>
  );
}
