import { useGetEventByIdQuery } from "@api/eventApi";
import { useGetPollStatByEventIdQuery } from "@api/pollApi";
import AdditionalPoll from "@components/poll/AdditionalPoll";
import EventBanner from "@components/poll/EventBanner";
import PollDashboard from "@components/poll/PollDashboard";
import QuestionSelectorPopUp from "@components/poll/QuestionSelector";
import StatisticsOverview from "@components/poll/StatisticsOverview";
import React, { useState } from "react";
import { useParams } from "react-router-dom";

const PollAnalystic = () => {
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [selectedPoll, setSelectedPoll] = useState(null);
  const eventId = useParams().eventId;
  const { data: eventData = [] } = useGetEventByIdQuery(eventId);
  const { data: pollsData = [] } = useGetPollStatByEventIdQuery(eventId);
  // console.log(pollsData);
  console.log(selectedPoll)

  return (
    <div className="px-0 py-7">
      <div className="mx-auto max-w-[1200px] px-5">
        <h1 className="mb-8 text-center text-4xl font-bold text-[#e53935]">
          Thống kê bình chọn sự kiện
        </h1>
        <EventBanner eventData={eventData} />
        <StatisticsOverview participantsNumber={eventData?.maxParticipants} />
        <PollDashboard pollsData={pollsData} />
        <AdditionalPoll
          openPopup={setIsOpenPopup}
          selectedPoll={selectedPoll}
        />

        {isOpenPopup && (
          <QuestionSelectorPopUp
            closePopup={setIsOpenPopup}
            pollsData={pollsData}
            setSelectedPoll={setSelectedPoll}
          />
        )}
      </div>
    </div>
  );
};

export default PollAnalystic;
