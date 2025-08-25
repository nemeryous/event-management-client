import React from 'react';
import { FiAlertCircle, FiClock, FiUsers, FiX, FiInfo, FiTrendingDown } from 'react-icons/fi';

const AlertItem = ({ alert }) => {
  const getAlertConfig = (type) => {
    switch(type) {
      case 'upcoming':
        return {
          icon: <FiCalendar />,
          bgColor: 'bg-[#e8f5e8]',
          textColor: 'text-[#2e7d32]',
          borderColor: 'border-[#2e7d32]'
        };
      case 'soon':
        return {
          icon: <FiClock />,
          bgColor: 'bg-[#fffbe6]',
          textColor: 'text-[#ffd012]',
          borderColor: 'border-[#ffd012]'
        };
      case 'low':
        return {
          icon: <FiTrendingDown />,
          bgColor: 'bg-[#ffeaea]',
          textColor: 'text-[#c52032]',
          borderColor: 'border-[#c52032]'
        };
      case 'over':
        return {
          icon: <FiUsers />,
          bgColor: 'bg-[#fff7e6]',
          textColor: 'text-[#223b73]',
          borderColor: 'border-[#223b73]'
        };
      case 'cancelled':
        return {
          icon: <FiX />,
          bgColor: 'bg-[#f8f9fa]',
          textColor: 'text-[#6c757d]',
          borderColor: 'border-[#6c757d]'
        };
      case 'ending':
        return {
          icon: <FiClock />,
          bgColor: 'bg-[#e3f2fd]',
          textColor: 'text-[#1976d2]',
          borderColor: 'border-[#1976d2]'
        };
      case 'info':
      default:
        return {
          icon: <FiInfo />,
          bgColor: 'bg-[#f3f4f6]',
          textColor: 'text-[#374151]',
          borderColor: 'border-[#374151]'
        };
    }
  };

  const config = getAlertConfig(alert.type);

  return (
    <li className={`flex items-center gap-3 px-3 py-2 rounded-lg border-l-4 ${config.bgColor} ${config.borderColor} text-sm transition-all hover:shadow-sm`}>
      <div className={`text-lg ${config.textColor}`}>
        {config.icon}
      </div>
      <span className="flex-1">{alert.message}</span>
    </li>
  );
};

export default AlertItem; 