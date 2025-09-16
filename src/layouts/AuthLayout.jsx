import { Alert, Snackbar } from "@mui/material";
import { closeSnackbar } from "@store/slices/snackbarSlice";
import React, { Suspense, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import EventBannerCard from "@components/common/EventBannerCard.jsx";
import { useGetUpcomingEventsQuery } from "@api/eventApi";

const AuthLayout = () => {
  const dispatch = useDispatch();
  const { open, type, message } = useSelector((state) => state.snackbar);

  const { data: upcomingEvents, isLoading: isLoadingEvents, error: errorEvents } = useGetUpcomingEventsQuery(undefined, {
    refetchOnMountOrArgChange: false,
  });

  const normalizePageData = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (typeof data === "object" && data !== null && "content" in data) return data.content || [];
    return [];
  };

  const events = normalizePageData(upcomingEvents);

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const previousSlide = () => {
    setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : events.length - 1));
  };

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev < events.length - 1 ? prev + 1 : 0));
  };

  // Hiệu ứng tự động chuyển slide
  React.useEffect(() => {
    if (events.length > 1) {
      const interval = setInterval(nextSlide, 5000);
      return () => clearInterval(interval);
    }
  }, [events.length, currentSlideIndex]);

  if (isLoadingEvents) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (errorEvents) {
    dispatch(closeSnackbar({ message: "Lỗi tải sự kiện. Vui lòng thử lại.", type: "error" }));
    return (
      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <div className="flex min-h-screen bg-white">
            <div className="relative hidden overflow-hidden lg:flex lg:w-1/2">
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200 opacity-30"></div>
              <div className="relative z-10 flex h-full w-full flex-col items-start justify-center p-8 text-gray-800">
                <div className="mb-6">
                  <img src="/vku-text-logo.svg" alt="VKU Logo" className="h-12" />
                </div>
                <div className="max-w-lg">
                  <h1 className="mb-4 text-3xl font-bold leading-tight">
                    <span className="text-gray-900">Chào mừng đến với</span>
                    <br />
                    <span className="text-red-600">VKU Event Portal</span>
                  </h1>
                  <p className="text-gray-700">Có lỗi khi tải sự kiện. Vui lòng thử lại sau!</p>
                </div>
              </div>
            </div>
            <Outlet />
          </div>
          <Snackbar
            open={open}
            autoHideDuration={4000}
            onClose={() => dispatch(closeSnackbar())}
          >
            <Alert
              onClose={() => dispatch(closeSnackbar())}
              severity={type}
              variant="filled"
              sx={{ width: "100%" }}
            >
              {message}
            </Alert>
          </Snackbar>
        </Suspense>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <div className="flex min-h-screen bg-white">
            <div className="relative hidden overflow-hidden lg:flex lg:w-1/2">
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200 opacity-30"></div>
              <div className="relative z-10 flex h-full w-full flex-col items-start justify-center p-8 text-gray-800">
                <div className="mb-6">
                  <img src="/vku-text-logo.svg" alt="VKU Logo" className="h-12" />
                </div>
                <div className="max-w-lg">
                  <h1 className="mb-4 text-3xl font-bold leading-tight">
                    <span className="text-gray-900">Chào mừng đến với</span>
                    <br />
                    <span className="text-red-600">VKU Event Portal</span>
                  </h1>
                  <p className="text-gray-700">Hiện không có sự kiện sắp diễn ra. Hãy quay lại sau!</p>
                </div>
              </div>
            </div>
            <Outlet />
          </div>
          <Snackbar
            open={open}
            autoHideDuration={4000}
            onClose={() => dispatch(closeSnackbar())}
          >
            <Alert
              onClose={() => dispatch(closeSnackbar())}
              severity={type}
              variant="filled"
              sx={{ width: "100%" }}
            >
              {message}
            </Alert>
          </Snackbar>
        </Suspense>
      </div>
    );
  }

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="flex min-h-screen bg-white">
          <div className="relative hidden overflow-hidden lg:flex lg:w-1/2">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-30"
              style={{
                backgroundImage: `url(${import.meta.env.VITE_BASE_URL}/uploads/${events[currentSlideIndex]?.banner})`,
              }}
            ></div>
            <div className="relative z-10 flex h-full w-full flex-col items-start justify-center p-8 text-gray-800">
              <div className="mb-6">
                <img src="/vku-text-logo.svg" alt="VKU Logo" className="h-12" />
              </div>
              <div className="max-w-lg">
                <h1 className="mb-4 text-3xl font-bold leading-tight">
                  <span className="text-gray-900">Chào mừng đến với</span>
                  <br />
                  <span className="text-red-600">VKU Event Portal</span>
                </h1>
                <p className="mb-6 text-gray-700">
                  Khám phá và tham gia các sự kiện thú vị tại Đại học Công nghệ Thông tin và Truyền thông Việt - Hàn
                </p>
                <div className="relative w-full overflow-hidden">
                <div className="relative h-70 w-full ">
                    <div
                      className="flex transition-transform duration-700 ease-in-out"
                      style={{ transform: `translateX(-${currentSlideIndex * 100}%)` }}
                    >
                      {events.map((event, index) => (
                        <div
                          key={event.id}
                          className="flex-shrink-0 w-full"
                          style={{ minWidth: "100%" }}
                        >
                          <EventBannerCard event={event} isManageMode={false} relatedEvents={[]} />
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-10 h-10 bg-white/80 rounded-full shadow-md hover:bg-white transition-all disabled:opacity-50"
                    onClick={previousSlide}
                    disabled={events.length <= 1}
                    aria-label="Previous slide"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-6 h-6 text-gray-800"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-10 h-10 bg-white/80 rounded-full shadow-md hover:bg-white transition-all disabled:opacity-50"
                    onClick={nextSlide}
                    disabled={events.length <= 1}
                    aria-label="Next slide"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-6 h-6 text-gray-800"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  {events.length > 1 && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                      {events.map((_, index) => (
                        <button
                          key={index}
                          className={`w-3 h-3 rounded-full transition-all ${
                            currentSlideIndex === index ? "bg-red-600" : "bg-gray-400 hover:bg-gray-500"
                          }`}
                          onClick={() => setCurrentSlideIndex(index)}
                          aria-label={`Go to slide ${index + 1}`}
                        ></button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <Outlet />
        </div>
        <Snackbar
          open={open}
          autoHideDuration={4000}
          onClose={() => dispatch(closeSnackbar())}
        >
          <Alert
            onClose={() => dispatch(closeSnackbar())}
            severity={type}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {message}
          </Alert>
        </Snackbar>
      </Suspense>
    </div>
  );
};

export default AuthLayout;