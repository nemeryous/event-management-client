# Dashboard Improvements - Thống kê chi tiết dựa trên API

## Tổng quan

Đã cập nhật Dashboard để tính toán và hiển thị thống kê chi tiết dựa trên thông tin API thực tế từ backend.

## Các cải tiến chính

### 1. **Cập nhật dashboardStats.js**

#### Hàm `getEventStats()` mới:
- **Tính toán tỷ lệ trạng thái**: `statusRatio` với phần trăm chính xác
- **Thống kê theo tháng**: `monthlyStats` với dữ liệu chi tiết
- **Top địa điểm**: `topLocations` - 5 địa điểm phổ biến nhất
- **Thời gian trung bình**: `averageEventDuration` - thời gian trung bình của sự kiện
- **Xử lý trạng thái**: Hỗ trợ UPCOMING, ACTIVE/ONGOING, COMPLETED/ENDED, CANCELLED

#### Hàm `getMonthlyChartData()`:
- Tính toán thống kê theo tháng
- Phân loại theo trạng thái trong từng tháng
- Dữ liệu cho biểu đồ cột

#### Hàm `getPieChartData()`:
- Tạo dữ liệu cho biểu đồ tròn
- Tỷ lệ trạng thái sự kiện
- Hỗ trợ 4 trạng thái: Sắp diễn ra, Đang diễn ra, Đã kết thúc, Đã hủy

### 2. **Cập nhật Dashboard.jsx**

#### KPI Cards mở rộng:
- **7 thẻ thống kê** thay vì 6
- **Subtitle** hiển thị tỷ lệ phần trăm
- **Thêm thẻ "Đã hủy"** với màu xám

#### Biểu đồ cải tiến:
- **Bar chart**: Hiển thị 5 loại dữ liệu (Tổng, Sắp diễn ra, Đang diễn ra, Đã kết thúc, Đã hủy)
- **Pie chart**: Tỷ lệ trạng thái với 4 màu khác nhau
- **Responsive**: Tự động điều chỉnh theo kích thước màn hình

#### Bảng sự kiện cải tiến:
- **Thêm cột "Địa điểm"** cho desktop
- **Hiển thị địa điểm** trong mobile view
- **Cập nhật trạng thái** hỗ trợ "Đã hủy"

#### Thống kê chi tiết mới:
- **Thời gian trung bình** của sự kiện
- **Tỷ lệ sự kiện mở/đóng**
- **Top địa điểm phổ biến**

### 3. **Xử lý dữ liệu API**

#### Mapping dữ liệu:
```javascript
const mapEventToDisplay = (event) => {
  // Chuyển đổi từ API format sang display format
  return {
    id: event.id,
    name: event.title,           // API: title -> Display: name
    time: formatted_time,        // Từ startTime + endTime
    status: event.status,        // UPCOMING, ACTIVE, etc.
    location: event.location,    // Địa điểm
    // ... các trường khác
  };
};
```

#### Xử lý trạng thái:
- **Ưu tiên status từ API**
- **Fallback** tính toán dựa trên thời gian
- **Hỗ trợ đầy đủ** các trạng thái: UPCOMING, ACTIVE/ONGOING, COMPLETED/ENDED, CANCELLED

## Dữ liệu API được sử dụng

### Từ ảnh API:
```json
{
  "id": 1,
  "title": "Hội thảo Công nghệ AI 2025",
  "description": "Sự kiện giới thiệu các xu hướng mới nhất...",
  "startTime": "2025-07-01T09:00:00",
  "endTime": "2025-07-01T17:00:00",
  "location": "Trung tâm Hội nghị Quốc gia, Hà Nội",
  "status": "UPCOMING",
  "enabled": true,
  "createdBy": 1,
  "createdAt": "2025-06-25T15:39:13"
}
```

### Các trường được tính toán:
- **Thời gian trung bình**: Từ `startTime` và `endTime`
- **Tỷ lệ trạng thái**: Từ `status`
- **Thống kê theo tháng**: Từ `startTime`
- **Top địa điểm**: Từ `location`

## Kết quả

### Thống kê hiển thị:
1. **Tổng sự kiện**: Số lượng tất cả sự kiện
2. **Đang diễn ra**: Sự kiện có status ACTIVE/ONGOING
3. **Sắp diễn ra**: Sự kiện có status UPCOMING
4. **Đã kết thúc**: Sự kiện có status COMPLETED/ENDED
5. **Đang mở**: Sự kiện có enabled = true
6. **Đã đóng**: Sự kiện có enabled = false
7. **Đã hủy**: Sự kiện có status CANCELLED

### Biểu đồ:
- **Bar chart**: Thống kê theo tháng với 5 loại dữ liệu
- **Pie chart**: Tỷ lệ trạng thái với 4 màu
- **Responsive**: Tự động điều chỉnh

### Bảng dữ liệu:
- **Desktop**: Bảng đầy đủ với 7 cột
- **Mobile**: Card view với thông tin tóm tắt
- **Filtering**: Theo thời gian, trạng thái, tên, người tạo

## Lợi ích

1. **Thống kê chính xác**: Dựa trên dữ liệu API thực tế
2. **Hiển thị đầy đủ**: 7 KPI cards với thông tin chi tiết
3. **Biểu đồ trực quan**: Bar chart và Pie chart với nhiều dữ liệu
4. **Responsive design**: Hoạt động tốt trên mọi thiết bị
5. **Filtering mạnh mẽ**: Lọc theo nhiều tiêu chí
6. **Thống kê chi tiết**: Thời gian trung bình, tỷ lệ, top địa điểm 