import React, { useState, useMemo } from "react";
import "./EventManagement.css";
import EventModal from "./EventModal";
import { useNavigate } from "react-router-dom";

const defaultEvents = [
  {
    id: 1,
    title: "Hội nghị Công nghệ 2025",
    description: "Hội nghị về xu hướng công nghệ mới nhất trong năm 2025",
    start_time: "2025-08-15T09:00",
    end_time: "2025-08-15T17:00",
    location: "Trung tâm Hội nghị Quốc gia",
    created_at: "2025-06-01T10:00",
    created_by: 1,
    qr_join_token: "ABC123XYZ",
    banner: "banner1.png",
    url_docs: "https://example.com/docs1",
    status: "upcoming",
    max_participants: 500
  },
  {
    id: 2,
    title: "Workshop Marketing Digital",
    description: "Khóa học về chiến lược marketing số hiện đại",
    start_time: "2025-07-20T14:00",
    end_time: "2025-07-20T16:00",
    location: "Khách sạn Lotte",
    created_at: "2025-06-10T10:00",
    created_by: 2,
    qr_join_token: "DEF456UVW",
    banner: "banner2.png",
    url_docs: "https://example.com/docs2",
    status: "active",
    max_participants: 100
  },
  {
    id: 3,
    title: "Triển lãm Nghệ thuật Đương đại",
    description: "Triển lãm các tác phẩm nghệ thuật đương đại của các nghệ sĩ trẻ",
    start_time: "2025-06-10T10:00",
    end_time: "2025-06-10T18:00",
    location: "Bảo tàng Mỹ thuật",
    created_at: "2025-05-20T09:00",
    created_by: 1,
    qr_join_token: "GHI789PQR",
    banner: "banner3.png",
    url_docs: "https://example.com/docs3",
    status: "completed",
    max_participants: 200
  },
  {
    id: 4,
    title: "Lễ hội Âm nhạc Mùa hè",
    description: "Lễ hội âm nhạc outdoor với sự tham gia của nhiều nghệ sĩ nổi tiếng",
    start_time: "2025-09-05T18:00",
    end_time: "2025-09-05T22:00",
    location: "Công viên Thống Nhất",
    created_at: "2025-07-01T11:00",
    created_by: 3,
    qr_join_token: "JKL012MNO",
    banner: "banner4.png",
    url_docs: "https://example.com/docs4",
    status: "upcoming",
    max_participants: 300
  },
  {
    id: 5,
    title: "Khóa đào tạo Lãnh đạo",
    description: "Khóa đào tạo kỹ năng lãnh đạo cho các quản lý cấp trung",
    start_time: "2025-07-25T08:00",
    end_time: "2025-07-25T12:00",
    location: "Trung tâm Đào tạo FPT",
    created_at: "2025-06-15T14:00",
    created_by: 2,
    qr_join_token: "PQR345STU",
    banner: "banner5.png",
    url_docs: "https://example.com/docs5",
    status: "active",
    max_participants: 150
  }
];

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function getStatusText(status) {
  const statusMap = {
    upcoming: "Sắp Tới",
    active: "Đang Diễn Ra",
    completed: "Hoàn Thành"
  };
  return statusMap[status] || status;
}

export default function EventManagement() {
  const [events, setEvents] = useState(defaultEvents);
  const [modalOpen, setModalOpen] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filteredEvents = useMemo(() => {
    if (!search) return events;
    return events.filter(event =>
      event.title.toLowerCase().includes(search.toLowerCase()) ||
      event.location.toLowerCase().includes(search.toLowerCase()) ||
      event.description.toLowerCase().includes(search.toLowerCase())
    );
  }, [events, search]);

  const stats = useMemo(() => {
    return {
      total: events.length,
      active: events.filter(e => e.status === "active").length,
      upcoming: events.filter(e => e.status === "upcoming").length,
      completed: events.filter(e => e.status === "completed").length
    };
  }, [events]);

  const handleAdd = () => {
    navigate("/admin/events/create");
  };

  const handleEdit = (event) => {
    setEditEvent(event);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sự kiện này?")) {
      setEvents(events.filter(e => e.id !== id));
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditEvent(null);
  };

  const handleModalSubmit = (form) => {
    if (editEvent) {
      setEvents(events.map(e => e.id === editEvent.id ? { ...e, ...form } : e));
    } else {
      const newId = Math.max(0, ...events.map(e => e.id)) + 1;
      setEvents([...events, { id: newId, ...form }]);
    }
    setModalOpen(false);
    setEditEvent(null);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(events, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'events-export.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="container">
      <div className="header">
        <h1>🎉 Quản Lý Sự Kiện</h1>
        <p>Hệ thống quản lý sự kiện chuyên nghiệp</p>
        <div className="admin-badge">👑 ADMIN</div>
      </div>
      <div className="stats">
        <div className="stat-card">
          <h3>{stats.total}</h3>
          <p>Tổng Sự Kiện</p>
        </div>
        <div className="stat-card">
          <h3>{stats.active}</h3>
          <p>Sự Kiện Đang Diễn Ra</p>
        </div>
        <div className="stat-card">
          <h3>{stats.upcoming}</h3>
          <p>Sự Kiện Sắp Tới</p>
        </div>
        <div className="stat-card">
          <h3>{stats.completed}</h3>
          <p>Sự Kiện Hoàn Thành</p>
        </div>
      </div>
      <div className="controls">
        <button className="btn btn-primary" onClick={handleAdd}>➕ Thêm Sự Kiện</button>
        <button className="btn btn-secondary" onClick={() => { setSearch(""); }}>🔄 Làm Mới</button>
        <button className="btn btn-accent" onClick={handleExport}>📊 Xuất Dữ Liệu</button>
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Tìm kiếm sự kiện..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="events-grid">
        {filteredEvents.length === 0 ? (
          <div className="no-events">
            <h3>🔍 Không tìm thấy sự kiện nào</h3>
            <p>Hãy thử tìm kiếm với từ khóa khác hoặc thêm sự kiện mới</p>
          </div>
        ) : (
          filteredEvents.map(event => (
            <div className="event-card" key={event.id}>
              <div className="event-header">
                <div className="event-title">{event.title}</div>
                <div className="event-date">📅 {formatDate(event.start_time)} - {formatDate(event.end_time)}</div>
              </div>
              <div className="event-body">
                <div className="event-info">
                  <span>📍 {event.location}</span>
                  <span className={`event-status status-${event.status}`}>
                    {getStatusText(event.status)}
                  </span>
                </div>
                <div className="event-description">{event.description}</div>
                <div className="event-extra">
                  <div><b>Người tạo:</b> {event.created_by}</div>
                  <div><b>Ngày tạo:</b> {formatDate(event.created_at)}</div>
                  <div><b>QR Token:</b> {event.qr_join_token}</div>
                  <div><b>Banner:</b> {event.banner}</div>
                  <div><b>Docs:</b> <a href={event.url_docs} target="_blank" rel="noopener noreferrer">Tài liệu</a></div>
                  <div><b>SL tối đa:</b> {event.max_participants}</div>
                </div>
                <div className="event-actions" style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginBottom: 0, paddingBottom: 0 }}>
                  <button className="btn btn-accent btn-small" onClick={() => handleEdit(event)}>✏️ Sửa</button>
                  <button className="btn btn-primary btn-small" onClick={() => handleDelete(event.id)}>🗑️ Xóa</button>
                  <button className="btn btn-outline btn-small" onClick={() => navigate(`/admin/events/${event.id}`)}>👁️ Xem chi tiết</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <EventModal
        open={modalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        initialData={editEvent}
        isEdit={!!editEvent}
      />
    </div>
  );
} 