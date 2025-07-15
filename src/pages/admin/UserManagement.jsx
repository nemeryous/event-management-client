import React, { useState } from "react";
import { FiUser, FiMail, FiPhone, FiCheckCircle, FiXCircle, FiUsers, FiSearch } from "react-icons/fi";

const users = [
  {
    id: 1,
    name: "Nguyễn Văn An",
    email: "an.nguyen@email.com",
    phone_number: "0901123456",
    enabled: true,
    role: "Thành viên",
    events_joined: 5,
    votes: 12
  },
  {
    id: 2,
    name: "Trần Thị Bình",
    email: "binh.tran@email.com",
    phone_number: "0901654321",
    enabled: false,
    role: "Ban tổ chức",
    events_joined: 2,
    votes: 3
  }
];
const roles = ["Tất cả", "Thành viên", "Ban tổ chức", "Admin"];

export default function UserManagement() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("Tất cả");
  const [statusFilter, setStatusFilter] = useState("Tất cả");

  const filtered = users.filter(u => {
    if (search && !(`${u.name} ${u.email} ${u.phone_number}`.toLowerCase().includes(search.toLowerCase()))) return false;
    if (roleFilter !== "Tất cả" && u.role !== roleFilter) return false;
    if (statusFilter === "Đã kích hoạt" && !u.enabled) return false;
    if (statusFilter === "Đã vô hiệu hóa" && u.enabled) return false;
    return true;
  });

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold text-[#223b73] mb-6 flex items-center gap-2">
        <FiUsers className="text-[#c52032]" /> Quản lý tài khoản người dùng
      </h1>
      {/* Bộ lọc */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 shadow">
          <FiSearch className="text-[#c52032]" />
          <input
            className="outline-none"
            placeholder="Tìm theo tên, email, SĐT..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select className="rounded-lg border px-3 py-2 text-sm" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
          {roles.map(r => <option key={r}>{r}</option>)}
        </select>
        <select className="rounded-lg border px-3 py-2 text-sm" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option>Tất cả</option>
          <option>Đã kích hoạt</option>
          <option>Đã vô hiệu hóa</option>
        </select>
      </div>
      {/* Bảng dữ liệu */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-[#223b73] border-b">
              <th className="py-2 px-2">STT</th>
              <th className="py-2 px-2">Tên</th>
              <th className="py-2 px-2">Email</th>
              <th className="py-2 px-2">SĐT</th>
              <th className="py-2 px-2">Trạng thái</th>
              <th className="py-2 px-2">Vai trò</th>
              <th className="py-2 px-2">Sự kiện đã tham gia</th>
              <th className="py-2 px-2">Số lượt bình chọn</th>
              <th className="py-2 px-2"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u, idx) => (
              <tr key={u.id} className="border-b hover:bg-[#f7f9fb]">
                <td className="py-2 px-2">{idx + 1}</td>
                <td className="py-2 px-2 flex items-center gap-2"><FiUser className="text-[#223b73]" /> {u.name}</td>
                <td className="py-2 px-2">{u.email}</td>
                <td className="py-2 px-2">{u.phone_number}</td>
                <td className="py-2 px-2">
                  {u.enabled
                    ? <span className="flex items-center gap-1 text-green-600 font-semibold"><FiCheckCircle /> Kích hoạt</span>
                    : <span className="flex items-center gap-1 text-gray-400"><FiXCircle /> Vô hiệu hóa</span>
                  }
                </td>
                <td className="py-2 px-2">{u.role}</td>
                <td className="py-2 px-2">{u.events_joined}</td>
                <td className="py-2 px-2">{u.votes}</td>
                <td className="py-2 px-2">
                  <button
                    className={`font-semibold hover:underline ${u.enabled ? 'text-gray-400' : 'text-[#c52032]'}`}
                    onClick={() => {
                      // Toggle enabled status
                      const updated = filtered.map(user =>
                        user.id === u.id ? { ...user, enabled: !user.enabled } : user
                      );
                      // Cập nhật lại danh sách users (nếu dùng state thực tế, ở đây chỉ là ví dụ)
                      alert(`${u.enabled ? 'Đã khóa' : 'Đã mở khóa'} tài khoản cho ${u.name}`);
                    }}
                  >
                    {u.enabled ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center py-8 text-gray-400">Không có dữ liệu phù hợp</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 