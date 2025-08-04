import EventBanner from "@components/poll/EventBanner";
import PollDashboard from "@components/poll/PollDashboard";
import StatisticsOverview from "@components/poll/StatisticsOverview";
import React from "react";

const PollPage = () => {
  return (
    <main className="px-0 py-7">
      <div className="mx-auto my-0 max-w-[1200px] px-5 py-0">
        <h1 className="mb-7 text-center text-[2.5rem] font-bold text-[#e53935]">
          Thống kê bình chọn sự kiện
        </h1>

        <EventBanner />
        <StatisticsOverview />
        <PollDashboard />
      </div>
    </main>
  );
};

export default PollPage;
