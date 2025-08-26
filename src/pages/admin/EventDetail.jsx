import React, { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import OverviewTab from "./EventManagementManage/OverviewTab";
import ParticipantsTab from "./EventManagementManage/ParticipantsTab";
import SettingsTab from "./EventManagementManage/SettingsTab";
import EventVoteTab from "./EventManagementManage/EventVoteTab";
import { useGetEventByIdQuery } from "@api/eventApi";

const TABS = [
  { key: "overview", label: "Tổng quan", icon: "📄" },
  { key: "votes", label: "Kết quả bình chọn", icon: "📊" },
  { key: "participants", label: "Người tham gia", icon: "👥" },
  { key: "settings", label: "Cài đặt", icon: "⚙️" }
];

export default function EventDetail() {
  const [tab, setTab] = useState("overview");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const { id } = useParams();

  const { data: eventData, refetch: refetchEvent, isLoading } = useGetEventByIdQuery(id);

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

  const renderTabContent = () => (
    <div className="flex-1 w-full max-w-7xl flex flex-col items-center gap-6">
      {isLoading && <div>Đang tải dữ liệu sự kiện...</div>}
      {!isLoading && tab === "overview" && eventData && (
        <OverviewTab 
          eventData={eventData} 
          stats={{
            totalRegistered: eventData?.participants?.length || 0,
            checkedIn: eventData?.participants?.filter((p) => p.isCheckedIn)?.length || 0,
          }}
        />
      )}
      {tab === "votes" && (
        isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải dữ liệu sự kiện...</p>
            </div>
          </div>
        ) : eventData ? (
          <EventVoteTab eventData={eventData} />
        ) : (
          <div className="text-center py-12">
            <div className="text-red-500 text-6xl mb-4">❌</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Không tìm thấy sự kiện</h3>
            <p className="text-gray-600">Vui lòng thử lại sau</p>
          </div>
        )
      )}
      {!isLoading && tab === "participants" && eventData && (
        <ParticipantsTab eventData={eventData} refetchEvent={refetchEvent} />
      )}
      {!isLoading && tab === "settings" && eventData && (
        <SettingsTab eventData={eventData} onCancel={() => setTab("overview")} />
      )}
    </div>
  );

  return (
    // ĐÃ SỬA: Thay justify-center bằng justify-start để nội dung luôn bắt đầu từ trên
    <div className="min-h-screen bg-[#f7f9fb] w-full flex flex-col items-center justify-start">
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
        <aside className="w-64 flex-shrink-0 self-start">
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
                    // eslint-disable-next-line prettier/prettier
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