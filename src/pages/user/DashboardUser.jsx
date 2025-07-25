import { useGetAllEventsQuery, useGetEventsQuery } from "@api/eventApi";
import EventCard from "@components/user/EventCard";
import { EVENT_STATUS } from "@utils/constants";
import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";

const DashboardUser = () => {
  const user = useSelector((state) => state.auth.user);

  const [activeTab, setActiveTab] = useState("UPCOMING");
  const [currentPage, setCurrentPage] = useState(0);
  const [sortBy, setSortBy] = useState("date");
  // const [sortDir, setSortDir] = useState("asc");
  const sortDir = "asc";

  const tabs = Object.entries(EVENT_STATUS).map(([id, label]) => ({
    id,
    label,
  }));

  const {
    data: paginatedData,
    isLoading,
    error,
  } = useGetEventsQuery({
    page: currentPage,
    size: 6,
    sortBy: sortBy === "date" ? "startTime" : "name",
    sortDir,
    status: activeTab,
  });

  const { data: allEvents } = useGetAllEventsQuery();

  const tabCounts = useMemo(() => {
    if (!allEvents) return {};

    const counts = {};
    tabs.forEach((tab) => {
      counts[tab.id] = allEvents.filter(
        (event) => event.status === tab.id,
      ).length;
    });
    return counts;
  }, [allEvents, tabs]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setCurrentPage(0);
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    setCurrentPage(0);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (isLoading) {
    return (
      <div className="my-5 rounded-2xl bg-white p-7 shadow">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-red-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-5 rounded-2xl bg-white p-7 shadow">
        <div className="flex min-h-[400px] items-center justify-center text-center text-red-600">
          Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại.
        </div>
      </div>
    );
  }

  return (
    <div className="my-5 rounded-2xl bg-white p-7 shadow">
      <h2 className="text-secondary mb-2 text-2xl font-bold md:text-3xl">
        Chào mừng, {user?.name || "Người dùng"}! 👋
      </h2>
      <p className="mb-8 text-gray-600">
        Khám phá và tham gia các sự kiện thú vị của chúng tôi
      </p>

      <nav className="mb-8 flex overflow-hidden rounded-xl shadow-md">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`group relative flex-1 cursor-pointer overflow-hidden px-4 py-4 text-sm font-medium transition-all duration-300 md:text-base ${
              activeTab === tab.id
                ? "-translate-y-1 border-b-2 border-red-600 bg-white text-red-600 shadow-lg"
                : "bg-white text-gray-700 hover:-translate-y-1 hover:bg-gray-50 hover:shadow-md"
            }`}
            onClick={() => handleTabChange(tab.id)}
          >
            <div className="absolute top-0 -left-full h-full w-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-all duration-500 group-hover:left-full"></div>
            <span className="relative z-10 flex items-center justify-center gap-2">
              {tab.label}
              {tabCounts[tab.id] > 0 && (
                <span
                  className={`inline-flex min-w-[20px] items-center justify-center rounded-full px-2 py-1 text-xs font-bold ${
                    activeTab === tab.id
                      ? "bg-red-100 text-red-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {tabCounts[tab.id]}
                </span>
              )}
            </span>
          </button>
        ))}
      </nav>

      <div className="min-h-[400px]">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            Tìm thấy{" "}
            <span className="font-semibold text-gray-900">
              {paginatedData?.totalElements || 0}
            </span>{" "}
            sự kiện
          </p>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Sắp xếp theo:</span>
            <select
              className="rounded border border-gray-300 px-2 py-1 text-sm focus:border-red-500 focus:outline-none"
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <option value="date">Ngày diễn ra</option>
              <option value="name">Tên sự kiện</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {paginatedData?.content?.map((event, index) => (
            <div
              key={event.id}
              className="animate-slideInUp"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <EventCard event={event} />
            </div>
          ))}
        </div>

        {paginatedData?.content?.length === 0 && (
          <div className="py-12 text-center text-gray-500">
            <div className="mb-4 text-6xl">📅</div>
            <p className="text-lg font-medium">Không có sự kiện nào</p>
            <p className="text-sm">Hãy quay lại sau để xem các sự kiện mới</p>
          </div>
        )}
      </div>

      {paginatedData && paginatedData.totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-2">
            <button
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
              disabled={paginatedData.first}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Trước
            </button>

            {/* Page numbers */}
            <div className="flex items-center gap-1">
              {Array.from(
                { length: Math.min(5, paginatedData.totalPages) },
                (_, i) => {
                  let pageNum;
                  if (paginatedData.totalPages <= 5) {
                    pageNum = i;
                  } else if (currentPage < 3) {
                    pageNum = i;
                  } else if (currentPage > paginatedData.totalPages - 4) {
                    pageNum = paginatedData.totalPages - 5 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                        currentPage === pageNum
                          ? "bg-red-600 text-white"
                          : "border border-gray-300 hover:bg-gray-50"
                      }`}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum + 1}
                    </button>
                  );
                },
              )}
            </div>

            <button
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
              disabled={paginatedData.last}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Sau
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardUser;
