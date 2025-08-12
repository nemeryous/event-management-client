import React, { useEffect, useState } from "react";
import {
  faUserPlus,
  faUserMinus,
  faSearch,
  faDownload,
  faCheckCircle,
  faTimesCircle,
  faTimes,
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
} from "@api/attendantApi";
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

const ParticipantsTab = ({ participants, eventData, refetchEvent }) => {
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

  const filteredParticipants = participants.filter((participant) => {
    const matchesSearch =
      participant.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.userEmail.toLowerCase().includes(searchTerm.toLowerCase());

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
    if (!participants || participants.length === 0) {
      alert("Không có dữ liệu người tham gia để xuất!");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(participants);

    const headers = {
      id: "ID",
      name: "Họ tên",
      email: "Email",
      phone: "Số điện thoại",
      date: "Ngày đăng ký",
      checkedTime: "Ngày điểm danh",
    };

    XLSX.utils.sheet_add_aoa(worksheet, [Object.values(headers)], {
      origin: "A1",
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Participants");

    XLSX.writeFile(workbook, `event_participants.xlsx`);
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
          const participant = participants.find((p) => p.userId === userId);
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
    <div className="space-y-6 pb-0">
      {/* Add Participants Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 m-0 flex items-center justify-center">
          {/* Backdrop with smooth transition */}
          <div
            className="bg-opacity-30 absolute inset-0 bg-black backdrop-blur-sm transition-all duration-300 ease-out"
            onClick={handleCloseModal}
          />

          {/* Modal container */}
          <div className="relative mx-4 w-full max-w-md transform transition-all duration-300 ease-out">
            {/* Modal content with glassmorphism effect */}
            <div className="rounded-3xl border border-white/20 bg-white/95 p-8 shadow-2xl ring-1 ring-black/5 backdrop-blur-md">
              {/* Header */}
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

      {/* Controls */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
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
                className="w-full rounded-xl border-2 border-gray-200 py-2.5 pr-4 pl-10 transition-all duration-200 hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:outline-none sm:w-64"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-xl border-2 border-gray-200 px-4 py-2.5 transition-all duration-200 hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:outline-none"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="checked">Đã điểm danh</option>
              <option value="registered">Đã đăng ký</option>
            </select>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-green-700 px-4 py-2.5 font-medium text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:from-green-700 hover:to-green-800 hover:shadow-xl focus:ring-4 focus:ring-green-500/30 focus:outline-none"
            >
              <FontAwesomeIcon icon={faUserPlus} />
              Thêm người tham gia
            </button>
            <button
              onClick={exportParticipantsToExcel}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2.5 font-medium text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl focus:ring-4 focus:ring-blue-500/30 focus:outline-none"
            >
              <FontAwesomeIcon icon={faDownload} />
              Xuất Excel
            </button>
          </div>
        </div>
      </div>

      {/* Participants List */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg">
        <div className="border-b border-gray-200 bg-gray-50/50 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">
              Danh sách người tham gia ({filteredParticipants.length})
            </h3>
            {selectedParticipants.length > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-600">
                  Đã chọn {selectedParticipants.length} người
                </span>
                <button
                  onClick={handleDeleteSelectedParticipants}
                  disabled={isErrorDelParticipants}
                  className="rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:from-red-600 hover:to-red-700 hover:shadow-lg focus:ring-4 focus:ring-red-500/30 focus:outline-none"
                >
                  <FontAwesomeIcon icon={faUserMinus} className="mr-2" />
                  Xóa đã chọn
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left">
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
                <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                  Họ tên
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                  Số điện thoại
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                  Ngày đăng ký
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold tracking-wider text-gray-600 uppercase">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredParticipants.map((participant) => (
                <tr
                  key={participant.userId}
                  className="transition-all duration-200 hover:bg-blue-50/30"
                >
                  <td className="px-6 py-4">
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 font-bold text-white shadow-md">
                          {participant.userName.charAt(0)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-semibold text-gray-900">
                          {participant.userName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600">
                    {participant.userEmail}
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600">
                    {participant.userPhone || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600">
                    {formatDateTime(participant.joinedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
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
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    <button
                      onClick={() =>
                        handleDeleteParticipant(participant.userId)
                      }
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-red-500 transition-all duration-200 hover:bg-red-50 hover:text-red-700 focus:ring-2 focus:ring-red-500/20 focus:outline-none"
                    >
                      <FontAwesomeIcon icon={faUserMinus} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ParticipantsTab;
