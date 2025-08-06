'use client'

import { useEffect, useRef, useState } from 'react'
import DOMPurify from 'dompurify'
import '@/public/admin_css/style.css';
import '@/public/admin_css/danhmuc.css';
import Modal from '@/components/Modal';

type SuKien = {
  maSuKien: number
  tenSuKien: string
  trangThaiSuKien: string
  luongChoNgoi: number
}

const STATUS_BADGE_MAP: Record<string, string> = {
  'Còn chỗ': 'badge-processing',
  'Hết chỗ': 'badge-default',
  'Hết hạn đăng ký': 'badge-cancelled',
  'Đang diễn ra': 'badge-checkedin',
  'Đã kết thúc': 'badge-success',
  'Hủy bỏ': 'badge-cancelled',
}

export default function SuKienTablePage() {
  const [suKiens, setSuKiens] = useState<SuKien[]>([])
  const [page, setPage] = useState(0)
  const [pageSize] = useState(10)
  const [totalElements, setTotalElements] = useState(0)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [sortField, setSortField] = useState<'tenSuKien' | 'luongChoNgoi' | 'trangThaiSuKien' | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [addForm, setAddForm] = useState({
    tenSuKien: '',
    moTa: '',
    diaDiem: '',
    phiThamGia: '',
    luongChoNgoi: '',
    ngayBatDau: '',
    ngayKetThuc: '',
    danhMuc: '',
    anhSuKien: null as File | null,
  })
  const [danhMucs, setDanhMucs] = useState<{ maDanhMuc: string; tenDanhMuc: string }[]>([]);
  const [addMessage, setAddMessage] = useState('');
  const [addError, setAddError] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editForm, setEditForm] = useState({
    maSuKien: '',
    tenSuKien: '',
    moTa: '',
    diaDiem: '',
    phiThamGia: '',
    luongChoNgoi: '',
    ngayBatDau: '',
    ngayKetThuc: '',
    danhMuc: '',
    anhSuKien: '', // string filename from DB
  })
  const [editImage, setEditImage] = useState<File | null>(null);
  const [editMessage, setEditMessage] = useState('');
  const [editError, setEditError] = useState('');
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedCancel, setSelectedCancel] = useState<any | null>(null);
  const [cancelMessage, setCancelMessage] = useState('');
  const [cancelError, setCancelError] = useState('');
  const READONLY_STATUSES = ['Đang diễn ra', 'Đã kết thúc', 'Hủy bỏ'];
  const [isReadOnly, setIsReadOnly] = useState(false);

  useEffect(() => {
    fetchData()
  }, [page, search])  

  const fetchData = async () => {
    const url = new URL('http://localhost:5555/api/sukien/get/all')
    url.searchParams.set('page', page.toString())
    url.searchParams.set('size', pageSize.toString())
    if (search) url.searchParams.set('search', search)
  
    try {
      const res = await fetch(url.toString(), { credentials: 'include' })
      const data = await res.json()
  
      let sorted = [...data.content] as SuKien[]
  
      if (sortField !== null) {
        sorted.sort((a, b) => {
          const aValue = a[sortField as keyof SuKien]
          const bValue = b[sortField as keyof SuKien]
  
          if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortDir === 'asc'
              ? aValue.localeCompare(bValue)
              : bValue.localeCompare(aValue)
          }
  
          if (typeof aValue === 'number' && typeof bValue === 'number') {
            return sortDir === 'asc' ? aValue - bValue : bValue - aValue
          }
  
          return 0 // fallback
        })
      }
  
      setSuKiens(sorted)
      setTotalElements(data.totalElements)
    } catch (err) {
      console.error('Failed to fetch su kien:', err)
    }
  }  

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDir(prev => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDir('asc')
    }
  
    if (field) {
      const sorted = [...suKiens].sort((a, b) => {
        const valA = a[field as keyof SuKien] ?? '';
        const valB = b[field as keyof SuKien] ?? '';
    
        return sortDir === 'asc'
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA));
      });
      setSuKiens(sorted);
    }
    
  }
  
  const totalPages = Math.ceil(totalElements / pageSize)

  useEffect(() => {
    if (addModalOpen || editModalOpen) {
      fetch('http://localhost:5555/api/danhmucsukien/get/all?size=100', {
        credentials: 'include',
      })
        .then((res) => res.json())
        .then((data) => {
          setDanhMucs(data.content || []);
        })
        .catch((err) => {
          console.error('Failed to fetch danh mục:', err);
          setDanhMucs([]);
        });
    }
  }, [addModalOpen, editModalOpen]);

  const onSubmitAddForm = async () => {
    setAddMessage('');
    setAddError('');
  
    try {
      const formData = new FormData();
      formData.append('tenSuKien', addForm.tenSuKien);
      formData.append('moTa', addForm.moTa);
      formData.append('diaDiem', addForm.diaDiem);
      formData.append('phiThamGia', addForm.phiThamGia);
      formData.append('luongChoNgoi', addForm.luongChoNgoi);
      formData.append('ngayBatDau', addForm.ngayBatDau);
      formData.append('ngayKetThuc', addForm.ngayKetThuc);
      if (addForm.danhMuc) {
        formData.append('maDanhMuc', addForm.danhMuc);
      }
      if (addForm.anhSuKien) {
        formData.append('anhSuKien', addForm.anhSuKien); // should be a File
      }
  
      const res = await fetch('http://localhost:5555/api/sukien/add', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
  
      const result = await res.json();
  
      if (res.ok) {
        setAddMessage(result.message || 'Thêm sự kiện thành công!');
        // Optionally reset form
        setAddForm({
          tenSuKien: '',
          moTa: '',
          diaDiem: '',
          phiThamGia: '',
          luongChoNgoi: '',
          ngayBatDau: '',
          ngayKetThuc: '',
          danhMuc: '',
          anhSuKien: null as File | null,
        });
        fetchData();
      } else {
        setAddError(result.error || result.message || 'Đã có lỗi xảy ra!');
      }
    } catch (err) {
      setAddError('Lỗi kết nối đến máy chủ.');
    }
  };  

  const editImageInputRef = useRef<HTMLInputElement>(null);

  const handleEditImageChangeClick = () => {
    if (editImageInputRef.current) {
      editImageInputRef.current.click();
    }
  };

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditImage(file); // assuming you track file upload with editImage state
      setEditForm((prev) => ({
        ...prev,
        anhSuKien: file.name, // or generate a preview URL if needed
      }));
    }
  };

  const handleEditSubmit = async () => {
    setEditMessage('');
    setEditError('');
    const formData = new FormData();
    formData.append('tenSuKien', editForm.tenSuKien);
    formData.append('moTa', editForm.moTa);
    formData.append('diaDiem', editForm.diaDiem);
    formData.append('phiThamGia', editForm.phiThamGia);
    formData.append('ngayBatDau', editForm.ngayBatDau);
    formData.append('ngayKetThuc', editForm.ngayKetThuc);
    if (editForm.danhMuc) formData.append('maDanhMuc', editForm.danhMuc);
    if (editImage) formData.append('anhSuKien', editImage);
  
    try {
      const res = await fetch(`http://localhost:5555/api/sukien/update/${editForm.maSuKien}`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
  
      const result = await res.json();
      if (res.ok) {
        setEditMessage(result.message || 'Cập nhật thành công!');
        setEditModalOpen(false);
        setEditImage(null);
        fetchData(); // Refresh table
      } else {
        setEditError(result.error || result.message || 'Có lỗi xảy ra!');
      }
    } catch (err) {
      setEditError('Lỗi kết nối máy chủ hoặc ảnh tải quá lớn.');
    }
  };  

  return (
    <main className="main-content">
      <div>
      <h1>Danh sách sự kiện</h1>
      <button className="add-btn" style={{ marginBottom: '10px' }} onClick={() => {setAddModalOpen(true), setAddMessage(''), setAddError('')}}>
        + Thêm sự kiện
      </button>

      <table className="admin-table">
        <thead>
          {/* Search row */}
          <tr className="table-search-row">
            <th colSpan={5}>
              <div className="search-wrapper">
                <input
                  type="text"
                  placeholder="🔍 Tìm kiếm sự kiện..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setSearch(searchInput.trim())
                      setPage(0)
                    }
                  }}
                  className="search-input"
                />
                {search && (
                  <button
                    onClick={() => {
                      setSearch('')
                      setSearchInput('')
                      setPage(0)
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
            <th onClick={() => toggleSort('tenSuKien')} className="sortable">
              Tên sự kiện {sortField === 'tenSuKien' ? (sortDir === 'asc' ? '▲' : '▼') : '▲▼'}
            </th>
            <th onClick={() => toggleSort('luongChoNgoi')} className="sortable">
              Lượng chỗ ngồi {sortField === 'luongChoNgoi' ? (sortDir === 'asc' ? '▲' : '▼') : '▲▼'}
            </th>
            <th onClick={() => toggleSort('trangThaiSuKien')} className="sortable">
              Trạng thái {sortField === 'trangThaiSuKien' ? (sortDir === 'asc' ? '▲' : '▼') : '▲▼'}
            </th>
            <th>Hành động</th>
          </tr>
        </thead>

        <tbody>
          {suKiens.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ textAlign: 'center', padding: '20px' }}>
                Không có dữ liệu
              </td>
            </tr>
          ) : (
            suKiens.map((sk, index) => (
              <tr key={sk.maSuKien} className={index % 2 === 0 ? 'even' : 'odd'}>
                <td>{page * pageSize + index + 1}</td>
                <td
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(sk.tenSuKien),
                  }}
                />
                <td>{sk.luongChoNgoi}</td>
                <td>
                  <span className={`badge ${STATUS_BADGE_MAP[sk.trangThaiSuKien] || 'badge-default'}`}>
                    {sk.trangThaiSuKien}
                  </span>
                </td>
                <td>
                <button
  className="edit-btn"
  onClick={() => {
    fetch(`http://localhost:5555/api/sukien/get/${sk.maSuKien}`, { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        setEditForm({
          maSuKien: DOMPurify.sanitize(data.maSuKien),
          tenSuKien: DOMPurify.sanitize(data.tenSuKien),
          moTa: DOMPurify.sanitize(data.moTa) || '',
          diaDiem: DOMPurify.sanitize(data.diaDiem) || '',
          phiThamGia: data.phiThamGia?.toString() || '',
          luongChoNgoi: data.luongChoNgoi?.toString() || '',
          ngayBatDau: data.ngayBatDau?.slice(0, 19) || '',
          ngayKetThuc: data.ngayKetThuc?.slice(0, 19) || '',
          danhMuc: data.maDanhMuc || '',
          anhSuKien: data.anhSuKien || '',
        });
        setEditModalOpen(true);
        setIsReadOnly(READONLY_STATUSES.includes(sk.trangThaiSuKien));
      })
      .catch(console.error);
    setEditError('');
    setEditMessage('');
  }}
>
  {READONLY_STATUSES.includes(sk.trangThaiSuKien) ? 'Chi tiết' : 'Chỉnh sửa'}
</button>


                  <button
                    className="delete-btn"
                    onClick={() => {
                      setSelectedCancel(sk);
                      setCancelModalOpen(true);
                      setCancelMessage('');
                      setCancelError('');
                    }}
                    disabled={sk.trangThaiSuKien === 'Đang diễn ra' || sk.trangThaiSuKien === 'Đã kết thúc' || sk.trangThaiSuKien === 'Hủy bỏ'}>
                  Hủy
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="table-footer">
        <span>
          Trang {page + 1} / {totalPages} &nbsp;|&nbsp;
          Hiển thị {suKiens.length} / {totalElements}
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
    </div>
    {addModalOpen && (
  <Modal onClose={() => setAddModalOpen(false)} isOpen={addModalOpen} title="Thêm sự kiện">
    <div
      style={{
        width: '900px',
        overflowX: 'hidden',
      }}
    >
      <div
        className="modal-details"
        style={{
          display: 'flex',
          gap: '24px',
          alignItems: 'flex-start',
          maxHeight: '65vh',
          overflowY: 'auto',
          overflowX: 'hidden',
          paddingRight: '8px',
          width: '900px',
        }}
      >
        {/* Left: image upload placeholder */}
        <div style={{ flex: '1', minWidth: '200px' }}>
          <label
            htmlFor="anhSuKienInput"
            style={{
              width: '100%',
              height: '100%',
              minHeight: '400px',
              border: '2px dashed #ccc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              background: '#f9f9f9',
              textAlign: 'center',
            }}
          >
            {addForm.anhSuKien ? (
              <img
                src={URL.createObjectURL(addForm.anhSuKien)}
                alt="Preview"
                style={{ maxWidth: '100%', maxHeight: '100%' }}
              />
            ) : (
              <span style={{ color: '#999' }}>Bấm để tải ảnh sự kiện</span>
            )}
          </label>
          <input
            type="file"
            id="anhSuKienInput"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setAddForm((prev) => ({ ...prev, anhSuKien: file }));
              }
            }}
          />
        </div>

        {/* Right: form inputs */}
        <div style={{ flex: '2' }}>
          {[
            ['Tên sự kiện', 'tenSuKien'],
            ['Mô tả', 'moTa'],
            ['Địa điểm', 'diaDiem'],
            ['Phí tham gia', 'phiThamGia'],
            ['Lượng chỗ ngồi', 'luongChoNgoi'],
            ['Ngày bắt đầu', 'ngayBatDau'],
            ['Ngày kết thúc', 'ngayKetThuc'],
          ].map(([label, key]) => (
            <div className="form-group" key={key}>
              <label><strong>{label}:</strong></label>
              {key === 'moTa' ? (
                <textarea
                  value={addForm[key as keyof typeof addForm] as string}
                  onChange={(e) =>
                    setAddForm((prev) => ({ ...prev, [key]: e.target.value }))
                  }
                  className="modal-input"
                  rows={4}
                />
              ) : (
                <input
                  type={
                    key === 'phiThamGia' || key === 'luongChoNgoi'
                      ? 'number'
                      : key === 'ngayBatDau' || key === 'ngayKetThuc'
                      ? 'datetime-local'
                      : 'text'
                  }
                  value={addForm[key as keyof typeof addForm] as string}
                  onChange={(e) =>
                    setAddForm((prev) => ({ ...prev, [key]: e.target.value }))
                  }
                  className="modal-input"
                />
              )}
            </div>
          ))}

          {/* Danh mục (dropdown) */}
          <div className="form-group">
            <label><strong>Danh mục:</strong></label>
            <select
              className="modal-input"
              value={addForm.danhMuc}
              onChange={(e) => setAddForm((prev) => ({ ...prev, danhMuc: e.target.value }))}
            >
              <option value="">-- Chọn danh mục --</option>
              {danhMucs.map((dm) => (
                <option key={dm.maDanhMuc} value={DOMPurify.sanitize(dm.maDanhMuc)}>
                  {DOMPurify.sanitize(dm.tenDanhMuc)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Success & error messages */}
      {addMessage && <p style={{ color: 'green', marginTop: '8px' }}>{addMessage}</p>}
      {addError && <p style={{ color: 'red', marginTop: '8px' }}>{addError}</p>}
    </div>

    <div className="modal-buttons">
      <button className="modal-save" onClick={onSubmitAddForm}>
        Thêm
      </button>
      <button
        className="modal-cancel"
        onClick={() => {
          setAddModalOpen(false);
          setAddForm({
            tenSuKien: '',
            moTa: '',
            diaDiem: '',
            phiThamGia: '',
            luongChoNgoi: '',
            ngayBatDau: '',
            ngayKetThuc: '',
            danhMuc: '',
            anhSuKien: null as File | null,
          });
          setAddMessage('');
          setAddError('');
        }}
      >
        Hủy
      </button>
    </div>
  </Modal>
)}

{editModalOpen && (
  <Modal onClose={() => setEditModalOpen(false)} isOpen={editModalOpen} title="Chỉnh sửa sự kiện">
    <div
      style={{
        width: '900px',
        overflowX: 'hidden',
      }}
    >
      <div
        className="modal-details"
        style={{
          display: 'flex',
          gap: '24px',
          alignItems: 'flex-start',
          maxHeight: '65vh',
          overflowY: 'auto',
          overflowX: 'hidden',
          paddingRight: '8px',
          width: '900px',
        }}
      >
        {/* Left: image placeholder */}
        <div style={{ flex: '1', minWidth: '200px' }}>
          <label
            onClick={handleEditImageChangeClick}
            style={{
              width: '100%',
              height: '100%',
              minHeight: '400px',
              border: '2px dashed #ccc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              background: '#f9f9f9',
              textAlign: 'center',
            }}
          >
            {editImage ? (
              <img
                src={URL.createObjectURL(editImage)}
                alt="Preview"
                style={{ maxWidth: '100%', maxHeight: '100%' }}
              />
            ) : editForm.anhSuKien ? (
              <img
                src={`http://localhost:5555/api/sukien/get${editForm.anhSuKien}`}
                alt="Hiện tại"
                style={{ maxWidth: '100%', maxHeight: '100%' }}
              />
            ) : (
              <span style={{ color: '#999' }}>Bấm để thay ảnh sự kiện</span>
            )}
          </label>
          <input
            type="file"
            ref={editImageInputRef}
            style={{ display: 'none' }}
            accept="image/*"
            onChange={handleEditImageChange}
          />
        </div>

        {/* Right: Form fields */}
        <div style={{ flex: '2' }}>
          {[
            ['Tên sự kiện', 'tenSuKien'],
            ['Mô tả', 'moTa'],
            ['Địa điểm', 'diaDiem'],
            ['Phí tham gia', 'phiThamGia'],
            ['Lượng chỗ ngồi', 'luongChoNgoi'],
            ['Ngày bắt đầu', 'ngayBatDau'],
            ['Ngày kết thúc', 'ngayKetThuc'],
          ].map(([label, key]) => (
            <div className="form-group" key={key}>
              <label><strong>{label}:</strong></label>
              {key === 'moTa' ? (
                <textarea
                  value={editForm[key as keyof typeof editForm] as string}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, [key]: e.target.value }))
                  }
                  className="modal-input"
                  rows={4}
                  disabled={isReadOnly}
                />
              ) : (
                <input
                  type={
                    key === 'phiThamGia' || key === 'luongChoNgoi'
                      ? 'number'
                      : key === 'ngayBatDau' || key === 'ngayKetThuc'
                      ? 'datetime-local'
                      : 'text'
                  }
                  value={editForm[key as keyof typeof editForm] as string}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, [key]: e.target.value }))
                  }
                  className="modal-input"
                  disabled={isReadOnly || key === 'luongChoNgoi'}
                />
              )}
            </div>
          ))}

          {/* Danh mục */}
          <div className="form-group">
            <label><strong>Danh mục:</strong></label>
            <select
              className="modal-input"
              value={editForm.danhMuc}
              onChange={(e) =>
                setEditForm((prev) => ({ ...prev, danhMuc: e.target.value }))
              }
              disabled={isReadOnly}
            >
              <option value="">{isReadOnly ? 'Sự kiện này không thuộc danh mục nào' : '-- Chọn danh mục --'}</option>
              {danhMucs.map((dm) => (
                <option key={dm.maDanhMuc} value={DOMPurify.sanitize(dm.maDanhMuc)}>
                  {DOMPurify.sanitize(dm.tenDanhMuc)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Optional: add success/error if needed */}
    </div>

    {editMessage && <p style={{ color: 'green', marginTop: '8px' }}>{editMessage}</p>}
    {editError && <p style={{ color: 'red', marginTop: '8px' }}>{editError}</p>}
    <div className="modal-buttons">
    {!isReadOnly && (
    <button className="modal-save" onClick={handleEditSubmit}>
      Cập nhật
    </button>
  )}
      <button className="modal-cancel" onClick={() => setEditModalOpen(false)}>
        Hủy
      </button>
    </div>
  </Modal>
)}
{cancelModalOpen && selectedCancel && (
  <Modal isOpen={cancelModalOpen} onClose={() => setCancelModalOpen(false)} title="Xác nhận hủy sự kiện">
    <div>
      <p>Bạn có chắc chắn muốn <strong>hủy sự kiện "{DOMPurify.sanitize(selectedCancel.tenSuKien)}"</strong> không?</p>

      {cancelMessage && <p style={{ color: 'green', marginTop: '12px' }}>{cancelMessage}</p>}
      {cancelError && <p style={{ color: 'red', marginTop: '12px' }}>{cancelError}</p>}

      <div className="modal-buttons" style={{ marginTop: '20px' }}>
        <button
          style={{backgroundColor: 'red'}}
          className="modal-save"
          onClick={async () => {
            try {
              const res = await fetch(`http://localhost:5555/api/sukien/cancel/${selectedCancel.maSuKien}`, {
                method: 'PUT',
                credentials: 'include',
              });

              const data = await res.json();

              if (res.ok) {
                setCancelMessage(data.message || 'Hủy sự kiện thành công.');
                setCancelModalOpen(false);
                fetchData();
                // Optionally refresh the event list or mark status as 'Đã hủy'
              } else {
                setCancelError(data.error || 'Hủy sự kiện thất bại.');
              }
            } catch (err) {
              setCancelError('Đã xảy ra lỗi khi gửi yêu cầu hủy.');
            }
          }}
        >
          Xác nhận hủy
        </button>
        <button
          className="modal-cancel"
          onClick={() => {
            setCancelModalOpen(false);
            setSelectedCancel(null);
          }}
        >
          Đóng
        </button>
      </div>
    </div>
  </Modal>
)}
    </main>
    
  )
}

