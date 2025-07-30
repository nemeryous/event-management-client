import React, { useMemo } from "react";
import EventInfo from "./EventInfo";
import ButtonComponent from "@components/common/ButtonComponent";
import StatCard from "./StatCard";

const QRDisplay = ({ qrData }) => {

  const imageUrl = useMemo(() => {
    if (!qrData || !(qrData instanceof Blob)) {
      return null;
    }

    try {
      return URL.createObjectURL(qrData);
    } catch (error) {
      console.error("Failed to create object URL", error);
      return null;
    }
  }, [qrData]);

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

        <EventInfo />
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
