export const formatTimestampToDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // tháng bắt đầu từ 0
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

export const formatTimestampToTime = (dateString) => {
  const date = new Date(dateString);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
};

export const getTimeUntilEvent = (eventStartTime) => {
  const now = new Date();
  const eventDate = new Date(eventStartTime);
  const diffTime = eventDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > 0) {
    return `Còn ${diffDays} ngày`;
  } else if (diffDays === 0) {
    return "Hôm nay";
  } else {
    return "Đã qua";
  }
};

export const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return "";
  const date = new Date(dateTimeString);

  if (isNaN(date.getTime())) return "Ngày không hợp lệ";

  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Ho_Chi_Minh",
  });
};

export const getStatusText = (status) => {
  const statusMap = {
    UPCOMING: "Sắp diễn ra",
    ONGOING: "Đang diễn ra",
    COMPLETED: "Đã kết thúc",
    CANCELLED: "Đã hủy",
  };
  return statusMap[status] || "Không xác định";
};

export const getStatusColor = (status) => {
  const colorMap = {
    UPCOMING: "bg-blue-100 text-blue-800",
    ONGOING: "bg-green-100 text-green-800",
    COMPLETED: "bg-gray-100 text-gray-800",
    CANCELLED: "bg-red-100 text-red-800",
  };
  return colorMap[status] || "bg-gray-100 text-gray-800";
};

export const formatJoinedTime = (joinedAt) => {
  const date = new Date(joinedAt);
  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getPollState = (startTime, endTime) => {
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (now < start) {
    return "UPCOMING";
  }
  if (now >= start && now <= end) {
    return "ACTIVE";
  }
  return "ENDED";
};
