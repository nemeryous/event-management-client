import React, { useEffect, useMemo, useState } from "react";
import {
  faUserPlus,
  faUserMinus,
  faSearch,
  faDownload,
  faCheckCircle,
  faTimesCircle,
  faTimes,
  faUserShield,
  faRefresh,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatDateTime } from "@utils/helpers";
import * as XLSX from "xlsx";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  useAddParticipantsMutation,
  useDeleteParticipantMutation,
  useDeleteParticipantsMutation,
  useGetEventManagersByEventQuery,
  useGetAttendantsByEventQuery,
} from "@api/attendantApi";
import { useAssignEventManagerMutation } from "@api/attendantApi";
import { useRemoveEventManagerMutation } from "@api/attendantApi";
import { useUploadBannerMutation } from "@api/eventApi";

import { useDispatch } from "react-redux";
import { openSnackbar } from "@store/slices/snackbarSlice";

const addParticipantsSchema = yup.object({
  emailList: yup
    .string()
    .required("Vui lòng nhập ít nhất một email")
    .test(
      "valid-emails",
      "Một hoặc nhiều email không hợp lệ",
      function (value) {
        if (!value) return false;

        const emails = value
          .split("\n")
          .map((email) => email.trim())
          .filter((email) => email);

        if (emails.length === 0) return false;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const invalidEmails = emails.filter((email) => !emailRegex.test(email));

        if (invalidEmails.length > 0) {
          return this.createError({
            message: `Email không hợp lệ: ${invalidEmails.join(", ")}`,
          });
        }

        return true;
      },
    )
    .test(
      "unique-emails",
      "Có email trùng lặp trong danh sách",
      function (value) {
        if (!value) return true;

        const emails = value
          .split("\n")
          .map((email) => email.trim().toLowerCase())
          .filter((email) => email);

        const uniqueEmails = [...new Set(emails)];
        return emails.length === uniqueEmails.length;
      },
    ),
});

const ParticipantsTab = ({ participants = [], eventData, refetchEvent }) => {
  const { data: attendantsData, isLoading: isLoadingAttendants, error: attendantsError, refetch: refetchAttendants } = useGetAttendantsByEventQuery(eventData?.id, {
    skip: !eventData?.id
  });

  const actualParticipants = (attendantsData?.data || attendantsData)?.length > 0
    ? (attendantsData?.data || attendantsData)
    : eventData?.participants?.length > 0
      ? eventData.participants
      : participants?.length > 0
        ? participants
        : [];

  console.log('🔍 ParticipantsTab Debug:');
  console.log('eventData?.id:', eventData?.id);
  console.log('eventData?.participants:', eventData?.participants);
  console.log('attendantsData:', attendantsData);
  console.log('attendantsData?.data:', attendantsData?.data);
  console.log('participants (props):', participants);
  console.log('actualParticipants:', actualParticipants);

  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const [
    addParticipants,
    { errorAddParticipants, isErrorAddParticipants, isSuccessAddParticipants },
  ] = useAddParticipantsMutation();
  const [
    deleteParticipant,
    { errorDelParticipant, isErrorDelParticipant, isSuccessDelParticipant },
  ] = useDeleteParticipantMutation();
  const [
    deleteParticipants,
    { errorDelParticipants, isErrorDelParticipants, isSuccessDelParticipants },
  ] = useDeleteParticipantsMutation();

  const [
    assignManager,
    {
      error: errorAssignEventManager,
      isError: isErrorAssignEventManager,
      isSuccess: isSuccessAssignEventManager,
    },
  ] = useAssignEventManagerMutation();
  const [removeManager, { error: errorRemoveManager }] =
    useRemoveEventManagerMutation();

  const [uploadBanner, { isLoading: isUploadingBanner }] = useUploadBannerMutation();

  const handleBannerChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      await uploadBanner({ eventId: eventData.id, file }).unwrap();
      dispatch(openSnackbar({ message: "Tải lên banner thành công!" }));
      if (refetchEvent) refetchEvent();
    } catch (err) {
      dispatch(openSnackbar({ message: err?.data?.message || "Tải lên banner thất bại!", type: "error" }));
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(addParticipantsSchema),
    defaultValues: {
      emailList: "",
    },
  });

  const watchedEmailList = watch("emailList");

  const getStatusColor = (isCheckedIn) => {
    if (isCheckedIn) {
      return "text-green-600 bg-green-100";
    } else {
      return "text-blue-600 bg-blue-100";
    }
  };

  const filteredParticipants = actualParticipants.filter((participant) => {
    const matchesSearch =
      participant.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.userEmail?.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesFilter = true;
    if (filterStatus === "checked") {
      matchesFilter = participant.isCheckedIn === true;
    } else if (filterStatus === "registered") {
      matchesFilter = participant.isCheckedIn === false;
    }

    return matchesSearch && matchesFilter;
  });

  const handleSelectParticipant = (participantId) => {
    setSelectedParticipants((prev) =>
      prev.includes(participantId)
        ? prev.filter((id) => id !== participantId)
        : [...prev, participantId],
    );
  };

  const countValidEmails = (emailList) => {
    if (!emailList || !emailList.trim()) return 0;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailList
      .split("\n")
      .map((email) => email.trim())
      .filter((email) => email && emailRegex.test(email)).length;
  };

  const handleCloseModal = () => {
    reset();
    setShowAddModal(false);
  };

  const handleSelectAll = () => {
    if (selectedParticipants.length === filteredParticipants.length) {
      setSelectedParticipants([]);
    } else {
      setSelectedParticipants(filteredParticipants.map((p) => p.userId));
    }
  };

  const exportParticipantsToExcel = () => {
    if (!actualParticipants || actualParticipants.length === 0) {
      alert("Không có dữ liệu người tham gia để xuất!");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(actualParticipants);

    const headers = {
      userId: "ID",
      userName: "Họ tên",
      userEmail: "Email",
      userPhone: "Số điện thoại",
      joinedAt: "Ngày đăng ký",
      checkedTime: "Ngày điểm danh",
    };

    XLSX.utils.sheet_add_aoa(worksheet, [Object.values(headers)], {
      origin: "A1",
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Participants");

    XLSX.writeFile(workbook, `event_participants_${eventData?.title || 'event'}.xlsx`);
  };

  const onSubmit = async (data) => {
    try {
      const emails = data.emailList
        .split("\n")
        .filter((email) => email.trim())
        .map((email) => ({
          email: email.trim(),
        }));
      await addParticipants({ eventId: eventData.id, emails }).unwrap();
      handleCloseModal();
    } catch {
      //
    }
  };

  const handleDeleteParticipant = async (userId) => {
    try {
      await deleteParticipant({ eventId: eventData.id, userId }).unwrap();
    } catch {
      // Lỗi được xử lý trong useEffect
    }
  };

  const handleDeleteSelectedParticipants = async () => {
    try {
      const emails = selectedParticipants
        .map((userId) => {
          const participant = actualParticipants.find((p) => p.userId === userId);
          return participant ? { email: participant.userEmail } : null;
        })
        .filter((email) => email !== null);

      if (emails.length === 0) {
        dispatch(
          openSnackbar({
            message: "Không có người tham gia nào được chọn!",
            type: "error",
          }),
        );
        return;
      }

      await deleteParticipants({ eventId: eventData.id, emails }).unwrap();
      setSelectedParticipants([]);
    } catch {
      // Lỗi được xử lý trong useEffect
    }
  };

  const handleAssignStaffSingle = async (userId) => {
    try {
      await assignManager({
        event_id: eventData.id,
        user_id: userId,
        roleType: "STAFF",
      }).unwrap();
      if (refetchEvent) refetchEvent();
      if (refetchManagers) refetchManagers();
      dispatch(openSnackbar({ message: "Gán quyền staff thành công!" }));
    } catch (e) {
      dispatch(
        openSnackbar({
          message:
            e?.data?.message ||
            errorAssignEventManager?.data?.message ||
            "Có lỗi xảy ra khi gán quyền staff!",
          type: "error",
        }),
      );
    }
  };

  const handleRemoveStaffSingle = async (userId) => {
    try {
      await removeManager({
        event_id: eventData.id,
        user_id: userId,
      }).unwrap();
      if (refetchManagers) refetchManagers();
      if (refetchEvent) refetchEvent();
      dispatch(openSnackbar({ message: "Xóa staff thành công!" }));
    } catch (e) {
      dispatch(
        openSnackbar({
          message:
            e?.data?.message ||
            errorRemoveManager?.data?.message ||
            "Có lỗi xảy ra khi xóa staff!",
          type: "error",
        }),
      );
    }
  };

  const { data: managersData, refetch: refetchManagers } =
    useGetEventManagersByEventQuery(eventData.id);
  const staffIds = useMemo(() => {
    const managersArray = Array.isArray(managersData?.data)
      ? managersData.data
      : Array.isArray(managersData)
        ? managersData
        : [];

    return managersArray
      .filter(
        (manager) =>
          (manager.roleType ?? manager.role ?? manager.role_type) === "STAFF",
      )
      .map(
        (manager) =>
          manager.userId ?? manager.user_id ?? manager.id ?? manager.managerId,
      )
      .filter(Boolean)
      .map((id) => String(id));
  }, [managersData]);

  useEffect(() => {
    if (isSuccessAddParticipants) {
      dispatch(openSnackbar({ message: "Thêm người tham gia thành công!" }));

      if (refetchEvent) {
        refetchEvent();
      }
    }

    if (isErrorAddParticipants || errorAddParticipants) {
      dispatch(
        openSnackbar({
          message: errorAddParticipants?.data?.message,
          type: "error",
        }),
      );
    }

    if (isSuccessDelParticipant || isSuccessDelParticipants) {
      dispatch(openSnackbar({ message: "Xóa người tham gia thành công!" }));

      if (refetchEvent) {
        refetchEvent();
      }
    }

    if (
      isErrorDelParticipant ||
      errorDelParticipant ||
      isErrorDelParticipants ||
      errorDelParticipants
    ) {
      dispatch(
        openSnackbar({
          message: errorDelParticipant?.data?.message,
          type: "error",
        }),
      );
    }
  }, [
    isSuccessAddParticipants,
    isErrorAddParticipants,
    errorAddParticipants,
    dispatch,
    refetchEvent,
    errorAddParticipants?.data?.message,
    isSuccessDelParticipant,
    isSuccessDelParticipants,
    isErrorDelParticipant,
    errorDelParticipant,
    isErrorDelParticipants,
    errorDelParticipants,
  ]);

  return (
    <div className="space-y-6">
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="bg-opacity-30 absolute inset-0 bg-black backdrop-blur-sm transition-all duration-300 ease-out"
            onClick={handleCloseModal}
          />

          <div className="relative mx-4 w-full max-w-md transform transition-all duration-300 ease-out">
            <div className="rounded-3xl border border-white/20 bg-white/95 p-8 shadow-2xl ring-1 ring-black/5 backdrop-blur-md">
              <div className="mb-6 flex items-center justify-between">
                <h3
                  onClick={handleSubmit(onSubmit)}
                  className="text-xl font-bold text-gray-900"
                >
                  Thêm người tham gia
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-all duration-200 hover:bg-gray-100 hover:text-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <FontAwesomeIcon icon={faTimes} className="text-sm" />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="mb-3 block text-sm font-semibold text-gray-700">
                    Danh sách email (mỗi email một dòng)
                  </label>
                  <textarea
                    {...register("emailList")}
                    placeholder="example1@email.com&#10;example2@email.com&#10;example3@email.com"
                    rows={8}
                    className={`w-full resize-none rounded-xl border-2 px-4 py-3 transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:outline-none ${
                      errors.emailList
                        ? "border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-red-500/20"
                        : "border-gray-200 bg-gray-50/50 hover:border-gray-300"
                    }`}
                  />
                  {errors.emailList && (
                    <p className="mt-2 flex items-center text-sm text-red-600">
                      <span className="mr-2">⚠️</span>
                      {errors.emailList.message}
                    </p>
                  )}
                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      <span className="font-medium text-blue-600">
                        {countValidEmails(watchedEmailList)}
                      </span>{" "}
                      email hợp lệ
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="rounded-xl border-2 border-gray-200 px-6 py-2.5 text-gray-600 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 focus:ring-4 focus:ring-gray-500/20 focus:outline-none"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={
                      isSubmitting || countValidEmails(watchedEmailList) === 0
                    }
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-green-700 px-6 py-2.5 font-medium text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:from-green-700 hover:to-green-800 hover:shadow-xl focus:ring-4 focus:ring-green-500/30 focus:outline-none disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Đang thêm...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faUserPlus} />
                        Thêm ({countValidEmails(watchedEmailList)})
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between flex-wrap">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center flex-wrap">
            <div className="relative">
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400"
              />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên hoặc email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border-2 border-gray-200 py-2 pr-4 pl-10 transition-all duration-200 hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:outline-none sm:w-56"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-xl border-2 border-gray-200 px-3 py-2 transition-all duration-200 hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:outline-none"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="checked">Đã điểm danh</option>
              <option value="registered">Đã đăng ký</option>
            </select>
          </div>

          <div className="flex flex-row flex-wrap gap-2 items-center justify-start w-full sm:w-auto">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-green-700 px-3 py-2 font-medium text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:from-green-700 hover:to-green-800 hover:shadow-xl focus:ring-4 focus:ring-green-500/30 focus:outline-none"
              style={{ minWidth: 160 }}
            >
              <FontAwesomeIcon icon={faUserPlus} />
              Thêm người tham gia
            </button>
            <button
              onClick={exportParticipantsToExcel}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-3 py-2 font-medium text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl focus:ring-4 focus:ring-blue-500/30 focus:outline-none"
              style={{ minWidth: 120 }}
            >
              <FontAwesomeIcon icon={faDownload} />
              Xuất Excel
            </button>
            <button
              onClick={() => refetchAttendants()}
              disabled={isLoadingAttendants}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gray-600 to-gray-700 px-3 py-2 font-medium text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:from-gray-700 hover:to-gray-800 hover:shadow-xl focus:ring-4 focus:ring-gray-500/30 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FontAwesomeIcon icon={faRefresh} />
              {isLoadingAttendants ? 'Đang tải...' : 'Làm mới'}
            </button>
          </div>
        </div>
      </div>

      {/* DÒNG NÀY ĐÃ ĐƯỢC SỬA: xóa class `mt-6` */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-lg">
        <div className="border-b border-gray-200 bg-gray-50/50 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">
              Danh sách người tham gia ({filteredParticipants.length})
              {isLoadingAttendants && ' - Đang tải...'}

            </h3>
            {selectedParticipants.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-600">
                  Đã chọn {selectedParticipants.length} người
                </span>
                <button
                  onClick={handleDeleteSelectedParticipants}
                  disabled={isErrorDelParticipants}
                  className="rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-3 py-1.5 text-xs font-medium text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:from-red-600 hover:to-red-700 hover:shadow-lg focus:ring-4 focus:ring-red-500/30 focus:outline-none"
                >
                  <FontAwesomeIcon icon={faUserMinus} className="mr-1" />
                  Xóa đã chọn
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto max-h-96">
          <div className="min-w-max">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-6 py-4 text-left w-16">
                    <input
                      type="checkbox"
                      checked={
                        selectedParticipants.length ===
                          filteredParticipants.length &&
                        filteredParticipants.length > 0
                      }
                      onChange={handleSelectAll}
                      className="h-4 w-4 rounded border-2 border-gray-300 text-blue-600 transition-colors focus:ring-2 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase w-48">
                    Họ tên
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase w-64">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase w-32">
                    Số điện thoại
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase w-40">
                    Ngày đăng ký
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase w-32">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold tracking-wider text-gray-600 uppercase w-40">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {isLoadingAttendants ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      <div className="flex items-center justify-center">
                        <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-blue-600"></div>
                        <span className="ml-2 text-sm">Đang tải danh sách người tham gia...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredParticipants.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      <div className="text-center">
                        <div className="mb-2 text-3xl">👥</div>
                        <p className="text-base font-medium">Chưa có người tham gia nào</p>
                        <p className="text-xs text-gray-400">Hãy thêm người tham gia vào sự kiện</p>
                        <div className="mt-3 text-xs text-gray-500">
                          <p>Debug info:</p>
                          <p>actualParticipants length: {actualParticipants.length}</p>
                          <p>Raw attendantsData: {JSON.stringify(attendantsData)}</p>
                          <p>eventData?.id: {eventData?.id}</p>
                          <p>API URL: {eventData?.id ? `events/${eventData.id}/participants` : 'No event ID'}</p>
                          <p>eventData.participants: {eventData?.participants ? `${eventData.participants.length} items` : 'None'}</p>
                          <p>Data source: {(attendantsData?.data || attendantsData)?.length > 0 ? 'API' : eventData?.participants?.length > 0 ? 'Event Data' : participants?.length > 0 ? 'Props' : 'None'}</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredParticipants.map((participant) => (
                    <tr
                      key={participant.userId}
                      className="transition-all duration-200 hover:bg-blue-50/30"
                    >
                      <td className="px-6 py-4 w-16">
                        <input
                          type="checkbox"
                          checked={selectedParticipants.includes(
                            participant.userId,
                          )}
                          onChange={() =>
                            handleSelectParticipant(participant.userId)
                          }
                          className="h-4 w-4 rounded border-2 border-gray-300 text-blue-600 transition-colors focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap w-48">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 font-bold text-white shadow-md">
                              {participant.userName?.charAt(0)}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900">
                              {participant.userName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600 w-64">
                        {participant.userEmail}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600 w-32">
                        {participant.userPhone || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600 w-40">
                        {formatDateTime(participant.joinedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap w-32">
                        <div className="flex flex-col">
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(participant.isCheckedIn)}`}
                          >
                            {participant.isCheckedIn ? (
                              <>
                                <FontAwesomeIcon
                                  icon={faCheckCircle}
                                  className="mr-1.5"
                                />
                                Đã điểm danh
                              </>
                            ) : (
                              <>
                                <FontAwesomeIcon
                                  icon={faTimesCircle}
                                  className="mr-1.5"
                                />
                                Đã đăng ký
                              </>
                            )}
                          </span>
                          {participant.checkedTime && (
                            <div className="mt-1 text-center text-xs text-gray-500">
                              {formatDateTime(participant.checkedTime)}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap w-40">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() =>
                              handleDeleteParticipant(participant.userId)
                            }
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-red-500 transition-all duration-200 hover:bg-red-50 hover:text-red-700 focus:ring-2 focus:ring-red-500/20 focus:outline-none"
                          >
                            <FontAwesomeIcon icon={faUserMinus} />
                          </button>
                          {staffIds.includes(String(participant.userId)) ? (
                            <div className="group relative inline-flex h-8 w-28 items-center justify-center">
                              <span className="inline-flex h-8 w-28 items-center justify-center rounded border border-yellow-300 bg-yellow-100 text-xs font-semibold text-yellow-700">
                                STAFF
                              </span>
                              <button
                                onClick={() =>
                                  handleRemoveStaffSingle(participant.userId)
                                }
                                className="absolute -top-1 -right-1 hidden h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white group-hover:flex"
                                title="Xóa STAFF"
                              >
                                ×
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() =>
                                handleAssignStaffSingle(participant.userId)
                              }
                              className="inline-flex h-8 w-28 items-center justify-center rounded border border-blue-300 bg-blue-100 text-xs font-semibold text-blue-700 transition-all hover:bg-blue-200"
                              title="Gán quyền STAFF"
                            >
                              <FontAwesomeIcon
                                icon={faUserShield}
                                className="mr-1"
                              />
                              Thêm staff
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantsTab;