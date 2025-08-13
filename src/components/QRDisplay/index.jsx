import React, { useMemo } from "react";
import EventInfo from "./EventInfo";
import ButtonComponent from "@components/common/ButtonComponent";
import StatCard from "./StatCard";
import { useParams } from "react-router-dom";
import { useGetEventByIdQuery, useGetEventQRQuery } from "@api/eventApi";
import dayjs from "dayjs";

const QRDisplay = ({participants=0}) => {
  const eventId = useParams().id;

  const { data = {}, isLoading, isError, error } = useGetEventQRQuery(eventId);
  const {
    data: eventData = {},
    isLoading: isEventLoading,
    isError: isEventError,
    error: eventError,
  } = useGetEventByIdQuery(eventId);

  // console.log({ eventData });

  const startTime = dayjs(eventData?.startTime).format("HH:mm DD-MM-YYYY");
  const endTime = dayjs(eventData?.endTime).format("HH:mm DD-MM-YYYY");
  // console.log({ startTime, endTime });
  const imageUrl = useMemo(() => {
    if (!data || !(data instanceof Blob)) {
      return null;
    }

    try {
      return URL.createObjectURL(data);
    } catch (error) {
      console.error("Failed to create object URL", error);
      return null;
    }
  }, [data]);

  return (
    <div className="flex items-center justify-between px-0 py-4">
      <div className="rounded-[20px] bg-white p-10 text-center shadow-[0_10px_30px_rgba(0,0,0,0.1)] transition-transform duration-300 ease-in-out">
        <div className="relative mx-auto mb-5 flex h-[300px] w-[300px] items-center justify-center overflow-hidden rounded-[15px] border-[4px] border-yellow-400 bg-blue-600 text-[1.5rem] font-bold text-white">
          {!imageUrl ? (
            <p className="text-xl text-white">Đang tải mã QR...</p>
          ) : (
            <img
              src={imageUrl}
              alt="QR Code"
              className="h-full w-full object-contain"
            />
          )}
        </div>

        <EventInfo
          name={eventData.title}
          address={eventData.location}
          startTime={startTime}
          endTime={endTime}
          participants={participants}
        />
        <div className="mt-[30px] grid grid-cols-2 gap-[15px]">
          <ButtonComponent
            btnColor={"white"}
            btnBackground={"primary"}
            icon={"📱"}
            title={"Tải mã QR"}
            hoverColor={"#c62828"}
            hoverRgba={"229, 57, 53, 0.4"}
          />
          <ButtonComponent
            btnColor={"white"}
            btnBackground={"secondary"}
            icon={"🔄"}
            title={"Làm mới mã QR"}
            hoverColor={"#c62828"}
            hoverRgba={"229, 57, 53, 0.4"}
          />
          <ButtonComponent
            btnColor={"white"}
            btnBackground={"accent"}
            icon={"📋"}
            title={"Sao chép liên kết"}
            hoverColor={"#c62828"}
            hoverRgba={"229, 57, 53, 0.4"}
          />
        </div>
      </div>
    </div>
  );
};

export default QRDisplay;
