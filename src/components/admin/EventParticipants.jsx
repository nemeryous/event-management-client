import React, { useState } from "react";
import { FiCheckCircle, FiXCircle, FiUser, FiUsers, FiDownload, FiSearch, FiUserCheck, FiUserPlus, FiBarChart2 } from "react-icons/fi";

const participants = [
  {
    id: 1,
    name: "Nguyễn Văn An",
    email: "an.nguyen@email.com",
    phone: "0901123456",
    checkinTime: "2025-07-12 15:04",
    checkedIn: true,
    votes: 5,
    role: "Thành viên"
  },
  {
    id: 2,
    name: "Trần Thị Bình",
    email: "binh.tran@email.com",
    phone: "0901654321",
    checkinTime: "",
    checkedIn: false,
    votes: 0,
    role: "Thành viên"
  },
  {
    id: 3,
    name: "Lê Hoàng Cường",
    email: "cuong.le@email.com",
    phone: "0909999999",
    checkinTime: "2025-07-12 14:58",
    checkedIn: true,
    votes: 3,
    role: "Ban tổ chức"
  }
];

const roles = ["Tất cả", "Thành viên", "Ban tổ chức"];
const checkinStatus = ["Tất cả", "Đã check-in", "Chưa check-in"];

export default function EventParticipants() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("Tất cả");
  const [checkinFilter, setCheckinFilter] = useState("Tất cả");
  const [voteFilter, setVoteFilter] = useState(false);

  // Lọc dữ liệu
  const filtered = participants.filter(p => {
    if (search && !(`${p.name} ${p.email}`.toLowerCase().includes(search.toLowerCase()))) return false;
    if (roleFilter !== "Tất cả" && p.role !== roleFilter) return false;
    if (checkinFilter === "Đã check-in" && !p.checkedIn) return false;
    if (checkinFilter === "Chưa check-in" && p.checkedIn) return false;
    if (voteFilter && p.votes < 1) return false;
    return true;
  });

  // Thống kê nhanh
  const total = participants.length;
  const checkedIn = participants.filter(p => p.checkedIn).length;
  const avgVotes = (participants.reduce((sum, p) => sum + p.votes, 0) / total).toFixed(1);

  return (
    <div className="p-4 md:p-8">
      {/* Tiêu đề và chỉ số nhanh */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#223b73] mb-1 flex items-center gap-2">
            <FiUsers className="text-[#c52032]" /> Danh sách người tham gia – <span className="text-[#c52032]">Hội nghị AI 2025</span>
          </h1>
          <div className="flex gap-4 mt-2">
            <div className="bg-white rounded-lg shadow px-4 py-2 flex items-center gap-2">
              <FiUserPlus className="text-[#c52032]" /> <span className="font-semibold">{total}</span> đăng ký
            </div>
            <div className="bg-white rounded-lg shadow px-4 py-2 flex items-center gap-2">
              <FiUserCheck className="text-[#223b73]" /> <span className="font-semibold">{checkedIn}</span> đã check-in
            </div>
            <div className="bg-white rounded-lg shadow px-4 py-2 flex items-center gap-2">
              <FiBarChart2 className="text-[#ffd012]" /> <span className="font-semibold">{avgVotes}</span> votes/người
            </div>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#ffd012] text-[#223b73] font-semibold shadow hover:bg-[#ffe066]">
          <FiDownload /> Xuất CSV
        </button>
      </div>

      {/* Bộ lọc và tìm kiếm */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 shadow">
          <FiSearch className="text-[#c52032]" />
          <input
            className="outline-none"
            placeholder="Tìm theo tên, email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select className="rounded-lg border px-3 py-2 text-sm" value={checkinFilter} onChange={e => setCheckinFilter(e.target.value)}>
          {checkinStatus.map(s => <option key={s}>{s}</option>)}
        </select>
        <select className="rounded-lg border px-3 py-2 text-sm" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
          {roles.map(r => <option key={r}>{r}</option>)}
        </select>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={voteFilter} onChange={e => setVoteFilter(e.target.checked)} />
          Có bình chọn
        </label>
      </div>

      {/* Bảng dữ liệu */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-[#223b73] border-b">
              <th className="py-2 px-2">STT</th>
              <th className="py-2 px-2">Tên người dùng</th>
              <th className="py-2 px-2">Email</th>
              <th className="py-2 px-2">SĐT</th>
              <th className="py-2 px-2">Thời gian check-in</th>
              <th className="py-2 px-2">Trạng thái</th>
              <th className="py-2 px-2">Bình chọn</th>
              <th className="py-2 px-2">Vai trò</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, idx) => (
              <tr key={p.id} className="border-b hover:bg-[#f7f9fb]">
                <td className="py-2 px-2">{idx + 1}</td>
                <td className="py-2 px-2 flex items-center gap-2"><FiUser className="text-[#223b73]" /> {p.name}</td>
                <td className="py-2 px-2">{p.email}</td>
                <td className="py-2 px-2">{p.phone}</td>
                <td className="py-2 px-2">{p.checkinTime || <span className="text-gray-400">–</span>}</td>
                <td className="py-2 px-2">
                  {p.checkedIn
                    ? <span className="flex items-center gap-1 text-green-600 font-semibold"><FiCheckCircle /> Đã check-in</span>
                    : <span className="flex items-center gap-1 text-gray-400"><FiXCircle /> Chưa check-in</span>
                  }
                </td>
                <td className="py-2 px-2">{p.votes > 0 ? <span className="font-bold text-[#c52032]">{p.votes} votes</span> : <span className="text-gray-400">0</span>}</td>
                <td className="py-2 px-2">
                  {p.role === "Ban tổ chức"
                    ? <span className="flex items-center gap-1 text-[#223b73] font-semibold"><FiUsers /> {p.role}</span>
                    : <span className="flex items-center gap-1 text-[#c52032]"><FiUser /> {p.role}</span>
                  }
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-8 text-gray-400">Không có dữ liệu phù hợp</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Responsive: Card list trên mobile */}
      <div className="md:hidden mt-6 space-y-3">
        {filtered.map((p, idx) => (
          <div key={p.id} className="bg-white rounded-xl shadow p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 font-bold text-[#223b73]">
              <FiUser className="text-[#c52032]" /> {p.name}
            </div>
            <div className="flex items-center gap-2 text-sm">
              {p.checkedIn
                ? <span className="flex items-center gap-1 text-green-600 font-semibold"><FiCheckCircle /> Đã check-in</span>
                : <span className="flex items-center gap-1 text-gray-400"><FiXCircle /> Chưa check-in</span>
              }
              <span className="ml-2">{p.votes} votes</span>
            </div>
            <div className="text-xs text-gray-500">{p.email} • {p.phone}</div>
            <div className="text-xs">{p.role}</div>
          </div>
        ))}
      </div>
    </div>
  );
} 