import React from "react";

const EventCard = ({ event }) => {
  const getHeaderClass = (type) => {
    switch (type) {
      case "upcoming":
        return "bg-gradient-to-br from-blue-500 to-blue-800";
      case "ongoing":
        return "bg-gradient-to-br from-orange-500 to-red-600";
      case "registered":
        return "bg-gradient-to-br from-green-500 to-green-700";
      case "manage":
        return "bg-gradient-to-br from-blue-500 to-blue-800";
      default:
        return "";
    }
  };

  const getBadgeText = (status) => {
    switch (status) {
      case "upcoming":
        return "Sắp diễn ra";
      case "ongoing":
        return "Đang diễn ra";
      case "registered":
        return "Đã đăng ký";
      default:
        return "Sắp diễn ra";
    }
  };

  const handleShowDetails = (eventName) => {
    alert(`Xem chi tiết sự kiện: ${eventName}`);
  };

  const handleRegister = (eventName) => {
    alert(`Đăng ký sự kiện: ${eventName}`);
  };

  return (
    <div class="relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
      <div className="absolute inset-0 z-10 bg-gradient-to-br from-blue-500/10 to-red-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

      <div
        className={`relative flex h-30 items-center justify-center overflow-hidden text-4xl font-bold text-white ${getHeaderClass("upcoming")}`}
      >
        <div className="absolute -top-1/2 -left-1/2 h-full w-full rotate-45 transform bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <span className="relative z-10">AI 2024</span>
        <div className="absolute top-4 right-4 animate-pulse rounded-full bg-yellow-400 px-3 py-1 text-xs font-bold text-gray-900">
          {getBadgeText("upcoming")}
        </div>
      </div>

      <div className="relative z-20 p-6">
        <h3 className="mb-4 cursor-default text-xl font-bold text-blue-600 transition-colors duration-300 group-hover:text-red-600">
          {"Hội thảo Công nghệ AI 2024"}
        </h3>

        <div className="mb-5 space-y-2 text-gray-600">
          <div className="flex cursor-default items-center gap-2 rounded p-1 transition-all duration-300 hover:bg-gray-50 hover:pl-3">
            <span>📅</span>
            <span>{"15/12/2024"}</span>
          </div>
          <div className="flex cursor-default items-center gap-2 rounded p-1 transition-all duration-300 hover:bg-gray-50 hover:pl-3">
            <span>⏰</span>
            <span>{"9:00"}</span>
          </div>
          <div className="flex cursor-default items-center gap-2 rounded p-1 transition-all duration-300 hover:bg-gray-50 hover:pl-3">
            <span>📍</span>
            <span>Hội trường A</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            className="group relative flex-1 cursor-pointer overflow-hidden rounded-full bg-red-600 px-5 py-3 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-red-700 hover:shadow-lg hover:shadow-red-500/40"
            onClick={() => handleShowDetails(event.shortName)}
          >
            <div className="absolute inset-0 scale-0 rounded-full bg-white/30 transition-transform duration-300 group-hover:scale-100"></div>
            <span className="relative z-10">Xem chi tiết</span>
          </button>
          <button
            className="group relative flex-1 cursor-pointer overflow-hidden rounded-full bg-yellow-400 px-5 py-3 text-sm font-bold text-gray-900 transition-all duration-300 hover:-translate-y-1 hover:bg-yellow-500 hover:shadow-lg hover:shadow-yellow-400/40"
            onClick={() => handleRegister(event.shortName)}
          >
            <div className="absolute inset-0 scale-0 rounded-full bg-white/30 transition-transform duration-300 group-hover:scale-100"></div>
            <span className="relative z-10">Đăng ký</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
