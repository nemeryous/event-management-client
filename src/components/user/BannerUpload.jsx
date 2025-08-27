import { useUploadEventBannerMutation } from "@api/eventApi";
import { openSnackbar } from "@store/slices/snackbarSlice";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const BannerUpload = ({ eventData }) => {
  const dispatch = useDispatch();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [uploadBanner, { isLoading, isSuccess, isError, error }] =
    useUploadEventBannerMutation();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      try {
        await uploadBanner({
          eventId: eventData.id,
          bannerFile: selectedFile,
        });
      } catch {
        //
      }
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    const input = document.getElementById("banner-upload-input");
    if (input) input.value = "";
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(openSnackbar({ message: "Cập nhật banner thành công" }));
      setSelectedFile(null);
      setPreviewUrl(null);
    }
    if (isError) {
      dispatch(
        openSnackbar({
          message: error?.data?.message || "Có lỗi xảy ra",
          type: "error",
        }),
      );
    }
  }, [isSuccess, isError, error, dispatch]);

  const currentBannerUrl = eventData.banner
    ? `${import.meta.env.VITE_BASE_URL}/events/${eventData.banner}`
    : "https://placehold.co/1200x400/e2e8f0/a0aec0?text=No+Banner";

  return (
    <div className="rounded-2xl bg-white p-6 shadow-lg">
      <h3 className="mb-4 text-xl font-bold">Banner sự kiện</h3>
      <div className="mb-4">
        <p className="mb-2 text-sm text-gray-600">Ảnh hiện tại:</p>
        <img
          src={previewUrl || currentBannerUrl}
          alt="Event Banner"
          className="h-auto max-h-64 w-full rounded-lg border object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://placehold.co/1200x400/e2e8f0/a0aec0?text=Image+Error";
          }}
        />
      </div>
      <div>
        <label
          htmlFor="banner-upload-input"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          {selectedFile
            ? `Ảnh mới: ${selectedFile.name}`
            : "Chọn ảnh mới để thay thế"}
        </label>
        <input
          id="banner-upload-input"
          type="file"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>
      {selectedFile && (
        <div className="mt-6 flex justify-end gap-4">
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-lg border border-gray-300 px-6 py-2 text-gray-700 transition-colors hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            onClick={handleUpload}
            disabled={isLoading}
            className="rounded-lg bg-green-600 px-6 py-2 text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-300"
          >
            {isLoading ? "Đang tải lên..." : "Lưu Banner"}
          </button>
        </div>
      )}
    </div>
  );
};

export default BannerUpload;
