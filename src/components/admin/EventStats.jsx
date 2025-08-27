import React from "react";

export default function EventStats({ stats }) {
  return (
    <div className="stats">
      <div className="stat-card">
        <h3>{stats.total}</h3>
        <p>Tổng Sự Kiện</p>
      </div>
      <div className="stat-card">
        <h3>{stats.active}</h3>
        <p>Đang diễn ra</p>
      </div>
      <div className="stat-card">
        <h3>{stats.upcoming}</h3>
        <p>Sắp diễn ra</p>
      </div>
      <div className="stat-card">
        <h3>{stats.completed}</h3>
        <p>Đã kết thúc</p>
      </div>
    </div>
  );
}
