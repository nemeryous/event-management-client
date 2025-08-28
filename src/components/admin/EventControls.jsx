import React from "react";

export default function EventControls({ onAdd, onExport, onRefresh, search, setSearch }) {
  return (
    <div className="controls">
      <button className="btn btn-primary" onClick={onAdd}>➕ Thêm Sự Kiện</button>
      <button className="btn btn-secondary" onClick={onRefresh}>🔄 Làm Mới</button>
      <button className="btn btn-accent" onClick={onExport}>📊 Xuất Dữ Liệu</button>
      <div className="search-box">
        <input
          type="text"
          placeholder="🔍 Tìm kiếm sự kiện..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
    </div>
  );
}
