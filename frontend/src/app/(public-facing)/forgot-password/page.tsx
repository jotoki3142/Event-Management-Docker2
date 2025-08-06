'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import '@/public/css/style.css';
import '@/public/css/index.css';
import '@/public/css/account.css';
import '@/public/css/forget-password.css';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [sending, setSending] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const { user } = useUser();
    
    useEffect(() => {
      if (user) {
        router.push('/');
      }
    }, [user]);
  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setSending(true);
      setMessage('');
      setError('');
  
      try {
        const res = await fetch('http://localhost:5555/api/auth/forgot_password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ identifier: email }),
        });
  
        if (res.ok) {
          const data = await res.json();
          setMessage(data.message || 'Yêu cầu đã được gửi! Vui lòng kiểm tra email của bạn.');
          setEmail('');
        } else {
          const data = await res.json();
          setError(data.error || 'Đã xảy ra lỗi khi gửi yêu cầu.');
        }
      } catch (err) {
        setError('Không thể kết nối đến máy chủ.');
      } finally {
        setSending(false);
      }
    };
  
    return (
      <main>
        <div className="account">
          <div className="container">
            <div className="auth-container">
              <div className="auth-content">
                <div id="forgot-section">
                  <h2>Quên mật khẩu</h2>
                  <form onSubmit={handleSubmit} id="forgot-form">
                    <div className="form-group">
                      <label htmlFor="email">Địa chỉ Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Nhập email đã đăng ký"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <button type="submit" disabled={sending}>
                        {sending ? 'Đang gửi...' : 'Gửi yêu cầu đặt lại mật khẩu'}
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