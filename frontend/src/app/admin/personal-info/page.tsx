'use client';

import { useState, useEffect, FormEvent } from 'react';
import DOMPurify from 'dompurify';
import { useUser } from '@/context/UserContext';

export default function AdminPersonalInfoPage() {
  const { user, refreshUser } = useUser();
    const [formData, setFormData] = useState({
        hoTen: "",
        gioiTinh: "",
        soTuoi: "",
        email: "",
        phone: "",
        diaChi: "",
    });

    const [initialData, setInitialData] = useState(formData);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (user) {
        const data = {
            hoTen: user.hoTen || "",
            gioiTinh: user.gioiTinh || "",
            soTuoi: user.soTuoi?.toString() || "",
            email: user.email || "",
            phone: user.phone || "",
            diaChi: user.diaChi || "",
        };
        setFormData(data);
        setInitialData(data);
        }
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
        }));
    };

    const handleGenderSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setFormData((prev) => ({ ...prev, gioiTinh: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setMessage("");
        setError("");

        // Compare formData with initialData and only include changed fields
        const updatedFields: Record<string, any> = {};
        Object.entries(formData).forEach(([key, value]) => {
        if (value !== (initialData as any)[key]) {
            updatedFields[key] = key === "soTuoi" ? parseInt(value) : value;
        }
        });

        if (Object.keys(updatedFields).length === 0) {
        setMessage("Không có thay đổi nào.");
        return;
        }

        try {
        const res = await fetch("http://localhost:5555/api/taikhoan/update/me", {
            method: "PUT",
            headers: {
            "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(updatedFields),
        });

        const data = await res.json();

        if (res.ok) {
            setMessage(data.message || "Cập nhật thành công!");
            refreshUser(); // refresh local user data
            setInitialData(formData); // reset change tracking
        } else {
            setError(data.error || "Có lỗi xảy ra khi cập nhật.");
        }
        } catch {
        setError("Không thể kết nối đến máy chủ.");
        }
    };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Cập nhật thông tin cá nhân</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="hoTen"
          value={DOMPurify.sanitize(formData.hoTen)}
          onChange={handleInputChange}
          placeholder="Họ tên"
          required
          style={styles.input}
        />
        <input
          type="text"
          name="diaChi"
          value={DOMPurify.sanitize(formData.diaChi)}
          onChange={handleInputChange}
          placeholder="Địa chỉ"
          required
          style={styles.input}
        />
        <input
          type="email"
          name="email"
          value={DOMPurify.sanitize(formData.email)}
          onChange={handleInputChange}
          placeholder="Email"
          required
          style={styles.input}
        />
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="Số điện thoại"
          required
          style={styles.input}
        />
        <select name="gioiTinh" value={formData.gioiTinh} onChange={handleGenderSelect} required style={styles.input}>
          <option value="">Chọn giới tính</option>
          <option value="Nam">Nam</option>
          <option value="Nữ">Nữ</option>
          <option value="Khác">Khác</option>
        </select>
        <input
          type="number"
          name="soTuoi"
          value={formData.soTuoi}
          onChange={handleInputChange}
          placeholder="Tuổi"
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Lưu thay đổi</button>
        {message && <p style={styles.success}>{message}</p>}
        {error && <p style={styles.error}>{error}</p>}
      </form>
    </div>
  );
}

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
    width: '95%',
  },
  button: {
    padding: '14px',
    fontSize: '16px',
    backgroundColor: '#0070f3',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    width: '15%',
    alignContent: 'center',
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
