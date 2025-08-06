'use client';

import { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import '@/public/admin_css/style.css';
import '@/public/admin_css/danhmuc.css';
import Modal from '@/components/Modal';

interface NhanVien {
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

export default function NhanVienPage() {
  const [nhanViens, setNhanViens] = useState<NhanVien[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedNhanVien, setSelectedNhanVien] = useState<any | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState('');
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedIdForStatusChange, setSelectedIdForStatusChange] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [statusChangeError, setStatusChangeError] = useState('');
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  const [sortField, setSortField] = useState<null | 'hoTen' | 'email' | 'phone' | 'trangThai'>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addForm, setAddForm] = useState({
    tenDangNhap: '',
    matKhau: '',
    confirmMatKhau: '',
    hoTen: '',
    diaChi: '',
    email: '',
    phone: '',
    gioiTinh: '',
    soTuoi: ''
  });
  const [addError, setAddError] = useState('');
  const [addSuccess, setAddSuccess] = useState('');
  const [adding, setAdding] = useState(false);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const pageSize = 10;

  useEffect(() => {
    fetchData();
  }, [page, search, sortField, sortAsc]);


  const fetchData = async () => {
    try {
      const res = await fetch(`http://localhost:5555/api/admin/nhanvien/get/all?page=${page}&size=${pageSize}&search=${encodeURIComponent(search)}`, {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setNhanViens(data.content);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
        let sorted = [...data.content];

        if (sortField) {
          sorted.sort((a: NhanVien, b: NhanVien) => {
            const valA = a[sortField] ?? '';
            const valB = b[sortField] ?? '';

            return sortAsc
              ? String(valA).localeCompare(String(valB), 'vi', { sensitivity: 'base' })
              : String(valB).localeCompare(String(valA), 'vi', { sensitivity: 'base' });
          });
        }

        setNhanViens(sorted);

      }
    } catch (err) {
      console.error('Lỗi kết nối:', err);
    }
  };

  const getStatusBadge = (status: string) => {
    const base = 'badge ';
    return status === 'Hoạt động'
      ? base + 'badge-success'
      : base + 'badge-cancelled';
  };

  const handleDetailClick = async (maId: number) => {
    setDetailModalOpen(true);
    setSelectedNhanVien(null);
    setLoadingDetail(true);
    setDetailError('');

    try {
      const res = await fetch(`http://localhost:5555/api/admin/nhanvien/get/${maId}`, {
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok) {
        setSelectedNhanVien(data);
      } else {
        setDetailError(data.error || 'Lỗi khi tải chi tiết nhân viên');
      }
    } catch (err) {
      setDetailError('Không thể kết nối máy chủ');
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc); // Toggle direction
    } else {
      setSortField(field);
      setSortAsc(true); // Default to ascending
    }
  };

  const handleAddNhanVien = async () => {
    setAddError('');
    setAddSuccess('');
    setAdding(true);
  
    try {
      const res = await fetch('http://localhost:5555/api/admin/nhanvien/add', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addForm),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        setAddSuccess(data.message || 'Thêm nhân viên thành công!');
        fetchData(); // reload table
        setAddForm({
          tenDangNhap: '',
          matKhau: '',
          confirmMatKhau: '',
          hoTen: '',
          diaChi: '',
          email: '',
          phone: '',
          gioiTinh: '',
          soTuoi: ''
        });        
      } else {
        setAddError(data.error || 'Thêm thất bại');
      }
    } catch (err) {
      setAddError('Không thể kết nối đến máy chủ');
    } finally {
      setAdding(false);
    }
  };  

  return (
    <main className="main-content">
      <h1>Quản lý Nhân viên</h1>
      <div style={{ marginBottom: '16px' }}>
        <button className="add-btn" onClick={() => setAddModalOpen(true)}>
          + Thêm nhân viên
        </button>
      </div>

      <table className="admin-table">
        <thead>
        <tr className="table-search-row">
            <th colSpan={6}>
              <div className="search-wrapper">
                <input
                  type="text"
                  placeholder="🔍 Tìm kiếm theo tên nhân viên..."
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
              Tên nhân viên {sortField === 'hoTen' ? (sortAsc ? '▲' : '▼') : '↕'}
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
          {nhanViens.map((nv, index) => (
            <tr key={nv.tenDangNhap} className={index % 2 === 0 ? 'even' : 'odd'}>
              <td>{page * pageSize + index + 1}</td>
              <td>{DOMPurify.sanitize(nv.hoTen)}</td>
              <td>{DOMPurify.sanitize(nv.email)}</td>
              <td>{DOMPurify.sanitize(nv.phone)}</td>
              <td>
                <span className={getStatusBadge(nv.trangThai)}>{DOMPurify.sanitize(nv.trangThai)}</span>
              </td>
              <td>
                <button className="edit-btn" onClick={() => handleDetailClick(nv.maId)}>Chi tiết</button>
                <button
                className="delete-btn"
                onClick={() => {
                  setSelectedIdForStatusChange(nv.maId);
                  setSelectedStatus(nv.trangThai);
                  setStatusChangeError('');
                  setStatusModalOpen(true);
                }}
              >
                Thay đổi trạng thái
              </button>

              </td>
            </tr>
          ))}
          {nhanViens.length === 0 && (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center', padding: '10px' }}>Không có dữ liệu</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="table-footer">
        <span>
          Trang {page + 1} / {totalPages} | Hiển thị {nhanViens.length} / {totalElements}
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
            <h2>Chi tiết nhân viên</h2>

            {loadingDetail ? (
              <p>Đang tải...</p>
            ) : detailError ? (
              <p className="error-text">{detailError}</p>
            ) : selectedNhanVien ? (
              <div className="modal-details">
                <p><strong>Tên đăng nhập:</strong> {DOMPurify.sanitize(selectedNhanVien.tenDangNhap)}</p>
                <p><strong>Họ tên:</strong> {DOMPurify.sanitize(selectedNhanVien.hoTen)}</p>
                <p><strong>Email:</strong> {DOMPurify.sanitize(selectedNhanVien.email)}</p>
                <p><strong>Số điện thoại:</strong> {DOMPurify.sanitize(selectedNhanVien.phone)}</p>
                <p><strong>Địa chỉ:</strong> {DOMPurify.sanitize(selectedNhanVien.diaChi)}</p>
                <p><strong>Giới tính:</strong> {DOMPurify.sanitize(selectedNhanVien.gioiTinh)}</p>
                <p><strong>Tuổi:</strong> {DOMPurify.sanitize(String(selectedNhanVien.soTuoi))}</p>
                <p><strong>Trạng thái:</strong> <span className={getStatusBadge(selectedNhanVien.trangThai)}>{DOMPurify.sanitize(selectedNhanVien.trangThai)}</span> </p>
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
              <strong>
                {selectedStatus === 'Hoạt Động' ? 'dừng hoạt động' : 'kích hoạt lại'}
              </strong>{' '}
              cho nhân viên này không?
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
                      ? `http://localhost:5555/api/admin/nhanvien/deactivate/${selectedIdForStatusChange}`
                      : `http://localhost:5555/api/admin/nhanvien/activate/${selectedIdForStatusChange}`;

                  try {
                    const res = await fetch(`${endpoint}`, {
                      method: 'POST',
                      credentials: 'include',
                    });

                    const data = await res.json();
                    if (res.ok) {
                      setStatusModalOpen(false);
                      setSelectedIdForStatusChange(null);
                      fetchData(); // reload data
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
      {addModalOpen && (
        <Modal onClose={() => setAddModalOpen(false)} isOpen={addModalOpen} title="Thêm nhân viên mới">
          <div className="modal-details" style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '8px' }}>
          {[
            ['Tên đăng nhập', 'tenDangNhap'],
            ['Mật khẩu', 'matKhau'],
            ['Xác nhận mật khẩu', 'confirmMatKhau'],
            ['Họ tên', 'hoTen'],
            ['Địa chỉ', 'diaChi'],
            ['Email', 'email'],
            ['Số điện thoại', 'phone'],
            ['Giới tính', 'gioiTinh'],
            ['Tuổi', 'soTuoi']
          ].map(([label, key]) => (
            <div className="form-group" key={key}>
              <label><strong>{label}:</strong></label>

              {key === 'gioiTinh' ? (
                <select
                  value={addForm[key as keyof typeof addForm]}
                  onChange={(e) => setAddForm((prev) => ({ ...prev, [key]: e.target.value }))}
                  className="modal-input"
                >
                  <option value="">-- Chọn giới tính --</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              ) : key === 'matKhau' || key === 'confirmMatKhau' ? (
                <input
                  type="password"
                  value={addForm[key as keyof typeof addForm]}
                  onChange={(e) => setAddForm((prev) => ({ ...prev, [key]: e.target.value }))}
                  className="modal-input"
                />
              ) : (
                <input
                  type={key === 'soTuoi' ? 'number' : 'text'}
                  value={addForm[key as keyof typeof addForm]}
                  onChange={(e) => setAddForm((prev) => ({ ...prev, [key]: e.target.value }))}
                  className="modal-input"
                />
              )}
            </div>
          ))}

            {addSuccess && <p className="success-text">{addSuccess}</p>}
            {addError && <p className="error-text">{addError}</p>}
          </div>

          <div className="modal-buttons">
            <button className="modal-save" onClick={handleAddNhanVien} disabled={adding}>
              {adding ? 'Đang thêm...' : 'Thêm'}
            </button>
            <button
              className="modal-cancel"
              onClick={() => {
                setAddModalOpen(false);
                setAddError('');
                setAddSuccess('');
                setAddForm({
                  tenDangNhap: '',
                  matKhau: '',
                  confirmMatKhau: '',
                  hoTen: '',
                  diaChi: '',
                  email: '',
                  phone: '',
                  gioiTinh: '',
                  soTuoi: ''
                });
              }}
            >
              Hủy
            </button>
          </div>
        </Modal>
      )}

    </main>
  );
}
