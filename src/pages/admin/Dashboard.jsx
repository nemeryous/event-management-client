import React, { useState } from "react";
import dayjs from "dayjs";
import { FiCalendar, FiTrendingUp, FiPieChart, FiActivity, FiX, FiAlertCircle, FiBarChart2, FiUsers, FiMapPin, FiClock } from "react-icons/fi";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsivePie } from "@nivo/pie";
import { useGetEventsQuery } from "@api/eventApi";
import { getEventStats, getMonthlyChartData, getPieChartData } from "@utils/dashboardStats";
import { useNavigate } from "react-router-dom";
import AlertItem from "@components/common/AlertItem";
import UpcomingEventsList from "@components/common/UpcomingEventsList";
import { mapBackendStatusToFrontend, getStatusText } from "@utils/eventHelpers";

// Helper function to generate alerts based on real data
const generateAlerts = (events) => {
  const alerts = [];
  const now = dayjs();
  
  // Get upcoming events sorted by start time (closest first)
  const upcomingEvents = events
    .filter(ev => {
      const startTime = dayjs(ev.startTime);
      return startTime.isAfter(now) && ev.status === 'UPCOMING';
    })
    .sort((a, b) => dayjs(a.startTime).diff(dayjs(b.startTime)))
    .slice(0, 5); // Get top 5 closest events
  
  // Add upcoming events with time remaining
  upcomingEvents.forEach(ev => {
    const startTime = dayjs(ev.startTime);
    const timeDiff = startTime.diff(now, 'hour', true);
    
    let timeMessage = '';
    if (timeDiff < 1) {
      const minutes = Math.round(timeDiff * 60);
      timeMessage = `${minutes} phút`;
    } else if (timeDiff < 24) {
      const hours = Math.round(timeDiff);
      timeMessage = `${hours} giờ`;
    } else {
      const days = Math.floor(timeDiff / 24);
      const hours = Math.round(timeDiff % 24);
      timeMessage = `${days} ngày ${hours} giờ`;
    }
    
    alerts.push({
      type: "upcoming",
      message: `Sự kiện '${ev.name}' sẽ diễn ra sau ${timeMessage}`,
      event: ev,
      timeRemaining: timeDiff
    });
  });
  
  // Check for events starting very soon (within 2 hours)
  const soonEvents = events.filter(ev => {
    const startTime = dayjs(ev.startTime);
    const timeDiff = startTime.diff(now, 'hour', true);
    return timeDiff > 0 && timeDiff <= 2;
  });
  
  soonEvents.forEach(ev => {
    const startTime = dayjs(ev.startTime);
    const timeDiff = startTime.diff(now, 'hour', true);
    const minutes = Math.round(timeDiff * 60);
    
    alerts.push({
      type: "soon",
      message: `Sự kiện '${ev.name}' sẽ bắt đầu sau ${minutes} phút!`,
      event: ev,
      timeRemaining: timeDiff
    });
  });
  
  // Check for events with low participation rate
  const lowParticipationEvents = events.filter(ev => {
    const rate = parseInt(ev.rate) || 0;
    return rate > 0 && rate < 30;
  });
  
  lowParticipationEvents.forEach(ev => {
    alerts.push({
      type: "low",
      message: `Sự kiện '${ev.name}' có tỷ lệ tham gia thấp (${ev.rate}).`,
      event: ev
    });
  });
  
  // Check for cancelled events
  const cancelledEvents = events.filter(ev => ev.status === 'CANCELLED');
  
  cancelledEvents.forEach(ev => {
    alerts.push({
      type: "cancelled",
      message: `Sự kiện '${ev.name}' đã bị hủy.`,
      event: ev
    });
  });
  
  // Check for events that are over capacity
  const overCapacityEvents = events.filter(ev => {
    const participants = ev.participants || 0;
    const maxParticipants = ev.maxParticipants || 0;
    return maxParticipants > 0 && participants >= maxParticipants;
  });
  
  overCapacityEvents.forEach(ev => {
    alerts.push({
      type: "capacity",
      message: `Sự kiện '${ev.name}' đã đạt sức chứa tối đa.`,
      event: ev
    });
  });
  
  // Check for events ending soon
  const endingSoonEvents = events.filter(ev => {
    const endTime = dayjs(ev.endTime);
    const timeDiff = endTime.diff(now, 'hour', true);
    return timeDiff > 0 && timeDiff <= 4 && ev.status === 'ONGOING';
  });
  
  endingSoonEvents.forEach(ev => {
    const endTime = dayjs(ev.endTime);
    const timeDiff = endTime.diff(now, 'hour', true);
    const hours = Math.round(timeDiff);
    
    alerts.push({
      type: "ending",
      message: `Sự kiện '${ev.name}' sẽ kết thúc sau ${hours} giờ.`,
      event: ev,
      timeRemaining: timeDiff
    });
  });
  
  return alerts.sort((a, b) => {
    // Sort by priority: soon > upcoming > ending > others
    const priority = { soon: 4, upcoming: 3, ending: 2, capacity: 1, low: 0, cancelled: 0 };
    return (priority[b.type] || 0) - (priority[a.type] || 0);
  });
};

const topUsers = [
  { id: 1, name: "Nguyễn Văn A", votes: 40, events: 8 },
  { id: 2, name: "Trần Thị B", votes: 35, events: 7 },
  { id: 3, name: "Lê Văn C", votes: 30, events: 6 },
];

const statusColor = {
  UPCOMING: "bg-[#ffd012] text-[#223b73]",
  ONGOING: "bg-[#c52032] text-white",
  COMPLETED: "bg-[#223b73] text-white",
  CANCELLED: "bg-[#6c757d] text-white"
};

// Helper function to map API data to display format
const mapEventToDisplay = (event) => {
  const startTime = dayjs(event.startTime);
  const endTime = dayjs(event.endTime);
  const now = dayjs();
  
  // Use backend status and map to frontend display
  let status = mapBackendStatusToFrontend(event.status);
  if (!status) {
    if (startTime.isAfter(now)) {
      status = 'upcoming';
    } else if (endTime.isAfter(now)) {
      status = 'ongoing';
    } else {
      status = 'completed';
    }
  }

  return {
    id: event.id,
    name: event.title,
    time: `${startTime.format('DD/MM/YYYY HH:mm')} - ${endTime.format('HH:mm')}`,
    participants: event.participants || 0,
    rate: event.rate || '0%',
    status: status,
    startTime: event.startTime,
    endTime: event.endTime,
    location: event.location,
    description: event.description,
    enabled: event.enabled,
    createdBy: event.createdBy,
    createdAt: event.createdAt
  };
};

function EventDetailCard({ event, onClose }) {
  if (!event) return null;
  return (
    <div className="fixed top-8 right-8 z-50 w-full max-w-sm animate-fadeIn">
      <div className="relative bg-white rounded-2xl shadow-2xl border-2 border-[#ffd012] p-6">
        <button onClick={onClose} className="absolute top-3 right-3 text-2xl text-[#c52032] hover:text-[#223b73] font-bold"> <FiX /> </button>
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-[#c52032] text-white rounded-full p-2 text-xl"><FiCalendar /></div>
          <h2 className="text-lg font-bold text-[#223b73]">{event.name}</h2>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="font-semibold text-[#223b73]">Thời gian:</span> <span>{event.time}</span></div>
          <div className="flex justify-between"><span className="font-semibold text-[#223b73]">Địa điểm:</span> <span>{event.location}</span></div>
          <div className="flex justify-between"><span className="font-semibold text-[#223b73]">Người tham gia:</span> <span>{event.participants}</span></div>
          <div className="flex justify-between"><span className="font-semibold text-[#223b73]">Tỷ lệ tham gia:</span> <span>{event.rate}</span></div>
          <div className="flex justify-between items-center"><span className="font-semibold text-[#223b73]">Trạng thái:</span> <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor[event.status.toUpperCase()]}`}>{getStatusText(event.status)}</span></div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [detailEvent, setDetailEvent] = useState(null);
  const [timeRange, setTimeRange] = useState("all"); // "7d", "30d", "all"
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchName, setSearchName] = useState("");
  const [searchCreator, setSearchCreator] = useState("");

  // Lấy dữ liệu từ API
  const { data, isLoading, error } = useGetEventsQuery({ page: 0, size: 100 });
  
  // Map API data to display format
  const rawEvents = data?.content || data || [];
  const events = rawEvents.map(mapEventToDisplay);
  const stats = getEventStats(events);

  // Tạo dữ liệu KPI cards với thông tin chi tiết hơn
  const kpi = [
    { label: "Tổng sự kiện", value: stats.total, icon: <FiCalendar />, color: "bg-[#c52032] text-white", subtitle: "Tất cả sự kiện" },
    { label: "Đang diễn ra", value: stats.ongoing, icon: <FiTrendingUp />, color: "bg-[#ffd012] text-[#223b73]", subtitle: `${stats.statusRatio.ongoing}% tổng số` },
    { label: "Sắp diễn ra", value: stats.upcoming, icon: <FiPieChart />, color: "bg-[#223b73] text-white", subtitle: `${stats.statusRatio.upcoming}% tổng số` },
    { label: "Đã kết thúc", value: stats.ended, icon: <FiCalendar />, color: "bg-[#c52032] text-white", subtitle: `${stats.statusRatio.ended}% tổng số` },
    { label: "Đang mở", value: stats.enabled, icon: <FiActivity />, color: "bg-[#223b73] text-white", subtitle: "Sự kiện hoạt động" },
    { label: "Đã đóng", value: stats.disabled, icon: <FiX />, color: "bg-[#ffd012] text-[#223b73]", subtitle: "Sự kiện tạm dừng" },
    { label: "Đã hủy", value: stats.cancelled, icon: <FiX />, color: "bg-[#6c757d] text-white", subtitle: `${stats.statusRatio.cancelled}% tổng số` },
  ];

  // Lọc dữ liệu theo timeRange, status, search
  const now = dayjs();
  const filteredEvents = events.filter(ev => {
    // Lọc theo thời gian
    if (timeRange !== "all") {
      const eventDate = dayjs(ev.startTime);
      if (timeRange === "7d" && !eventDate.isAfter(now.subtract(7, "day"))) return false;
      if (timeRange === "30d" && !eventDate.isAfter(now.subtract(30, "day"))) return false;
    }
    // Lọc theo trạng thái
    if (statusFilter !== "all") {
      if (ev.status && ev.status !== statusFilter.toUpperCase()) return false;
    }
    // Lọc theo tên sự kiện
    if (searchName && !((ev.name || "").toLowerCase().includes(searchName.toLowerCase()))) return false;
    // Lọc theo người tạo
    if (searchCreator && (!ev.createdBy || !ev.createdBy.toString().includes(searchCreator))) return false;
    return true;
  });

  // Dữ liệu cho biểu đồ theo tháng
  const monthlyChartData = getMonthlyChartData(events);
  const barData = monthlyChartData.map(item => ({
    month: dayjs(item.month).format("MM/YYYY"),
    "Tổng sự kiện": item.count,
    "Sắp diễn ra": item.upcoming,
    "Đang diễn ra": item.ongoing,
    "Đã kết thúc": item.ended,
    "Đã hủy": item.cancelled
  }));

  // Lấy danh sách năm từ dữ liệu
  const years = Array.from(new Set(barData.map(d => d.month.split("/")[1])));
  const [selectedYear, setSelectedYear] = useState(years[years.length-1] || "");

  // Dữ liệu bar chart chỉ lấy theo năm được chọn
  const filteredBarData = barData.filter(d => d.month.split("/")[1] === selectedYear)
    .map(d => ({ ...d, month: d.month.split("/")[0] })); // chỉ lấy tháng

  // Pie chart trạng thái sự kiện
  const pieData = getPieChartData(events);

  // Leaderboard: top sự kiện nhiều người tham gia/vote
  const leaderboard = [...events]
    .sort((a, b) => (b.participants || 0) - (a.participants || 0))
    .slice(0, 3)
    .map(ev => ({
      id: ev.id,
      name: ev.name,
      participants: ev.participants || 0,
      votes: ev.votes || 0,
    }));

  // Top users: cần backend trả về hoặc tính toán từ dữ liệu khác
  const topUsers = [];

  if (isLoading) return <div>Đang tải dữ liệu...</div>;
  if (error) return <div>Lỗi khi tải dữ liệu sự kiện!</div>;

  return (
    <div className="p-4 md:p-8 bg-[#f7f9fb] min-h-screen">

      
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
        {kpi.map((item, idx) => (
          <div key={idx} className={`rounded-xl shadow-md flex flex-col items-center py-6 ${item.color} transition hover:scale-105`}>
            <div className="text-3xl mb-2">{item.icon}</div>
            <div className="text-2xl font-bold">{item.value}</div>
            <div className="text-sm opacity-80 text-center">{item.label}</div>
            <div className="text-xs opacity-60 text-center mt-1">{item.subtitle}</div>
          </div>
        ))}
      </div>

      {/* Global Filters */}
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        {/* Bộ lọc năm cho biểu đồ bar */}
        <label className="font-semibold text-[#223b73]" htmlFor="year-filter">Năm:</label>
        <select
          id="year-filter"
          className="rounded-lg border px-3 py-2 text-sm"
          value={selectedYear}
          onChange={e => setSelectedYear(e.target.value)}
        >
          {years.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
        <select
          className="rounded-lg border px-3 py-2 text-sm"
          value={timeRange}
          onChange={e => setTimeRange(e.target.value)}
        >
          <option value="7d">7 ngày qua</option>
          <option value="30d">30 ngày qua</option>
          <option value="all">Tất cả</option>
        </select>
        <select
          className="rounded-lg border px-3 py-2 text-sm"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="upcoming">Sắp diễn ra</option>
          <option value="ongoing">Đang diễn ra</option>
          <option value="completed">Đã kết thúc</option>
          <option value="cancelled">Đã hủy</option>
        </select>
        <input
          className="rounded-lg border px-3 py-2 text-sm"
          placeholder="Tìm theo tên sự kiện..."
          value={searchName}
          onChange={e => setSearchName(e.target.value)}
        />
        <input
          className="rounded-lg border px-3 py-2 text-sm"
          placeholder="Người tạo sự kiện..."
          value={searchCreator}
          onChange={e => setSearchCreator(e.target.value)}
        />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Recent Events Table & Alerts */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Recent Events Table - Desktop */}
          <div className="bg-white rounded-xl shadow-md p-4 overflow-x-auto hidden md:block">
            <div className="font-bold text-lg mb-4 flex items-center gap-2"><FiCalendar className="text-[#c52032]" /> Sự kiện gần đây</div>
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-[#223b73]">
                  <th className="py-2">Tên sự kiện</th>
                  <th className="py-2">Thời gian</th>
                  <th className="py-2">Địa điểm</th>
                  <th className="py-2">Người tham gia</th>
                  <th className="py-2">Tỷ lệ tham gia</th>
                  <th className="py-2">Trạng thái</th>
                  <th className="py-2"></th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map(ev => (
                  <tr key={ev.id} className="border-t">
                    <td className="py-2 font-medium">{ev.name}</td>
                    <td className="py-2">{ev.time}</td>
                    <td className="py-2">{ev.location}</td>
                    <td className="py-2">{ev.participants}</td>
                    <td className="py-2">{ev.rate}</td>
                    <td className="py-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${statusColor[ev.status.toUpperCase()]}`}>
                        {getStatusText(ev.status)}
                      </span>
                    </td>
                    <td className="py-2">
                      <button onClick={() => navigate(`/admin/events/${ev.id}`)} className="text-[#c52032] font-semibold hover:underline">Xem chi tiết</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Recent Events Card - Mobile */}
          <div className="bg-white rounded-xl shadow-md p-4 md:hidden">
            <div className="font-bold text-lg mb-4 flex items-center gap-2"><FiCalendar className="text-[#c52032]" /> Sự kiện gần đây</div>
            <div className="flex flex-col gap-4">
              {filteredEvents.map(ev => (
                <div key={ev.id} className="border rounded-lg p-3 flex flex-col gap-1 shadow-sm">
                  <div className="font-semibold text-[#223b73]">{ev.name}</div>
                  <div className="text-xs text-gray-500">{ev.time}</div>
                  <div className="text-xs text-gray-600 flex items-center gap-1">
                    <FiMapPin className="text-[#c52032]" />
                    {ev.location}
                  </div>
                  <div className="flex gap-2 text-xs">
                    <span>👥 {ev.participants}</span>
                    <span>• {ev.rate}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap ${statusColor[ev.status.toUpperCase()]}`}>
                      {getStatusText(ev.status)}
                    </span>
                    <button onClick={() => navigate(`/admin/events/${ev.id}`)} className="ml-auto text-[#c52032] font-semibold underline text-xs">Xem chi tiết</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

                     {/* Alerts Panel */}
           <div className="bg-white rounded-xl shadow-md p-4">
             <div className="font-bold text-lg mb-4 flex items-center gap-2"><FiAlertCircle className="text-[#ffd012]" /> Thông báo & cảnh báo</div>
             <ul className="space-y-2">
               {generateAlerts(events).map((alert, idx) => (
                 <AlertItem key={idx} alert={alert} />
               ))}
             </ul>
           </div>

           {/* Upcoming Events List */}
           <div className="bg-white rounded-xl shadow-md p-4">
             <UpcomingEventsList events={events} />
           </div>
        </div>

        {/* Right: Charts, Leaderboard, Top Users */}
        <div className="flex flex-col gap-8">
          {/* Charts */}
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="font-bold text-lg mb-4 flex items-center gap-2"><FiBarChart2 className="text-[#223b73]" /> Thống kê sự kiện theo tháng</div>
            <div className="h-48">
              <ResponsiveBar
                data={filteredBarData}
                keys={["Tổng sự kiện", "Sắp diễn ra", "Đang diễn ra", "Đã kết thúc", "Đã hủy"]}
                indexBy="month"
                margin={{ top: 10, right: 10, bottom: 40, left: 40 }}
                padding={0.3}
                colors={["#c52032", "#ffd012", "#223b73", "#6c757d"]}
                axisBottom={{ tickSize: 5, tickPadding: 5, tickRotation: 0 }}
                axisLeft={{ tickSize: 5, tickPadding: 5, tickRotation: 0 }}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor="#fff"
                theme={{
                  axis: { ticks: { text: { fill: '#223b73' } } },
                  legends: { text: { fill: '#223b73' } },
                }}
              />
            </div>
            <div className="font-bold text-lg mt-8 mb-4 flex items-center gap-2"><FiPieChart className="text-[#ffd012]" /> Tỷ lệ trạng thái sự kiện</div>
            <div className="h-48">
              <ResponsivePie
                data={pieData}
                margin={{ top: 10, right: 120, bottom: 40, left: 10 }}
                innerRadius={0.5}
                padAngle={2}
                colors={({ id }) => id === 'Sắp diễn ra' ? '#ffd012' : id === 'Đang diễn ra' ? '#c52032' : id === 'Đã kết thúc' ? '#223b73' : '#6c757d'}
                enableArcLabels={true}
                arcLabelsTextColor="#fff"
                enableArcLinkLabels={false}
                legends={[
                  {
                    anchor: 'right',
                    direction: 'column',
                    justify: false,
                    translateX: 100,
                    translateY: 0,
                    itemsSpacing: 8,
                    itemWidth: 100,
                    itemHeight: 24,
                    itemTextColor: '#223b73',
                    itemDirection: 'left-to-right',
                    symbolSize: 18,
                    symbolShape: 'circle',
                  },
                ]}
              />
            </div>
          </div>

          {/* Additional Statistics */}
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="font-bold text-lg mb-4 flex items-center gap-2"><FiClock className="text-[#223b73]" /> Thống kê chi tiết</div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Thời gian trung bình:</span>
                <span className="font-semibold">{stats.averageEventDuration} giờ</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tỷ lệ sự kiện mở:</span>
                <span className="font-semibold">{stats.total > 0 ? ((stats.enabled / stats.total) * 100).toFixed(1) : 0}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tỷ lệ sự kiện đóng:</span>
                <span className="font-semibold">{stats.total > 0 ? ((stats.disabled / stats.total) * 100).toFixed(1) : 0}%</span>
              </div>
            </div>
          </div>

          {/* Top Locations */}
          {stats.topLocations.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-4">
              <div className="font-bold text-lg mb-4 flex items-center gap-2"><FiMapPin className="text-[#c52032]" /> Địa điểm phổ biến</div>
              <ul className="space-y-2">
                {stats.topLocations.map((loc, idx) => (
                  <li key={idx} className="flex justify-between items-center px-2 py-1 rounded hover:bg-[#f7f9fb]">
                    <span className="text-sm truncate">{loc.location}</span>
                    <span className="font-bold text-[#c52032]">{loc.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Leaderboard */}
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="font-bold text-lg mb-4 flex items-center gap-2"><FiTrendingUp className="text-[#c52032]" /> Bảng xếp hạng sự kiện</div>
            <div className="mb-2 text-sm font-semibold text-[#223b73]">Top nhiều người tham gia</div>
            <ul className="mb-4 space-y-1">
              {leaderboard.sort((a,b)=>b.participants-a.participants).slice(0,3).map(ev => (
                <li key={ev.id} className="flex justify-between items-center px-2 py-1 rounded hover:bg-[#f7f9fb]">
                  <span className="text-sm truncate">{ev.name}</span>
                  <span className="font-bold text-[#c52032]">{ev.participants}</span>
                </li>
              ))}
            </ul>
            <div className="mb-2 text-sm font-semibold text-[#223b73]">Top nhiều bình chọn</div>
            <ul className="space-y-1">
              {leaderboard.sort((a,b)=>b.votes-a.votes).slice(0,3).map(ev => (
                <li key={ev.id} className="flex justify-between items-center px-2 py-1 rounded hover:bg-[#f7f9fb]">
                  <span className="text-sm truncate">{ev.name}</span>
                  <span className="font-bold text-[#ffd012]">{ev.votes}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Top Users */}
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="font-bold text-lg mb-4 flex items-center gap-2"><FiUsers className="text-[#223b73]" /> Top người dùng tương tác</div>
            <ul className="space-y-2">
              {topUsers.map(u => (
                <li key={u.id} className="flex items-center gap-3 px-2 py-1 rounded hover:bg-[#f7f9fb]">
                  <div className="w-8 h-8 rounded-full bg-[#ffd012] flex items-center justify-center font-bold text-[#223b73]">{u.name[0]}</div>
                  <div className="flex-1">
                    <div className="font-semibold">{u.name}</div>
                    <div className="text-xs text-[#223b73]">{u.votes} vote • {u.events} sự kiện</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {/* Card nổi chi tiết sự kiện */}
      <EventDetailCard event={detailEvent} onClose={() => setDetailEvent(null)} />
    </div>
  );
}