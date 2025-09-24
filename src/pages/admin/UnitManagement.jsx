import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuilding,
  faDownload,
  faFilter,
  faPlus,
  faSearch,
  faSync,
} from "@fortawesome/free-solid-svg-icons";

import { useListUnitsQuery, useDeleteUnitMutation } from "@/api/unitApi";
import UnitStats from "@/components/features/admin/UnitStats";
import UnitList from "@/components/features/admin/UnitList";
import PaginationControls from "@/components/features/admin/PaginationControls";
import LoadingState from "@/components/ui/LoadingState";
import UnitModal from "./UnitModal";
import { openSnackbar } from "@/store/slices/snackbarSlice";

const PAGE_SIZE = 12;

const UNIT_TYPE_FILTERS = [
  { value: "all", label: "Tất cả loại" },
  { value: "DEPARTMENT", label: "Phòng ban" },
  { value: "TEAM", label: "Nhóm" },
  { value: "PROJECT_GROUP", label: "Dự án" },
];

export default function UnitManagement() {
  const [page, setPage] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editUnit, setEditUnit] = useState(null);
  const [modalErrors, setModalErrors] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput.trim()), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Reset page khi filter/search thay đổi
  useEffect(() => {
    setPage(0);
  }, [debouncedSearch, typeFilter]);

  // Fetch units từ RTK Query
  const { data, isLoading, error, refetch } = useListUnitsQuery(
    {
      q: debouncedSearch || undefined,
      page,
      size: PAGE_SIZE,
      // Note: API có thể không support filter theo unit_type,
      // sẽ filter client-side nếu cần
    },
    { refetchOnMountOrArgChange: true },
  );

  const [deleteUnit] = useDeleteUnitMutation();

  // Process units data từ API
  const units = useMemo(() => {
    const unitList = data?.content || [];

    // Client-side filter by type nếu API không support
    let filtered = unitList;
    if (typeFilter !== "all") {
      filtered = unitList.filter((unit) => unit.unit_type === typeFilter);
    }

    // Map parent names (nếu API không trả về)
    return filtered.map((unit) => ({
      ...unit,
      parent_name: unit.parent_id
        ? unitList.find((p) => p.id === unit.parent_id)?.unit_name
        : null,
    }));
  }, [data, typeFilter]);

  // Pagination từ API
  const totalPages = data?.totalPages || 1;

  // Thống kê từ API data
  const stats = useMemo(() => {
    const allUnits = data?.content || [];
    const departments = allUnits.filter(
      (u) => u.unit_type === "DEPARTMENT",
    ).length;
    const teams = allUnits.filter((u) => u.unit_type === "TEAM").length;
    const projects = allUnits.filter(
      (u) => u.unit_type === "PROJECT_GROUP",
    ).length;

    return {
      total: allUnits.length,
      departments,
      teams,
      projects,
    };
  }, [data]);

  // Xử lý modal
  const handleAdd = () => {
    setEditUnit(null);
    setModalOpen(true);
  };

  const handleEdit = (unit) => {
    console.log("✏️ HandleEdit called with unit:", unit);
    setEditUnit(unit);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditUnit(null);
    setModalErrors([]);
  };

  const handleModalSubmit = async (form, errorsFromModal) => {
    if (errorsFromModal && errorsFromModal.length > 0) {
      setModalErrors(errorsFromModal);
      return;
    }
    setModalErrors([]);

    // Refetch data sau khi thành công
    await refetch();
    setModalOpen(false);
    setEditUnit(null);
  };

  const handleDelete = async (id) => {
    console.log("🗑️ HandleDelete called with id:", id);
    const unit = units.find((u) => u.id === id);
    console.log("Found unit to delete:", unit);

    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa đơn vị "${unit?.unit_name}" không?`,
      )
    ) {
      try {
        console.log("Calling deleteUnit API...");
        await deleteUnit(id).unwrap();
        dispatch(openSnackbar({ message: "Đã xóa đơn vị thành công!" }));
      } catch (err) {
        console.error("Delete error:", err);
        dispatch(
          openSnackbar({
            message: err?.data?.message || "Xóa đơn vị thất bại!",
            type: "error",
          }),
        );
      }
    }
  };

  // Xuất dữ liệu
  const handleExport = () => {
    const dataStr = JSON.stringify(units, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = "units-export.json";
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const handleRefresh = () => {
    refetch();
    dispatch(openSnackbar({ message: "Đã làm mới dữ liệu!" }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="mb-4 flex items-center justify-center gap-3 text-4xl font-bold text-gray-800">
            🏢 Quản Lý Đơn Vị
          </h1>
          <p className="mb-4 text-lg text-gray-600">
            Hệ thống quản lý cơ cấu tổ chức và đơn vị
          </p>
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 px-6 py-2 font-semibold text-white shadow-lg">
            👑 ADMIN DASHBOARD
          </div>
        </motion.div>

        {/* Statistics */}
        <UnitStats stats={stats} />

        {/* Controls */}
        <motion.div
          className="mb-8 rounded-xl bg-white p-6 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            {/* Search */}
            <div className="relative max-w-md flex-1">
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400"
              />
              <input
                type="text"
                placeholder="Tìm kiếm đơn vị..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faFilter} className="text-gray-500" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              >
                {UNIT_TYPE_FILTERS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAdd}
                className="flex items-center gap-2 rounded-lg bg-blue-500 px-6 py-3 font-semibold text-white shadow-lg transition-colors hover:bg-blue-600"
              >
                <FontAwesomeIcon icon={faPlus} />
                Thêm mới
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExport}
                className="flex items-center gap-2 rounded-lg bg-green-500 px-6 py-3 font-semibold text-white shadow-lg transition-colors hover:bg-green-600"
              >
                <FontAwesomeIcon icon={faDownload} />
                Xuất file
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                className="rounded-lg bg-gray-500 px-4 py-3 font-semibold text-white shadow-lg transition-colors hover:bg-gray-600"
                disabled={isLoading}
              >
                <FontAwesomeIcon
                  icon={faSync}
                  className={isLoading ? "animate-spin" : ""}
                />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Units List */}
        {isLoading ? (
          <LoadingState message="Đang tải dữ liệu đơn vị..." />
        ) : units.length > 0 ? (
          <>
            <UnitList
              units={units}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />

            <PaginationControls
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        ) : (
          <motion.div
            className="rounded-xl bg-white py-12 text-center shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <FontAwesomeIcon
              icon={faBuilding}
              className="mb-4 text-6xl text-gray-300"
            />
            <h3 className="mb-2 text-xl font-semibold text-gray-600">
              Không tìm thấy đơn vị nào
            </h3>
            <p className="text-gray-500">
              Hãy thử tìm kiếm với từ khóa khác hoặc tạo đơn vị mới
            </p>
          </motion.div>
        )}

        {/* API Error Display */}
        {error && (
          <motion.div
            className="rounded-xl border border-red-200 bg-red-50 p-6 text-center shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="mb-2 text-lg font-semibold text-red-600">
              ❌ Lỗi tải dữ liệu
            </div>
            <p className="text-red-700">
              {error?.data?.message || "Không thể tải danh sách đơn vị"}
            </p>
            <button
              onClick={handleRefresh}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              Thử lại
            </button>
          </motion.div>
        )}

        {/* Modal lỗi */}
        {modalErrors.length > 0 && (
          <div className="my-4 rounded border border-red-400 bg-red-50 px-4 py-3 text-red-700">
            <div className="mb-2 font-semibold">Thông báo lỗi:</div>
            <ul className="list-disc pl-5">
              {modalErrors.map((msg, idx) => (
                <li key={idx}>{msg}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Modal tạo/sửa đơn vị */}
        <UnitModal
          key={editUnit ? editUnit.id : "new"}
          open={modalOpen}
          onClose={handleModalClose}
          onUpdated={handleModalSubmit}
          onSubmit={handleModalSubmit}
          initialData={editUnit}
          isEdit={!!editUnit}
          availableParents={units.filter((u) => u.id !== editUnit?.id)} // Loại bỏ chính nó khỏi danh sách parent
        />
      </div>
    </div>
  );
}
