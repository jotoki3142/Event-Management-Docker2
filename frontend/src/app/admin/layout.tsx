'use client';

import React from 'react';
import Link from 'next/link';
import '@/public/admin_css/style.css';
import { UserProvider, useUser } from '@/context/UserContext';
import { useRouter, usePathname } from 'next/navigation';

function AdminContent({ children }: { children: React.ReactNode }) {
  const { user, setUser } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  if (user === null) {
    return <p style={{ textAlign: 'center' }}>Đang tải thông tin người dùng...</p>;
  }

  if (!user || (user.vaiTro !== 'NhanVien' && user.vaiTro !== 'QuanLy')) {
    if (typeof window !== 'undefined') {
      router.push('/');
    }
    return null;
  }

  const isQuanLy = user.vaiTro === 'QuanLy';

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5555/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="container">
      <aside className="sidebar">
      <div style={{ marginBottom: '1rem' }}>
        <Link href="/" className="go-back-button">
          ← Quay về trang chính
        </Link>
      </div>
      <h2>Admin Panel</h2>
        <nav>
          {isQuanLy && (
            <Link href="/admin/statistics" className={pathname === '/admin/statistics' ? 'active' : ''}>
              Thống kê
            </Link>
          )}
          <Link href="/admin/sukien" className={pathname === '/admin/sukien' ? 'active' : ''}>
            Sự kiện
          </Link>
          <Link href="/admin/danhmuc" className={pathname === '/admin/danhmuc' ? 'active' : ''}>
            Danh mục
          </Link>
          <Link href="/admin/dangky" className={pathname === '/admin/dangky' ? 'active' : ''}>
            Đăng ký
          </Link>
          <Link href="/admin/hoadon" className={pathname === '/admin/hoadon' ? 'active' : ''}>
            Hóa đơn
          </Link>
          <Link href="/admin/diemdanh" className={pathname === '/admin/diemdanh' ? 'active' : ''}>
            Điểm danh
          </Link>
          {isQuanLy && (
            <Link href="/admin/nhanvien" className={pathname === '/admin/nhanvien' ? 'active' : ''}>
              Nhân viên
            </Link>
          )}
          {isQuanLy && (
            <Link href="/admin/khachhang" className={pathname === '/admin/khachhang' ? 'active' : ''}>
              Khách hàng
            </Link>
          )}
          <Link href="/admin/danhgia" className={pathname === '/admin/danhgia' ? 'active' : ''}>
            Đánh giá
          </Link>
          <Link href="/admin/cauhoi" className={pathname === '/admin/cauhoi' ? 'active' : ''}>
            Câu hỏi
          </Link>
          <Link href="/admin/ticket" className={pathname === '/admin/ticket' ? 'active' : ''}>
            Ticket
          </Link>
          <Link href="/admin/personal-info" className={pathname === '/admin/personal-info' ? 'active' : ''}>
            Thông tin cá nhân
          </Link>
          <Link href="/admin/change-password" className={pathname === '/admin/change-password' ? 'active' : ''}>
            Đổi mật khẩu
          </Link>
          <Link href="#" onClick={handleLogout}>
            Đăng xuất
          </Link>
        </nav>
      </aside>

      <main className="admin-content">{children}</main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <UserProvider>
          <AdminContent>{children}</AdminContent>
        </UserProvider>
      </body>
    </html>
  );
}
