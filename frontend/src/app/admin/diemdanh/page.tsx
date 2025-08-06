'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import '@/public/admin_css/style.css';
import DOMPurify from 'dompurify';

interface SuKien {
  maSuKien: number;
  tenSuKien: string;
  occupiedSeat: any[]; // dynamic list for khách
}

export default function DiemDanhPage() {
  const [suKiens, setSuKiens] = useState<SuKien[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<'tenSuKien' | 'soLuongKhach'>('tenSuKien');
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, [page, search]);

  const fetchData = async () => {
    try {
      const query = new URLSearchParams({
        page: page.toString(),
        size: pageSize.toString(),
        trangThai: 'Đang diễn ra',
      });
      if (search.trim()) query.append('search', search.trim());

      const res = await fetch(`http://localhost:5555/api/sukien/get/all?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        const sorted = [...data.content].sort((a: SuKien, b: SuKien) => {
          const valA = sortField === 'tenSuKien' ? a.tenSuKien : a.occupiedSeat.length;
          const valB = sortField === 'tenSuKien' ? b.tenSuKien : b.occupiedSeat.length;

          if (typeof valA === 'string' && typeof valB === 'string') {
            return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
          } else if (typeof valA === 'number' && typeof valB === 'number') {
            return sortAsc ? valA - valB : valB - valA;
          }
          return 0;
        });
        setSuKiens(sorted);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
      }
    } catch (err) {
      console.error('Lỗi kết nối:', err);
    }
  };

  const handleSort = (field: 'tenSuKien' | 'soLuongKhach') => {
    if (field === sortField) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }

    setSuKiens(prev => [...prev].sort((a, b) => {
      const valA = field === 'tenSuKien' ? a.tenSuKien : a.occupiedSeat.length;
      const valB = field === 'tenSuKien' ? b.tenSuKien : b.occupiedSeat.length;

      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortAsc ? valB.localeCompare(valA) : valA.localeCompare(valB);
      } else if (typeof valA === 'number' && typeof valB === 'number') {
        return sortAsc ? valB - valA : valA - valB;
      }
      return 0;
    }));
  };

  return (
    <main className="main-content">
      <h1>Quản lý Điểm danh - Sự kiện đang diễn ra</h1>

      <table className="admin-table">
        <thead>
          <tr className="table-search-row">
            <th colSpan={4}>
              <div className="search-wrapper">
                <input
                  type="text"
                  placeholder="🔍 Tìm kiếm theo tên sự kiện..."
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
            <th onClick={() => handleSort('tenSuKien')} className="sortable">
              Tên sự kiện ▲▼
            </th>
            <th onClick={() => handleSort('soLuongKhach')} className="sortable">
              Số lượng khách ▲▼
            </th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {suKiens.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ textAlign: 'center', padding: '20px' }}>
                Không có sự kiện đang diễn ra
              </td>
            </tr>
          ) : (
            suKiens.map((sk, index) => (
              <tr key={sk.maSuKien} className={index % 2 === 0 ? 'even' : 'odd'}>
                <td>{page * pageSize + index + 1}</td>
                <td>{DOMPurify.sanitize(sk.tenSuKien)}</td>
                <td>{sk.occupiedSeat?.length || 0}</td>
                <td>
                  <button
                    className="edit-btn"
                    disabled={sk.occupiedSeat.length === 0}
                    onClick={() => router.push(`/admin/diemdanh/${sk.maSuKien}`)}
                  >
                    Vào điểm danh
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
    </main>
  );
}
