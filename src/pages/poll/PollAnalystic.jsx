import AdditionalPoll from "@components/poll/AdditionalPoll";
import EventBanner from "@components/poll/EventBanner";
import PollDashboard from "@components/poll/PollDashboard";
import QuestionSelectorPopUp from "@components/poll/QuestionSelector";
import StatisticsOverview from "@components/poll/StatisticsOverview";
import React, { useState } from "react";

const PollAnalystic = () => {
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  console.log(isOpenPopup)

  return (
    <div className="px-0 py-7">
      <div className="mx-auto max-w-[1200px] px-5">
        <h1 className="mb-8 text-center text-4xl font-bold text-[#e53935]">
          Thống kê bình chọn sự kiện
        </h1>
        <EventBanner />
        <StatisticsOverview />
        <PollDashboard />
        <AdditionalPoll openPopup={setIsOpenPopup} />

        {
          isOpenPopup && <QuestionSelectorPopUp closePopup={setIsOpenPopup}  />
        }
      </div>
    </div>
  );
};

export default PollAnalystic;
