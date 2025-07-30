import React, { useEffect, useState } from "react";
import "./EventManagement.css";

const statusOptions = [
  { value: "upcoming", label: "Sắp Tới" },
  { value: "active", label: "Đang Diễn Ra" },
  { value: "completed", label: "Hoàn Thành" },
];

const userOptions = [
  { id: 1, name: 'Nguyễn Văn A' },
  { id: 2, name: 'Trần Thị B' },
  { id: 3, name: 'Lê Văn C' },
];

export default function EventModal({ open, onClose, onSubmit, initialData, isEdit }) {
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
    max_participants: "",
    manager_id: ""
  });

  useEffect(() => {
    if (open) {
      setForm(initialData || {
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
        max_participants: "",
        manager_id: ""
      });
    }
  }, [open, initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  if (!open) return null;

  return (
    <div className="modal" style={{ display: "block" }}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2 id="modalTitle" style={{ color: '#c52032' }}>{isEdit ? "Chỉnh Sửa Sự Kiện" : "Thêm Sự Kiện Mới"}</h2>
        <form id="eventForm" onSubmit={handleSubmit}>
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
          <div className="form-group">
            <label htmlFor="manager_id">Người Quản Lý Sự Kiện:</label>
            <select id="manager_id" value={form.manager_id} onChange={handleChange} required>
              <option value="">-- Chọn người quản lý --</option>
              {userOptions.map(user => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-primary">Lưu Sự Kiện</button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Hủy</button>
          </div>
        </form>
      </div>
    </div>
  );
} 