import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import EventParticipants from "./EventParticipants";
// Có thể import các component tab khác nếu có

const TABS = [
  { key: "overview", label: "Tổng quan" },
  { key: "votes", label: "Kết quả bình chọn" },
  { key: "participants", label: "Danh sách người tham gia" },
  { key: "logs", label: "Nhật ký hoạt động" },
  { key: "settings", label: "Cài đặt" }
];

export default function EventDetail() {
  const [tab, setTab] = useState("overview");
  const navigate = useNavigate();

  return (
    <div className="p-4 md:p-8">
      {/* Nút quay lại */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 rounded-lg bg-[#223b73] text-white font-semibold shadow hover:bg-[#c52032] transition"
      >
        ← Quay lại
      </button>
      {/* Tabs navigation */}
      <div className="flex gap-2 border-b mb-6">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 font-semibold border-b-2 transition ${
              tab === t.key
                ? "border-[#c52032] text-[#c52032] bg-[#fff7f7]"
                : "border-transparent text-[#223b73] hover:bg-[#f7f9fb]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "overview" && (
        <div>
          <h2 className="text-xl font-bold mb-4">Tổng quan sự kiện</h2>
          <div className="bg-white rounded-xl shadow p-6">Thông tin tổng quan về sự kiện...</div>
        </div>
      )}
      {tab === "votes" && (
        <div>
          <h2 className="text-xl font-bold mb-4">Kết quả bình chọn</h2>
          <div className="bg-white rounded-xl shadow p-6">Biểu đồ, thống kê bình chọn...</div>
        </div>
      )}
      {tab === "participants" && <EventParticipants />}
      {tab === "logs" && (
        <div>
          <h2 className="text-xl font-bold mb-4">Nhật ký hoạt động</h2>
          <div className="bg-white rounded-xl shadow p-6">Lịch sử hoạt động sự kiện...</div>
        </div>
      )}
      {tab === "settings" && (
        <div>
          <h2 className="text-xl font-bold mb-4">Cài đặt sự kiện</h2>
          <div className="bg-white rounded-xl shadow p-6">Các tùy chọn cấu hình sự kiện...</div>
        </div>
      )}
    </div>
  );
} 