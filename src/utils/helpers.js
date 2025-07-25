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
