import React from "react";

export default function EventList({
  events,
  onEdit,
  onDelete,
  onView,
  formatDate,
  formatTimeRemaining,
  getStatusText,
}) {
  if (events.length === 0) {
    return (
      <div className="no-events">
        <h3>🔍 Không tìm thấy sự kiện nào</h3>
        <p>Hãy thử tìm kiếm với từ khóa khác hoặc thêm sự kiện mới</p>
      </div>
    );
  }

  return (
    <div className="events-grid">
      {events.map((event) => (
        <div className="event-card" key={event.id}>
          <div className="event-header">
            <div className="event-title">
              {event.title_short || event.title}
            </div>
            <div className="event-date">
              📅 {formatDate(event.start_time)} - {formatDate(event.end_time)}
            </div>
            {event.status === "upcoming" && event.timeRemaining > 0 && (
              <div className="event-time-remaining">
                ⏰ Còn {formatTimeRemaining(event.timeRemaining)}
              </div>
            )}
          </div>
          <div className="event-body">
            <div className="event-info">
              <span>📍 {event.location}</span>
              <span className={`event-status status-${event.status}`}>
                {getStatusText(event.status)}
              </span>
            </div>
            <div className="event-description">
              <div
                dangerouslySetInnerHTML={{
                  __html: event.description_short || event.description || "",
                }}
              />
            </div>
            <div className="event-extra">
              {event.enable !== undefined && (
                <div>
                  <b>Trạng thái:</b> {event.enable ? "Hiển thị" : "Đã ẩn"}
                </div>
              )}
              {event.created_by !== undefined && event.created_by !== null && (
                <div>
                  <b>Người tạo:</b>
                  <span>{event.createdByName || "Không rõ"}</span>
                </div>
              )}
              {/* Hiển thị tên người quản lý ngay dưới phần người tạo */}
              <div>
                <b>Quản lý:</b>
                {event.managerName ? (
                  <span>{event.managerName}</span>
                ) : (
                  <span style={{ color: "#888", fontSize: 12 }}>
                    Chưa có quản lý
                  </span>
                )}
              </div>
              {event.created_at && (
                <div>
                  <b>Ngày tạo:</b> {formatDate(event.created_at)}
                </div>
              )}
              {event.url_docs && (
                <div>
                  <b>Docs:</b>{" "}
                  <a
                    href={event.url_docs}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Tài liệu
                  </a>
                </div>
              )}
              {event.max_participants !== undefined &&
                event.max_participants !== null && (
                  <div>
                    <b>SL tối đa:</b> {event.max_participants}
                  </div>
                )}
              {event.participants !== undefined &&
                event.participants !== null &&
                event.participants > 0 && (
                  <div>
                    <b>Đã đăng ký:</b> {event.participants}
                  </div>
                )}
            </div>
            <div
              className="event-actions"
              style={{
                display: "flex",
                gap: 8,
                justifyContent: "flex-end",
                marginBottom: 0,
                paddingBottom: 0,
              }}
            >
              <button
                className="btn btn-accent btn-small"
                onClick={() => onEdit(event)}
              >
                ✏️ Sửa
              </button>
              <button
                className="btn btn-primary btn-small"
                onClick={() => onDelete(event.id)}
              >
                🗑️ Xóa
              </button>
              <button
                className="btn btn-outline btn-small"
                onClick={() => onView(event.id)}
              >
                👁️ Xem chi tiết
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
