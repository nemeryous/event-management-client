import {
    formatTimestampToDate,
    formatTimestampToTime,
    getTimeUntilEvent,
  } from "@utils/helpers";
  import React, { useEffect, useState } from "react";
  import { Link } from "react-router-dom";
  import { FallbackImage } from "@components/user/EventCard/FallbackBanner.jsx";
  import { useDispatch } from "react-redux";
  import { useJoinEventMutation } from "@api/eventApi";
  import { openSnackbar } from "@store/slices/snackbarSlice";
  import EventStatusBadge from "@components/user/EventStatusBadge";
  
  const EventBannerCard = ({ event, isManageMode = false }) => {
    const dispatch = useDispatch();
  
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
  
    useEffect(() => {
      if (isJoining) {
        dispatch(
          openSnackbar({ message: "Đang tham gia sự kiện...", type: "info" })
        );
      }
      if (isJoined) {
        dispatch(
          openSnackbar({
            message: "Tham gia sự kiện thành công",
            type: "success",
          })
        );
      }
      if (joinError) {
        dispatch(
          openSnackbar({
            message:
              joinError?.data?.message || "Không thể tham gia sự kiện",
            type: "error",
          })
        );
      }
    }, [isJoining, isJoined, joinError, dispatch]);
  
    const [imageState, setImageState] = useState({
      loaded: false,
      error: false,
      loading: true,
      url: "",
    });
  
    useEffect(() => {
      const fetchImage = async () => {
        if (!event?.banner) return;
        const bannerName = event.banner.replace(/^banners\//, "");
        const fullUrl = `${import.meta.env.VITE_BASE_URL}/events/banners/${bannerName}`;
        try {
          const response = await fetch(fullUrl);
          if (!response.ok)
            throw new Error(`HTTP ${response.status}: ${await response.text()}`);
          const blob = await response.blob();
          setImageState({
            loaded: true,
            error: false,
            loading: false,
            url: URL.createObjectURL(blob),
          });
        } catch (error) {
          console.error("Image error:", error.message);
          setImageState({
            loaded: false,
            error: true,
            loading: false,
            url: fullUrl,
          });
        }
      };
      fetchImage();
    }, [event?.banner]);
  
    const isEventPassed = new Date(event.startTime) < new Date();
    const canRegister =
      event.status === "UPCOMING" && !isEventPassed && !event.isRegistered;
  
    return (
      <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
        <div className="relative h-64 w-full">
          {imageState.loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <FallbackImage showProgress={true} />
            </div>
          )}
  
          {imageState.error && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
              <div className="text-center text-gray-500">
                <div className="mb-2 text-4xl">🖼️</div>
                <p className="text-sm font-medium">Không thể tải banner</p>
                <p className="mt-1 text-xs text-gray-400">Vui lòng thử lại sau</p>
              </div>
            </div>
          )}
  
          {imageState.loaded && (
            <>
              <img
                src={imageState.url}
                alt={`${event.title} Banner`}
                className="absolute inset-0 h-full w-full object-cover opacity-50"
                style={{ filter: "blur(1px)" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            </>
          )}
  
          <div className="relative z-10 p-6 text-white">
            <div className="absolute top-4 right-4 z-20">
              <EventStatusBadge event={event} />
            </div>
  
            {event.status === "UPCOMING" && (
              <div className="absolute top-4 left-4 z-20 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-gray-700 shadow-lg backdrop-blur-sm">
                {getTimeUntilEvent(event.startTime)}
              </div>
            )}
  
            <div className="relative z-20  p-6 rounded-lg "> 
              <Link
                to={`/events/${event.id}`}
                title={event.title}
                aria-label={event.title}
                className="mb-4 line-clamp-2 text-2xl font-bold text-white hover:text-red-200 transition-colors duration-300"
                style={{ textShadow: "0 0 4px rgba(0, 0, 0, 0.7)" }} 
              >
                {event.title}
              </Link>
  
              <div className="mb-5 space-y-2 text-red-400">
                <div className="flex items-center gap-3">
                  <span className="text-xl">📅</span>
                  <span className="text-base font-semibold">
                    {formatTimestampToDate(event.startTime)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl">⏰</span>
                  <span className="text-base font-semibold">
                    {formatTimestampToTime(event.startTime)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl">📍</span>
                  <span
                    className="line-clamp-2 text-base font-semibold"
                    title={event.location}
                  >
                    {event.location}
                  </span>
                </div>
              </div>
  
              <div className="flex gap-3">
                {isManageMode ? (
                  <Link
                    to={`/events/${event.id}/manage`}
                    className="group/btn relative flex-1 cursor-pointer overflow-hidden rounded-full bg-blue-500 px-5 py-3 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/40 focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:outline-none"
                  >
                    <div className="absolute inset-0 scale-0 rounded-full bg-white/30 transition-transform duration-300 group-hover/btn:scale-100"></div>
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <span>Quản lý</span>
                      <span className="transition-transform duration-300 group-hover/btn:scale-110">
                        ⚙️
                      </span>
                    </span>
                  </Link>
                ) : (
                  <button
                    className={`group/btn relative bottom-2 flex-1 cursor-pointer overflow-hidden rounded-full px-5 py-3 text-sm font-bold transition-all duration-300 hover:-translate-y-1 focus:ring-2 focus:ring-offset-2 focus:outline-none ${
                      canRegister
                        ? "bg-yellow-400 text-gray-900 hover:bg-yellow-500 hover:shadow-lg hover:shadow-yellow-400/40 focus:ring-yellow-500"
                        : "cursor-not-allowed bg-gray-300 text-gray-500"
                    }`}
                    onClick={() => {
                      if (!canRegister) return;
                      handleJoinEvent(event.qrJoinToken);
                    }}
                    disabled={!canRegister}
                  >
                    <div
                      className={`absolute inset-0 scale-0 rounded-full bg-white/30 transition-transform duration-300 ${
                        canRegister ? "group-hover/btn:scale-100" : ""
                      }`}
                    ></div>
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <span>{event.isRegistered ? "Đã tham gia" : "Tham gia"}</span>
                    </span>
                  </button>
                )}
              </div>
  
              {!canRegister &&
                event.status === "UPCOMING" &&
                isEventPassed && (
                  <p className="mt-2 rounded-lg bg-amber-900/50 px-3 py-2 text-center text-xs text-amber-100">
                    ⚠️ Sự kiện đã qua, không thể đăng ký
                  </p>
                )}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default EventBannerCard;