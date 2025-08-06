'use client';

import { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import '@/public/admin_css/style.css';
import '@/public/admin_css/danhmuc.css';

interface KhachHang {
  tenDangNhap: string;
  trangThai: string;
  vaiTro: string;
  maId: number;
  hoTen: string;
  diaChi: string;
  email: string;
  phone: string;
  gioiTinh: string;
  soTuoi: number;
}

export default function KhachHangPage() {
  const [khachHangs, setKhachHangs] = useState<KhachHang[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedKhachHang, setSelectedKhachHang] = useState<any | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState('');
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedIdForStatusChange, setSelectedIdForStatusChange] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [statusChangeError, setStatusChangeError] = useState('');
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  const [sortField, setSortField] = useState<null | 'hoTen' | 'email' | 'phone' | 'trangThai'>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const pageSize = 10;

  useEffect(() => {
    fetchData();
  }, [page, search, sortField, sortAsc]);

  const fetchData = async () => {
    try {
      const res = await fetch(`http://localhost:5555/api/admin/khachhang/get/all?page=${page}&size=${pageSize}&search=${encodeURIComponent(search)}`, {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        let sorted = [...data.content];

        if (sortField) {
          sorted.sort((a: KhachHang, b: KhachHang) => {
            const valA = a[sortField] ?? '';
            const valB = b[sortField] ?? '';
            return sortAsc
              ? String(valA).localeCompare(String(valB), 'vi', { sensitivity: 'base' })
              : String(valB).localeCompare(String(valA), 'vi', { sensitivity: 'base' });
          });
        }

        setKhachHangs(sorted);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
      }
    } catch (err) {
      console.error('Lỗi kết nối:', err);
    }
  };

  const getStatusBadge = (status: string) => {
    const base = 'badge ';
    return status === 'Hoạt động' ? base + 'badge-success' : base + 'badge-cancelled';
  };

  const handleDetailClick = async (maId: number) => {
    setDetailModalOpen(true);
    setSelectedKhachHang(null);
    setLoadingDetail(true);
    setDetailError('');

    try {
      const res = await fetch(`http://localhost:5555/api/admin/khachhang/get/${maId}`, {
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok) {
        setSelectedKhachHang(data);
      } else {
        setDetailError(data.error || 'Lỗi khi tải chi tiết khách hàng');
      }
    } catch (err) {
      setDetailError('Không thể kết nối máy chủ');
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <main className="main-content">
      <h1>Quản lý Khách hàng</h1>

      <table className="admin-table">
        <thead>
          <tr className="table-search-row">
            <th colSpan={6}>
              <div className="search-wrapper">
                <input
                  type="text"
                  placeholder="🔍 Tìm kiếm theo tên khách hàng..."
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
                {search && (
                  <button
                    onClick={() => {
                      setSearch('');
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
          <tr>
            <th>STT</th>
            <th onClick={() => handleSort('hoTen')} className="sortable">
              Tên khách hàng {sortField === 'hoTen' ? (sortAsc ? '▲' : '▼') : '↕'}
            </th>
            <th onClick={() => handleSort('email')} className="sortable">
              Email {sortField === 'email' ? (sortAsc ? '▲' : '▼') : '↕'}
            </th>
            <th onClick={() => handleSort('phone')} className="sortable">
              Số điện thoại {sortField === 'phone' ? (sortAsc ? '▲' : '▼') : '↕'}
            </th>
            <th onClick={() => handleSort('trangThai')} className="sortable">
              Trạng thái {sortField === 'trangThai' ? (sortAsc ? '▲' : '▼') : '↕'}
            </th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {khachHangs.map((kh, index) => (
            <tr key={kh.tenDangNhap} className={index % 2 === 0 ? 'even' : 'odd'}>
              <td>{page * pageSize + index + 1}</td>
              <td>{DOMPurify.sanitize(kh.hoTen)}</td>
              <td>{DOMPurify.sanitize(kh.email)}</td>
              <td>{DOMPurify.sanitize(kh.phone)}</td>
              <td>
                <span className={getStatusBadge(kh.trangThai)}>{DOMPurify.sanitize(kh.trangThai)}</span>
              </td>
              <td>
                <button className="edit-btn" onClick={() => handleDetailClick(kh.maId)}>Chi tiết</button>
                <button
                  className="delete-btn"
                  onClick={() => {
                    setSelectedIdForStatusChange(kh.maId);
                    setSelectedStatus(kh.trangThai);
                    setStatusChangeError('');
                    setStatusModalOpen(true);
                  }}
                >
                  Thay đổi trạng thái
                </button>
              </td>
            </tr>
          ))}
          {khachHangs.length === 0 && (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center', padding: '10px' }}>Không có dữ liệu</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="table-footer">
        <span>
          Trang {page + 1} / {totalPages} | Hiển thị {khachHangs.length} / {totalElements}
        </span>

        <div className="pagination-buttons">
          <button disabled={page === 0} className="pagination-btn" onClick={() => setPage(p => p - 1)}>Trước</button>
          <button disabled={page + 1 >= totalPages} className="pagination-btn" onClick={() => setPage(p => p + 1)}>Sau</button>
        </div>
      </div>

      {detailModalOpen && (
        <div
        className="modal-overlay"
        onClick={() => setDetailModalOpen(false)}
      >
        <div
          className="modal-content fade-in"
          onClick={(e) => e.stopPropagation()}
        >
            <h2>Chi tiết khách hàng</h2>
            {loadingDetail ? (
              <p>Đang tải...</p>
            ) : detailError ? (
              <p className="error-text">{detailError}</p>
            ) : selectedKhachHang ? (
              <div className="modal-details">
                <p><strong>Tên đăng nhập:</strong> {DOMPurify.sanitize(selectedKhachHang.tenDangNhap)}</p>
                <p><strong>Họ tên:</strong> {DOMPurify.sanitize(selectedKhachHang.hoTen)}</p>
                <p><strong>Email:</strong> {DOMPurify.sanitize(selectedKhachHang.email)}</p>
                <p><strong>Số điện thoại:</strong> {DOMPurify.sanitize(selectedKhachHang.phone)}</p>
                <p><strong>Địa chỉ:</strong> {DOMPurify.sanitize(selectedKhachHang.diaChi)}</p>
                <p><strong>Giới tính:</strong> {DOMPurify.sanitize(selectedKhachHang.gioiTinh)}</p>
                <p><strong>Tuổi:</strong> {DOMPurify.sanitize(String(selectedKhachHang.soTuoi))}</p>
                <p><strong>Trạng thái:</strong> <span className={getStatusBadge(selectedKhachHang.trangThai)}>{DOMPurify.sanitize(selectedKhachHang.trangThai)}</span></p>
              </div>
            ) : (
              <p>Không có dữ liệu</p>
            )}

            <div className="modal-buttons">
              <button className="modal-cancel" onClick={() => setDetailModalOpen(false)}>Đóng</button>
            </div>
          </div>
        </div>
      )}

      {statusModalOpen && (
        <div
        className="modal-overlay"
        onClick={() => setDetailModalOpen(false)}
      >
        <div
          className="modal-content fade-in"
          onClick={(e) => e.stopPropagation()}
        >
            <h2>Xác nhận thay đổi trạng thái</h2>
            <p>
              Bạn có chắc chắn muốn{' '}
              <strong>{selectedStatus === 'Hoạt Động' ? 'dừng hoạt động' : 'kích hoạt lại'}</strong>{' '}
              cho khách hàng này không?
            </p>
            {statusChangeError && <p className="error-text">{statusChangeError}</p>}
            <div className="modal-buttons">
              <button
                className="modal-save"
                onClick={async () => {
                  if (!selectedIdForStatusChange || !selectedStatus) return;
                  setIsChangingStatus(true);
                  setStatusChangeError('');

                  const endpoint =
                    selectedStatus === 'Hoạt Động'
                      ? `http://localhost:5555/api/taikhoan/deactivate/${selectedIdForStatusChange}`
                      : `http://localhost:5555/api/taikhoan/activate/${selectedIdForStatusChange}`;

                  try {
                    const res = await fetch(`${endpoint}`, {
                      method: 'POST',
                      credentials: 'include',
                    });
                    const data = await res.json();
                    if (res.ok) {
                      setStatusModalOpen(false);
                      setSelectedIdForStatusChange(null);
                      fetchData();
                    } else {
                      setStatusChangeError(data.error || 'Thay đổi trạng thái thất bại');
                    }
                  } catch (err) {
                    setStatusChangeError('Không thể kết nối đến máy chủ');
                  } finally {
                    setIsChangingStatus(false);
                  }
                }}
                disabled={isChangingStatus}
              >
                {isChangingStatus ? 'Đang xử lý...' : 'Xác nhận'}
              </button>
              <button
                className="modal-cancel"
                onClick={() => {
                  setStatusModalOpen(false);
                  setSelectedIdForStatusChange(null);
                  setStatusChangeError('');
                }}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
