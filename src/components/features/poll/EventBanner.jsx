import React from "react";
import StatItem from "./StatItem";
import { formatTimestampToDate } from "@utils/helpers";

const EventBanner = ({ eventData }) => {
  return (
    <div className="mb-[30px] rounded-2xl bg-gradient-to-br from-[#e53935] to-[#ff6f61] p-[30px] text-white shadow-[0_8px_32px_rgba(229,57,53,0.3)]">
      <div className="grid grid-cols-1 items-center gap-5 text-center md:grid-cols-[1fr_auto] md:text-left">
        <div className="">
          <h2 className="mb-3 text-3xl">{eventData?.name}</h2>
          <div className="flex gap-5 text-sm opacity-90">
            <span>
              📅 {formatTimestampToDate(eventData?.startTime)} -{" "}
              {formatTimestampToDate(eventData?.endTime)}
            </span>
            <span>📍 {eventData?.location}</span>
            <span>👥 Tối đa {eventData?.maxParticipants} người</span>
          </div>
        </div>
        <div className="flex justify-center gap-[30px] text-center md:justify-start">
          <StatItem statNumber={eventData?.maxParticipants} statLabel="Người tham gia" />
        </div>
      </div>
    </div>
  );
};

export default EventBanner;
