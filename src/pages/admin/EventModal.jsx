import React, { useEffect, useState } from "react";
import "./EventManagement.css";
import {
  useGetEventByIdQuery,
  useUpdateEventMutation,
  useGetEventManagersByEventIdQuery,
  useRemoveEventManagerMutation,
  useUploadBannerMutation,
} from "../../api/eventApi";
import { useAssignEventManagerMutation } from "@api/attendantApi";
import { useGetUserNameQuery, useGetAllUsersQuery } from "../../api/authApi";
import { useSelector, useDispatch } from "react-redux";
import { openSnackbar } from "@store/slices/snackbarSlice";
import { truncateDescription, truncateTitle } from "../../utils/eventHelpers";
import { Editor } from "@tinymce/tinymce-react";

export default function EventModal({
  open,
  onClose,
  onSubmit,
  initialData,
  isEdit,
}) {
  const [errorMessages, setErrorMessages] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    start_time: "",
    end_time: "",
    location: "",
    max_participants: "",
    url_docs: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [assignEventManager] = useAssignEventManagerMutation();
  const [removeEventManager] = useRemoveEventManagerMutation();
  const { data: allUsers = [] } = useGetAllUsersQuery();
  const [searchName, setSearchName] = useState("");
  const [foundUser, setFoundUser] = useState(null);
  const [managerError, setManagerError] = useState("");
  const [updateEvent, { isLoading: isUpdating }] = useUpdateEventMutation();
  const accessToken = useSelector((state) => state.auth.accessToken);
  const currentUserId = useSelector((state) => state.auth.userId);
  const dispatch = useDispatch();
  const [justAssignedName, setJustAssignedName] = useState("");
  const [uploadBanner, { isLoading: isUploadingBanner }] =
    useUploadBannerMutation();

  const eventId = isEdit && initialData ? initialData.id : null;
  const {
    data: eventDetail,
    error: fetchError,
    isLoading: isFetching,
    refetch,
  } = useGetEventByIdQuery(eventId, { skip: !isEdit || !eventId || !open });
  // Lấy danh sách manager (chỉ lấy user_id)
  const { data: managerRoles = [], refetch: refetchManagers } =
    useGetEventManagersByEventIdQuery(eventId, {
      skip: !isEdit || !eventId || !open,
    });
  // Lấy tên user của manager (chỉ lấy user đầu tiên nếu có)
  const managerUserId =
    managerRoles.length > 0 ? managerRoles[0].user_id : null;
  const { data: managerUserName } = useGetUserNameQuery(managerUserId, {
    skip: !managerUserId,
  });
  const [tempManagerName, setTempManagerName] = useState("");
  const [removedNow, setRemovedNow] = useState(false);

  useEffect(() => {
    if (open) {
      if (isEdit && eventDetail) {
        setForm({
          title: eventDetail.title || eventDetail.name || "",
          description: eventDetail.description || "",
          start_time: eventDetail.start_time || eventDetail.startTime || "",
          end_time: eventDetail.end_time || eventDetail.endTime || "",
          location: eventDetail.location || "",
          max_participants:
            eventDetail.max_participants || eventDetail.maxParticipants || "",
          url_docs: eventDetail.url_docs || eventDetail.urlDocs || "",
        });
      } else if (!isEdit) {
        setForm({
          title: "",
          description: "",
          start_time: "",
          end_time: "",
          location: "",
          max_participants: "",
          url_docs: "",
        });
      }
      setErrorMsg("");
    }
  }, [open, isEdit, eventDetail]);

  useEffect(() => {
    if (managerUserName) {
      setJustAssignedName("");
      setRemovedNow(false);
      setTempManagerName("");
    }
  }, [managerUserName]);

  useEffect(() => {
    if (
      fetchError &&
      (fetchError.status === 401 || fetchError.status === 403)
    ) {
      setErrorMsg("Bạn không có quyền truy cập sự kiện này.");
      setErrorMessages((prev) => [
        ...prev,
        "Bạn không có quyền truy cập sự kiện này.",
      ]);
    } else if (fetchError) {
      setErrorMsg("Lỗi khi tải thông tin sự kiện.");
      setErrorMessages((prev) => [...prev, "Lỗi khi tải thông tin sự kiện."]);
    }
  }, [fetchError]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleDescriptionChange = (htmlContent) => {
    setForm({ ...form, description: htmlContent });
  };

  const formatDateTime = (dt) => {
    if (!dt) return dt;
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(dt)) return dt + ":00";
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(dt)) return dt;
    return dt;
  };

  const handleBannerChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      await uploadBanner({ eventId, file }).unwrap();
      setErrorMsg("");
      if (refetch) refetch();
      alert("Tải lên banner thành công!");
    } catch (err) {
      setErrorMsg(err?.data?.message || "Tải lên banner thất bại!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    let errorList = [];

    if (!accessToken) {
      errorList.push("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn.");
      if (onSubmit) onSubmit(form, errorList);
      return;
    }

    const formWithSeconds = {
      ...form,
      start_time: formatDateTime(form.start_time),
      end_time: formatDateTime(form.end_time),
      max_participants: form.max_participants
        ? parseInt(form.max_participants, 10)
        : undefined,
    };

    try {
      const payload = {
        title: formWithSeconds.title,
        description: formWithSeconds.description,
        start_time: formWithSeconds.start_time,
        end_time: formWithSeconds.end_time,
        location: formWithSeconds.location,
        max_participants: formWithSeconds.max_participants,
        url_docs: formWithSeconds.url_docs,
      };
      const res = await updateEvent({ id: eventId, data: payload }).unwrap();
      // Việc gán manager sẽ được thực hiện qua luồng nhập email riêng bên dưới
      if (onSubmit) onSubmit(res, errorList);
      if (onClose) onClose();
    } catch (err) {
      let msg = "Lỗi khi cập nhật sự kiện hoặc gán manager.";
      if (err?.data?.message) {
        msg += `\nChi tiết: ${err.data.message}`;
      }
      errorList.push(msg);
      if (err?.status === 401 || err?.status === 403) {
        errorList.push(
          "Bạn không có quyền chỉnh sửa/gán manager cho sự kiện này.",
        );
      } else if (err?.status === 500) {
        const sysMsg =
          "Lỗi hệ thống (500). Vui lòng kiểm tra lại dữ liệu hoặc liên hệ quản trị viên." +
          (err?.data?.message ? `\nChi tiết: ${err.data.message}` : "");
        errorList.push(sysMsg);
      }
      if (onSubmit) onSubmit(form, errorList);
    }
  };

  // Hàm refresh dữ liệu event
  const handleRefresh = async () => {
    if (refetch) await refetch();
  };

  if (!open) return null;

  return (
    <div className="modal" style={{ display: "block" }}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2 id="modalTitle" style={{ color: "#c52032" }}>
          {isEdit ? "Chỉnh Sửa Sự Kiện" : "Thêm Sự Kiện Mới"}
        </h2>
        {/* Không hiển thị lỗi trong modal, lỗi sẽ được truyền lên EventManagement */}
        {isFetching ? (
          <div>Đang tải thông tin sự kiện...</div>
        ) : (
          <form id="eventForm" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Tên Sự Kiện:</label>
              <input
                type="text"
                id="title"
                value={form.title || ""}
                onChange={handleChange}
                required
              />
              {form.title && (
                <div
                  style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}
                >
                  {form.title.length > 40 ? (
                    <span style={{ color: "#e53935" }}>
                      Tên quá dài ({form.title.length} ký tự). Sẽ hiển thị: "
                      {truncateTitle(form.title, 40)}"
                    </span>
                  ) : (
                    <span>Độ dài: {form.title.length}/40 ký tự</span>
                  )}
                </div>
              )}
            </div>
            {/* Upload banner ngay dưới tên sự kiện */}
            <div className="form-group">
              <label>Banner sự kiện:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleBannerChange}
                disabled={isUploadingBanner}
              />
              {isUploadingBanner && (
                <span style={{ marginLeft: 8, color: "#888" }}>
                  Đang tải lên...
                </span>
              )}
              {eventDetail?.banner && (
                <div style={{ marginTop: 8 }}>
                  <img
                    src={`${import.meta.env.VITE_BASE_URL}/events/${eventDetail.banner}`}
                    alt="Banner"
                    style={{ maxWidth: 200, borderRadius: 8 }}
                  />
                </div>
              )}
            </div>
            {/* Hiển thị tên manager hiện tại nếu có, nếu chưa có thì hiện phần chọn manager */}
            {!removedNow && (managerUserName || tempManagerName) ? (
              <>
                <div className="form-group">
                  <label>Manager hiện tại:</label>
                  <div style={{ fontSize: 13, color: "#555", marginBottom: 6 }}>
                    Sự kiện:{" "}
                    {eventDetail?.title ||
                      eventDetail?.name ||
                      eventDetail?.eventName ||
                      "(Không rõ tên)"}
                  </div>
                  <div
                    style={{
                      fontWeight: 600,
                      color: "#223b73",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    {tempManagerName || managerUserName}
                    <button
                      type="button"
                      style={{
                        marginLeft: 8,
                        background: "#fff4f4",
                        color: "#e53935",
                        border: "1px solid #e53935",
                        borderRadius: 6,
                        padding: "2px 10px",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                      onClick={async () => {
                        try {
                          await removeEventManager({
                            user_id: managerUserId,
                            event_id: eventId,
                          });
                          setFoundUser(null);
                          setSearchName("");
                          setJustAssignedName("");
                          setTempManagerName("");
                          setRemovedNow(true);
                          await Promise.all([
                            handleRefresh(),
                            refetchManagers?.(),
                          ]);
                          dispatch(
                            openSnackbar({
                              message: "Xóa quản lý thành công!",
                              type: "success",
                            }),
                          );
                        } catch (err) {
                          const msg =
                            err?.data?.message ||
                            err?.message ||
                            "Xóa quản lý thất bại!";
                          dispatch(
                            openSnackbar({ message: msg, type: "error" }),
                          );
                        }
                      }}
                    >
                      Xóa quản lý
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="form-group">
                <label htmlFor="managerSearch">
                  Nhập tên để tìm người quản lí:
                </label>
                <div style={{ fontSize: 13, color: "#555", marginBottom: 6 }}>
                  Sự kiện:{" "}
                  {eventDetail?.title ||
                    eventDetail?.name ||
                    eventDetail?.eventName ||
                    "(Không rõ tên)"}
                </div>
                {justAssignedName && (
                  <div
                    style={{
                      marginBottom: 8,
                      padding: 8,
                      background: "#e8f5e9",
                      border: "1px solid #81c784",
                      borderRadius: 6,
                      color: "#2e7d32",
                    }}
                  >
                    Đã gán quản lí: <strong>{justAssignedName}</strong>. Đang
                    đồng bộ dữ liệu...
                  </div>
                )}
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  <input
                    type="text"
                    id="managerSearch"
                    placeholder="Nhập tên hoặc email để tìm..."
                    value={searchName}
                    onChange={(e) => {
                      setSearchName(e.target.value);
                      setFoundUser(null);
                      setManagerError("");
                    }}
                  />
                  {searchName && (
                    <div
                      style={{
                        border: "1px solid #ddd",
                        borderRadius: 6,
                        maxHeight: 200,
                        overflowY: "auto",
                      }}
                    >
                      {allUsers
                        .filter((u) => {
                          const q = searchName.toLowerCase();
                          return (
                            (u.name && u.name.toLowerCase().includes(q)) ||
                            (u.email && u.email.toLowerCase().includes(q))
                          );
                        })
                        .slice(0, 8)
                        .map((u) => (
                          <div
                            key={u.id}
                            onClick={() => {
                              setFoundUser(u);
                              setSearchName(u.name || u.email || "");
                              setManagerError("");
                            }}
                            style={{
                              padding: "8px 10px",
                              cursor: "pointer",
                              borderBottom: "1px solid #eee",
                            }}
                          >
                            {u.name || "Không rõ tên"} ({u.email})
                          </div>
                        ))}
                      {allUsers.filter((u) => {
                        const q = searchName.toLowerCase();
                        return (
                          (u.name && u.name.toLowerCase().includes(q)) ||
                          (u.email && u.email.toLowerCase().includes(q))
                        );
                      }).length === 0 && (
                        <div style={{ padding: "8px 10px", color: "#666" }}>
                          Không tìm thấy người dùng phù hợp.
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {managerError && (
                  <div style={{ color: "#e53935", marginTop: 6 }}>
                    {managerError}
                  </div>
                )}
                {foundUser && (
                  <div
                    style={{
                      marginTop: 8,
                      padding: 8,
                      border: "1px solid #ccc",
                      borderRadius: 6,
                    }}
                  >
                    <div>
                      <strong>Người dùng:</strong>{" "}
                      {foundUser.name ||
                        foundUser.fullName ||
                        foundUser.username ||
                        "Không rõ tên"}{" "}
                      ({foundUser.email})
                    </div>
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ marginTop: 8 }}
                      onClick={async () => {
                        try {
                          if (!eventId) {
                            setManagerError(
                              "Chỉ gán quản lí sau khi sự kiện đã tồn tại.",
                            );
                            return;
                          }
                          (await assignEventManager({
                            user_id: foundUser.id,
                            event_id: eventId,
                            roleType: "MANAGE",
                            assigned_by: currentUserId || "",
                          }).unwrap?.()) ??
                            assignEventManager({
                              user_id: foundUser.id,
                              event_id: eventId,
                              roleType: "MANAGE",
                              assigned_by: currentUserId || "",
                            });
                          setSearchName("");
                          setFoundUser(null);
                          setManagerError("");
                          const displayName =
                            foundUser.name ||
                            foundUser.fullName ||
                            foundUser.username ||
                            foundUser.email ||
                            "Người dùng";
                          setJustAssignedName(displayName);
                          setTempManagerName(displayName);
                          setRemovedNow(false);
                          await Promise.all([
                            handleRefresh(),
                            refetchManagers?.(),
                          ]);
                          dispatch(
                            openSnackbar({
                              message: "Gán quản lí thành công!",
                              type: "success",
                            }),
                          );
                        } catch (err) {
                          const details =
                            err?.data?.message ||
                            err?.error ||
                            err?.message ||
                            "Không thể gán quyền quản lí.";
                          setManagerError(details);
                          dispatch(
                            openSnackbar({ message: details, type: "error" }),
                          );
                        }
                      }}
                    >
                      Gán làm quản lí
                    </button>
                  </div>
                )}
              </div>
            )}
            <div className="form-group">
              <label htmlFor="description">Mô Tả:</label>
              <div
                style={{
                  border: "1px solid #ccc",
                  borderRadius: 6,
                  padding: 8,
                  marginBottom: 8,
                }}
              >
                <Editor
                  apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                  initialValue={form.description}
                  onEditorChange={(content) => handleDescriptionChange(content)}
                  init={{
                    height: 300,
                    menubar: false,
                    plugins: [
                      "advlist autolink lists link image charmap print preview anchor",
                      "searchreplace visualblocks code fullscreen",
                      "insertdatetime media table paste code help wordcount",
                    ],
                    toolbar:
                      "undo redo | styleselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | print preview media fullpage | forecolor backcolor emoticons | help",
                    content_css: "/path/to/your/content.css", // Đường dẫn tới file CSS tùy chỉnh
                    // Đường dẫn tới file CSS mặc định của TinyMCE
                    // Bạn có thể tùy chỉnh thêm các thuộc tính khác tại đây
                  }}
                />
              </div>
              {form.description && (
                <div
                  style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}
                >
                  {form.description.length > 300 ? (
                    <span style={{ color: "#e53935" }}>
                      Mô tả quá dài ({form.description.length} ký tự). Sẽ hiển
                      thị: "{truncateDescription(form.description, 300)}"
                    </span>
                  ) : (
                    <span>Độ dài: {form.description.length}/300 ký tự</span>
                  )}
                </div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="start_time">Thời Gian Bắt Đầu:</label>
              <input
                type="datetime-local"
                id="start_time"
                value={form.start_time}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="end_time">Thời Gian Kết Thúc:</label>
              <input
                type="datetime-local"
                id="end_time"
                value={form.end_time}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="location">Địa Điểm:</label>
              <input
                type="text"
                id="location"
                value={form.location}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="max_participants">
                Số lượng tham gia tối đa:
              </label>
              <input
                type="number"
                id="max_participants"
                value={form.max_participants}
                onChange={handleChange}
                min="1"
              />
            </div>
            <div className="form-group">
              <label htmlFor="url_docs">Tài Liệu (URL):</label>
              <input
                type="text"
                id="url_docs"
                value={form.url_docs}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isUpdating}
              >
                Lưu Sự Kiện
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Hủy
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
