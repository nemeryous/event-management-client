import React, { useState } from "react";
import {
  faQrcode,
  faUserPlus,
  faUserMinus,
  faUsers,
  faChartBar,
  faFileExport,
  faEdit,
  faCog,
  faCalendar,
  faMapMarkerAlt,
  faClock,
  faEye,
  faSearch,
  faDownload,
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

const EventManagementManage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedParticipants, setSelectedParticipants] = useState([]);

  // Mock data - thay thế bằng API calls thực tế
  const event = {
    id: 1,
    title: "Hội thảo Công nghệ AI 2024",
    startTime: "2024-12-15T09:00:00",
    endTime: "2024-12-15T17:00:00",
    location: "Hội trường A - Trường Đại học VKU",
    status: "UPCOMING",
    maxParticipants: 200,
    description: "Hội thảo về các xu hướng công nghệ AI mới nhất",
    banner: "/event-banner.jpg",
  };

  const participants = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      email: "a@vku.edu.vn",
      joinedAt: "2024-12-01T10:00:00",
      isCheckedIn: true,
      status: "confirmed",
    },
    {
      id: 2,
      name: "Trần Thị B",
      email: "b@vku.edu.vn",
      joinedAt: "2024-12-02T14:30:00",
      isCheckedIn: false,
      status: "confirmed",
    },
    {
      id: 3,
      name: "Lê Văn C",
      email: "c@vku.edu.vn",
      joinedAt: "2024-12-03T08:15:00",
      isCheckedIn: true,
      status: "pending",
    },
    {
      id: 4,
      name: "Phạm Thị D",
      email: "d@vku.edu.vn",
      joinedAt: "2024-12-04T16:45:00",
      isCheckedIn: false,
      status: "confirmed",
    },
    {
      id: 5,
      name: "Hoàng Văn E",
      email: "e@vku.edu.vn",
      joinedAt: "2024-12-05T11:20:00",
      isCheckedIn: true,
      status: "cancelled",
    },
  ];

  const stats = {
    totalRegistered: participants.length,
    checkedIn: participants.filter((p) => p.isCheckedIn).length,
    confirmed: participants.filter((p) => p.status === "confirmed").length,
    pending: participants.filter((p) => p.status === "pending").length,
    cancelled: participants.filter((p) => p.status === "cancelled").length,
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "text-green-600 bg-green-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "cancelled":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "confirmed":
        return "Đã xác nhận";
      case "pending":
        return "Chờ xử lý";
      case "cancelled":
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  const filteredParticipants = participants.filter((participant) => {
    const matchesSearch =
      participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || participant.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleSelectParticipant = (participantId) => {
    setSelectedParticipants((prev) =>
      prev.includes(participantId)
        ? prev.filter((id) => id !== participantId)
        : [...prev, participantId],
    );
  };

  const handleSelectAll = () => {
    if (selectedParticipants.length === filteredParticipants.length) {
      setSelectedParticipants([]);
    } else {
      setSelectedParticipants(filteredParticipants.map((p) => p.id));
    }
  };

  const tabs = [
    { id: "overview", label: "Tổng quan", icon: faChartBar },
    { id: "participants", label: "Người tham gia", icon: faUsers },
    { id: "checkin", label: "Điểm danh", icon: faQrcode },
    { id: "settings", label: "Cài đặt", icon: faCog },
  ];

  const quickActions = [
    {
      title: "QR Điểm danh",
      description: "Tạo và quản lý QR code điểm danh",
      icon: faQrcode,
      color: "from-blue-500 to-blue-600",
      action: () => console.log("Navigate to QR checkin"),
    },
    {
      title: "Thêm người tham gia",
      description: "Thêm người tham gia mới vào sự kiện",
      icon: faUserPlus,
      color: "from-green-500 to-green-600",
      action: () => console.log("Navigate to add participant"),
    },
    {
      title: "Xuất báo cáo",
      description: "Xuất danh sách và thống kê",
      icon: faFileExport,
      color: "from-purple-500 to-purple-600",
      action: () => console.log("Export report"),
    },
    {
      title: "Chỉnh sửa sự kiện",
      description: "Cập nhật thông tin sự kiện",
      icon: faEdit,
      color: "from-orange-500 to-orange-600",
      action: () => console.log("Navigate to edit event"),
    },
  ];

  const OverviewTab = () => (
    <div className="space-y-8">
      {/* Event Info */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
            <div className="relative h-48 bg-gradient-to-r from-blue-600 to-purple-600">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute bottom-4 left-6 text-white">
                <h1 className="mb-2 text-2xl font-bold">{event.title}</h1>
                <div className="flex items-center gap-4 text-sm opacity-90">
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faCalendar} />
                    <span>{formatDateTime(event.startTime)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6">
              <p className="leading-relaxed text-gray-600">
                {event.description}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {/* Quick Stats */}
          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <h3 className="mb-4 text-lg font-bold">Thống kê nhanh</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Đã đăng ký</span>
                <span className="font-bold text-blue-600">
                  {stats.totalRegistered}/{event.maxParticipants}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Đã check-in</span>
                <span className="font-bold text-green-600">
                  {stats.checkedIn}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Đã xác nhận</span>
                <span className="font-bold text-purple-600">
                  {stats.confirmed}
                </span>
              </div>
              <div className="mt-4 h-2 w-full rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
                  style={{
                    width: `${(stats.totalRegistered / event.maxParticipants) * 100}%`,
                  }}
                ></div>
              </div>
              <p className="text-center text-sm text-gray-500">
                {Math.round(
                  (stats.totalRegistered / event.maxParticipants) * 100,
                )}
                % đã đăng ký
              </p>
            </div>
          </div>

          {/* Status */}
          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <h3 className="mb-4 text-lg font-bold">Trạng thái sự kiện</h3>
            <div className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 font-medium text-blue-600">
                <FontAwesomeIcon icon={faClock} />
                Sắp diễn ra
              </div>
              <p className="mt-2 text-sm text-gray-500">Bắt đầu trong 5 ngày</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-2xl bg-white p-6 shadow-lg">
        <h3 className="mb-6 text-xl font-bold">Thao tác nhanh</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className="group relative transform rounded-xl border-2 border-gray-100 bg-white bg-gradient-to-br p-6 transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-xl"
            >
              <div
                className={`absolute inset-0 rounded-xl bg-gradient-to-br ${action.color} opacity-0 transition-opacity duration-300 group-hover:opacity-10`}
              ></div>
              <div className="relative z-10">
                <div
                  className={`h-12 w-12 rounded-full bg-gradient-to-br ${action.color} mb-4 flex items-center justify-center text-white transition-transform duration-300 group-hover:scale-110`}
                >
                  <FontAwesomeIcon icon={action.icon} className="text-lg" />
                </div>
                <h4 className="mb-2 font-bold text-gray-800">{action.title}</h4>
                <p className="text-sm text-gray-600 transition-colors duration-300 group-hover:text-gray-700">
                  {action.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const ParticipantsTab = () => (
    <div className="space-y-6">
      {/* Controls */}
      <div className="rounded-2xl bg-white p-6 shadow-lg">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
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
                className="w-64 rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="confirmed">Đã xác nhận</option>
              <option value="pending">Chờ xử lý</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700">
              <FontAwesomeIcon icon={faUserPlus} />
              Thêm người tham gia
            </button>
            <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
              <FontAwesomeIcon icon={faDownload} />
              Xuất Excel
            </button>
          </div>
        </div>
      </div>

      {/* Participants List */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">
              Danh sách người tham gia ({filteredParticipants.length})
            </h3>
            {selectedParticipants.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Đã chọn {selectedParticipants.length} người
                </span>
                <button className="rounded bg-red-600 px-3 py-1 text-sm text-white transition-colors hover:bg-red-700">
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
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      selectedParticipants.length ===
                        filteredParticipants.length &&
                      filteredParticipants.length > 0
                    }
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Họ tên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Ngày đăng ký
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Check-in
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredParticipants.map((participant) => (
                <tr
                  key={participant.id}
                  className="transition-colors hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedParticipants.includes(participant.id)}
                      onChange={() => handleSelectParticipant(participant.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 font-bold text-white">
                          {participant.name.charAt(0)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {participant.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                    {participant.email}
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                    {formatDateTime(participant.joinedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(participant.status)}`}
                    >
                      {getStatusText(participant.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {participant.isCheckedIn ? (
                      <span className="flex items-center gap-1 text-green-600">
                        <FontAwesomeIcon icon={faCheckCircle} />
                        Đã check-in
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-gray-500">
                        <FontAwesomeIcon icon={faTimesCircle} />
                        Chưa check-in
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button className="text-blue-600 transition-colors hover:text-blue-900">
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button className="text-green-600 transition-colors hover:text-green-900">
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button className="text-red-600 transition-colors hover:text-red-900">
                        <FontAwesomeIcon icon={faUserMinus} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const CheckinTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* QR Code Section */}
        <div className="rounded-2xl bg-white p-6 shadow-lg">
          <h3 className="mb-6 text-center text-xl font-bold">
            QR Code Điểm danh
          </h3>
          <div className="text-center">
            <div className="mb-4 inline-block rounded-2xl bg-gray-100 p-6">
              <div className="flex h-48 w-48 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white">
                <div className="text-center">
                  <FontAwesomeIcon
                    icon={faQrcode}
                    className="mb-2 text-6xl text-gray-400"
                  />
                  <p className="text-gray-500">QR Code sẽ hiển thị ở đây</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <button className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
                Tạo QR Code mới
              </button>
              <button className="w-full rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700">
                Tải xuống QR Code
              </button>
              <button className="w-full rounded-lg bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700">
                Chia sẻ QR Code
              </button>
            </div>
          </div>
        </div>

        {/* Recent Check-ins */}
        <div className="rounded-2xl bg-white p-6 shadow-lg">
          <h3 className="mb-6 text-xl font-bold">Check-in gần đây</h3>
          <div className="max-h-96 space-y-3 overflow-y-auto">
            {participants
              .filter((p) => p.isCheckedIn)
              .map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center gap-3 rounded-lg bg-green-50 p-3"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 font-bold text-white">
                    {participant.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {participant.name}
                    </p>
                    <p className="text-sm text-gray-500">{participant.email}</p>
                  </div>
                  <div className="text-green-600">
                    <FontAwesomeIcon icon={faCheckCircle} />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Check-in Stats */}
      <div className="rounded-2xl bg-white p-6 shadow-lg">
        <h3 className="mb-6 text-xl font-bold">Thống kê điểm danh</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <div className="rounded-xl bg-blue-50 p-4 text-center">
            <div className="mb-2 text-3xl font-bold text-blue-600">
              {stats.totalRegistered}
            </div>
            <div className="text-sm text-gray-600">Tổng đăng ký</div>
          </div>
          <div className="rounded-xl bg-green-50 p-4 text-center">
            <div className="mb-2 text-3xl font-bold text-green-600">
              {stats.checkedIn}
            </div>
            <div className="text-sm text-gray-600">Đã check-in</div>
          </div>
          <div className="rounded-xl bg-yellow-50 p-4 text-center">
            <div className="mb-2 text-3xl font-bold text-yellow-600">
              {stats.totalRegistered - stats.checkedIn}
            </div>
            <div className="text-sm text-gray-600">Chưa check-in</div>
          </div>
          <div className="rounded-xl bg-purple-50 p-4 text-center">
            <div className="mb-2 text-3xl font-bold text-purple-600">
              {Math.round((stats.checkedIn / stats.totalRegistered) * 100)}%
            </div>
            <div className="text-sm text-gray-600">Tỷ lệ check-in</div>
          </div>
        </div>
      </div>
    </div>
  );

  const SettingsTab = () => (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-lg">
        <h3 className="mb-6 text-xl font-bold">Cài đặt sự kiện</h3>
        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Tên sự kiện
            </label>
            <input
              type="text"
              value={event.title}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Mô tả
            </label>
            <textarea
              value={event.description}
              rows="4"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Thời gian bắt đầu
              </label>
              <input
                type="datetime-local"
                value={event.startTime.slice(0, 16)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Thời gian kết thúc
              </label>
              <input
                type="datetime-local"
                value={event.endTime.slice(0, 16)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Địa điểm
            </label>
            <input
              type="text"
              value={event.location}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Số lượng tối đa
            </label>
            <input
              type="number"
              value={event.maxParticipants}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end gap-4">
            <button className="rounded-lg border border-gray-300 px-6 py-2 text-gray-700 transition-colors hover:bg-gray-50">
              Hủy bỏ
            </button>
            <button className="rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700">
              Lưu thay đổi
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab />;
      case "participants":
        return <ParticipantsTab />;
      case "checkin":
        return <CheckinTab />;
      case "settings":
        return <SettingsTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Quản lý sự kiện
          </h1>
          <p className="text-gray-600">
            Quản lý và điều hành sự kiện của bạn một cách hiệu quả
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-1 rounded-xl bg-white p-1 shadow-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 rounded-lg px-6 py-3 font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? "scale-105 transform bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <FontAwesomeIcon icon={tab.icon} className="text-lg" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="transition-all duration-300">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default EventManagementManage;
