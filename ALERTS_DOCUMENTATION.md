# Hệ thống Thông báo & Cảnh báo - Dựa trên dữ liệu API thực tế

## Tổng quan

Hệ thống thông báo đã được cập nhật để tự động tạo ra các thông báo dựa trên dữ liệu API thực tế thay vì sử dụng dữ liệu dummy.

## Các loại thông báo

### 1. **Sắp diễn ra (upcoming)**
- **Điều kiện**: 5 sự kiện sắp diễn ra gần nhất (sắp xếp theo thời gian)
- **Icon**: 📅 (FiCalendar)
- **Màu**: Xanh lá (#2e7d32)
- **Ví dụ**: "Sự kiện 'Hội thảo AI' sẽ diễn ra sau 2 ngày 3 giờ"

### 2. **Sắp bắt đầu (soon)**
- **Điều kiện**: Sự kiện sẽ bắt đầu trong vòng 2 giờ tới
- **Icon**: ⏰ (FiClock)
- **Màu**: Vàng (#ffd012)
- **Ví dụ**: "Sự kiện 'Workshop Marketing' sẽ bắt đầu sau 30 phút!"

### 3. **Tỷ lệ tham gia thấp (low)**
- **Điều kiện**: Sự kiện có tỷ lệ tham gia dưới 30%
- **Icon**: 📉 (FiTrendingDown)
- **Màu**: Đỏ (#c52032)
- **Ví dụ**: "Sự kiện 'Workshop Marketing' có tỷ lệ tham gia thấp (25%)."

### 4. **Vượt quá giới hạn (over)**
- **Điều kiện**: Sự kiện có số người tham gia vượt quá 100
- **Icon**: 👥 (FiUsers)
- **Màu**: Xanh dương (#223b73)
- **Ví dụ**: "Sự kiện 'Triển lãm Nghệ thuật' đã vượt quá giới hạn người tham gia!"

### 5. **Đã hủy (cancelled)**
- **Điều kiện**: Sự kiện có trạng thái CANCELLED
- **Icon**: ❌ (FiX)
- **Màu**: Xám (#6c757d)
- **Ví dụ**: "Sự kiện 'Hội thảo Blockchain' đã bị hủy."

### 6. **Sắp kết thúc (ending)**
- **Điều kiện**: Sự kiện sẽ kết thúc trong vòng 1 giờ tới
- **Icon**: ⏰ (FiClock)
- **Màu**: Xanh dương nhạt (#1976d2)
- **Ví dụ**: "Sự kiện 'Workshop React' sẽ kết thúc sau 30 phút."

### 7. **Thông tin chung (info)**
- **Điều kiện**: Khi không có thông báo cụ thể, hiển thị thống kê chung
- **Icon**: ℹ️ (FiInfo)
- **Màu**: Xám nhạt (#374151)
- **Ví dụ**: "Có 5 sự kiện sắp diễn ra trong tương lai."

## Logic tạo thông báo

### Hàm `generateAlerts(events)`

```javascript
const generateAlerts = (events) => {
  const alerts = [];
  const now = dayjs();
  
  // 1. Lấy 5 sự kiện sắp diễn ra gần nhất
  const upcomingEvents = events
    .filter(ev => {
      const startTime = dayjs(ev.startTime);
      return startTime.isAfter(now) && ev.status === 'UPCOMING';
    })
    .sort((a, b) => dayjs(a.startTime).diff(dayjs(b.startTime)))
    .slice(0, 5);
  
  // Thêm thông báo cho các sự kiện sắp diễn ra
  upcomingEvents.forEach(ev => {
    const startTime = dayjs(ev.startTime);
    const timeDiff = startTime.diff(now, 'hour', true);
    
    let timeMessage = '';
    if (timeDiff < 1) {
      const minutes = Math.round(timeDiff * 60);
      timeMessage = `${minutes} phút`;
    } else if (timeDiff < 24) {
      const hours = Math.round(timeDiff);
      timeMessage = `${hours} giờ`;
    } else {
      const days = Math.floor(timeDiff / 24);
      const hours = Math.round(timeDiff % 24);
      timeMessage = `${days} ngày ${hours} giờ`;
    }
    
    alerts.push({
      type: "upcoming",
      message: `Sự kiện '${ev.name}' sẽ diễn ra sau ${timeMessage}`,
      event: ev,
      timeRemaining: timeDiff
    });
  });
  
  // 2. Kiểm tra sự kiện sắp bắt đầu (trong 2 giờ)
  const soonEvents = events.filter(ev => {
    const startTime = dayjs(ev.startTime);
    const timeDiff = startTime.diff(now, 'hour', true);
    return timeDiff > 0 && timeDiff <= 2;
  });
  
  // 3. Kiểm tra tỷ lệ tham gia thấp
  const lowParticipationEvents = events.filter(ev => {
    const rate = parseInt(ev.rate) || 0;
    return rate > 0 && rate < 30;
  });
  
  // 4. Kiểm tra sự kiện đã hủy
  const cancelledEvents = events.filter(ev => ev.status === 'CANCELLED');
  
  // 5. Kiểm tra vượt quá giới hạn
  const overCapacityEvents = events.filter(ev => {
    const participants = ev.participants || 0;
    return participants > 100;
  });
  
  // 6. Kiểm tra sắp kết thúc
  const endingSoonEvents = events.filter(ev => {
    const endTime = dayjs(ev.endTime);
    const timeDiff = endTime.diff(now, 'hour', true);
    return timeDiff > 0 && timeDiff <= 1;
  });
  
  // 7. Fallback: thông tin chung
  if (alerts.length === 0) {
    // Hiển thị thống kê chung
  }
  
  return alerts.slice(0, 5); // Giới hạn 5 thông báo
};
```

## Component AlertItem

### Tính năng:
- **Icon động**: Mỗi loại thông báo có icon riêng
- **Màu sắc phân biệt**: Mỗi loại có màu nền và chữ khác nhau
- **Border accent**: Viền bên trái với màu tương ứng
- **Hover effect**: Hiệu ứng shadow khi hover
- **Responsive**: Tự động điều chỉnh theo kích thước màn hình

### Cấu trúc:
```jsx
<AlertItem alert={alert} />
```

## Lợi ích

### 1. **Thông tin thực tế**
- Dựa trên dữ liệu API thực tế
- Cập nhật tự động khi dữ liệu thay đổi
- Không còn dữ liệu dummy

### 2. **Phân loại rõ ràng**
- 7 loại thông báo khác nhau
- Màu sắc và icon phân biệt
- Dễ dàng nhận biết mức độ quan trọng

### 3. **Thông tin hữu ích**
- **5 sự kiện sắp diễn ra gần nhất** với thời gian còn lại
- Cảnh báo sự kiện sắp bắt đầu (trong 2 giờ)
- Thông báo tỷ lệ tham gia thấp
- Cảnh báo vượt quá giới hạn
- Thông báo sự kiện đã hủy
- Cảnh báo sắp kết thúc

### 4. **Fallback thông minh**
- Khi không có thông báo cụ thể
- Hiển thị thống kê chung
- Đảm bảo luôn có thông tin hữu ích

## Cấu hình

### Ngưỡng có thể điều chỉnh:
- **Sắp diễn ra**: 2 giờ
- **Tỷ lệ tham gia thấp**: 30%
- **Vượt quá giới hạn**: 100 người
- **Sắp kết thúc**: 1 giờ
- **Giới hạn thông báo**: 5 thông báo

### Màu sắc:
- **Upcoming**: Xanh lá (#2e7d32)
- **Soon**: Vàng (#ffd012)
- **Low**: Đỏ (#c52032)
- **Over**: Xanh dương (#223b73)
- **Cancelled**: Xám (#6c757d)
- **Ending**: Xanh dương nhạt (#1976d2)
- **Info**: Xám nhạt (#374151) 