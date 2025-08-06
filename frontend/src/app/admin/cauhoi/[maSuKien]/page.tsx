'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import DOMPurify from 'dompurify';
import '@/public/admin_css/style.css';
import '@/public/admin_css/danhmuc.css';
import Modal from '@/components/Modal';

interface CauHoi {
  maCauHoi: number;
  noiDungCauHoi: string;
  noiDungTraLoi: string;
  trangThai: string;
  tenKhachHang: string;
  tenSuKien: string;
  tenNhanVien: string;
}

export default function CauHoiPage() {
  const { maSuKien } = useParams();
  const [cauHois, setCauHois] = useState<CauHoi[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCauHoi, setSelectedCauHoi] = useState<CauHoi | null>(null);
  const [answer, setAnswer] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sortField, setSortField] = useState<null | 'tenKhachHang' | 'trangThai'>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const pageSize = 10;

  useEffect(() => {
    fetchData();
  }, [page, search]);

  const fetchData = async () => {
    try {
      const query = `page=${page}&size=${pageSize}&maSuKien=${maSuKien}${search ? `&search=${encodeURIComponent(search)}` : ''}`;
      const res = await fetch(`http://localhost:5555/api/cauhoi/get/all?${query}`, {
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setCauHois(data.content);
        setTotalElements(data.totalElements);
        setTotalPages(data.totalPages);
      }
    } catch (err) {
      console.error('Lỗi kết nối:', err);
    }
  };

  const getStatusBadge = (status: string) => {
    return status === 'Đã xử lý' ? 'badge badge-success' : 'badge badge-default';
  };

  const handleClick = (ch: CauHoi) => {
    setSelectedCauHoi(ch);
    setAnswer(ch.noiDungTraLoi || '');
    setSubmitError('');
    setSubmitSuccess('');
    setModalOpen(true);
  };

  const handleSubmitAnswer = async () => {
    if (!selectedCauHoi) return;
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess('');

    try {
      const res = await fetch(`http://localhost:5555/api/cauhoi/answer/${selectedCauHoi.maCauHoi}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer })
      });

      const data = await res.json();

      if (res.ok) {
        setSubmitSuccess(data.message || 'Gửi phản hồi thành công');
        fetchData();
        setTimeout(() => setModalOpen(false), 1000);
      } else {
        setSubmitError(data.error || 'Phản hồi thất bại');
      }
    } catch (err) {
      setSubmitError('Không thể kết nối đến máy chủ');
    } finally {
      setIsSubmitting(false);
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

  const pagedData = [...cauHois];
  if (sortField) {
    pagedData.sort((a, b) => {
      const valA = a[sortField] ?? '';
      const valB = b[sortField] ?? '';
      return sortAsc
        ? valA.localeCompare(valB, 'vi', { sensitivity: 'base' })
        : valB.localeCompare(valA, 'vi', { sensitivity: 'base' });
    });
  }
  const paginated = pagedData.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <main className="main-content">
      <h1>Quản lý Câu hỏi sự kiện</h1>
      <table className="admin-table">
        <thead>
        <tr className="table-search-row">
            <th colSpan={5}>
            <div className="search-wrapper">
                <input
                type="text"
                placeholder="🔍 Tìm kiếm theo tên..."
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
            <th>Nội dung</th>
            <th onClick={() => handleSort('trangThai')} className="sortable">
              Trạng thái {sortField === 'trangThai' ? (sortAsc ? '▲' : '▼') : '↕'}
            </th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((c, index) => (
            <tr key={c.maCauHoi} className={index % 2 === 0 ? 'even' : 'odd'}>
              <td>{page * pageSize + index + 1}</td>
              <td>{DOMPurify.sanitize(c.tenKhachHang)}</td>
              <td>{DOMPurify.sanitize(c.noiDungCauHoi)}</td>
              <td><span className={getStatusBadge(c.trangThai)}>{c.trangThai}</span></td>
              <td>
                <button className="edit-btn" onClick={() => handleClick(c)}>
                  {c.trangThai === 'Đã xử lý' ? 'Chi tiết' : 'Trả lời'}
                </button>
              </td>
            </tr>
          ))}
          {paginated.length === 0 && (
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
          Trang {page + 1} / {totalPages} | Hiển thị {paginated.length} / {totalElements}
        </span>
        <div className="pagination-buttons">
          <button disabled={page === 0} className="pagination-btn" onClick={() => setPage(p => p - 1)}>Trước</button>
          <button disabled={page + 1 >= totalPages} className="pagination-btn" onClick={() => setPage(p => p + 1)}>Sau</button>
        </div>
      </div>

      {modalOpen && selectedCauHoi && (
        <Modal
          onClose={() => setModalOpen(false)}
          isOpen={modalOpen}
          title={selectedCauHoi.trangThai === 'Đã trả lời' ? 'Chi tiết Câu hỏi' : 'Trả lời Câu hỏi'}
        >
          <div className="modal-details">
            <div className="form-group">
              <label><strong>Tên khách hàng:</strong></label>
              <input value={DOMPurify.sanitize(selectedCauHoi.tenKhachHang)} disabled className="modal-input" />
            </div>
            <div className="form-group">
              <label><strong>Nội dung câu hỏi:</strong></label>
              <textarea value={DOMPurify.sanitize(selectedCauHoi.noiDungCauHoi)} disabled className="modal-input" rows={4} />
            </div>
            <div className="form-group">
              <label><strong>Trạng thái:</strong></label>
              <input value={selectedCauHoi.trangThai} disabled className="modal-input" />
            </div>
            {selectedCauHoi.tenNhanVien && (
              <div className="form-group">
                <label><strong>Nhân viên phụ trách:</strong></label>
                <input value={DOMPurify.sanitize(selectedCauHoi.tenNhanVien)} disabled className="modal-input" />
              </div>
            )}
            <div className="form-group">
              <label><strong>Phản hồi:</strong></label>
              {selectedCauHoi.trangThai === 'Đã xử lý' ? (
                <textarea value={DOMPurify.sanitize(selectedCauHoi.noiDungTraLoi) || 'N/A'} disabled className="modal-input" rows={4} />
              ) : (
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="modal-input"
                  rows={4}
                />
              )}
            </div>
            {submitSuccess && <p className="success-text">{submitSuccess}</p>}
            {submitError && <p className="error-text">{submitError}</p>}
          </div>

          <div className="modal-buttons">
            {selectedCauHoi.trangThai !== 'Đã xử lý' && (
              <button
                className="modal-save"
                onClick={handleSubmitAnswer}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Đang gửi...' : 'Gửi phản hồi'}
              </button>
            )}
            <button className="modal-cancel" onClick={() => setModalOpen(false)}>Đóng</button>
          </div>
        </Modal>
      )}
    </main>
  );
}
