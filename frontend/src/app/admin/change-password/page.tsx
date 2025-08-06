'use client';

import { useState } from 'react';

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minWidth: '95%',
    margin: '40px auto',
    padding: '30px',
    backgroundColor: '#fff',
    borderRadius: '10px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '30px',
    textAlign: 'left',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  input: {
    fontSize: '16px',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    width: '100%',
  },
  button: {
    padding: '14px',
    fontSize: '16px',
    backgroundColor: '#0070f3',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    width: '20%',
  },
  success: {
    marginTop: '16px',
    color: '#227d42',
    fontWeight: 'bold',
  },
  error: {
    marginTop: '16px',
    color: '#c62828',
    fontWeight: 'bold',
  },
};

export default function AdminChangePasswordPage() {
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
    <div style={styles.container}>
      <h2 style={styles.title}>Đổi mật khẩu</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="password"
          name="oldPassword"
          placeholder="Mật khẩu hiện tại"
          value={formData.oldPassword}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <input
          type="password"
          name="newPassword"
          placeholder="Mật khẩu mới"
          value={formData.newPassword}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <input
          type="password"
          name="confirmNewPassword"
          placeholder="Nhập lại mật khẩu mới"
          value={formData.confirmNewPassword}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
        </button>
        {message && <p style={styles.success}>{message}</p>}
        {error && <p style={styles.error}>{error}</p>}
      </form>
    </div>
  );
}
