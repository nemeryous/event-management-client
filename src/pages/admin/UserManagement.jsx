import React, { useEffect, useMemo, useState } from "react";
import {
  useGetAllUsersQuery,
  useEnableUserMutation,
  useDeleteUserMutation,
} from "../../api/authApi";
import { useDispatch } from "react-redux";
import { openSnackbar } from "@/store/slices/snackbarSlice";
import {
  faSearch,
  faUserCheck,
  faUsers,
  faUserSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import StatCard from "@/components/features/admin/StatCard";
import LoadingState from "@/components/ui/LoadingState";
import StatusBadge from "@/components/features/admin/StatusBadge";

const getRoleDisplayName = (roleName) => {
  if (!roleName) return "";
  const raw = roleName.replace(/^ROLE_/, "");
  if (raw === "ADMIN") return "Quản trị viên";
  if (raw === "USER") return "Người dùng";
  if (raw === "STAFF") return "Nhân viên";
  return raw.charAt(0) + raw.slice(1).toLowerCase();
};

export default function UserManagement() {
  const {
    data: usersResponse,
    isLoading,
    error,
    refetch,
  } = useGetAllUsersQuery();
  const [enableUser] = useEnableUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const dispatch = useDispatch();
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput.trim()), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const allUsers = useMemo(
    () =>
      Array.isArray(usersResponse)
        ? usersResponse
        : usersResponse?.content || [],
    [usersResponse],
  );

  const filteredUsers = useMemo(() => {
    return allUsers.filter((u) => {
      const searchLower = debouncedSearch.toLowerCase();
      const roleName = u.roles?.[0]?.roleName;

      const matchesSearch = debouncedSearch
        ? `${u.name} ${u.email} ${u.phone_number}`
            .toLowerCase()
            .includes(searchLower)
        : true;
      const matchesRole = roleFilter === "all" || roleName === roleFilter;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && u.enabled) ||
        (statusFilter === "inactive" && !u.enabled);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [allUsers, debouncedSearch, roleFilter, statusFilter]);

  const roles = useMemo(
    () => [
      "all",
      ...Array.from(
        new Set(
          allUsers.flatMap((u) => (u.roles || []).map((r) => r.roleName)),
        ),
      ),
    ],
    [allUsers],
  );

  const stats = useMemo(() => {
    const total = allUsers.length;
    const active = allUsers.filter((u) => u.enabled).length;
    return {
      total,
      active,
      inactive: total - active,
    };
  }, [allUsers]);

  const handleToggleUserStatus = async (user) => {
    const action = user.enabled ? "Khóa" : "Mở khóa";
    if (
      !window.confirm(
        `Bạn có chắc muốn ${action.toLowerCase()} tài khoản ${user.name}?`,
      )
    )
      return;

    try {
      if (user.enabled) {
        await deleteUser(user.id).unwrap();
      } else {
        await enableUser(user.id).unwrap();
      }
      dispatch(openSnackbar({ message: `${action} tài khoản thành công!` }));
      refetch();
    } catch (err) {
      dispatch(
        openSnackbar({
          message:
            err?.data?.message ||
            `Có lỗi xảy ra khi ${action.toLowerCase()} tài khoản`,
          type: "error",
        }),
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-6 py-8">
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="mb-4 flex items-center justify-center gap-3 text-4xl font-bold text-gray-800">
            <FontAwesomeIcon icon={faUsers} /> Quản Lý Người Dùng
          </h1>
          <p className="text-lg text-gray-600">
            Theo dõi, tìm kiếm và quản lý tất cả tài khoản trong hệ thống.
          </p>
        </motion.div>

        <motion.div
          className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
        >
          <StatCard
            icon={faUsers}
            label="Tổng số tài khoản"
            value={stats.total}
            color={{ border: "border-blue-500", text: "text-blue-600" }}
          />
          <StatCard
            icon={faUserCheck}
            label="Đang hoạt động"
            value={stats.active}
            color={{ border: "border-green-500", text: "text-green-600" }}
          />
          <StatCard
            icon={faUserSlash}
            label="Đã khóa"
            value={stats.inactive}
            color={{ border: "border-gray-500", text: "text-gray-600" }}
          />
        </motion.div>

        <motion.div
          className="mb-8 rounded-xl bg-white p-6 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.4 } }}
        >
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="relative w-full flex-1 md:max-w-md">
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, email..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả vai trò</option>
                {roles
                  .filter((r) => r !== "all")
                  .map((role) => (
                    <option key={role} value={role}>
                      {getRoleDisplayName(role)}
                    </option>
                  ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Đã khóa</option>
              </select>
            </div>
          </div>
        </motion.div>

        {isLoading ? (
          <LoadingState message="Đang tải danh sách người dùng..." />
        ) : error ? (
          <div className="text-center text-red-500">Lỗi: {error.message}</div>
        ) : (
          <motion.div
            className="overflow-hidden rounded-xl bg-white shadow-lg"
            layout
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">
                      Họ tên
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">
                      Đơn vị
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">
                      Trạng thái
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">
                      Vai trò
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold tracking-wider text-gray-500 uppercase">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {user.tenDonVi || user.unit?.unit_name || "Chưa có"}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge enabled={user.enabled} />
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {(user.roles || [])
                            .map((r) => getRoleDisplayName(r.roleName))
                            .join(", ")}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleToggleUserStatus(user)}
                            className={`rounded-md px-3 py-1.5 text-sm font-semibold transition-colors ${
                              user.enabled
                                ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                : "bg-red-100 text-red-700 hover:bg-red-200"
                            }`}
                          >
                            {user.enabled ? "Khóa" : "Mở khóa"}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="py-12 text-center text-gray-500"
                      >
                        <FontAwesomeIcon
                          icon={faSearch}
                          className="mb-2 text-4xl text-gray-300"
                        />
                        <p className="font-semibold">
                          Không tìm thấy người dùng
                        </p>
                        <p className="text-sm">
                          Hãy thử thay đổi bộ lọc của bạn.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
