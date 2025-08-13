export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

export function getStatusText(status) {
  const statusMap = {
    upcoming: "Sắp diễn ra",
    ongoing: "Đang diễn ra",
    completed: "Đã kết thúc",
    cancelled: "Đã hủy"
  };
  return statusMap[status] || status;
}

// Mapping từ backend enum sang frontend display
export function mapBackendStatusToFrontend(backendStatus) {
  const statusMap = {
    "UPCOMING": "upcoming",
    "ONGOING": "ongoing", 
    "COMPLETED": "completed",
    "CANCELLED": "cancelled"
  };
  return statusMap[backendStatus] || "upcoming";
}

// Mapping từ frontend display sang backend enum
export function mapFrontendStatusToBackend(frontendStatus) {
  const statusMap = {
    "upcoming": "UPCOMING",
    "ongoing": "ONGOING",
    "completed": "COMPLETED", 
    "cancelled": "CANCELLED"
  };
  return statusMap[frontendStatus] || "UPCOMING";
}

// Cắt bớt description nếu quá dài
export function truncateDescription(description, maxLength = 400) {
  if (!description) return "";
  if (description.length <= maxLength) return description;
  return description.substring(0, maxLength) + "...";
}

// Cắt bớt title nếu quá dài
export function truncateTitle(title, maxLength = 50) {
  if (!title) return "";
  if (title.length <= maxLength) return title;
  return title.substring(0, maxLength) + "...";
}

export function formatTimeRemaining(hours) {
  if (hours < 1) {
    const minutes = Math.round(hours * 60);
    return `${minutes} phút`;
  } else if (hours < 24) {
    const roundedHours = Math.round(hours);
    return `${roundedHours} giờ`;
  } else {
    const days = Math.floor(hours / 24);
    const remainingHours = Math.round(hours % 24);
    return `${days} ngày ${remainingHours} giờ`;
  }
}
