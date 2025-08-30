import { getDisplayStatus } from "@utils/eventHelpers";
import React from "react";

const statusStyles = {
  UPCOMING: {
    text: "Sắp diễn ra",
    classes: "bg-yellow-100 text-yellow-800",
  },
  ONGOING: {
    text: "Đang diễn ra",
    classes: "bg-green-100 text-green-800",
  },
  COMPLETED: {
    text: "Đã kết thúc",
    classes: "bg-gray-100 text-gray-800",
  },
  CANCELLED: {
    text: "Đã bị hủy",
    classes: "bg-red-100 text-red-800",
  },
  UNKNOWN: {
    text: "Không xác định",
    classes: "bg-gray-100 text-gray-500",
  },
};

const EventStatusBadge = ({ event }) => {
  const displayStatus = getDisplayStatus(event);

  const style = statusStyles[displayStatus] || statusStyles.UNKNOWN;

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${style.classes}`}
    >
      {style.text}
    </span>
  );
};

export default EventStatusBadge;
