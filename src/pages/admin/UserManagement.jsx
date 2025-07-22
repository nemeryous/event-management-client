import React, { useState } from "react";
import { FiUser, FiCheckCircle, FiXCircle, FiUsers, FiSearch } from "react-icons/fi";
import DataTable from '../../components/admin/DataTable';
import FilterBar from '../../components/admin/FilterBar';
import ActionButtons from '../../components/admin/ActionButtons';

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
const statusOptions = ["Tất cả", "Đã kích hoạt", "Đã vô hiệu hóa"];

function StatusCell({ enabled }) {
  return (
    <span className={`flex items-center gap-1 font-semibold ${enabled ? 'text-green-600' : 'text-gray-400'}`}>
      {enabled ? <FiCheckCircle /> : <FiXCircle />}
      {enabled ? 'Kích hoạt' : 'Vô hiệu hóa'}
    </span>
  );
}

function UserActionButtons({ user, onToggle }) {
  return (
    <ActionButtons
      actions={[{
        label: user.enabled ? 'Khóa tài khoản' : 'Mở khóa tài khoản',
        color: user.enabled ? 'text-gray-400' : 'text-[#c52032]',
        onClick: () => onToggle(user)
      }]}
    />
  );
}

function UserCard({ user, idx, onToggle }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-2">
      <div className="flex items-center gap-2 font-bold text-[#223b73]">
        <span className="text-xs text-gray-400">#{idx + 1}</span>
        <FiUser className="text-[#c52032]" /> {user.name}
      </div>
      <div className="flex items-center gap-2 text-sm">
        <StatusCell enabled={user.enabled} />
        <span className="ml-2">{user.votes} votes</span>
      </div>
      <div className="text-xs text-gray-500">{user.email} • {user.phone_number}</div>
      <div className="text-xs">{user.role} | Đã tham gia: {user.events_joined}</div>
      <div>
        <UserActionButtons user={user} onToggle={onToggle} />
      </div>
    </div>
  );
}

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

  const filters = [
    { key: 'search', type: 'input', label: 'Tìm theo tên, email, SĐT...', value: search, icon: <FiSearch />, placeholder: 'Tìm kiếm...' },
    { key: 'role', type: 'select', label: 'Vai trò', value: roleFilter, options: roles },
    { key: 'status', type: 'select', label: 'Trạng thái', value: statusFilter, options: statusOptions }
  ];

  const handleFilterChange = (key, value) => {
    if (key === 'search') setSearch(value);
    else if (key === 'role') setRoleFilter(value);
    else if (key === 'status') setStatusFilter(value);
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold text-[#223b73] mb-6 flex items-center gap-2">
        <FiUsers className="text-[#c52032]" /> Quản lý tài khoản người dùng
      </h1>
      <FilterBar filters={filters} onChange={handleFilterChange} />
      {/* Table cho desktop */}
      <div className="hidden md:block">
        <DataTable
          data={filtered}
          columns={[
            { key: 'stt', label: 'STT', render: (row, idx) => idx + 1 },
            { key: 'name', label: 'Tên', render: (row) => <div className="flex items-center gap-2"><FiUser className="text-[#223b73]" /> {row.name}</div> },
            { key: 'email', label: 'Email' },
            { key: 'phone_number', label: 'SĐT' },
            { key: 'enabled', label: 'Trạng thái', render: (row) => <StatusCell enabled={row.enabled} /> },
            { key: 'role', label: 'Vai trò' },
            { key: 'events_joined', label: 'Sự kiện đã tham gia' },
            { key: 'votes', label: 'Số lượt bình chọn' },
            { key: 'actions', label: '', render: (row) => <UserActionButtons user={row} onToggle={(user) => alert(`${user.enabled ? 'Đã khóa' : 'Đã mở khóa'} tài khoản cho ${user.name}`)} /> }
          ]}
        />
      </div>
      {/* Card view cho mobile */}
      <div className="block md:hidden space-y-3">
        {filtered.map((user, idx) => (
          <UserCard key={user.id} user={user} idx={idx} onToggle={(user) => alert(`${user.enabled ? 'Đã khóa' : 'Đã mở khóa'} tài khoản cho ${user.name}`)} />
        ))}
        {filtered.length === 0 && (
          <div className="text-center text-gray-400 py-8">Không có dữ liệu phù hợp</div>
        )}
      </div>
    </div>
  );
} 