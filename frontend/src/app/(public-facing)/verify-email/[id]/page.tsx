'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import '@/public/css/style.css';

export default function VerifyEmailPage() {
    const { id } = useParams();
    const [message, setMessage] = useState('Đang xác minh...');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id) return;
    
        const verifyEmail = async () => {
            try {
                const res = await fetch(`http://localhost:5555/api/auth/verify/${id}`);
                if (res.ok) {
                    const data = await res.json(); 
                setMessage(data.message || 'Xác minh email thành công!');
                } else {
                    const errData = await res.json();
                    setError(errData.error || 'Xác minh thất bại.');
                }
            } catch (err) {
                setError('Lỗi kết nối đến máy chủ.');
            }
        };
    
        verifyEmail();
    }, [id]);

    return (
        <main className="verify-email-page">
          <div className="container">
            <h1>Xác minh Email</h1>
            {error ? (
              <h2 style={{ color: 'red' }}>{error}</h2>
            ) : (
              <h2 style={{ color: 'green' }}>{message}</h2>
            )}
          </div>
        </main>
      );
}