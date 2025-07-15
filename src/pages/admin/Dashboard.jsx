import React, { useState } from "react";
import { FiUsers, FiBarChart2, FiActivity, FiAlertCircle, FiTrendingUp, FiPieChart, FiCalendar, FiX } from "react-icons/fi";
import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveLine } from '@nivo/line';
import { ResponsivePie } from '@nivo/pie';
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

// Dummy data
const kpi = [
  { label: "Tổng sự kiện", value: 32, icon: <FiCalendar />, color: "bg-[#c52032] text-white" },
  { label: "Tổng vote", value: 1240, icon: <FiBarChart2 />, color: "bg-[#ffd012] text-[#223b73]" },
  { label: "Tổng người tham gia", value: 890, icon: <FiUsers />, color: "bg-[#223b73] text-white" },
  { label: "Tỷ lệ tham gia TB", value: "68%", icon: <FiActivity />, color: "bg-[#c52032] text-white" },
  { label: "Đang diễn ra", value: 4, icon: <FiTrendingUp />, color: "bg-[#ffd012] text-[#223b73]" },
  { label: "Sắp diễn ra", value: 7, icon: <FiPieChart />, color: "bg-[#223b73] text-white" },
  { label: "Đã kết thúc", value: 21, icon: <FiCalendar />, color: "bg-[#c52032] text-white" },
];

const events = [
  { id: 1, name: "Hội nghị AI 2025", time: "2025-08-15 09:00", participants: 120, rate: "80%", status: "active", creator: "Nguyễn Văn A" },
  { id: 2, name: "Workshop Marketing", time: "2025-07-20 14:00", participants: 90, rate: "60%", status: "upcoming", creator: "Trần Thị B" },
  { id: 3, name: "Triển lãm Nghệ thuật", time: "2025-06-10 10:00", participants: 200, rate: "100%", status: "completed", creator: "Lê Văn C" },
  { id: 4, name: "Lễ hội Âm nhạc", time: "2025-09-05 18:00", participants: 300, rate: "90%", status: "active", creator: "Nguyễn Văn A" },
  { id: 5, name: "Khóa đào tạo Lãnh đạo", time: "2025-07-25 08:00", participants: 150, rate: "75%", status: "completed", creator: "Trần Thị B" },
];

const barData = [
  { month: "01/2025", value: 120 },
  { month: "02/2025", value: 180 },
  { month: "03/2025", value: 90 },
  { month: "04/2025", value: 200 },
  { month: "05/2025", value: 150 },
  { month: "06/2025", value: 220 },
];

const pieData = [
  { id: "Sắp diễn ra", label: "Sắp diễn ra", value: 7, color: "#ffd012" },
  { id: "Đang diễn ra", label: "Đang diễn ra", value: 4, color: "#c52032" },
  { id: "Đã kết thúc", label: "Đã kết thúc", value: 21, color: "#223b73" },
];

const leaderboard = [
  { id: 1, name: "Hội nghị AI 2025", participants: 120, votes: 300 },
  { id: 2, name: "Lễ hội Âm nhạc", participants: 300, votes: 250 },
  { id: 3, name: "Triển lãm Nghệ thuật", participants: 200, votes: 180 },
];

const alerts = [
  { type: "soon", message: "Sự kiện 'Workshop Marketing' sẽ bắt đầu sau 2 giờ." },
  { type: "low", message: "Sự kiện 'Khóa đào tạo Lãnh đạo' có tỷ lệ tham gia thấp (30%)." },
  { type: "over", message: "Sự kiện 'Triển lãm Nghệ thuật' đã vượt quá giới hạn người tham gia!" },
];

const topUsers = [
  { id: 1, name: "Nguyễn Văn A", votes: 40, events: 8 },
  { id: 2, name: "Trần Thị B", votes: 35, events: 7 },
  { id: 3, name: "Lê Văn C", votes: 30, events: 6 },
];

const statusColor = {
  upcoming: "bg-[#ffd012] text-[#223b73]",
  active: "bg-[#c52032] text-white",
  completed: "bg-[#223b73] text-white"
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
          <div className="flex justify-between"><span className="font-semibold text-[#223b73]">Người tham gia:</span> <span>{event.participants}</span></div>
          <div className="flex justify-between"><span className="font-semibold text-[#223b73]">Tỷ lệ tham gia:</span> <span>{event.rate}</span></div>
          <div className="flex justify-between items-center"><span className="font-semibold text-[#223b73]">Trạng thái:</span> <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor[event.status]}`}>{event.status === 'active' ? 'Đang diễn ra' : event.status === 'upcoming' ? 'Sắp diễn ra' : 'Đã kết thúc'}</span></div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [detailEvent, setDetailEvent] = useState(null);
  const [timeRange, setTimeRange] = useState("7d"); // "7d", "30d", "all"
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchName, setSearchName] = useState("");
  const [searchCreator, setSearchCreator] = useState("");

  // Lọc dữ liệu theo timeRange
  const now = dayjs();
  const filteredEvents = events.filter(ev => {
    // Lọc theo thời gian
    if (timeRange !== "all") {
      const eventDate = dayjs(ev.time, "YYYY-MM-DD HH:mm");
      if (timeRange === "7d" && !eventDate.isAfter(now.subtract(7, "day"))) return false;
      if (timeRange === "30d" && !eventDate.isAfter(now.subtract(30, "day"))) return false;
    }
    // Lọc theo trạng thái
    if (statusFilter !== "all" && ev.status !== statusFilter) return false;
    // Lọc theo tên sự kiện
    if (searchName && !ev.name.toLowerCase().includes(searchName.toLowerCase())) return false;
    // Lọc theo người tạo (giả sử có trường creator)
    if (searchCreator && (!ev.creator || !ev.creator.toLowerCase().includes(searchCreator.toLowerCase()))) return false;
    return true;
  });

  return (
    <div className="p-4 md:p-8 bg-[#f7f9fb] min-h-screen">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
        {kpi.map((item, idx) => (
          <div key={idx} className={`rounded-xl shadow-md flex flex-col items-center py-6 ${item.color} transition hover:scale-105`}>
            <div className="text-3xl mb-2">{item.icon}</div>
            <div className="text-2xl font-bold">{item.value}</div>
            <div className="text-sm opacity-80 text-center">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Global Filters */}
      <div className="flex flex-wrap gap-4 mb-6 items-center">
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
          <option value="active">Đang diễn ra</option>
          <option value="completed">Đã kết thúc</option>
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
          {/* Recent Events Table */}
          <div className="bg-white rounded-xl shadow-md p-4 overflow-x-auto">
            <div className="font-bold text-lg mb-4 flex items-center gap-2"><FiCalendar className="text-[#c52032]" /> Sự kiện gần đây</div>
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-[#223b73]">
                  <th className="py-2">Tên sự kiện</th>
                  <th className="py-2">Thời gian</th>
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
                    <td className="py-2">{ev.participants}</td>
                    <td className="py-2">{ev.rate}</td>
                    <td className="py-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor[ev.status]}`}>{ev.status === 'active' ? 'Đang diễn ra' : ev.status === 'upcoming' ? 'Sắp diễn ra' : 'Đã kết thúc'}</span>
                    </td>
                    <td className="py-2">
                      <button onClick={() => navigate(`/admin/events/${ev.id}`)} className="text-[#c52032] font-semibold hover:underline">Xem chi tiết</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Alerts Panel */}
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="font-bold text-lg mb-4 flex items-center gap-2"><FiAlertCircle className="text-[#ffd012]" /> Thông báo & cảnh báo</div>
            <ul className="space-y-2">
              {alerts.map((alert, idx) => (
                <li key={idx} className={`flex items-center gap-2 px-3 py-2 rounded-lg ${alert.type === 'soon' ? 'bg-[#fffbe6]' : alert.type === 'low' ? 'bg-[#ffeaea]' : 'bg-[#fff7e6]'} text-sm`}>
                  <FiAlertCircle className={alert.type === 'soon' ? 'text-[#ffd012]' : alert.type === 'low' ? 'text-[#c52032]' : 'text-[#223b73]'} />
                  <span>{alert.message}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: Charts, Leaderboard, Top Users */}
        <div className="flex flex-col gap-8">
          {/* Charts */}
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="font-bold text-lg mb-4 flex items-center gap-2"><FiBarChart2 className="text-[#223b73]" /> Thống kê tham gia theo tháng</div>
            <div className="h-48">
              <ResponsiveBar
                data={barData}
                keys={["value"]}
                indexBy="month"
                margin={{ top: 10, right: 10, bottom: 40, left: 40 }}
                padding={0.3}
                colors={["#c52032"]}
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
                margin={{ top: 10, right: 10, bottom: 40, left: 10 }}
                innerRadius={0.5}
                padAngle={2}
                colors={({ id }) => id === 'Sắp diễn ra' ? '#ffd012' : id === 'Đang diễn ra' ? '#c52032' : '#223b73'}
                enableArcLabels={true}
                arcLabelsTextColor="#fff"
                arcLinkLabelsTextColor="#223b73"
                legends={[]}
              />
            </div>
          </div>

          {/* Leaderboard */}
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="font-bold text-lg mb-4 flex items-center gap-2"><FiTrendingUp className="text-[#c52032]" /> Bảng xếp hạng sự kiện</div>
            <div className="mb-2 text-sm font-semibold text-[#223b73]">Top nhiều người tham gia</div>
            <ul className="mb-4 space-y-1">
              {leaderboard.sort((a,b)=>b.participants-a.participants).slice(0,3).map(ev => (
                <li key={ev.id} className="flex justify-between items-center px-2 py-1 rounded hover:bg-[#f7f9fb]">
                  <span>{ev.name}</span>
                  <span className="font-bold text-[#c52032]">{ev.participants}</span>
                </li>
              ))}
            </ul>
            <div className="mb-2 text-sm font-semibold text-[#223b73]">Top nhiều bình chọn</div>
            <ul className="space-y-1">
              {leaderboard.sort((a,b)=>b.votes-a.votes).slice(0,3).map(ev => (
                <li key={ev.id} className="flex justify-between items-center px-2 py-1 rounded hover:bg-[#f7f9fb]">
                  <span>{ev.name}</span>
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