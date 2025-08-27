// Hàm tính toán thống kê cho dashboard admin từ danh sách sự kiện
// events: mảng các sự kiện lấy từ API
import { mapBackendStatusToFrontend } from './eventHelpers';

export function getEventStats(events) {
  if (!Array.isArray(events)) return {
    total: 0,
    upcoming: 0,
    ongoing: 0,
    ended: 0,
    enabled: 0,
    disabled: 0,
    statusRatio: {
      upcoming: 0,
      ongoing: 0,
      ended: 0,
      cancelled: 0
    },
    monthlyStats: [],
    topLocations: [],
    participationRate: 0,
    averageEventDuration: 0
  };

  const now = new Date();
  let upcoming = 0, ongoing = 0, ended = 0, enabled = 0, disabled = 0, cancelled = 0;
  let totalDuration = 0;
  let locationCounts = {};
  let monthlyData = {};

  events.forEach(ev => {
    // Check enabled status
    if (ev.enabled) enabled++; else disabled++;
    
    // Map backend status to frontend display format
    const displayStatus = mapBackendStatusToFrontend(ev.status);
    
    // Count by status
    switch(displayStatus) {
      case 'upcoming':
        upcoming++;
        break;
      case 'ongoing':
        ongoing++;
        break;
      case 'completed':
        ended++;
        break;
      case 'cancelled':
        cancelled++;
        break;
      default:
        // Fallback to time-based calculation
        const start = new Date(ev.startTime);
        const end = new Date(ev.endTime);
        if (end < now) {
          ended++;
        } else if (start > now) {
          upcoming++;
        } else {
          ongoing++;
        }
    }
    
    // Calculate event duration
    const start = new Date(ev.startTime);
    const end = new Date(ev.endTime);
    const duration = (end - start) / (1000 * 60 * 60); // hours
    totalDuration += duration;
    
    // Count locations
    if (ev.location) {
      locationCounts[ev.location] = (locationCounts[ev.location] || 0) + 1;
    }
    
    // Monthly statistics
    const monthKey = start.toISOString().slice(0, 7); // YYYY-MM format
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = {
        month: monthKey,
        count: 0,
        totalDuration: 0,
        upcoming: 0,
        ongoing: 0,
        ended: 0,
        cancelled: 0
      };
    }
    monthlyData[monthKey].count++;
    monthlyData[monthKey].totalDuration += duration;
    
    // Count status by month
    switch(displayStatus) {
      case 'upcoming':
        monthlyData[monthKey].upcoming++;
        break;
      case 'ongoing':
        monthlyData[monthKey].ongoing++;
        break;
      case 'completed':
        monthlyData[monthKey].ended++;
        break;
      case 'cancelled':
        monthlyData[monthKey].cancelled++;
        break;
    }
  });

  // Calculate ratios
  const total = events.length;
  const statusRatio = {
    upcoming: total > 0 ? (upcoming / total * 100).toFixed(1) : 0,
    ongoing: total > 0 ? (ongoing / total * 100).toFixed(1) : 0,
    ended: total > 0 ? (ended / total * 100).toFixed(1) : 0,
    cancelled: total > 0 ? (cancelled / total * 100).toFixed(1) : 0
  };

  // Convert monthly data to array and sort
  const monthlyStats = Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));

  // Top locations
  const topLocations = Object.entries(locationCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([location, count]) => ({ location, count }));

  // Average event duration
  const averageEventDuration = events.length > 0 ? (totalDuration / events.length).toFixed(1) : 0;

  // Participation rate (assuming this is calculated elsewhere or from different API)
  const participationRate = 0; // Placeholder - would need separate API call

  return {
    total,
    upcoming,
    ongoing,
    ended,
    enabled,
    disabled,
    cancelled,
    statusRatio,
    monthlyStats,
    topLocations,
    participationRate,
    averageEventDuration
  };
}

// Hàm tính toán thống kê theo tháng cho biểu đồ
export function getMonthlyChartData(events) {
  if (!Array.isArray(events)) return [];

  const monthlyData = {};
  
  events.forEach(ev => {
    const start = new Date(ev.startTime);
    const monthKey = start.toISOString().slice(0, 7); // YYYY-MM format
    
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = {
        month: monthKey,
        count: 0,
        upcoming: 0,
        ongoing: 0,
        ended: 0,
        cancelled: 0
      };
    }
    
    monthlyData[monthKey].count++;
    
    // Map backend status to frontend display format
    const displayStatus = mapBackendStatusToFrontend(ev.status);
    
    switch(displayStatus) {
      case 'upcoming':
        monthlyData[monthKey].upcoming++;
        break;
      case 'ongoing':
        monthlyData[monthKey].ongoing++;
        break;
      case 'completed':
        monthlyData[monthKey].ended++;
        break;
      case 'cancelled':
        monthlyData[monthKey].cancelled++;
        break;
    }
  });

  return Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));
}

// Hàm tính toán dữ liệu cho biểu đồ tròn
export function getPieChartData(events) {
  if (!Array.isArray(events)) return [];

  const statusCounts = {
    'Sắp diễn ra': 0,
    'Đang diễn ra': 0,
    'Đã kết thúc': 0,
    'Đã hủy': 0
  };

  events.forEach(ev => {
    // Map backend status to frontend display format
    const displayStatus = mapBackendStatusToFrontend(ev.status);
    
    switch(displayStatus) {
      case 'upcoming':
        statusCounts['Sắp diễn ra']++;
        break;
      case 'ongoing':
        statusCounts['Đang diễn ra']++;
        break;
      case 'completed':
        statusCounts['Đã kết thúc']++;
        break;
      case 'cancelled':
        statusCounts['Đã hủy']++;
        break;
    }
  });

  return [
    { id: "Sắp diễn ra", label: "Sắp diễn ra", value: statusCounts['Sắp diễn ra'], color: "#ffd012" },
    { id: "Đang diễn ra", label: "Đang diễn ra", value: statusCounts['Đang diễn ra'], color: "#c52032" },
    { id: "Đã kết thúc", label: "Đã kết thúc", value: statusCounts['Đã kết thúc'], color: "#223b73" },
    { id: "Đã hủy", label: "Đã hủy", value: statusCounts['Đã hủy'], color: "#6c757d" }
  ].filter(item => item.value > 0);
}
