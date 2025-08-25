import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./EventManagement.css";
import { useCreateEventMutation } from "../../api/eventApi";
import TinyMCEEditor from "../../components/common/TinyMCEEditor";

const statusOptions = [
  { value: "UPCOMING", label: "Sắp Tới" },
  { value: "ACTIVE", label: "Đang Diễn Ra" },
  { value: "COMPLETED", label: "Hoàn Thành" },
];

export default function EventCreate() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    start_time: "",
    end_time: "",
    location: "",
    max_participants: "",
    url_docs: "",
  });
  const navigate = useNavigate();
  const [createEvent] = useCreateEventMutation();
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleDescriptionChange = (htmlContent) => {
    setForm((prev) => ({ ...prev, description: htmlContent }));
  };

  const formatDateTime = (dt) => {
    if (!dt) return dt;
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(dt)) return dt + ":00";
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(dt)) return dt;
    return dt;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    const payload = {
      title: form.title,
      description: form.description,
      start_time: formatDateTime(form.start_time),
      end_time: formatDateTime(form.end_time),
      location: form.location,
      max_participants: form.max_participants ? parseInt(form.max_participants, 10) : undefined,
      url_docs: form.url_docs,
    };
    console.log("[DEBUG] Payload tạo sự kiện:", payload);
    try {
      await createEvent(payload).unwrap();
    alert("Tạo sự kiện thành công!");
    navigate("/admin/events");
    } catch (err) {
      setErrorMsg("Tạo sự kiện thất bại! " + (err?.data?.message || err?.message || ""));
    }
  };

  return (
    <div
      className="container"
      style={{
        maxWidth: 600,
        margin: "40px auto",
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 4px 24px rgba(197,32,50,0.08)",
        padding: 32,
      }}
    >
      <h1
        style={{
          color: "#c52032",
          textAlign: "center",
          marginBottom: 32,
        }}
      >
        ➕ Thêm Sự Kiện Mới
      </h1>
      {errorMsg && <div style={{ color: "red", marginBottom: 16 }}>{errorMsg}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Tên Sự Kiện:</label>
          <input
            type="text"
            id="title"
            value={form.title}
            onChange={handleChange}
            required
            placeholder="Nhập tên sự kiện"
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Mô Tả:</label>
          <div style={{ border: "1px solid #ccc", borderRadius: 6, padding: 8, marginBottom: 8 }}>
            <TinyMCEEditor value={form.description} onChange={handleDescriptionChange} placeholder="Nhập mô tả sự kiện với định dạng phong phú..." />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="start_time">Thời Gian Bắt Đầu:</label>
          <input
            type="datetime-local"
            id="start_time"
            value={form.start_time}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="end_time">Thời Gian Kết Thúc:</label>
          <input
            type="datetime-local"
            id="end_time"
            value={form.end_time}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="location">Địa Điểm:</label>
          <input
            type="text"
            id="location"
            value={form.location}
            onChange={handleChange}
            required
            placeholder="Nhập địa điểm"
          />
        </div>
        <div className="form-group">
          <label htmlFor="max_participants">Số lượng tham gia tối đa:</label>
          <input
            type="number"
            id="max_participants"
            value={form.max_participants}
            onChange={handleChange}
            min="1"
          />
        </div>
        <div className="form-group">
          <label htmlFor="url_docs">Tài Liệu (URL):</label>
          <input
            type="text"
            id="url_docs"
            value={form.url_docs}
            onChange={handleChange}
            placeholder="https://example.com/docs/..."
          />
        </div>
        <div
          className="form-group"
          style={{ display: "flex", gap: 16, justifyContent: "flex-end" }}
        >
          <button
            type="submit"
            className="btn btn-primary"
            style={{ background: "#c52032", color: "#fff" }}
          >
            Lưu Sự Kiện
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ background: "#223b73", color: "#fff" }}
            onClick={() => navigate("/admin/events")}
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}
