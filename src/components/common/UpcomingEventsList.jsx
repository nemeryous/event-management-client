import React from 'react';
import dayjs from 'dayjs';
import { FiCalendar, FiClock, FiMapPin, FiUsers } from 'react-icons/fi';

const UpcomingEventsList = ({ events }) => {
  const now = dayjs();
  
  // Get upcoming events sorted by start time
  const upcomingEvents = events
    .filter(ev => {
      const startTime = dayjs(ev.startTime);
      return startTime.isAfter(now) && ev.status === 'UPCOMING';
    })
    .sort((a, b) => dayjs(a.startTime).diff(dayjs(b.startTime)))
    .slice(0, 5);

  const formatTimeRemaining = (startTime) => {
    const timeDiff = dayjs(startTime).diff(now, 'hour', true);
    
    if (timeDiff < 1) {
      const minutes = Math.round(timeDiff * 60);
      return `${minutes} phút`;
    } else if (timeDiff < 24) {
      const hours = Math.round(timeDiff);
      return `${hours} giờ`;
    } else {
      const days = Math.floor(timeDiff / 24);
      const hours = Math.round(timeDiff % 24);
      return `${days} ngày ${hours} giờ`;
    }
  };

  const getPriorityColor = (startTime) => {
    const timeDiff = dayjs(startTime).diff(now, 'hour', true);
    
    if (timeDiff <= 2) return 'text-red-600 bg-red-50 border-red-200';
    if (timeDiff <= 24) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  if (upcomingEvents.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        <FiCalendar className="mx-auto text-2xl mb-2" />
        <p>Không có sự kiện sắp diễn ra</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <FiCalendar className="text-[#2e7d32] text-lg" />
        <h3 className="font-semibold text-[#2e7d32]">Sự kiện sắp diễn ra</h3>
      </div>
      
      {upcomingEvents.map((event, index) => (
        <div 
          key={event.id} 
          className={`p-3 rounded-lg border ${getPriorityColor(event.startTime)} transition-all hover:shadow-md`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-semibold text-sm mb-1">{event.name}</h4>
              <div className="flex items-center gap-4 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <FiClock className="text-[#2e7d32]" />
                  <span>{dayjs(event.startTime).format('DD/MM/YYYY HH:mm')}</span>
                </div>
                {event.location && (
                  <div className="flex items-center gap-1">
                    <FiMapPin className="text-[#2e7d32]" />
                    <span>{event.location}</span>
                  </div>
                )}
                {event.participants > 0 && (
                  <div className="flex items-center gap-1">
                    <FiUsers className="text-[#2e7d32]" />
                    <span>{event.participants} người</span>
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold">
                {formatTimeRemaining(event.startTime)}
              </div>
              <div className="text-xs text-gray-500">
                {index === 0 ? 'Tiếp theo' : `#${index + 1}`}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UpcomingEventsList; 