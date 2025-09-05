import { useGetEventByIdQuery, useJoinEventMutation } from "@api/eventApi";
import Loading from "@components/common/Loading";
import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { openSnackbar } from "@store/slices/snackbarSlice";
import Error from "@components/common/Error";
import {
  formatDateTime,
  formatJoinedTime,
  getPollState,
} from "../../utils/helpers";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useGetPollsByEventQuery } from "@api/pollApi";
import PollPageUser from "./PollPageUser";
import EventStatusBadge from "@components/user/EventStatusBadge";
import { useCancelMyRegistrationMutation } from "@api/attendantApi";
import { getDisplayStatus } from "@utils/eventHelpers";

const PollStatusBadge = ({ status }) => {
  switch (status) {
    case "UPCOMING":
      return (
        <span className="rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-medium text-yellow-800">
          Sắp diễn ra
        </span>
      );
    case "ENDED":
      return (
        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-800">
          Đã kết thúc
        </span>
      );
    default:
      return (
        <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-800">
          Đang diễn ra
        </span>
      );
  }
};

const PollActionButton = ({ status, poll, handleOpenPoll }) => {
  switch (status) {
    case "UPCOMING":
      return (
        <button
          className="cursor-not-allowed rounded-md bg-gray-300 px-4 py-2 text-sm font-semibold text-gray-600"
          disabled
        >
          Sắp diễn ra
        </button>
      );
    case "ENDED":
      return (
        <button
          className="cursor-not-allowed rounded-md bg-gray-300 px-4 py-2 text-sm font-semibold text-gray-600"
          disabled
        >
          Đã kết thúc
        </button>
      );
    default: // ONGOING
      return (
        <button
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-105 hover:bg-blue-700"
          onClick={() => handleOpenPoll(poll.id)}
        >
          Bình chọn
        </button>
      );
  }
};

const EventDetailUser = () => {
  const { eventId } = useParams();
  const { data: event, isLoading, error } = useGetEventByIdQuery(eventId);
  const { data: polls, isLoading: isLoadingPolls } =
    useGetPollsByEventQuery(eventId);
  const { user: authUser } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [showPollModal, setShowPollModal] = useState(false);
  const [selectedPollId, setSelectedPollId] = useState(null);

  const [
    joinEvent,
    { isLoading: isJoining, error: joinError, isSuccess: isJoinedSuccess },
  ] = useJoinEventMutation();

  const [
    cancelRegistration,
    { isLoading: isCancelling, isSuccess: isCancelSuccess, error: cancelError },
  ] = useCancelMyRegistrationMutation();

  const currentParticipants = event?.participants?.length || 0;
  const remainingSlots =
    (event?.maxParticipants || Infinity) - currentParticipants;
  const isFull = remainingSlots <= 0;
  const canInteract = getDisplayStatus(event) === "UPCOMING";
  const isLoadingAction = isJoining || isCancelling;

  const handleJoinEvent = async () => {
    try {
      await joinEvent(event.qrJoinToken).unwrap();
    } catch {
      // ignore error
    }
  };

  const handleCancelRegistration = async () => {
    if (!authUser?.id) return;
    try {
      await cancelRegistration(eventId).unwrap();
    } catch {
      // unwrap đã tự xử lý
    }
  };

  const handleOpenPoll = (pollId) => {
    setSelectedPollId(pollId);
    setShowPollModal(true);
  };

  useEffect(() => {
    if (isJoinedSuccess) {
      dispatch(
        openSnackbar({
          message: "Đăng ký tham gia thành công!",
          type: "success",
        }),
      );
    }
    if (isCancelSuccess) {
      dispatch(openSnackbar({ message: "Đã hủy đăng ký.", type: "info" }));
    }
    if (joinError) {
      dispatch(
        openSnackbar({
          message: joinError?.data?.message || "Đăng ký thất bại",
          type: "error",
        }),
      );
    }
    if (cancelError) {
      dispatch(
        openSnackbar({
          message: cancelError?.data?.message || "Hủy đăng ký thất bại",
          type: "error",
        }),
      );
    }
  }, [isJoinedSuccess, isCancelSuccess, joinError, cancelError, dispatch]);

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
          <div className="absolute top-5 right-5">
            <EventStatusBadge event={event} />
          </div>
        </div>

        <div className="p-7">
          <h1 className="text-secondary mb-5 text-2xl font-bold md:text-3xl">
            {event?.title || "Tên sự kiện"}
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
              <div
                className={`leading-[1.8] !font-normal whitespace-pre-wrap text-[#666] [&_*]:text-inherit [&_b]:!font-bold [&_strong]:!font-bold ${
                  !isDescriptionExpanded && shouldShowExpandButton
                    ? "line-clamp-4"
                    : ""
                }`}
                dangerouslySetInnerHTML={{
                  __html: description,
                }}
              ></div>
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
          <h3 className="text-secondary mb-5 flex items-center gap-2 text-xl font-bold">
            🎯 Trạng thái tham gia
          </h3>

          {(() => {
            if (event.isUserRegistered) {
              return (
                <div className="text-center">
                  <div className="mb-4 rounded-full bg-green-100 px-4 py-3 font-bold text-green-800">
                    ✅ Đã đăng ký
                  </div>
                  {canInteract && (
                    <button
                      onClick={handleCancelRegistration}
                      disabled={isLoadingAction}
                      className="w-full rounded-full bg-red-100 px-4 py-3 font-bold text-red-800 transition hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isCancelling ? "Đang hủy..." : "Hủy đăng ký"}
                    </button>
                  )}
                </div>
              );
            }

            if (isFull) {
              return (
                <div className="text-center">
                  <div className="mb-4 rounded-full bg-red-100 px-4 py-3 font-bold text-red-800">
                    Đã hết chỗ
                  </div>
                  <p className="text-sm text-gray-600">
                    Sự kiện đã đạt số lượng tối đa.
                  </p>
                </div>
              );
            }

            if (canInteract) {
              return (
                <div className="text-center">
                  <button
                    onClick={handleJoinEvent}
                    disabled={isLoadingAction}
                    className="group relative w-full overflow-hidden rounded-full bg-blue-600 p-4 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isJoining ? "Đang xử lý..." : "Đăng ký ngay"}
                  </button>
                  <p className="mt-4 text-center text-sm text-gray-600">
                    Còn lại {remainingSlots} suất tham gia
                  </p>
                </div>
              );
            }

            return (
              <div className="text-center">
                <div className="mb-4 rounded-full bg-gray-100 px-4 py-3 font-bold text-gray-800">
                  Không thể đăng ký
                </div>
                <p className="text-sm text-gray-600">
                  Đã hết thời gian đăng ký cho sự kiện này.
                </p>
              </div>
            );
          })()}
        </div>

        {/* Polls Section */}
        <div className="rounded-2xl bg-white p-6 shadow">
          <h3 className="text-secondary mb-5 flex items-center gap-2 text-xl leading-1.5 font-bold">
            🗳️ Cuộc bình chọn
          </h3>
          {isLoadingPolls ? (
            <div className="py-4 text-center text-gray-500">Đang tải...</div>
          ) : (
            <div
              className="space-y-3 overflow-y-auto"
              style={{ maxHeight: "300px" }}
            >
              {(() => {
                const visiblePolls =
                  polls?.filter((poll) => !poll.is_delete) || [];

                if (visiblePolls.length > 0) {
                  return visiblePolls.map((poll) => {
                    const status = getPollState(poll.start_time, poll.end_time);

                    return (
                      <div
                        key={poll.id}
                        className="flex items-center justify-between rounded-[10px] bg-[#f8f9fa] p-4 transition-shadow hover:shadow-md"
                      >
                        <div className="flex flex-col gap-1">
                          <div className="font-bold text-gray-800">
                            {poll.title}
                          </div>
                          <PollStatusBadge status={status} />
                        </div>
                        <PollActionButton
                          status={status}
                          poll={poll}
                          handleOpenPoll={handleOpenPoll}
                        />
                      </div>
                    );
                  });
                } else {
                  return (
                    <div className="py-4 text-center text-gray-500">
                      Chưa có cuộc bình chọn nào.
                    </div>
                  );
                }
              })()}
            </div>
          )}
        </div>

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

        {event?.polls &&
          event.polls.length > 0 &&
          event.polls.map((poll) => (
            <div key={poll.id} className="mb-4">
              <span>{poll.title}</span>
              <button
                className="ml-2 rounded bg-blue-600 px-4 py-1 text-white"
                onClick={() => handleOpenPoll(poll.id)}
              >
                Tham gia bình chọn
              </button>
            </div>
          ))}

        {showPollModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 z-5 bg-transparent backdrop-blur-sm"></div>
            <div className="border-black-100 relative z-30 w-full max-w-md rounded-lg border bg-yellow-50 p-6 shadow-lg">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPollModal(false)}
              >
                ×
              </button>
              <PollPageUser
                pollId={selectedPollId}
                onClose={() => setShowPollModal(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetailUser;
