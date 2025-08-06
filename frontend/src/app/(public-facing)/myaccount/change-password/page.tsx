'use client';

import { useState } from 'react';

export default function ChangePasswordPage() {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5555/api/taikhoan/changepassword', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || 'Đổi mật khẩu thành công!');
        setFormData({
          oldPassword: '',
          newPassword: '',
          confirmNewPassword: '',
        });
      } else {
        setError(data.error || 'Đã xảy ra lỗi!');
      }
    } catch (err) {
      setError('Lỗi kết nối đến máy chủ!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section" id="account-info">
      <h2>Đổi mật khẩu</h2>
      <form id="account-info-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="current-password">Mật khẩu</label>
          <input
            type="password"
            id="current-password"
            name="oldPassword"
            value={formData.oldPassword}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="new-password">Mật khẩu mới</label>
          <input
            type="password"
            id="new-password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirm-password">Nhập lại mật khẩu mới</label>
          <input
            type="password"
            id="confirm-password"
            name="confirmNewPassword"
            value={formData.confirmNewPassword}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-buttons">
        <button type="submit" className="btn-change-password" disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
        </button>
        </div>

        {message && <p style={{ color: 'green', marginTop: '1rem' }}>{message}</p>}
        {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
      </form>
    </div>
  );
}
