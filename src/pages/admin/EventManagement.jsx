import React, { useState, useMemo, useEffect } from "react";
import EventStats from "../../components/admin/EventStats";
import EventControls from "../../components/admin/EventControls";
import EventList from "../../components/admin/EventList";
import LoadingState from "../../components/common/LoadingState";
import TokenDebug from "../../components/admin/TokenDebug";
import "./EventManagement.css";
import EventModal from "./EventModal";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetEventsQuery, useDeleteEventMutation, useCreateEventMutation, useGetEventManagersByEventIdQuery } from "../../api/eventApi";
import dayjs from "dayjs";
import { formatDate, getStatusText, formatTimeRemaining, mapBackendStatusToFrontend, truncateDescription, truncateTitle } from "../../utils/eventHelpers";

const STATUS_FILTERS = [
  { value: "all", label: "Tất cả" },
  { value: "upcoming", label: "Sắp diễn ra" },
  { value: "ongoing", label: "Đang diễn ra" },
  { value: "completed", label: "Đã kết thúc" },
  { value: "cancelled", label: "Đã hủy" },
];

export default function EventManagement() {
  const [modalErrors, setModalErrors] = useState([]);
  const accessToken = useSelector(state => state.auth.accessToken);
  const user = useSelector(state => state.auth.user);
  const {
    data: apiEvents = [],
    isLoading,
    error,
    refetch
  } = useGetEventsQuery({
    page: 0,
    size: 100, // Get more events for management page
    sortBy: "startTime",
    sortDir: "asc"
  }, {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [deleteEvent, { isLoading: isDeleting }] = useDeleteEventMutation();
  const [createEvent, { isLoading: isCreating }] = useCreateEventMutation();
  const [statusFilter, setStatusFilter] = useState("all");

  // Debug: Log API response
  console.log("API Events:", apiEvents);
  console.log("Loading:", isLoading);
  console.log("Error:", error);
  console.log("API Events type:", typeof apiEvents);
  console.log("API Events length:", apiEvents?.length);
  console.log("VITE_BASE_URL:", import.meta.env.VITE_BASE_URL);

  // Map API events to display format and sort by upcoming time
  const events = useMemo(() => {
    // Handle paginated response (common with Spring Boot)
    const eventsData = apiEvents?.content || apiEvents || [];
    
    console.log("Events Data:", eventsData);
    console.log("Events Data length:", eventsData?.length);
    
    if (!eventsData || eventsData.length === 0) {
      console.log("No events data found");
      return [];
    }
    
    const now = dayjs();
    
    return eventsData
      .map(event => {
        // Convert backend status to frontend display format
        const displayStatus = mapBackendStatusToFrontend(event.status);
        
        return {
          id: event.id,
          title: event.title || event.name || "",
          title_short: truncateTitle(event.title || event.name || "", 40), // Cắt bớt title
          description: event.description || "",
          description_short: truncateDescription(event.description || "", 400), // Giảm xuống 400 ký tự
          start_time: event.startTime,
          end_time: event.endTime,
          location: event.location || "",
          created_at: event.createdAt,
          created_by: event.createdBy,
          qr_join_token: event.qrJoinToken,
          banner: event.banner,
          url_docs: event.urlDocs,
          status: displayStatus,
          max_participants: event.maxParticipants,
          participants: event.participants,
          enable: event.enabled,
          // Add time remaining for sorting
          timeRemaining: dayjs(event.startTime).diff(now, 'hour', true)
        };
      })
      .sort((a, b) => {
        const statusOrder = {
          upcoming: 0,
          ongoing: 1,
          completed: 2,
          cancelled: 3
        };
        const aOrder = statusOrder[a.status] ?? 99;
        const bOrder = statusOrder[b.status] ?? 99;
        if (aOrder !== bOrder) return aOrder - bOrder;
        if (a.status === "upcoming") {
          return a.timeRemaining - b.timeRemaining;
        }
        if (a.status === "ongoing") {
          return dayjs(a.start_time).valueOf() - dayjs(b.start_time).valueOf();
        }
        if (a.status === "completed" || a.status === "cancelled") {
          return dayjs(b.start_time).valueOf() - dayjs(a.start_time).valueOf();
        }
        return 0;
      });
  }, [apiEvents]);

  const filteredEvents = useMemo(() => {
    let filtered = events;
    if (statusFilter !== "all") {
      filtered = filtered.filter(event => event.status === statusFilter);
    }
    if (!search) return filtered;
    return filtered.filter(event =>
      event.title.toLowerCase().includes(search.toLowerCase()) ||
      event.location.toLowerCase().includes(search.toLowerCase()) ||
      event.description.toLowerCase().includes(search.toLowerCase())
    );
  }, [events, search, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: events.length,
      active: events.filter(e => e.status === "ongoing").length,
      upcoming: events.filter(e => e.status === "upcoming").length,
      completed: events.filter(e => e.status === "completed").length
    };
  }, [events]);

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
    // Nhận lỗi từ modal và hiển thị ở đầu trang
    if (errorsFromModal && errorsFromModal.length > 0) {
      setModalErrors(errorsFromModal);
    } else {
      setModalErrors([]);
    }
    // Luôn refetch lại danh sách sự kiện sau khi submit modal
    await refetch();
    setModalOpen(false);
    setEditEvent(null);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(events, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'events-export.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
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
        alert("Xóa sự kiện thất bại!\n" + (err?.data?.message || err?.message || ""));
      }
    }
  };

  useEffect(() => {
    // Khi modal đóng hoặc manager thay đổi, tự động refetch lại dữ liệu
    if (!modalOpen) {
      refetch();
    }
  }, [modalOpen]);

  function EventManagerInfo({ eventId }) {
    const { data: managers, isLoading } = useGetEventManagersByEventIdQuery(eventId);
    if (isLoading) return <span style={{ color: '#888', fontSize: 12 }}>Đang tải manager...</span>;
    if (!managers || managers.length === 0) return <span style={{ color: '#888', fontSize: 12 }}>Chưa có quản lý</span>;
    return (
      <span style={{ color: '#223b73', fontWeight: 600, fontSize: 13 }}>
        {managers.map(m => m.userName || m.name || m.email).join(', ')}
      </span>
    );
  }

  return (
    <div className="container">
      {/* <TokenDebug /> */}
      <div className="header">
        <h1>🎉 Quản Lý Sự Kiện</h1>
        <p>Hệ thống quản lý sự kiện chuyên nghiệp</p>
        <div className="admin-badge">👑 ADMIN</div>
      </div>
      
      {isLoading && <LoadingState message="Đang tải dữ liệu sự kiện..." />}
      
      {error && (
        <div className="error-state">
          <h3>❌ Lỗi khi tải dữ liệu</h3>
          <p>{error.message || "Không thể kết nối đến máy chủ"}</p>
          <p>Chi tiết lỗi: {JSON.stringify(error)}</p>
        </div>
      )}
      
      {!isLoading && !error && events.length === 0 && (
        <div className="no-events">
          <h3>📭 Không có sự kiện nào</h3>
          <p>Chưa có sự kiện nào được tạo hoặc API không trả về dữ liệu.</p>
          <p>API Response: {JSON.stringify(apiEvents)}</p>
        </div>
      )}
      
      {!isLoading && !error && events.length > 0 && (
        <>
          <EventStats stats={stats} />
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
            <label htmlFor="statusFilter" style={{ fontWeight: 600 }}>Lọc theo trạng thái:</label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              style={{ padding: 6, borderRadius: 6, border: "1px solid #ccc" }}
            >
              {STATUS_FILTERS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <EventControls
            onAdd={handleAdd}
            onExport={handleExport}
            onRefresh={() => window.location.reload()}
            search={search}
            setSearch={setSearch}
          />
          <EventList
            events={filteredEvents.map(ev => ({
              ...ev,
              manager: <EventManagerInfo eventId={ev.id} />
            }))}
            onEdit={event => {
              setEditEvent({ ...event });
              setModalOpen(true);
            }}
            onDelete={handleDelete}
            onView={id => navigate(`/admin/events/${id}`)}
            formatDate={formatDate}
            formatTimeRemaining={formatTimeRemaining}
            getStatusText={getStatusText}
            // Hiển thị manager ra ngoài card
            renderExtra={event => (
              <div style={{marginTop: 8, color: '#223b73', fontWeight: 600, fontSize: 14}}>
                {event.manager}
              </div>
            )}
          />
        </>
      )}
      {/* Khung thông báo lỗi từ modal */}
      {modalErrors.length > 0 && (
        <div style={{
          background: '#fff4f4',
          border: '1.5px solid #e53935',
          borderRadius: 8,
          padding: '12px 18px',
          margin: '18px 0',
          color: '#c52032',
          fontWeight: 600,
          boxShadow: '0 2px 8px rgba(229,57,53,0.08)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 12
        }}>
          <span style={{fontSize: 22, marginRight: 8}}>⚠️</span>
          <div>
            <div style={{fontSize: 16, marginBottom: 4}}>Thông báo lỗi:</div>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {modalErrors.map((msg, idx) => (
                <li key={idx} style={{marginBottom: 2}}>{msg}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
      <EventModal
        key={editEvent ? editEvent.id : "new"}
        open={modalOpen}
        onClose={handleModalClose}
        onSubmit={(form, errors) => handleModalSubmit(form, errors)}
        initialData={editEvent}
        isEdit={!!editEvent}
      />
    </div>
  );
}

