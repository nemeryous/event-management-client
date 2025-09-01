import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetEventManagersByEventIdQuery,
  useUpdateEventMutation,
  useUploadEventBannerMutation,
} from "@api/eventApi";
import { openSnackbar } from "@store/slices/snackbarSlice";
import FormField from "@components/common/FormField";
import TextInput from "@components/common/TextInput";
import SunEditorEditor from "@components/common/SunEditorEditor";
import { useGetAllUsersQuery, useGetUserNameQuery } from "@api/authApi";
import {
  useAssignEventManagerMutation,
  useRemoveEventManagerMutation,
} from "@api/attendantApi";

const EventForm = ({ onSuccess, onCancel, initialData }) => {
  console.log({ initialData });
  const dispatch = useDispatch();
  const eventId = initialData ? initialData.id : null;
  const [updateEvent, { data: updatedEventData, isLoading: isUpdating }] =
    useUpdateEventMutation();
  const [justAssignedName, setJustAssignedName] = useState("");
  const [uploadBanner, { isLoading: isUploadingBanner }] =
    useUploadEventBannerMutation();
  const [removedNow, setRemovedNow] = useState(false);
  const { data: managerRoles = [], refetch: refetchManagers } =
    useGetEventManagersByEventIdQuery(eventId);
  console.log({ managerRoles });
  const managerUserId =
    managerRoles.length > 0 ? managerRoles[0].user_id : null;
  console.log({ managerUserId });
  const { data: managerUserName } = useGetUserNameQuery(managerUserId, {
    skip: !managerUserId,
  });
  const [foundUser, setFoundUser] = useState(null);
  const [removeEventManager] = useRemoveEventManagerMutation();
  const [tempManagerName, setTempManagerName] = useState("");
  console.log({ updatedEventData });
  const [searchName, setSearchName] = useState("");
  const [selectedBannerFile, setSelectedBannerFile] = useState(null);
  const [managerError, setManagerError] = useState("");
  const { data: allUsers = [] } = useGetAllUsersQuery();
  const [assignEventManager] = useAssignEventManagerMutation();
  const currentUserId = useSelector((state) => state.auth.userId);
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      startTime: initialData?.start_time || "",
      endTime: initialData?.end_time || "",
      location: initialData?.location || "",
      maxParticipants: initialData?.max_participants || "",
      urlDocs: initialData?.url_docs || "",
    },
  });
  const handleFileChange = (e) => {
    setSelectedBannerFile(e.target.files[0]);
  };
  useEffect(() => {
    if (managerUserName) {
      setJustAssignedName("");
      setRemovedNow(false);
      setTempManagerName("");
    }
  }, [managerUserName]);

  // useEffect(() => {
  //   if (
  //     fetchError &&
  //     (fetchError.status === 401 || fetchError.status === 403)
  //   ) {
  //     setErrorMsg("Bạn không có quyền truy cập sự kiện này.");
  //     setErrorMessages((prev) => [
  //       ...prev,
  //       "Bạn không có quyền truy cập sự kiện này.",
  //     ]);
  //   } else if (fetchError) {
  //     setErrorMsg("Lỗi khi tải thông tin sự kiện.");
  //     setErrorMessages((prev) => [...prev, "Lỗi khi tải thông tin sự kiện."]);
  //   }
  // }, [fetchError]);
  const onSubmit = async (formData) => {
    const payload = {
      title: formData.title,
      description: formData.description,
      start_time: `${formData.startTime}`,
      end_time: `${formData.endTime}`,
      location: formData.location,
      max_participants: Number(formData.maxParticipants) || null,
      url_docs: formData.urlDocs,
      created_at: initialData?.created_at,
      eventId: initialData?.id,
    };

    try {
      // 1. Cập nhật sự kiện
      const updatedEvent = await updateEvent(payload).unwrap();
      const eventId = updatedEvent.id || initialData?.id; // Lấy ID của sự kiện

      // 2. Nếu có file banner được chọn, tiến hành upload
      console.log({ selectedBannerFile });
      if (selectedBannerFile) {
        console.log({ selectedBannerFile });
        await uploadBanner({
          eventId: eventId,
          bannerFile: selectedBannerFile,
        }).unwrap();
        dispatch(
          openSnackbar({
            message: "Cập nhật sự kiện và tải banner thành công!",
          }),
        );
      } else {
        dispatch(openSnackbar({ message: "Cập nhật sự kiện thành công!" }));
      }

      if (onSuccess) onSuccess(); // Đóng modal sau khi hoàn tất
    } catch (error) {
      dispatch(
        openSnackbar({
          message: error?.data?.message || "Đã xảy ra lỗi khi cập nhật sự kiện",
          type: "error",
        }),
      );
    }
  };

  const isLoading = isUpdating || isUploadingBanner || isSubmitting;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h3 className="text-xl font-bold">Cập nhật thông tin sự kiện</h3>
      <FormField
        control={control}
        name="title"
        label="Tên sự kiện"
        rules={{ required: "Tên sự kiện là bắt buộc" }}
        Component={TextInput}
        error={errors.title}
      />

      {/* Phần Upload Banner mới */}
      <div className="form-group">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Banner sự kiện:
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUploadingBanner}
        />
        {isUploadingBanner && (
          <span style={{ marginLeft: 8, color: "#888" }}>
            Đang tải lên banner...
          </span>
        )}
        {selectedBannerFile && (
          <div style={{ marginTop: 8 }}>
            <img
              src={URL.createObjectURL(selectedBannerFile)}
              alt="Preview Banner"
              style={{ maxWidth: 200, borderRadius: 8 }}
            />
          </div>
        )}
      </div>
      {/* Kết thúc phần Upload Banner mới */}
      {!removedNow && (managerUserName || tempManagerName) ? (
        <>
          <div className="form-group">
            <label>Manager hiện tại:</label>
            <div style={{ fontSize: 13, color: "#555", marginBottom: 6 }}>
              Sự kiện:{" "}
              {initialData?.title ||
                initialData?.name ||
                initialData?.eventName ||
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
                    await Promise.all([refetchManagers?.()]);
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
                    dispatch(openSnackbar({ message: msg, type: "error" }));
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
          <label htmlFor="managerSearch">Nhập tên để tìm người quản lí:</label>
          <div style={{ fontSize: 13, color: "#555", marginBottom: 6 }}>
            Sự kiện:{" "}
            {initialData?.title ||
              initialData?.name ||
              initialData?.eventName ||
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
              Đã gán quản lí: <strong>{justAssignedName}</strong>. Đang đồng bộ
              dữ liệu...
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
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
            <div style={{ color: "#e53935", marginTop: 6 }}>{managerError}</div>
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
                    await Promise.all([refetchManagers?.()]);
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
                    dispatch(openSnackbar({ message: details, type: "error" }));
                  }
                }}
              >
                Gán làm quản lí
              </button>
            </div>
          )}
        </div>
      )}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Mô tả
        </label>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <SunEditorEditor
              value={field.value}
              onChange={field.onChange}
              placeholder={"Nhập mô tả sự kiện..."}
            />
          )}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField
          control={control}
          name="startTime"
          label="Thời gian bắt đầu"
          type="datetime-local"
          rules={{ required: "Thời gian bắt đầu là bắt buộc" }}
          Component={TextInput}
          error={errors.startTime}
        />
        <FormField
          control={control}
          name="endTime"
          label="Thời gian kết thúc"
          type="datetime-local"
          rules={{ required: "Thời gian kết thúc là bắt buộc" }}
          Component={TextInput}
          error={errors.endTime}
        />
      </div>

      <FormField
        control={control}
        name="location"
        label="Địa điểm"
        rules={{ required: "Địa điểm là bắt buộc" }}
        Component={TextInput}
        error={errors.location}
      />

      <FormField
        control={control}
        name="maxParticipants"
        label="Số lượng tối đa"
        type="number"
        Component={TextInput}
        error={errors.maxParticipants}
      />

      <FormField
        control={control}
        name="urlDocs"
        label="Tài liệu (URL)"
        Component={TextInput}
        error={errors.urlDocs}
      />

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-300 px-6 py-2 text-gray-700"
        >
          Hủy bỏ
        </button>
        <button
          onClick={handleSubmit(onSubmit)}
          type="submit"
          disabled={isLoading}
          className="rounded-lg bg-blue-600 px-6 py-2 text-white disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {isLoading ? "Đang xử lý..." : "Cập nhật Sự Kiện"}
        </button>
      </div>
    </form>
  );
};

export default EventForm;
