import React from "react";
import EventInfo from "./EventInfo";
import ButtonComponent from "@components/common/ButtonComponent";
import StatCard from "./StatCard";
import { useGetAttendantsByEventQuery } from "@api/attendantApi";
import { useParams } from "react-router-dom";
import { check } from "prettier";

const StatDisplay = ({ attendants = [] }) => {
  console.log(attendants);
  const totalAttendants = attendants.length || 0;
  const surveyCount = 0;

  const checkedAttendants = attendants.filter(
    (attendant) => attendant.checkedTime !== null,
  ).length;

  const participationRate = totalAttendants
    ? `${Math.round((checkedAttendants / totalAttendants).toFixed(2) * 100)}%`
    : "0%";
  console.log(participationRate);
  return (
    <div className="flex items-center justify-between px-0 py-4">
      <div className="rounded-[20px] bg-white p-10 text-center shadow-[0_10px_30px_rgba(0,0,0,0.1)] transition-transform duration-300 ease-in-out">
        <div className="mb-[30px] rounded-2xl bg-[#f8f9fa] p-[30px]">
          <h3 className="mb-5 flex items-center gap-[10px] text-[1.3rem] font-bold text-[#1e88e5]">
            <span class="flex h-5 w-5 items-center justify-center text-[#1e88e5]">
              📊
            </span>
            Thống kê tham gia
          </h3>
          <div class="mt-[30px] grid grid-cols-2 gap-5">
            <StatCard statLabel={"Đã tham gia"} statNumber={totalAttendants} />
            <StatCard statLabel={"Đã đăng kí"} statNumber={checkedAttendants} />
            <StatCard
              statLabel={"Tỉ lệ tham gia"}
              statNumber={participationRate}
            />
            <StatCard statLabel={"Khảo sát"} statNumber={surveyCount} />
          </div>
        </div>

        {/* <EventInfo /> */}
        <div className="mt-[30px] grid grid-cols-2 gap-[15px]">
          <ButtonComponent
            btnColor={"white"}
            btnBackground={"primary"}
            icon={"👥"}
            title={"Danh sách"}
            hoverColor={"#c62828"}
            hoverRgba={"229, 57, 53, 0.4"}
          />
          <ButtonComponent
            btnColor={"white"}
            btnBackground={"secondary"}
            icon={"📋"}
            title={"Quản lý khảo sát"}
            hoverColor={"#c62828"}
            hoverRgba={"229, 57, 53, 0.4"}
          />
          <ButtonComponent
            btnColor={"white"}
            btnBackground={"accent"}
            icon={"📊"}
            title={"Báo cáo chi tiết"}
            hoverColor={"#c62828"}
            hoverRgba={"229, 57, 53, 0.4"}
          />
        </div>
      </div>
    </div>
  );
};

export default StatDisplay;
