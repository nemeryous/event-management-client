import EventBanner from "@components/poll/EventBanner";
import PollDashboard from "@components/poll/PollDashboard";
import StatisticsOverview from "@components/poll/StatisticsOverview";
import React from "react";

const PollAnalystic = () => {
  return (
    <div className="px-0 py-7">
      <div className="mx-auto max-w-[1200px] px-5">
        <h1 className="mb-8 text-center text-4xl font-bold text-[#e53935]">
          Thống kê bình chọn sự kiện
        </h1>
        <EventBanner />
        <StatisticsOverview />
        <PollDashboard />
      </div>
    </div>
  );
};

export default PollAnalystic;
