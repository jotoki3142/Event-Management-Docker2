'use client';

import { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import '@/public/admin_css/style.css';
import '@/public/admin_css/danhmuc.css';
import Modal from '@/components/Modal';

interface DanhMuc {
  maDanhMuc: number;
  tenDanhMuc: string;
}

export default function DanhMucPage() {
  const [danhMucs, setDanhMucs] = useState<DanhMuc[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [newDanhMuc, setNewDanhMuc] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [editError, setEditError] = useState('');
  const [editMessage, setEditMessage] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [deleteName, setDeleteName] = useState('');
  const pageSize = 10;

  useEffect(() => {
    fetchData();
  }, [page, search]);

  const fetchData = async () => {
    try {
      const query = new URLSearchParams({
        page: page.toString(),
        size: pageSize.toString(),
      });
      if (search.trim()) query.append('search', search.trim());

      const res = await fetch(`http://localhost:5555/api/danhmucsukien/get/all?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        const sortedData = [...data.content].sort((a: DanhMuc, b: DanhMuc) =>
          sortAsc ? a.tenDanhMuc.localeCompare(b.tenDanhMuc) : b.tenDanhMuc.localeCompare(a.tenDanhMuc)
        );
        setDanhMucs(sortedData);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
      }
    } catch (err) {
      console.error('Lỗi kết nối:', err);
    }
  };

  const handleAddDanhMuc = async () => {
    setMessage('');
    setError('');
    if (!newDanhMuc.trim()) {
      setError('Vui lòng nhập tên danh mục');
      return;
    }

    try {
      const res = await fetch('http://localhost:5555/api/danhmucsukien/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenDanhMuc: newDanhMuc }),
        credentials: 'include',
      });

      const result = await res.json();

      if (res.ok) {
        setMessage(result.message || 'Thêm thành công!');
        setNewDanhMuc('');
        fetchData();
      } else {
        setError(result.error || 'Đã xảy ra lỗi');
      }
    } catch (err) {
      console.error(err);
      setError('Không thể kết nối đến máy chủ');
    }
  };

  const toggleSort = () => {
    setSortAsc(prev => !prev);
    setDanhMucs(prev =>
      [...prev].sort((a, b) =>
        !sortAsc
          ? a.tenDanhMuc.localeCompare(b.tenDanhMuc)
          : b.tenDanhMuc.localeCompare(a.tenDanhMuc)
      )
    );
  };

  const handleEditClick = (dm: DanhMuc) => {
    setEditId(dm.maDanhMuc);
    setEditValue(DOMPurify.sanitize(dm.tenDanhMuc));
    setEditMessage('');
    setEditError('');
    setEditModalOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!editId || !editValue.trim()) {
      setEditError('Tên danh mục không được để trống.');
      return;
    }

    const original = danhMucs.find(dm => dm.maDanhMuc === editId)?.tenDanhMuc || '';
    if (editValue.trim().toLowerCase() === original.trim().toLowerCase()) {
      setEditError('Tên danh mục mới không được trùng với tên danh mục hiện tại');
      return;
    }

    try {
      const res = await fetch(`http://localhost:5555/api/danhmucsukien/update/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ tenDanhMuc: editValue }),
      });

      const data = await res.json();

      if (res.ok) {
        setEditMessage(data.message || 'Cập nhật thành công');
        setEditError('');
        fetchData();
        setTimeout(() => setEditModalOpen(false), 1000);
      } else {
        setEditError(data.error || 'Cập nhật thất bại');
        setEditMessage('');
      }
    } catch (err) {
      setEditError('Lỗi kết nối máy chủ');
      setEditMessage('');
    }
  };

  const handleDeleteClick = (dm: DanhMuc) => {
    setDeleteId(dm.maDanhMuc);
    setDeleteName(DOMPurify.sanitize(dm.tenDanhMuc));
    setDeleteError('');
    setDeleteModalOpen(true);
  };
  
  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
  
    try {
      const res = await fetch(`http://localhost:5555/api/danhmucsukien/delete/${deleteId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
  
      if (res.ok) {
        setDeleteModalOpen(false);
        fetchData(); // refresh data
      } else {
        const data = await res.json();
        setDeleteError(data.error || 'Xóa thất bại');
      }
    } catch (err) {
      setDeleteError('Lỗi kết nối máy chủ');
    }
  };  

  return (
    <main className="main-content">
      <h1>Quản lý Danh mục Sự kiện</h1>

      <div className="form-section">
        <input
          type="text"
          placeholder="Nhập tên danh mục mới"
          value={newDanhMuc}
          onChange={(e) => setNewDanhMuc(e.target.value)}
        />
        <button onClick={handleAddDanhMuc}>Thêm danh mục</button>
      </div>
      {message && <p style={{ color: 'green', marginTop: '10px' }}>{message}</p>}
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

      <table className="admin-table">
        <thead>
          {/* Search row */}
          <tr className="table-search-row">
            <th colSpan={3}>
              <div className="search-wrapper">
                <input
                  type="text"
                  placeholder="🔍 Tìm kiếm danh mục..."
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
          {/* Column names */}
          <tr>
            <th>STT</th>
            <th onClick={toggleSort} className="sortable">Tên danh mục ▲▼</th>
            <th>Hành động</th>
          </tr>
        </thead>

        <tbody>
          {danhMucs.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>
                Không có dữ liệu
              </td>
            </tr>
          ) : (danhMucs.map((dm, index) => (
            <tr key={dm.maDanhMuc} className={index % 2 === 0 ? 'even' : 'odd'}>
              <td>{page * pageSize + index + 1}</td>
              <td
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(dm.tenDanhMuc),
                }}
              />
              <td>
                <button className="edit-btn" onClick={() => handleEditClick(dm)}>Chỉnh sửa</button>
                <button className="delete-btn" onClick={() => handleDeleteClick(dm)}>Xóa</button>
              </td>
            </tr>
          )))}
        </tbody>
      </table>

      <div className="table-footer">
        <span>
          Trang {page + 1} / {totalPages} &nbsp;|&nbsp;
          Hiển thị {danhMucs.length} / {totalElements}
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

      {editModalOpen && (
        <Modal onClose={() => setEditModalOpen(false)} isOpen={editModalOpen} title="Chỉnh sửa Danh mục">
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="modal-input"
          />
          {editMessage && <p className="success-text">{editMessage}</p>}
          {editError && <p className="error-text">{editError}</p>}
          <div className="modal-buttons">
            <button onClick={handleEditSubmit} className="modal-save">Lưu</button>
            <button onClick={() => setEditModalOpen(false)} className="modal-cancel">Hủy</button>
          </div>
        </Modal>
      )}

      {deleteModalOpen && (
        <Modal
          onClose={() => setDeleteModalOpen(false)}
          isOpen={deleteModalOpen}
          title="Xác nhận xóa danh mục"
        >
          <p>
            Bạn có chắc chắn muốn xóa danh mục <strong dangerouslySetInnerHTML={{ __html: deleteName }} /> không?
          </p>
          {deleteError && <p className="error-text">{deleteError}</p>}
          <div className="modal-buttons">
            <button onClick={handleDeleteConfirm} className="modal-save" style={{ backgroundColor: '#dc3545' }}>
              Xóa
            </button>
            <button onClick={() => setDeleteModalOpen(false)} className="modal-cancel">Hủy</button>
          </div>
        </Modal>
      )}

    </main>
  );
}
