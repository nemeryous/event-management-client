import React from "react";
import ParticipantCard from "./ParticipantCard";
import Participant from "./Participant";
import PollItem from "./PollItem";
import PollCard from "./PollCard";

const PollDashboard = () => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="space-y-6 rounded-xl bg-white p-6 shadow-md">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            Kết quả bình chọn chi tiết
          </h3>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-600">
            Đang diễn ra
          </span>
        </div>
        <PollItem
          question="Bạn có giới thiệu cho bạn bè không?"
          type="Lựa chọn đơn • 287 phản hồi"
          options={[
            {
              label: "Chắc chắn có",
              percent: 65.9,
              votes: 189,
              color: "blue-600",
            },
            { label: "Có thể", percent: 23.3, votes: 67, color: "pink-500" },
            {
              label: "Không chắc",
              percent: 7.3,
              votes: 21,
              color: "indigo-500",
            },
            { label: "Không", percent: 3.5, votes: 10, color: "purple-500" },
          ]}
        />

        <PollItem
          question="Mức độ hài lòng tổng thể?"
          type="Lựa chọn đơn • 287 phản hồi"
          options={[
            {
              label: "Rất hài lòng",
              percent: 49.5,
              votes: 142,
              color: "blue-600",
            },
            { label: "Hài lòng", percent: 34.1, votes: 98, color: "pink-500" },
            {
              label: "Trung bình",
              percent: 11.1,
              votes: 32,
              color: "indigo-500",
            },
            { label: "Kém", percent: 5.2, votes: 15, color: "purple-500" },
          ]}
        />
      </div>

      <div className="space-y-6 rounded-xl bg-white p-6 shadow-md">
        <Participant
          name="Nguyễn Văn An"
          email="an.nguyen@email.com"
          votes="5"
        />
        <Participant
          name="Trần Thị Bình"
          email="binh.tran@email.com"
          votes="4"
        />
        <Participant
          name="Lê Hoàng Cường"
          email="cuong.le@email.com"
          votes="5"
        />
        <Participant
          name="Phạm Thị Diệu"
          email="dieu.pham@email.com"
          votes="3"
        />
        <Participant name="Võ Minh Tuấn" email="tuan.vo@email.com" votes="5" />
        <Participant name="Đỗ Thị Lan" email="lan.do@email.com" votes="2" />
        <Participant
          name="Nguyễn Thanh Hải"
          email="hai.nguyen@email.com"
          votes="4"
        />
      </div>
    </div>
  );
};

export default PollDashboard;
