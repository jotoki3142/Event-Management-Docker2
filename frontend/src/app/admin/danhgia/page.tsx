'use client';

import { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import '@/public/admin_css/style.css';
import '@/public/admin_css/danhmuc.css';
import Modal from '@/components/Modal';

export default function DanhGiaPage() {
  const [danhGias, setDanhGias] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedDanhGia, setSelectedDanhGia] = useState<any | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [sortField, setSortField] = useState<null | 'tenKhachHang' | 'tenSuKien' | 'soSao'>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const pageSize = 10;

  useEffect(() => {
    fetchData();
  }, [page, search]);  

  const fetchData = async () => {
    try {
      const url = new URL('http://localhost:5555/api/danhgia/get/all');
      url.searchParams.append('page', page.toString());
      url.searchParams.append('size', pageSize.toString());
      if (search) {
        url.searchParams.append('search', search);
      }
  
      const res = await fetch(url.toString(), {
        credentials: 'include',
      });
  
      if (res.ok) {
        const data = await res.json();
        setDanhGias(data.content);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
      }
    } catch (err) {
      console.error('Lỗi kết nối:', err);
    }
  };  

  const handleDetailClick = async (maDanhGia: number) => {
    setDetailModalOpen(true);
    setSelectedDanhGia(null);
    setLoadingDetail(true);
    setDetailError('');
  
    try {
      const res = await fetch(`http://localhost:5555/api/danhgia/get/${maDanhGia}`, {
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok) {
        setSelectedDanhGia(data);
      } else {
        setDetailError(data.error || 'Lỗi khi tải chi tiết');
      }
    } catch (err) {
      setDetailError('Không thể kết nối máy chủ');
    } finally {
      setLoadingDetail(false);
    }
  };  

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
  
    setIsDeleting(true);
    setDeleteError('');
  
    try {
      const res = await fetch(`http://localhost:5555/api/danhgia/delete/${deleteId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
  
      const data = await res.json();
  
      if (res.ok) {
        setDeleteModalOpen(false);
        setDeleteId(null);
        fetchData(); // reload the table
      } else {
        setDeleteError(data.error || 'Xóa thất bại');
      }
    } catch (err) {
      setDeleteError('Không thể kết nối đến máy chủ');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc); // toggle
    } else {
      setSortField(field);
      setSortAsc(true); // default to ASC
    }
  };
  
  const sortedDanhGias = [...danhGias];

  if (sortField) {
    sortedDanhGias.sort((a, b) => {
      const valA = a[sortField] ?? '';
      const valB = b[sortField] ?? '';

      if (sortField === 'soSao') {
        return sortAsc ? valA - valB : valB - valA;
      }

      return sortAsc
        ? valA.localeCompare(valB, 'vi', { sensitivity: 'base' })
        : valB.localeCompare(valA, 'vi', { sensitivity: 'base' });
    });
  }

  return (
    <main className="main-content">
      <h1>Quản lý Đánh giá</h1>

      <table className="admin-table">
        <thead>
          <tr className="table-search-row">
            <th colSpan={5}>
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
            <th onClick={() => handleSort('tenKhachHang')} className="sortable">
              Tên khách hàng {sortField === 'tenKhachHang' ? (sortAsc ? '▲' : '▼') : '↕'}
            </th>
            <th onClick={() => handleSort('tenSuKien')} className="sortable">
              Tên sự kiện {sortField === 'tenSuKien' ? (sortAsc ? '▲' : '▼') : '↕'}
            </th>
            <th onClick={() => handleSort('soSao')} className="sortable">
              Số sao {sortField === 'soSao' ? (sortAsc ? '▲' : '▼') : '↕'}
            </th>
            <th>Hành động</th>
          </tr>
        </thead>

        <tbody>
          {sortedDanhGias.map((dg, index) => (
            <tr key={dg.maDanhGia} className={index % 2 === 0 ? 'even' : 'odd'}>
              <td>{page * pageSize + index + 1}</td>
              <td>{DOMPurify.sanitize(dg.tenKhachHang)}</td>
              <td>{DOMPurify.sanitize(dg.tenSuKien)}</td>
              <td>
                {DOMPurify.sanitize(String(dg.loaiDanhGia))}/5{' '}
                <span style={{ color: '#f5c518' }}>★</span>
              </td>
              <td>
                <button className="edit-btn" onClick={() => handleDetailClick(dg.maDanhGia)}>Chi tiết</button>
                <button
                  className="delete-btn"
                  onClick={() => {
                    setDeleteId(dg.maDanhGia);
                    setDeleteError('');
                    setDeleteModalOpen(true);
                  }}
                >
                  Xóa
                </button>

              </td>
            </tr>
          ))}
          {sortedDanhGias.length === 0 && (
            <tr>
              <td colSpan={5} style={{ textAlign: 'center', padding: '10px' }}>
                Không có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="table-footer">
        <span>
          Trang {page + 1} / {totalPages} | Hiển thị {danhGias.length} / {totalElements}
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
        <div
        className="modal-overlay"
        onClick={() => setDetailModalOpen(false)}
      >
        <div
          className="modal-content fade-in"
          onClick={(e) => e.stopPropagation()}
        >
            <h2>Chi tiết đánh giá</h2>

            {loadingDetail ? (
                <p>Đang tải...</p>
            ) : detailError ? (
                <p className="error-text">{detailError}</p>
            ) : selectedDanhGia ? (
                <div className="modal-details">
                <p><strong>Tên khách hàng:</strong> {DOMPurify.sanitize(selectedDanhGia.tenKhachHang)}</p>
                <p><strong>Tên sự kiện:</strong> {DOMPurify.sanitize(selectedDanhGia.tenSuKien)}</p>
                <p><strong>Số sao:</strong> {DOMPurify.sanitize(String(selectedDanhGia.loaiDanhGia))}/5 ⭐</p>
                <p><strong>Bình luận:</strong> {DOMPurify.sanitize(selectedDanhGia.binhLuan || 'Không có')}</p>
                <p><strong>Ngày đánh giá:</strong> {' '}
                    {selectedDanhGia.ngayDanhGia
                        ? new Date(selectedDanhGia.ngayDanhGia).toLocaleString('vi-VN', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false,
                        })
                        : 'Không có'}</p>
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

      {deleteModalOpen && (
        <div
        className="modal-overlay"
        onClick={() => setDetailModalOpen(false)}
      >
        <div
          className="modal-content fade-in"
          onClick={(e) => e.stopPropagation()}
        >
            <h2>Xác nhận xóa</h2>
            <p><strong>{DOMPurify.sanitize('Bạn có chắc chắn muốn xóa đánh giá này không?')}</strong></p>

            {deleteError && <p className="error-text">{deleteError}</p>}

            <div className="modal-buttons">
              <button
                className="modal-save"
                style={{ backgroundColor: '#dc3545' }}
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
              >
                {isDeleting ? 'Đang xóa...' : 'Xác nhận'}
              </button>
              <button
                className="modal-cancel"
                onClick={() => {
                  setDeleteModalOpen(false);
                  setDeleteId(null);
                  setDeleteError('');
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
