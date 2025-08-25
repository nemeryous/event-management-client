import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import EventOverview from "../../components/admin/EventOverview";
import EventVotes from "../../components/admin/EventVotes";
import EventParticipants from "../../components/admin/EventParticipants";
import EventLogs from "../../components/admin/EventLogs";
import EventSettings from "../../components/admin/EventSettings";

const TABS = [
  { key: "overview", label: "Tổng quan", icon: "📄" },
  { key: "votes", label: "Kết quả bình chọn", icon: "📊" },
  { key: "participants", label: "Danh sách người tham gia", icon: "👥" },
  { key: "logs", label: "Nhật ký hoạt động", icon: "📝" },
  { key: "settings", label: "Cài đặt", icon: "⚙️" }
];

export default function EventDetail() {
  const [tab, setTab] = useState("overview");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  const currentTab = TABS.find(t => t.key === tab);

  // Nội dung tab (dùng lại cho cả mobile và desktop)
  const renderTabContent = () => (
    <div className="flex-1 w-full max-w-2xl flex flex-col items-center gap-6">
      {tab === "overview" && <EventOverview />}
      {tab === "votes" && <EventVotes />}
      {tab === "participants" && <EventParticipants />}
      {tab === "logs" && <EventLogs />}
      {tab === "settings" && <EventSettings />}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f7f9fb] w-full flex flex-col items-center justify-center">
      {/* Mobile: Dropdown menu phía trên, nội dung bên dưới */}
      <div className="block md:hidden w-full p-2 flex flex-col items-center">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-4 py-2 rounded-lg bg-[#223b73] text-white font-semibold shadow hover:bg-[#c52032] transition self-start"
        >
          ← Quay lại
        </button>
        <div className="relative w-full max-w-xs mb-4" ref={dropdownRef}>
          <button
            className="w-full flex items-center justify-between px-4 py-2 rounded-lg bg-white shadow font-semibold text-[#223b73] border border-[#e0e0e0] hover:bg-[#f7f9fb] transition"
            onClick={() => setDropdownOpen(v => !v)}
          >
            <span className="flex items-center gap-2">
              <span className="text-lg">{currentTab.icon}</span>
              <span>{currentTab.label}</span>
            </span>
            <span className={`ml-2 transition-transform ${dropdownOpen ? "rotate-180" : "rotate-0"}`}>▼</span>
          </button>
          {dropdownOpen && (
            <div className="absolute left-0 right-0 mt-2 bg-white rounded-lg shadow-lg z-10 border border-[#e0e0e0] animate-fadeIn overflow-hidden">
              {TABS.map(t => (
                <button
                  key={t.key}
                  onClick={() => {
                    setTab(t.key);
                    setDropdownOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-4 py-2 text-left font-semibold transition hover:bg-[#f7f9fb] ${tab === t.key ? "bg-[#fff7f7] text-[#c52032]" : "text-[#223b73]"}`}
                >
                  <span className="text-lg">{t.icon}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        {renderTabContent()}
      </div>
      {/* Desktop: Sidebar menu dọc cố định bên trái, nội dung bên phải */}
      <div className="hidden md:flex w-full p-8 flex-row items-start justify-center gap-8">
        {/* Sidebar menu dọc */}
        <aside className="w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-lg p-4 flex flex-col gap-2 min-h-[400px]">
            <button
              onClick={() => navigate(-1)}
              className="mb-2 px-4 py-2 rounded-lg bg-[#223b73] text-white font-semibold shadow hover:bg-[#c52032] transition w-full"
            >
              ← Quay lại
            </button>
            {TABS.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition border-l-4 border-transparent
                  ${tab === t.key
                    ? "bg-[#fff7f7] text-[#c52032] border-[#c52032]"
                    : "text-[#223b73] hover:bg-[#f7f9fb] hover:text-[#c52032]"}
                `}
                style={{ minWidth: 0 }}
              >
                <span className="text-lg">{t.icon}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </aside>
        {renderTabContent()}
      </div>
    </div>
  );
} 