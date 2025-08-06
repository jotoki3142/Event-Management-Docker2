'use client'

import { FormEvent, useEffect, useState } from 'react';
import '@/public/css/style.css';
import '@/public/css/index.css';
import '@/public/css/account.css';
import Link from 'next/link';
import GenderSelector from '@/components/GenderSelector';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login')

  const { refreshUser } = useUser();
  const router = useRouter();
  const [loginError, setError] = useState<string | null>(null);
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);
  const [isSubmittingRegister, setIsSubmittingRegister] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user]);  

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmittingLogin(true);

    const form = e.currentTarget;
    const username = (form.querySelector("#login-name") as HTMLInputElement).value;
    const password = (form.querySelector("#login-password") as HTMLInputElement).value;

    try {
      const res = await fetch("http://localhost:5555/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        await refreshUser();
        router.push("/");
      } else {
        const data = await res.json();
        setError(data.error || "Đăng nhập thất bại");
      }
    } catch (err) {
      setError("Lỗi kết nối đến máy chủ");
    } finally {
      setIsSubmittingLogin(false);
    }
  };

  const [registerError, setRegisterError] = useState('');
  const [gender, setGender] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmittingRegister(true);

    const form = e.currentTarget;
    const username = (form.querySelector("#register-username") as HTMLInputElement).value;
    const password = (form.querySelector("#register-password") as HTMLInputElement).value;
    const confirmPassword = (form.querySelector("#register-confirm-password") as HTMLInputElement).value;
    const name = (form.querySelector("#register-name") as HTMLInputElement).value;
    const address = (form.querySelector("#register-address") as HTMLInputElement).value;
    const phone = (form.querySelector("#register-phone") as HTMLInputElement).value;
    const email = (form.querySelector("#register-email") as HTMLInputElement).value;
    const age = (form.querySelector("#register-age") as HTMLInputElement).value;

    try {
        const res = await fetch("http://localhost:5555/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ username, password, confirmPassword, name, address, phone, email, gender, age }),
        });

        if (res.ok) {
            const data = await res.json();
            setRegisterSuccess(data.message);
          } else {
            const data = await res.json();
            setRegisterError(data.error || "Đăng ký thất bại");
          }
        } catch (err) {
            setRegisterError("Lỗi kết nối đến máy chủ");
        } finally {
          setIsSubmittingRegister(false);
        }
    }

  return (
    <main>
        <div className="account">
            <div className="container">
                <div className="auth-container">
                <div className="auth-tabs">
                    <button
                    className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
                    onClick={() => setActiveTab('login')}
                    >
                    Đăng nhập
                    </button>
                    <button
                    className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
                    onClick={() => setActiveTab('register')}
                    >
                    Đăng ký
                    </button>
                </div>

                <div className="auth-content">
                    {/* Login Form */}
                    <form
                    id="login-form"
                    className={`auth-form ${activeTab === 'login' ? 'active' : ''}`}
                    onSubmit={handleLogin}
                    >
                    <div className="form-group">
                        <label htmlFor="login-name">Tên đăng nhập</label>
                        <input type="text" id="login-name" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="login-password">Mật khẩu</label>
                        <input type="password" id="login-password" required />
                    </div>
                    <div className="form-group remember-forgot">
                        <Link href="/forgot-password" className="forgot-password">
                        Quên mật khẩu?
                        </Link>
                    </div>
                    {loginError && <div style={{ color: 'red', marginBottom: '1rem' }}>{loginError}</div>}
                    <button type="submit" className="auth-button" disabled={isSubmittingLogin}>
                        {isSubmittingLogin ? "Đang xử lý..." : "Đăng nhập"}
                    </button>
                    </form>

                    {/* Register Form */}
                    <form
                    id="register-form"
                    className={`auth-form ${activeTab === 'register' ? 'active' : ''}`}
                    onSubmit={handleRegister}
                    >
                    <div className="form-group">
                        <label htmlFor="register-name">Họ và tên</label>
                        <input type="text" id="register-name" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="register-username">Tên đăng nhập</label>
                        <input type="text" id="register-username" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="register-password">Mật khẩu</label>
                        <input type="password" id="register-password" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="register-confirm-password">Xác nhận mật khẩu</label>
                        <input type="password" id="register-confirm-password" required />
                    </div>
                    <GenderSelector selected={gender} setSelected={setGender} />
                    <div className="form-group">
                        <label htmlFor="register-age">Tuổi</label>
                        <input type="number" id="register-age" min="1" max="120" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="register-email">Email</label>
                        <input type="email" id="register-email" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="register-phone">Số điện thoại</label>
                        <input type="tel" id="register-phone" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="register-address">Địa chỉ</label>
                        <input type="text" id="register-address" required />
                    </div>
                    {registerError && <div style={{ color: 'red', marginBottom: '1rem' }}>{registerError}</div>}
                    {registerSuccess && <div style={{ color: 'green', marginBottom: '1rem' }}>{registerSuccess}</div>}
                    <button type="submit" className="auth-button" disabled={isSubmittingRegister}>
                      {isSubmittingRegister ? "Đang xử lý..." : "Đăng ký"}
                    </button>
                    </form>
                </div>
                </div>
            </div>
        </div>
    </main>
    
  )
}