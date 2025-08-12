import React, { useEffect, useRef, useState } from "react";
import { faQrcode, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import QRCodeStyling from "qr-code-styling";
import { useDispatch } from "react-redux";
import { openSnackbar } from "@store/slices/snackbarSlice";

const CheckinTab = ({ eventData, participants, stats, refetchEvent }) => {
  const dispatch = useDispatch();
  const qrRef = useRef(null);
  const [qrCode, setQrCode] = useState(null);

  useEffect(() => {
    const qr = new QRCodeStyling({
      width: 192, // 48 * 4 (phù hợp với h-48 w-48)
      height: 192,
      data: eventData.qrJoinToken
        ? `${window.location.origin}/events/check-in/${eventData.qrJoinToken}`
        : "default-token",
      image: "/mini-logo.png",
      margin: 8,
      qrOptions: {
        typeNumber: 0,
        mode: "Byte",
        errorCorrectionLevel: "Q", // Đảm bảo quét được khi có logo
      },
      imageOptions: {
        hideBackgroundDots: true,
        imageSize: 0.3, // Logo chiếm 30% mã QR
        margin: 4,
      },
      dotsOptions: {
        color: "#000000",
        type: "rounded",
      },
      backgroundOptions: {
        color: "#ffffff",
      },
    });

    setQrCode(qr);
    if (qrRef.current) {
      qr.append(qrRef.current);
    }

    return () => {
      if (qrRef.current) {
        qrRef.current.innerHTML = ""; // Dọn dẹp khi unmount
      }
    };
  }, [eventData.qrJoinToken]);

  const handleDownloadQR = () => {
    if (qrCode) {
      qrCode.download({
        name: `QR_Checkin_${eventData.id}`,
        extension: "png",
      });
    }
  };

  const handleShareQR = async () => {
    if (!qrCode) return;

    try {
      // Tạo Data URL từ mã QR
      const blob = await qrCode.getRawData("png");
      const file = new File([blob], `QR_Checkin_${eventData.id}.png`, {
        type: "image/png",
      });

      // Sử dụng Web Share API
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `QR Code điểm danh - ${eventData.name}`,
          text: `Sử dụng mã QR này để điểm danh tại sự kiện ${eventData.name}!`,
        });
        dispatch(
          openSnackbar({
            message: "Chia sẻ QR Code thành công!",
            type: "success",
          }),
        );
      } else {
        dispatch(
          openSnackbar({
            message: "Trình duyệt không hỗ trợ chia sẻ hoặc không có QR Code!",
            type: "error",
          }),
        );
      }
    } catch {
      dispatch(
        openSnackbar({
          message: "Chia sẻ QR Code thất bại!",
          type: "error",
        }),
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* QR Code Section */}
        <div className="rounded-2xl bg-white p-6 shadow-lg">
          <h3 className="mb-6 text-center text-xl font-bold">
            QR Code Điểm danh
          </h3>
          <div className="text-center">
            <div className="mb-4 inline-block rounded-2xl bg-gray-100 p-6">
              <div
                ref={qrRef}
                className="flex h-48 w-48 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white"
              >
                {!eventData.qrJoinToken && (
                  <div className="text-center">
                    <FontAwesomeIcon
                      icon={faQrcode}
                      className="mb-2 text-6xl text-gray-400"
                    />
                    <p className="text-gray-500">QR Code sẽ hiển thị ở đây</p>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-3">
              <button
                onClick={refetchEvent}
                className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
              >
                Tạo QR Code mới
              </button>
              <button
                onClick={handleDownloadQR}
                disabled={!qrCode || !eventData.qrJoinToken}
                className="w-full rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
              >
                Tải xuống QR Code
              </button>
              <button
                onClick={handleShareQR}
                disabled={!qrCode || !eventData.qrJoinToken}
                className="w-full rounded-lg bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700"
              >
                Chia sẻ QR Code
              </button>
            </div>
          </div>
        </div>

        {/* Recent Check-ins */}
        {/* <div className="rounded-2xl bg-white p-6 shadow-lg">
          <h3 className="mb-6 text-xl font-bold">Check-in gần đây</h3>
          <div className="max-h-96 space-y-3 overflow-y-auto">
            {participants
              .filter((p) => p.isCheckedIn)
              .map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center gap-3 rounded-lg bg-green-50 p-3"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 font-bold text-white">
                    {participant.name?.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {participant.name}
                    </p>
                    <p className="text-sm text-gray-500">{participant.email}</p>
                  </div>
                  <div className="text-green-600">
                    <FontAwesomeIcon icon={faCheckCircle} />
                  </div>
                </div>
              ))}
          </div>
        </div> */}
      </div>

      {/* Check-in Stats */}
      <div className="rounded-2xl bg-white p-6 shadow-lg">
        <h3 className="mb-6 text-xl font-bold">Thống kê điểm danh</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <div className="rounded-xl bg-blue-50 p-4 text-center">
            <div className="mb-2 text-3xl font-bold text-blue-600">
              {stats.totalRegistered}
            </div>
            <div className="text-sm text-gray-600">Tổng đăng ký</div>
          </div>
          <div className="rounded-xl bg-green-50 p-4 text-center">
            <div className="mb-2 text-3xl font-bold text-green-600">
              {stats.checkedIn}
            </div>
            <div className="text-sm text-gray-600">Đã check-in</div>
          </div>
          <div className="rounded-xl bg-yellow-50 p-4 text-center">
            <div className="mb-2 text-3xl font-bold text-yellow-600">
              {stats.totalRegistered - stats.checkedIn}
            </div>
            <div className="text-sm text-gray-600">Chưa check-in</div>
          </div>
          <div className="rounded-xl bg-purple-50 p-4 text-center">
            <div className="mb-2 text-3xl font-bold text-purple-600">
              {Math.round((stats.checkedIn / stats.totalRegistered) * 100)}%
            </div>
            <div className="text-sm text-gray-600">Tỷ lệ check-in</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckinTab;
