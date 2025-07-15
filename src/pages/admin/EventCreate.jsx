import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./EventManagement.css";

const statusOptions = [
  { value: "upcoming", label: "Sắp Tới" },
  { value: "active", label: "Đang Diễn Ra" },
  { value: "completed", label: "Hoàn Thành" },
];

export default function EventCreate() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    start_time: "",
    end_time: "",
    location: "",
    created_at: "",
    created_by: "",
    qr_join_token: "",
    banner: "",
    url_docs: "",
    status: "upcoming",
    max_participants: ""
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Gọi API tạo sự kiện hoặc cập nhật state toàn cục
    alert("Tạo sự kiện thành công!");
    navigate("/admin/events");
  };

  return (
    <div className="container" style={{ maxWidth: 600, margin: "40px auto", background: "#fff", borderRadius: 16, boxShadow: "0 4px 24px rgba(197,32,50,0.08)", padding: 32 }}>
      <h1 style={{ color: "#c52032", textAlign: "center", marginBottom: 32 }}>➕ Thêm Sự Kiện Mới</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Tên Sự Kiện:</label>
          <input type="text" id="title" value={form.title} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="description">Mô Tả:</label>
          <textarea id="description" value={form.description} onChange={handleChange} placeholder="Nhập mô tả sự kiện..." />
        </div>
        <div className="form-group">
          <label htmlFor="start_time">Thời Gian Bắt Đầu:</label>
          <input type="datetime-local" id="start_time" value={form.start_time} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="end_time">Thời Gian Kết Thúc:</label>
          <input type="datetime-local" id="end_time" value={form.end_time} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="location">Địa Điểm:</label>
          <input type="text" id="location" value={form.location} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="created_at">Ngày Tạo:</label>
          <input type="datetime-local" id="created_at" value={form.created_at} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="created_by">Người Tạo (ID):</label>
          <input type="number" id="created_by" value={form.created_by} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="qr_join_token">QR Join Token:</label>
          <input type="text" id="qr_join_token" value={form.qr_join_token} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="banner">Banner (tên file hoặc URL):</label>
          <input type="text" id="banner" value={form.banner} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="url_docs">Tài Liệu (URL):</label>
          <input type="text" id="url_docs" value={form.url_docs} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="status">Trạng Thái:</label>
          <select id="status" value={form.status} onChange={handleChange} required>
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="max_participants">Số Lượng Tối Đa:</label>
          <input type="number" id="max_participants" value={form.max_participants} onChange={handleChange} />
        </div>
        <div className="form-group" style={{ display: "flex", gap: 16, justifyContent: "flex-end" }}>
          <button type="submit" className="btn btn-primary" style={{ background: "#c52032", color: "#fff" }}>Lưu Sự Kiện</button>
          <button type="button" className="btn btn-secondary" style={{ background: "#223b73", color: "#fff" }} onClick={() => navigate("/admin/events")}>Hủy</button>
        </div>
      </form>
    </div>
  );
} 