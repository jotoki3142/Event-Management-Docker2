'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import '@/public/css/style.css';
import '@/public/css/index.css';
import '@/public/css/account.css';
import '@/public/css/forget-password.css';

// TODO: add redirect after a successful request

export default function ResetPasswordPage() {
  const { id } = useParams();
  const router = useRouter();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [tokenError, setTokenError] = useState('');

  // redirect user if password has been reset successfully
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        router.push('/login');
      }, 2500); // 2.5 seconds delay before redirect

      return () => clearTimeout(timer); // cleanup
    }
  }, [message, router]);

  // Check token on load
  useEffect(() => {
    const checkToken = async () => {
      try {
        const res = await fetch(`http://localhost:5555/api/auth/reset_password/${id}`, {
          method: 'GET',
          credentials: 'include',
        });

        if (res.ok) {
          setTokenValid(true);
        } else {
          const data = await res.json();
          setTokenError(data.error || 'Liên kết không hợp lệ hoặc đã hết hạn.');
          setTokenValid(false);
        }
      } catch (err) {
        setTokenError('Lỗi kết nối đến máy chủ.');
        setTokenValid(false);
      }
    };

    checkToken();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    setError('');

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5555/api/auth/reset_password/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          newPassword,
          confirmNewPassword: confirmPassword,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessage(data.message || 'Mật khẩu đã được đặt lại thành công!');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        const data = await res.json();
        setError(data.error || 'Đã xảy ra lỗi khi đặt lại mật khẩu.');
      }
    } catch (err) {
      setError('Không thể kết nối đến máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  // --- Render Logic ---
  if (tokenValid === false) {
    return (
      <main>
        <div className="container">
          <h1 style={{ color: 'red', textAlign: 'center' }}>{tokenError}</h1>
        </div>
      </main>
    );
  }

  if (tokenValid === null) {
    return (
      <main>
        <div className="container">
          <h2 style={{ textAlign: 'center' }}>Đang kiểm tra liên kết...</h2>
        </div>
      </main>
    );
  }

  // Show form is token is valid

  return (
    <main>
      <div className="account">
        <div className="container">
          <div className="auth-container">
            <div className="auth-content">
              <div id="reset-section">
                <h2>Đặt lại mật khẩu</h2>
                <form id="reset-password-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="new-password">Mật khẩu mới</label>
                    <input
                      type="password"
                      id="new-password"
                      name="new-password"
                      placeholder="Nhập mật khẩu mới"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="confirm-password">Xác nhận mật khẩu</label>
                    <input
                      type="password"
                      id="confirm-password"
                      name="confirm-password"
                      placeholder="Nhập lại mật khẩu"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <button type="submit" disabled={loading}>
                      {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
                    </button>
                  </div>
                    {message && <p style={{ color: 'green', marginTop: '10px'}}>{message}</p>}
                    {error && <p style={{ color: 'red', marginTop: '10px'}}>{error}</p>}
                  <div className="form-footer">
                    <Link href="/login">Quay lại đăng nhập</Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
