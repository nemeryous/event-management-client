import { useGetEventByIdQuery, useJoinEventMutation } from "@api/eventApi";
import Loading from "@components/common/Loading";
import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { openSnackbar } from "@store/slices/snackbarSlice";
import {
  formatDateTime,
  formatJoinedTime,
  getStatusColor,
  getStatusText,
} from "@utils/helpers";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

const EventDetailUser = () => {
  const { id } = useParams();
  const { data: event, isLoading, error } = useGetEventByIdQuery(id);
  const dispatch = useDispatch();
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const currentParticipants = event?.participants?.length || 0;
  const remainingSlots = (event?.maxParticipants || 0) - currentParticipants;

  const isEventPassed = new Date(event?.startTime) < new Date();
  const canRegister =
    event?.status === "UPCOMING" && !isEventPassed && !event?.isRegistered;

  const [
    joinEvent,
    { isLoading: isJoining, error: joinError, isSuccess: isJoined },
  ] = useJoinEventMutation();

  const handleJoinEvent = async (qrJoinToken) => {
    try {
      await joinEvent(qrJoinToken).unwrap();
    } catch {
      // ignore error
    }
  };

  if (isJoining) {
    dispatch(
      openSnackbar({ message: "Đang tham gia sự kiện...", type: "info" }),
    );
  }

  if (isJoined) {
    dispatch(
      openSnackbar({ message: "Tham gia sự kiện thành công", type: "success" }),
    );
  }

  if (joinError) {
    dispatch(
      openSnackbar({
        message: joinError?.data?.message || "Không thể tham gia sự kiện",
        type: "error",
      }),
    );
  }

  if (isLoading) {
    return <Loading message={"Đang tải thông tin sự kiện..."} />;
  }

  if (error) {
    return (
      <Error
        message={
          error?.data?.message ||
          "Không thể tải thông tin sự kiện. Vui lòng thử lại sau."
        }
      />
    );
  }

  if (!event) {
    return (
      <div className="my-7.5 flex min-h-[400px] items-center justify-center">
        <div className="rounded-2xl bg-gray-50 p-8 text-center">
          <div className="mb-4 text-6xl">📋</div>
          <h2 className="mb-2 text-xl font-bold text-gray-600">
            Không tìm thấy sự kiện
          </h2>
          <p className="text-gray-500">Sự kiện không tồn tại hoặc đã bị xóa.</p>
        </div>
      </div>
    );
  }

  const description = event?.description || "Chưa có mô tả sự kiện";
  const shouldShowExpandButton = description.length > 200;

  return (
    <div className="my-7.5 grid grid-cols-1 gap-7.5 md:grid-cols-[2fr_1fr]">
      <div className="overflow-hidden rounded-2xl bg-white shadow">
        <div className="relative h-[200px] overflow-hidden md:h-[300px]">
          <img
            src={
              event?.banner
                ? `${import.meta.env.VITE_BASE_URL}/events/${event.banner}`
                : "https://via.placeholder.com/800x300?text=Event+Banner"
            }
            alt="banner"
            className="h-full w-full object-cover"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/800x300?text=Event+Banner";
            }}
          />
          <div
            className={`absolute top-5 right-5 rounded-[20px] px-4 py-2 text-sm font-bold ${getStatusColor(event?.status || "UPCOMING")}`}
          >
            {getStatusText(event?.status || "UPCOMING")}
          </div>
        </div>

        <div className="p-7">
          <h1 className="text-secondary mb-5 text-2xl font-bold md:text-3xl">
            {event?.name || "Tên sự kiện"}
          </h1>

          <div className="mb-7 grid grid-cols-1 gap-5 md:grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
            <div className="border-primary flex items-center gap-3 rounded-[10px] border border-l-4 bg-[#f8f9fa] p-4 duration-300 hover:translate-x-1 hover:bg-[#e9ecef]">
              <div className="bg-primary flex h-10 w-10 items-center justify-center rounded-full text-white">
                📅
              </div>
              <div>
                <h4 className="mb-1 font-bold text-[#333]">
                  Thời gian bắt đầu
                </h4>
                <p className="text-sm text-[#666]">
                  {event?.startTime
                    ? formatDateTime(event.startTime)
                    : "Chưa có thông tin"}
                </p>
              </div>
            </div>
            <div className="border-primary flex items-center gap-3 rounded-[10px] border border-l-4 bg-[#f8f9fa] p-4 duration-300 hover:translate-x-1 hover:bg-[#e9ecef]">
              <div className="bg-primary flex h-10 w-10 items-center justify-center rounded-full text-white">
                🏁
              </div>
              <div>
                <h4 className="mb-1 font-bold text-[#333]">
                  Thời gian kết thúc
                </h4>
                <p className="text-sm text-[#666]">
                  {event?.endTime
                    ? formatDateTime(event.endTime)
                    : "Chưa có thông tin"}
                </p>
              </div>
            </div>
            <div className="border-primary flex items-center gap-3 rounded-[10px] border border-l-4 bg-[#f8f9fa] p-4 duration-300 hover:translate-x-1 hover:bg-[#e9ecef]">
              <div className="bg-primary flex h-10 w-10 items-center justify-center rounded-full text-white">
                📍
              </div>
              <div>
                <h4 className="mb-1 font-bold text-[#333]">Địa điểm</h4>
                <p className="text-sm text-[#666]">
                  {event?.location || "Chưa có thông tin địa điểm"}
                </p>
              </div>
            </div>
            <div className="border-primary flex items-center gap-3 rounded-[10px] border border-l-4 bg-[#f8f9fa] p-4 duration-300 hover:translate-x-1 hover:bg-[#e9ecef]">
              <div className="bg-primary flex h-10 w-10 items-center justify-center rounded-full text-white">
                👥
              </div>
              <div>
                <h4 className="mb-1 font-bold text-[#333]">
                  Số lượng tham gia
                </h4>
                <p className="text-sm text-[#666]">
                  {currentParticipants} / {event?.maxParticipants || 0} người
                </p>
              </div>
            </div>
          </div>

          <div className="mb-7 rounded-[10px] bg-[#f8f9fa] p-6">
            <h3 className="text-secondary mb-4 text-xl font-bold">
              Mô tả sự kiện
            </h3>
            <div className="relative">
              <p
                className={`leading-[1.8] whitespace-pre-wrap text-[#666] ${
                  !isDescriptionExpanded && shouldShowExpandButton
                    ? "line-clamp-4"
                    : ""
                }`}
              >
                {description}
              </p>
              {shouldShowExpandButton && (
                <div className="mt-4 text-center">
                  <button
                    onClick={() =>
                      setIsDescriptionExpanded(!isDescriptionExpanded)
                    }
                    className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-blue-600 shadow-sm transition-all hover:bg-blue-50 hover:text-blue-700 hover:shadow-md"
                  >
                    {isDescriptionExpanded ? (
                      <>
                        Thu gọn
                        <FontAwesomeIcon
                          icon={faArrowUp}
                          className="h-4 w-4 transition-transform"
                        />
                      </>
                    ) : (
                      <>
                        Xem thêm
                        <FontAwesomeIcon
                          icon={faArrowDown}
                          className="h-4 w-4 transition-transform"
                        />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="flex flex-col gap-6">
        {/* Registration Section */}
        <div className="rounded-2xl bg-white p-6 shadow">
          <h3 className="text-secondary mb-5 flex items-center gap-2 text-xl leading-1.5 font-bold">
            🎯 Đăng ký tham gia
          </h3>

          {event?.isUserRegistered ? (
            <div className="text-center">
              <div className="mb-4 rounded-full bg-green-100 px-4 py-3 font-bold text-green-800">
                ✅ Đã đăng ký
              </div>
              <p className="text-sm text-[#666]">
                Bạn đã đăng ký tham gia sự kiện này
              </p>
            </div>
          ) : remainingSlots > 0 ? (
            <>
              <button
                onClick={() => handleJoinEvent(event.qrJoinToken)}
                className={`${canRegister ? "bg-primary text-white hover:translate-y-0.5" : "bg-gray-400 text-gray-900"} group relative w-full cursor-pointer overflow-hidden rounded-full border-none p-4 text-sm font-bold transition-all hover:opacity-90`}
                disabled={!canRegister}
              >
                Đăng ký ngay
              </button>
              <p className="mt-4 text-center text-sm text-[#666]">
                Còn lại {remainingSlots} suất tham gia
              </p>
              {isEventPassed && (
                <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-center text-xs text-amber-600">
                  ⚠️ Sự kiện đã qua, không thể đăng ký
                </p>
              )}
            </>
          ) : (
            <div className="text-center">
              <div className="mb-4 rounded-full bg-red-100 px-4 py-3 font-bold text-red-800">
                Đã hết chỗ
              </div>
              <p className="text-sm text-[#666]">
                Sự kiện đã đạt số lượng tối đa
              </p>
            </div>
          )}
        </div>

        {/* Manager Section */}
        <div className="rounded-2xl bg-white p-6 shadow">
          <h3 className="text-secondary mb-5 flex items-center gap-2 text-xl leading-1.5 font-bold">
            👨‍💼 Người quản lý
          </h3>
          {event?.manager && event.manager.length > 0 ? (
            <div className="space-y-3">
              {event?.manager?.map((manager, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 rounded-[10px] bg-[#f8f9fa] p-4"
                >
                  <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-full font-bold text-white">
                    {manager.userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="mb-1 font-bold text-[#333]">
                      {manager.userName}
                    </h4>
                    <p className="text-sm text-[#666]">
                      📧 {manager.userEmail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-[#666]">
              Chưa có thông tin người quản lý
            </p>
          )}
        </div>

        {/* Secretaries Section */}
        {event?.secretaries && event.secretaries.length > 0 && (
          <div className="rounded-2xl bg-white p-6 shadow">
            <h3 className="text-secondary mb-5 flex items-center gap-2 text-xl leading-1.5 font-bold">
              📝 Thư ký
            </h3>
            <div className="space-y-3">
              {event?.secretaries?.map((secretary, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 rounded-[10px] bg-[#f8f9fa] p-4"
                >
                  <div className="bg-secondary flex h-12 w-12 items-center justify-center rounded-full font-bold text-white">
                    {secretary.userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="mb-1 font-bold text-[#333]">
                      {secretary.userName}
                    </h4>
                    <p className="text-sm text-[#666]">
                      📧 {secretary.userEmail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Participants Section */}
        <div className="rounded-2xl bg-white p-6 shadow">
          <h3 className="text-secondary mb-5 flex items-center gap-2 text-xl leading-1.5 font-bold">
            👥 Danh sách tham gia ({currentParticipants})
          </h3>
          <div className="max-h-72 overflow-y-auto">
            {event?.participants && event.participants.length > 0 ? (
              event?.participants?.map((participant, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 border-b border-b-[#f0f0f0] p-2 hover:bg-[#f8f9fa]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-300 font-bold text-gray-600">
                    {participant.userName.charAt(0).toUpperCase()}
                  </div>
                  <div className="participant-info">
                    <h4 className="mb-0.5 text-sm font-bold text-[#333]">
                      {participant.userName}
                    </h4>
                    <p className="text-[12px] text-[#666]">
                      Đã đăng ký lúc {formatJoinedTime(participant.joinedAt)}
                    </p>
                    {participant.isCheckedIn && (
                      <p className="text-[12px] font-semibold text-green-600">
                        ✓ Đã check-in
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="py-4 text-center text-sm text-[#666]">
                Chưa có người tham gia
              </p>
            )}
          </div>
        </div>

        {/* Documents Section */}
        {event?.urlDocs && (
          <div className="rounded-2xl bg-white p-6 shadow">
            <h3 className="text-secondary mb-5 flex items-center gap-2 text-xl leading-1.5 font-bold">
              📊 Tài liệu sự kiện
            </h3>
            <div className="mb-5">
              <a
                href={event?.urlDocs}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:border-secondary mb-2 flex items-center gap-3 rounded-md border border-[#e9ecef] bg-white p-3 transition-all hover:translate-x-1 hover:bg-[#f8f9fa]"
              >
                <div className="bg-accent flex h-9 w-9 items-center justify-center rounded-[5px] text-sm text-[#333]">
                  📄
                </div>
                <div>
                  <h4 className="font-bold">Tài liệu chính thức</h4>
                  <p className="text-sm text-blue-600">Nhấn để mở tài liệu</p>
                </div>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetailUser;
