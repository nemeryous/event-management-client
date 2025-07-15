import EventCard from "@components/user/EventCard";
import React, { useState } from "react";

const DashboardUser = () => {
  const tabs = [
    { id: "upcoming", label: "Sắp diễn ra" },
    { id: "ongoing", label: "Đang diễn ra" },
    { id: "registered", label: "Đã đăng ký" },
    { id: "manage", label: "Quản lý" },
  ];

  const [activeTab, setActiveTab] = useState("upcoming");

  const eventsData = [1, 2, 3, 4];

  return (
    <div className="my-5 rounded-2xl bg-white p-7 shadow">
      <h2 className="text-secondary mb-5 text-2xl md:text-3xl">
        Chào mừng, Trần Phước Anh
      </h2>

      <nav className="mb-8 flex overflow-hidden rounded-xl shadow-md">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`group relative flex-1 cursor-pointer overflow-hidden px-5 py-4 text-base font-medium transition-all duration-300 ${
              activeTab === tab.id
                ? "-translate-y-1 border-b-2 border-red-600 bg-white text-red-600"
                : "bg-white text-gray-700 hover:-translate-y-1 hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            <div className="absolute top-0 -left-full h-full w-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-all duration-500 group-hover:left-full"></div>
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </nav>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {eventsData.map((event, index) => (
          <div
            key={event.id}
            className="animate-slideInUp"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <EventCard event={event} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardUser;