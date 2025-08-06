'use client';

import { useUser } from "@/context/UserContext";
import { FormEvent, useEffect, useState } from "react";
import Modal from "@/components/Modal"; // adjust path if needed
import { useRouter } from "next/navigation";
import DOMPurify from 'dompurify';

export default function PersonalDataPage() {
    const { user, setUser, refreshUser } = useUser();
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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();

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

    const handleGenderSelect = (value: string) => {
        setFormData((prev) => ({ ...prev, gioiTinh: value }));
      
        const options = document.getElementById("gender-options");
        if (options) {
            options.style.display = "none";
        }
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

    const handleLogout = async () => {
        try {
          await fetch("http://localhost:5555/api/auth/logout", {
            method: "POST",
            credentials: "include",
          });
          setUser(null);
          router.push("/");
        } catch (error) {
          console.error("Logout failed:", error);
        }
      };
      
      const handleDeactivate = async () => {
        try {
          const res = await fetch("http://localhost:5555/api/taikhoan/deactivate", {
            method: "POST",
            credentials: "include",
          });
      
          const data = await res.json();
      
          if (res.ok && data.message) {
            await handleLogout();
          } else {
            setError(data.error || "Không thể dừng tài khoản.");
          }
        } catch {
          setError("Không thể kết nối đến máy chủ.");
        }
      };      

    return (
        <div className="content">
        <div className="section" id="personal-info">
            <h2>THÔNG TIN CÁ NHÂN</h2>
            <form id="personal-info-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="register-name">Họ và tên</label>
                <input
                type="text"
                id="register-name"
                name="hoTen"
                value={DOMPurify.sanitize(formData.hoTen)}
                onChange={handleInputChange}
                required
                />
            </div>

            <div className="form-group">
                <label htmlFor="gender-select">Giới tính</label>
                <div id="gender-wrapper" className="custom-select">
                <div
                    id="gender-selected"
                    className="selected-option"
                    onClick={() => {
                    const options = document.getElementById("gender-options");
                    if (options) {
                        options.style.display =
                        options.style.display === "block" ? "none" : "block";
                    }
                    }}
                >
                    {formData.gioiTinh || "-- Chọn giới tính --"} <span className="arrow">▾</span>
                </div>
                <div id="gender-options" className="options" style={{ display: "none" }}>
                    <div className="option" onClick={() => handleGenderSelect("Nam")}>Nam</div>
                    <div className="option" onClick={() => handleGenderSelect("Nữ")}>Nữ</div>
                </div>
                </div>
                <input type="hidden" id="gender-value" name="gender" value={formData.gioiTinh} required />
            </div>

            <div className="form-group">
                <label htmlFor="register-age">Tuổi</label>
                <input
                type="number"
                id="register-age"
                name="soTuoi"
                min="1"
                max="120"
                value={formData.soTuoi}
                onChange={handleInputChange}
                required
                />
            </div>

            <div className="form-group">
                <label htmlFor="register-email">Email</label>
                <input
                type="email"
                id="register-email"
                name="email"
                value={DOMPurify.sanitize(formData.email)}
                onChange={handleInputChange}
                required
                />
            </div>

            <div className="form-group">
                <label htmlFor="register-phone">Số điện thoại</label>
                <input
                type="tel"
                id="register-phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                />
            </div>

            <div className="form-group">
                <label htmlFor="register-address">Địa chỉ</label>
                <input
                type="text"
                id="register-address"
                name="diaChi"
                value={DOMPurify.sanitize(formData.diaChi)}
                onChange={handleInputChange}
                required
                />
            </div>

            {message && <p style={{ color: "green" }}>{message}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            <div className="form-buttons">
            <button type="submit" className="btn-save">Lưu thông tin</button>
            <button type="button" className="btn-deactivate" onClick={() => setIsModalOpen(true)}>
                Dừng tài khoản
            </button>
            </div>
            </form>
        </div>
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Xác nhận dừng tài khoản">
        <p>Bạn có chắc chắn muốn dừng tài khoản của mình không?</p>
        <div className="form-buttons" style={{ marginTop: '1rem' }}>
            <button onClick={handleDeactivate} className="btn-deactivate">Có, dừng tài khoản</button>
            <button onClick={() => setIsModalOpen(false)} className="btn-save">Hủy</button>
        </div>
        </Modal>

        </div>
    );
}