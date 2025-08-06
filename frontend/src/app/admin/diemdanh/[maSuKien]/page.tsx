'use client';

import { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import '@/public/admin_css/style.css';
import '@/public/admin_css/danhmuc.css';
import Modal from '@/components/Modal';
import { use } from 'react';

interface DiemDanhEntry {
  maDiemDanh: number;
  ngayTaoVe: string;
  ngayDiemDanh: string;
  trangThaiDiemDanh: string;
  viTriGheNgoi: string;
  tenKhachHang: string;
}

export default function DiemDanhChiTietPage({ params }: { params: Promise<{ maSuKien: string }> }) {
  const { maSuKien } = use(params);
  const [entries, setEntries] = useState<DiemDanhEntry[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(10);

  const [selectedDiemDanh, setSelectedDiemDanh] = useState<DiemDanhEntry | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [markingError, setMarkingError] = useState('');
  const [markingMessage, setMarkingMessage] = useState('');
  const [isMarking, setIsMarking] = useState(false);

  useEffect(() => {
    fetchData();
  }, [search, sortBy, sortAsc, page]);

  const fetchData = async () => {
    try {
      const query = new URLSearchParams({
        page: page.toString(),
        size: pageSize.toString(),
      });
      if (search.trim()) query.append('search', search.trim());

      const res = await fetch(`http://localhost:5555/api/diemdanh/get/all/${maSuKien}?${query.toString()}`, {
        credentials: 'include'
      });

      if (res.ok) {
        const data = await res.json();
        const sorted = [...data.content].sort((a, b) => {
          const aVal = (a[sortBy] || '').toString();
          const bVal = (b[sortBy] || '').toString();
          return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        });
        setEntries(sorted);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
      }
    } catch (err) {
      console.error('Fetch failed', err);
    }
  };

  const handleSort = (field: string) => {
    if (sortBy === field) setSortAsc(!sortAsc);
    else {
      setSortBy(field);
      setSortAsc(true);
    }
  };

  const handleViewDetails = async (maDiemDanh: string) => {
    setDetailModalOpen(true);
    setMarkingError('');
    setMarkingMessage('');
    setLoadingDetail(true);
    try {
      const res = await fetch(`http://localhost:5555/api/diemdanh/get/${maDiemDanh}`, {
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) {
        setSelectedDiemDanh(data);
      } else {
        setMarkingError(data.error || 'Không thể tải dữ liệu');
      }
    } catch {
      setMarkingError('Lỗi kết nối đến máy chủ');
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleMarkAttendance = async () => {
    if (!selectedDiemDanh) return;
    setIsMarking(true);
    setMarkingError('');
    try {
      const res = await fetch(`http://localhost:5555/api/diemdanh/${selectedDiemDanh.maDiemDanh}`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) {
        setMarkingMessage(data.message || 'Điểm danh thành công');
        fetchData();
      } else {
        setMarkingError(data.error || 'Điểm danh thất bại');
      }
    } catch {
      setMarkingError('Lỗi kết nối đến máy chủ');
    } finally {
      setIsMarking(false);
    }
  };

  return (
    <main className="main-content">
      <h1>Danh sách Điểm danh</h1>

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
            <th onClick={() => handleSort('tenKhachHang')} className="sortable">Tên khách hàng ▲▼</th>
            <th onClick={() => handleSort('viTriGheNgoi')} className="sortable">Vị trí ghế ▲▼</th>
            <th onClick={() => handleSort('trangThaiDiemDanh')} className="sortable">Trạng thái ▲▼</th>
            <th>Hành động</th>
          </tr>
        </thead>

        <tbody>
          {entries.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ textAlign: 'center', padding: '20px' }}>
                Không có dữ liệu
              </td>
            </tr>
          ) : (
            entries.slice(page * pageSize, (page + 1) * pageSize).map((entry, index) => (
              <tr key={entry.maDiemDanh} className={index % 2 === 0 ? 'even' : 'odd'}>
                <td>{page * pageSize + index + 1}</td>
                <td>{DOMPurify.sanitize(entry.tenKhachHang)}</td>
                <td>{DOMPurify.sanitize(entry.viTriGheNgoi)}</td>
                <td>
                  <span className={`badge ${entry.trangThaiDiemDanh === 'Có mặt' ? 'badge-success' : 'badge-error'}`}>
                    {DOMPurify.sanitize(entry.trangThaiDiemDanh)}
                  </span>
                </td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => handleViewDetails(entry.maDiemDanh.toString())}
                  >
                    {entry.trangThaiDiemDanh === 'Vắng mặt' ? 'Điểm danh' : 'Chi tiết'}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="table-footer">
        <span>
          Trang {page + 1} / {totalPages} &nbsp;|&nbsp; Hiển thị {entries.length} / {totalElements} bản ghi
        </span>
        <div className="pagination-buttons">
          <button disabled={page === 0} className="pagination-btn" onClick={() => setPage((p) => p - 1)}>
            Trước
          </button>
          <button disabled={page + 1 >= totalPages} className="pagination-btn" onClick={() => setPage((p) => p + 1)}>
            Sau
          </button>
        </div>
      </div>

      {detailModalOpen && (
        <Modal isOpen={detailModalOpen} onClose={() => setDetailModalOpen(false)} title="Chi tiết điểm danh">
          {loadingDetail ? (
            <p>Đang tải...</p>
          ) : selectedDiemDanh ? (
            <div className="modal-details">
              <p><strong>Tên khách hàng:</strong> {DOMPurify.sanitize(selectedDiemDanh.tenKhachHang)}</p>
              <p><strong>Vị trí ghế:</strong> {DOMPurify.sanitize(selectedDiemDanh.viTriGheNgoi)}</p>
              <p><strong>Trạng thái:</strong> 
                <span className={`badge ${selectedDiemDanh.trangThaiDiemDanh === 'Có mặt' ? 'badge-success' : 'badge-error'}`}>
                  {DOMPurify.sanitize(selectedDiemDanh.trangThaiDiemDanh)}
                </span>
              </p>
              <p><strong>Ngày tạo vé:</strong> {new Date(selectedDiemDanh.ngayTaoVe).toLocaleString('vi-VN')}</p>
              <p><strong>Ngày điểm danh:</strong> {selectedDiemDanh.ngayDiemDanh ? new Date(selectedDiemDanh.ngayDiemDanh).toLocaleString('vi-VN') : 'Chưa điểm danh'}</p>
              {selectedDiemDanh.trangThaiDiemDanh === 'Vắng mặt' && (
                <div className="modal-buttons">
                  {markingError && <p className="error-text">{markingError}</p>}
                  {markingMessage && <p className="success-text">{markingMessage}</p>}
                  <button
                    className="modal-save"
                    onClick={handleMarkAttendance}
                    disabled={isMarking}
                  >
                    {isMarking ? 'Đang xử lý...' : 'Xác nhận điểm danh'}
                  </button>
                  <button className="modal-cancel" onClick={() => setDetailModalOpen(false)}>
                    Đóng
                  </button>
                </div>
              )}
            </div>
          ) : (
            <p>Không tìm thấy dữ liệu</p>
          )}
        </Modal>
      )}
    </main>
  );
}
