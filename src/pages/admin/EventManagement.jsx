import React, { useState, useMemo, useEffect } from "react";
import EventStats from "../../components/admin/EventStats";
import EventControls from "../../components/admin/EventControls";
import EventList from "../../components/admin/EventList";
import LoadingState from "../../components/common/LoadingState";
import "./EventManagement.css";
import EventModal from "./EventModal";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetEventsQuery, useDeleteEventMutation } from "../../api/eventApi";
import dayjs from "dayjs";
import {
  formatDate,
  getStatusText,
  formatTimeRemaining,
  truncateDescription,
  truncateTitle,
} from "../../utils/eventHelpers";
import PaginationControls from "@components/admin/PaginationControls";

const normalizeStatus = (s) => {
  if (!s) return "";
  const up = String(s).toUpperCase();
  return up;
};

const STATUS_FILTERS = [
  { value: "all", label: "Tất cả" },
  { value: "UPCOMING", label: "Sắp diễn ra" },
  { value: "ONGOING", label: "Đang diễn ra" },
  { value: "COMPLETED", label: "Đã kết thúc" },
  { value: "CANCELLED", label: "Đã hủy" },
];

const PAGE_SIZE = 6;

export default function EventManagement() {
  const [page, setPage] = useState(0);
  const [modalErrors, setModalErrors] = useState([]);
  const accessToken = useSelector((state) => state.auth.accessToken);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchInput.trim()), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    setPage(0);
  }, [debouncedSearch, statusFilter]);

  const {
    data: pageData,
    isLoading,
    error,
    refetch,
  } = useGetEventsQuery(
    {
      page: page,
      size: PAGE_SIZE,
      sortBy: "startTime",
      sortDir: "asc",
      search: debouncedSearch || null,
      status: statusFilter === "all" ? null : statusFilter.toUpperCase(),
    },
    {
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
    },
  );

  const eventsFromApi = pageData?.pagination?.content || [];
  const totalPages = pageData?.pagination?.totalPages || 0;

  const [modalOpen, setModalOpen] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const navigate = useNavigate();
  const [deleteEvent] = useDeleteEventMutation();

  const events = useMemo(() => {
    const now = dayjs();

    return (eventsFromApi || [])
      .map((event) => {
        const statusUpper = normalizeStatus(event.status); // <-- CHỐT UPPERCASE

        return {
          id: event.id,
          title: event.title || event.name || "",
          title_short: truncateTitle(event.title || event.name || "", 40),
          description: event.description || "",
          description_text: (event.description || "").replace(/<[^>]*>/g, " "),
          description_short: truncateDescription(event.description || "", 400),
          start_time: event.startTime,
          end_time: event.endTime,
          location: event.location || "",
          status: statusUpper,
          created_at: event.createdAt,
          created_by: event.createdBy,
          qr_join_token: event.qrJoinToken,
          banner: event.banner,
          url_docs: event.urlDocs,
          max_participants: event.maxParticipants,
          participants: event.participants,
          enable: event.enabled,
          timeRemaining: dayjs(event.startTime).diff(now, "hour", true),
          createdByName: event.createdByName,
          managerName: event.managerName,
        };
      })
      .sort((a, b) => {
        const order = { UPCOMING: 0, ONGOING: 1, COMPLETED: 2, CANCELLED: 3 };
        const ao = order[a.status] ?? 99;
        const bo = order[b.status] ?? 99;
        if (ao !== bo) return ao - bo;

        if (a.status === "UPCOMING") return a.timeRemaining - b.timeRemaining;
        if (a.status === "ONGOING")
          return dayjs(a.start_time).valueOf() - dayjs(b.start_time).valueOf();
        if (a.status === "COMPLETED" || a.status === "CANCELLED")
          return dayjs(b.start_time).valueOf() - dayjs(a.start_time).valueOf();
        return 0;
      });
  }, [eventsFromApi]);

  const filteredEvents = useMemo(() => {
    let filtered = events;

    if (statusFilter !== "all") {
      const wanted = normalizeStatus(statusFilter);
      filtered = filtered.filter((e) => e.status === wanted);
    }

    if (!searchInput?.trim()) return filtered;
    const normalizeVi = (s = "") =>
      s
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, " ")
        .trim();
    const q = normalizeVi(searchInput);

    return filtered.filter((e) => {
      const haystacks = [
        e.title,
        e.location,
        e.description_text,
        e.createdByName,
        e.managerName,
      ]
        .filter(Boolean)
        .map((x) => normalizeVi(String(x)));
      return haystacks.some((h) => h.includes(q));
    });
  }, [events, statusFilter, searchInput]);

  const counters = pageData?.counters || {};
  const stats = useMemo(
    () => ({
      total:
        (counters.UPCOMING ?? 0) +
        (counters.ONGOING ?? 0) +
        (counters.COMPLETED ?? 0) +
        (counters.CANCELLED ?? 0),
      active: counters.ONGOING ?? 0,
      upcoming: counters.UPCOMING ?? 0,
      completed: counters.COMPLETED ?? 0,
      cancelled: counters.CANCELLED ?? 0,
    }),
    [counters],
  );

  const handleAdd = () => {
    navigate("/admin/events/create");
  };

  const handleEdit = (event) => {
    setEditEvent(event);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditEvent(null);
  };

  const handleModalSubmit = async (form, errorsFromModal) => {
    if (errorsFromModal && errorsFromModal.length > 0) {
      setModalErrors(errorsFromModal);
      return;
    } else {
      setModalErrors([]);
    }
    await refetch();
    setModalOpen(false);
    setEditEvent(null);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(events, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = "events-export.json";
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sự kiện này?")) {
      if (!accessToken) {
        alert("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn.");
        return;
      }
      try {
        await deleteEvent(id).unwrap();
        alert("Đã xóa sự kiện thành công!");
        await refetch();
      } catch (err) {
        alert(
          "Xóa sự kiện thất bại!\n" +
            (err?.data?.message || err?.message || ""),
        );
      }
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>🎉 Quản Lý Sự Kiện</h1>
        <p>Hệ thống quản lý sự kiện chuyên nghiệp</p>
        <div className="admin-badge">👑 ADMIN</div>
      </div>

      {isLoading && <LoadingState message="Đang tải dữ liệu sự kiện..." />}

      {!isLoading && !error && events.length === 0 && (
        <div className="no-events">
          <h3>📭 Không có sự kiện nào</h3>
          <p>Chưa có sự kiện nào được tạo hoặc API không trả về dữ liệu.</p>
        </div>
      )}

      {!isLoading && !error && (
        <>
          <EventStats stats={stats} />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 16,
            }}
          >
            <label htmlFor="statusFilter" style={{ fontWeight: 600 }}>
              Lọc theo trạng thái:
            </label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ padding: 6, borderRadius: 6, border: "1px solid #ccc" }}
            >
              {STATUS_FILTERS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <EventControls
            onAdd={handleAdd}
            onExport={handleExport}
            onRefresh={() => refetch()}
            search={searchInput}
            setSearch={setSearchInput}
          />

          {filteredEvents.length > 0 ? (
            <>
              <EventList
                events={filteredEvents}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={(id) => navigate(`/admin/events/${id}`)}
                formatDate={formatDate}
                formatTimeRemaining={formatTimeRemaining}
                getStatusText={getStatusText}
              />

              <PaginationControls
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </>
          ) : (
            <div className="no-events">
              <h3>📭 Không tìm thấy sự kiện nào</h3>
              <p>Hãy thử tìm với từ khóa khác hoặc tạo sự kiện mới.</p>
            </div>
          )}
        </>
      )}
      {modalErrors.length > 0 && (
        <div
          style={{
            background: "#fff4f4",
            border: "1.5px solid #e53935",
            borderRadius: 8,
            padding: "12px 18px",
            margin: "18px 0",
            color: "#c52032",
            fontWeight: 600,
            boxShadow: "0 2px 8px rgba(229,57,53,0.08)",
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
          }}
        >
          <span style={{ fontSize: 22, marginRight: 8 }}>⚠️</span>
          <div>
            <div style={{ fontSize: 16, marginBottom: 4 }}>Thông báo lỗi:</div>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {modalErrors.map((msg, idx) => (
                <li key={idx} style={{ marginBottom: 2 }}>
                  {msg}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      <EventModal
        key={editEvent ? editEvent.id : "new"}
        open={modalOpen}
        onClose={handleModalClose}
        onUpdated={async () => {
          await refetch();
        }}
        onSubmit={(form, errors) => handleModalSubmit(form, errors)}
        initialData={editEvent}
        isEdit={!!editEvent}
      />
    </div>
  );
}
