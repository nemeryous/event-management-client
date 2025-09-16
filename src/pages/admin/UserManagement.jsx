import React, { useState } from "react";
import { FiUser, FiCheckCircle, FiXCircle, FiUsers, FiSearch } from "react-icons/fi";
import DataTable from '../../components/admin/DataTable';
import FilterBar from '../../components/admin/FilterBar';
import ActionButtons from '../../components/admin/ActionButtons';
import { useGetAllUsersQuery, useEnableUserMutation, useDeleteUserMutation } from '../../api/authApi';

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
      <div className="text-xs">{(user.roles || []).map(r => getRoleDisplayName(r.roleName)).join(', ')}</div>
      <div>
        <UserActionButtons user={user} onToggle={onToggle} />
      </div>
    </div>
  );
}

// Helper để chuyển roleName sang tên hiển thị
function getRoleDisplayName(roleName) {
  if (!roleName) return '';
  const raw = roleName.replace(/^ROLE_/, '');
  if (raw === 'ADMIN') return 'Quản trị viên';
  if (raw === 'USER') return 'Người dùng';
  return raw.charAt(0) + raw.slice(1).toLowerCase();
}

export default function UserManagement() {
  const DON_VI_OPTIONS = [
    { value: "CAN_BO_NHAN_VIEN", label: "Cán bộ nhân viên" },
    { value: "SINH_VIEN", label: "Sinh viên" },
    { value: "DON_VI_NGOAI", label: "Đơn vị ngoài" },
  ];
  const getDonViLabel = (value) => DON_VI_OPTIONS.find(o => o.value === value)?.label || value || '-';
  const { data: users = [], isLoading, error, refetch } = useGetAllUsersQuery();
  const [enableUser, { isLoading: isEnabling }] = useEnableUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [search, setSearch] = useState("");
  // Hiển thị thông báo trạng thái
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' | 'error'
  const [roleFilter, setRoleFilter] = useState("Tất cả");
  const [statusFilter, setStatusFilter] = useState("Tất cả");

  // Chuẩn hóa dữ liệu từ API (nếu trả về object có .content thì lấy .content)
  const userList = Array.isArray(users) ? users : (users?.content || []);

  const filtered = userList.filter(u => {
    // Debug log each user row for don_vi/ten_don_vi
    try {
      // eslint-disable-next-line no-console
      // console.debug("USER_ROW", {
      //   id: u?.id,
      //   name: u?.name,
      //   donVi: u?.donVi,
      //   tenDonVi: u?.tenDonVi,
      //   raw: u,
      // });
    } catch {}
    if (search && !( `${u.name} ${u.email} ${u.phoneNumber}`.toLowerCase().includes(search.toLowerCase()))) return false;
    if (roleFilter !== "Tất cả" && !(u.roles && u.roles.some(r => r.name === roleFilter))) return false;
    if (statusFilter === "Đã kích hoạt" && !u.enabled) return false;
    if (statusFilter === "Đã vô hiệu hóa" && u.enabled) return false;
    return true;
  });

  // Lấy danh sách vai trò duy nhất từ userList
  const roles = ["Tất cả", ...Array.from(new Set(userList.flatMap(u => (u.roles || []).map(r => r.name))) )];

  const statusOptions = ["Tất cả", "Đã kích hoạt", "Đã vô hiệu hóa"];

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

  if (isLoading) return <div className="p-8 text-center text-gray-500">Đang tải danh sách người dùng...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Lỗi tải dữ liệu: {error?.data?.message || error?.message || 'Không thể kết nối API'}</div>;

  // Hàm xử lý khóa/mở tài khoản
  const handleToggleUser = async (user) => {
    try {
      if (user.enabled) {
        // Khóa tài khoản (gọi API xóa user)
        await deleteUser(user.id).unwrap();
        setMessage(`Đã khóa tài khoản cho ${user.name}`);
        setMessageType('success');
      } else {
        // Mở khóa tài khoản (gọi API enable user)
        await enableUser(user.id).unwrap();
        setMessage(`Đã mở khóa tài khoản cho ${user.name}`);
        setMessageType('success');
      }
      refetch();
    } catch (err) {
      setMessage(err?.data?.message || 'Có lỗi xảy ra');
      setMessageType('error');
    }
    // Ẩn thông báo sau 2s
    setTimeout(() => setMessage(''), 2000);
  };

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#223b73] flex items-center gap-2">
          <FiUsers className="text-[#c52032]" /> Quản lý tài khoản người dùng
        </h1>
      </div>
      {message && (
        <div className={`mb-4 px-4 py-2 rounded ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message}</div>
      )}
      <FilterBar filters={filters} onChange={handleFilterChange} />
      {/* Table cho desktop */}
      <div className="hidden md:block">
        <DataTable
          data={filtered}
          columns={[
            { key: 'stt', label: 'STT', render: (row, idx) => idx + 1 },
            { key: 'name', label: 'Tên', render: (row) => <div className="flex items-center gap-2"><FiUser className="text-[#223b73]" /> {row.name}</div> },
            { key: 'email', label: 'Email' },
            { key: 'phoneNumber', label: 'SĐT' },
            { key: 'donVi', label: 'Đơn vị', render: (row) => getDonViLabel(row?.donVi) },
            { key: 'tenDonVi', label: 'Tên đơn vị', render: (row) => row?.tenDonVi || '-' },
            { key: 'enabled', label: 'Trạng thái', render: (row) => <StatusCell enabled={row.enabled} /> },
            { key: 'roles', label: 'Vai trò', render: (row) => (row.roles || []).map(r => getRoleDisplayName(r.roleName)).join(', ') },
            { key: 'actions', label: '', render: (row) => <UserActionButtons user={row} onToggle={handleToggleUser} /> }
          ]}
        />
      </div>
      {/* Card view cho mobile */}
      <div className="block md:hidden space-y-3">
        {filtered.map((user, idx) => (
          <div key={user.id} className="bg-white rounded-xl shadow p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 font-bold text-[#223b73]">
              <span className="text-xs text-gray-400">#{idx + 1}</span>
              <FiUser className="text-[#c52032]" /> {user.name}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <StatusCell enabled={user.enabled} />
              <span className="ml-2">{user.votes} votes</span>
            </div>
            <div className="text-xs text-gray-500">{user.email} • {user.phone_number || user.phoneNumber}</div>
            <div className="text-xs">{(user.roles || []).map(r => getRoleDisplayName(r.roleName)).join(', ')}</div>
            <div className="text-xs text-gray-700">Đơn vị: {getDonViLabel(user?.donVi)}</div>
            <div className="text-xs text-gray-700">Tên đơn vị: {user?.tenDonVi || '-'}</div>
            <div>
              <UserActionButtons user={user} onToggle={handleToggleUser} />
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center text-gray-400 py-8">Không có dữ liệu phù hợp</div>
        )}
      </div>
    </div>
  );
} 