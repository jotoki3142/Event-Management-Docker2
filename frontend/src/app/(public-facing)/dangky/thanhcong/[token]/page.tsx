'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function ThanhCongDangKyPage() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [maDangKy, setMaDangKy] = useState('');
  const [cauHoi, setCauHoi] = useState('');
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const router = useRouter();
  const { token } = useParams();

  useEffect(() => {
    const confirmSuccess = async () => {
      try {
        const res = await fetch(`http://localhost:5555/api/sukien/dangky/${token}/success`, {
          credentials: 'include',
        });

        const data = await res.json();

        if (res.ok && data.message) {
          setMessage(data.message);
          setMaDangKy(data.maDangKy);
        } else {
          setError(data.error || 'Đã xảy ra lỗi.');
        }
      } catch (err) {
        setError('Không thể kết nối đến máy chủ.');
      } finally {
        setLoading(false);
      }
    };

    confirmSuccess();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitMessage('');
    setSubmitError('');

    try {
      const res = await fetch(`http://localhost:5555/api/cauhoi/${maDangKy}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ cauHoi }),
      });

      const data = await res.json();

      if (res.ok && data.message) {
        setSubmitMessage(data.message);
        setIsFormSubmitted(true);
      } else {
        setSubmitError(data.error || 'Gửi câu hỏi thất bại.');
      }
    } catch (err) {
      setSubmitError('Không thể kết nối đến máy chủ.');
    }
  };

  return (
    <div className="success-container">
      {loading ? (
        <div className="success-loading">Đang xử lý xác nhận đăng ký...</div>
      ) : (
        <>
          {message && <div className="success-message success">{message}</div>}
          {error && <div className="success-message error">{error}</div>}

          {message && maDangKy && !isFormSubmitted && (
            <form onSubmit={handleSubmit} className="question-form">
              <textarea
                value={cauHoi}
                onChange={(e) => setCauHoi(e.target.value)}
                placeholder="Hãy đặt câu hỏi của bạn về sự kiện..."
                required
              />
              <button type="submit">Gửi câu hỏi</button>
            </form>
          )}

          {submitMessage && <div className="success-message success">{submitMessage}</div>}
          {submitError && <div className="success-message error">{submitError}</div>}

          <button className="back-home" onClick={() => router.push('/')}>
            Quay về trang chủ
          </button>
        </>
      )}

      <style jsx>{`
        .success-container {
          max-width: 600px;
          margin: 100px auto;
          padding: 20px;
          text-align: center;
          font-family: Arial, sans-serif;
        }

        .success-loading {
          font-size: 18px;
          color: #555;
        }

        .success-message {
          font-size: 20px;
          margin-bottom: 20px;
          padding: 15px;
          border-radius: 6px;
        }

        .success-message.success {
          background-color: #e6ffed;
          color: #227d42;
          border: 1px solid #b6e4c7;
        }

        .success-message.error {
          background-color: #ffe6e6;
          color: #c62828;
          border: 1px solid #f5c6cb;
        }

        .question-form {
          margin-top: 30px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .question-form textarea {
          width: 100%;
          min-height: 120px;
          padding: 12px;
          font-size: 16px;
          border-radius: 6px;
          border: 1px solid #ccc;
          resize: vertical;
        }

        .question-form button {
          margin-top: 10px;
          padding: 10px 20px;
          font-size: 16px;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          margin-bottom: 10px;
        }

        .question-form button:hover {
          background-color: #005dc1;
        }

        .back-home {
          margin-top: 30px;
          padding: 10px 20px;
          font-size: 16px;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }

        .back-home:hover {
          background-color: #005dc1;
        }
      `}</style>
    </div>
  );
}
