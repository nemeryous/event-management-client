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
  { key: "settings", label: "Cài đặt", icon: "⚙️" },
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

  const currentTab = TABS.find((t) => t.key === tab);

  // Nội dung tab (dùng lại cho cả mobile và desktop)
  const renderTabContent = () => (
    <div className="flex w-full max-w-2xl flex-1 flex-col items-center gap-6">
      {tab === "overview" && <EventOverview />}
      {tab === "votes" && <EventVotes />}
      {tab === "participants" && <EventParticipants />}
      {tab === "logs" && <EventLogs />}
      {tab === "settings" && <EventSettings />}
    </div>
  );

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#f7f9fb]">
      {/* Mobile: Dropdown menu phía trên, nội dung bên dưới */}
      <div className="block flex w-full flex-col items-center p-2 md:hidden">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 self-start rounded-lg bg-[#223b73] px-4 py-2 font-semibold text-white shadow transition hover:bg-[#c52032]"
        >
          ← Quay lại
        </button>
        <div className="relative mb-4 w-full max-w-xs" ref={dropdownRef}>
          <button
            className="flex w-full items-center justify-between rounded-lg border border-[#e0e0e0] bg-white px-4 py-2 font-semibold text-[#223b73] shadow transition hover:bg-[#f7f9fb]"
            onClick={() => setDropdownOpen((v) => !v)}
          >
            <span className="flex items-center gap-2">
              <span className="text-lg">{currentTab.icon}</span>
              <span>{currentTab.label}</span>
            </span>
            <span
              className={`ml-2 transition-transform ${dropdownOpen ? "rotate-180" : "rotate-0"}`}
            >
              ▼
            </span>
          </button>
          {dropdownOpen && (
            <div className="animate-fadeIn absolute right-0 left-0 z-10 mt-2 overflow-hidden rounded-lg border border-[#e0e0e0] bg-white shadow-lg">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  onClick={() => {
                    setTab(t.key);
                    setDropdownOpen(false);
                  }}
                  className={`flex w-full items-center gap-2 px-4 py-2 text-left font-semibold transition hover:bg-[#f7f9fb] ${tab === t.key ? "bg-[#fff7f7] text-[#c52032]" : "text-[#223b73]"}`}
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
      <div className="hidden w-full flex-row items-start justify-center gap-8 p-8 md:flex">
        {/* Sidebar menu dọc */}
        <aside className="w-64 flex-shrink-0">
          <div className="flex min-h-[400px] flex-col gap-2 rounded-2xl bg-white p-4 shadow-lg">
            <button
              onClick={() => navigate(-1)}
              className="mb-2 w-full rounded-lg bg-[#223b73] px-4 py-2 font-semibold text-white shadow transition hover:bg-[#c52032]"
            >
              ← Quay lại
            </button>
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex w-full items-center gap-2 rounded-lg border-l-4 border-transparent px-4 py-2 font-semibold transition ${
                  tab === t.key
                    ? "border-[#c52032] bg-[#fff7f7] text-[#c52032]"
                    : "text-[#223b73] hover:bg-[#f7f9fb] hover:text-[#c52032]"
                } `}
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
