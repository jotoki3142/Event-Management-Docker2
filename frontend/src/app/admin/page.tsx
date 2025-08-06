'use client';

import { useUser } from '@/context/UserContext';

export default function AdminHomePage() {
  const { user } = useUser();

  return (
    <div className="admin-welcome-container">
      <h1 className="admin-welcome-title">Welcome back, {user?.hoTen || 'Staff'}!</h1>
      <p className="admin-welcome-subtitle">Chúc bạn một ngày làm việc hiệu quả 🎉</p>

      <style jsx>{`
        .admin-welcome-container {
          margin: 60px auto;
          padding: 40px;
          max-width: 700px;
          text-align: center;
          font-family: Arial, sans-serif;
          background-color: #fff;
          border-radius: 12px;
        }

        .admin-welcome-title {
          font-size: 32px;
          color: #333;
          margin-bottom: 10px;
        }

        .admin-welcome-subtitle {
          font-size: 18px;
          color: #666;
        }
      `}</style>
    </div>
  );
}
