import EventBanner from "@components/poll/EventBanner";
import PollDashboard from "@components/poll/PollDashboard";
import StatisticsOverview from "@components/poll/StatisticsOverview";
import React from "react";

const PollAnalystic = () => {
  return (
    <div className="px-0 py-7">
      <div className='"max-w-[1200px] mx-auto px-5'>
        <h1 className="mb-8 text-center text-4xl font-bold text-[#e53935]">
          Thống kê bình chọn sự kiện
          <EventBanner />
          <StatisticsOverview />
          <PollDashboard />
        </h1>
      </div>
    </div>
  );
};

export default PollAnalystic;
