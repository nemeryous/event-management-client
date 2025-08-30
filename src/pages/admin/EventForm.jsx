import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import {
  useCreateEventMutation,
  useUploadEventBannerMutation,
} from "@api/eventApi";
import { openSnackbar } from "@store/slices/snackbarSlice";
import FormField from "@components/common/FormField";
import TextInput from "@components/common/TextInput";
import TinyMCEEditor from "@components/common/TinyMCEEditor";

const EventForm = ({ onSuccess, onCancel }) => {
  const dispatch = useDispatch();
  const [createEvent, { isLoading: isCreating }] = useCreateEventMutation();
  const [uploadBanner, { isLoading: isUploadingBanner }] =
    useUploadEventBannerMutation();

  const [selectedBannerFile, setSelectedBannerFile] = useState(null);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      startTime: "",
      endTime: "",
      location: "",
      maxParticipants: "",
      urlDocs: "",
    },
  });

  const handleFileChange = (e) => {
    setSelectedBannerFile(e.target.files[0]);
  };

  const onSubmit = async (formData) => {
    const payload = {
      title: formData.title,
      description: formData.description,
      start_time: `${formData.startTime}:00`,
      end_time: `${formData.endTime}:00`,
      location: formData.location,
      max_participants: Number(formData.maxParticipants) || null,
      url_docs: formData.urlDocs,
    };

    try {
      // 1. Tạo sự kiện trước
      const newEvent = await createEvent(payload).unwrap();
      const newEventId = newEvent.id; // Lấy ID của sự kiện vừa tạo

      // 2. Nếu có file banner được chọn, tiến hành upload
      if (selectedBannerFile) {
        await uploadBanner({
          eventId: newEventId,
          file: selectedBannerFile,
        }).unwrap();
        dispatch(
          openSnackbar({ message: "Tạo sự kiện và tải banner thành công!" }),
        );
      } else {
        dispatch(openSnackbar({ message: "Tạo sự kiện thành công!" }));
      }

      if (onSuccess) onSuccess(); // Đóng modal sau khi hoàn tất
    } catch (error) {
      dispatch(
        openSnackbar({
          message: error?.data?.message || "Đã xảy ra lỗi khi tạo sự kiện",
          type: "error",
        }),
      );
    }
  };

  const isLoading = isCreating || isUploadingBanner || isSubmitting;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h3 className="text-xl font-bold">Thông tin sự kiện mới</h3>
      <FormField
        control={control}
        name="title"
        label="Tên sự kiện"
        rules={{ required: "Tên sự kiện là bắt buộc" }}
        Component={TextInput}
        error={errors.title}
      />

      {/* Phần Upload Banner mới */}
      <div className="form-group">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Banner sự kiện:
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUploadingBanner}
        />
        {isUploadingBanner && (
          <span style={{ marginLeft: 8, color: "#888" }}>
            Đang tải lên banner...
          </span>
        )}
        {selectedBannerFile && (
          <div style={{ marginTop: 8 }}>
            <img
              src={URL.createObjectURL(selectedBannerFile)}
              alt="Preview Banner"
              style={{ maxWidth: 200, borderRadius: 8 }}
            />
          </div>
        )}
      </div>
      {/* Kết thúc phần Upload Banner mới */}

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Mô tả
        </label>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TinyMCEEditor value={field.value} onChange={field.onChange} />
          )}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField
          control={control}
          name="startTime"
          label="Thời gian bắt đầu"
          type="datetime-local"
          rules={{ required: "Thời gian bắt đầu là bắt buộc" }}
          Component={TextInput}
          error={errors.startTime}
        />
        <FormField
          control={control}
          name="endTime"
          label="Thời gian kết thúc"
          type="datetime-local"
          rules={{ required: "Thời gian kết thúc là bắt buộc" }}
          Component={TextInput}
          error={errors.endTime}
        />
      </div>

      <FormField
        control={control}
        name="location"
        label="Địa điểm"
        rules={{ required: "Địa điểm là bắt buộc" }}
        Component={TextInput}
        error={errors.location}
      />

      <FormField
        control={control}
        name="maxParticipants"
        label="Số lượng tối đa"
        type="number"
        Component={TextInput}
        error={errors.maxParticipants}
      />

      <FormField
        control={control}
        name="urlDocs"
        label="Tài liệu (URL)"
        Component={TextInput}
        error={errors.urlDocs}
      />

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-300 px-6 py-2 text-gray-700"
        >
          Hủy bỏ
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-lg bg-blue-600 px-6 py-2 text-white disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {isLoading ? "Đang xử lý..." : "Tạo Sự Kiện"}
        </button>
      </div>
    </form>
  );
};

export default EventForm;
