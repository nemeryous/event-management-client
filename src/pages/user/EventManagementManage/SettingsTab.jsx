import { useUpdateEventMutation } from "@api/eventApi";
import FormField from "@components/common/FormField";
import TextInput from "@components/common/TextInput";
import TinyMCEEditor from "@components/common/TinyMCEEditor";
import { openSnackbar } from "@store/slices/snackbarSlice";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const SettingsTab = ({ eventData }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [updateEvent, { isLoading: isUpdating, isError, error, isSuccess }] =
    useUpdateEventMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty, isSubmitting, errors },
  } = useForm({
    defaultValues: {
      title: eventData.name,
      description: eventData.description,
      startTime: eventData.startTime.slice(0, 16),
      endTime: eventData.endTime.slice(0, 16),
      location: eventData.location,
      maxParticipants: eventData.maxParticipants,
      urlDocs: eventData.urlDocs || "",
    },
  });

  const onSubmit = async (formData) => {
    const payload = {
      title: formData.title,
      description: formData.description,
      start_time: formData.startTime,
      end_time: formData.endTime,
      location: formData.location,
      max_participants: Number(formData.maxParticipants),
      url_docs: formData.urlDocs,
    };

    try {
      await updateEvent({ eventId: eventData.id, ...payload }).unwrap();
    } catch {
      //
    }
  };

  const handleCancel = () => {
    reset(); // Reset về defaultValues
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(openSnackbar({ message: "Cập nhập sự kiện thành công" }));
      navigate(`/events/${eventData.id}`);
    }

    if (isError) {
      dispatch(openSnackbar({ message: error?.data?.message, type: "error" }));
    }
  }, [
    dispatch,
    error?.data?.message,
    eventData.id,
    isError,
    isSuccess,
    navigate,
  ]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-lg">
        <h3 className="mb-6 text-xl font-bold">Cài đặt sự kiện</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={control}
            label="Tên sự kiện"
            name="title"
            type="text"
            Component={TextInput}
            error={errors.title}
          />

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Mô tả
            </label>
            <Controller
              name="description"
              control={control}
              render={({ field: { onChange, value } }) => (
                <TinyMCEEditor value={value} onChange={onChange} />
              )}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={control}
              label="Thời gian bắt đầu"
              name="startTime"
              type="datetime-local"
              Component={TextInput}
              error={errors.startTime}
            />
            <FormField
              control={control}
              label="Thời gian kết thúc"
              name="endTime"
              type="datetime-local"
              Component={TextInput}
              error={errors.endTime}
            />
          </div>

          <FormField
            control={control}
            label="Địa điểm"
            name="location"
            Component={TextInput}
            error={errors.location}
          />

          <FormField
            control={control}
            label="Số lượng tối đa"
            name="maxParticipants"
            type="number"
            Component={TextInput}
            error={errors.maxParticipants}
          />

          <FormField
            control={control}
            label="Tài liệu"
            name="urlDocs"
            Component={TextInput}
            error={errors.urlDocs}
          />

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-lg border border-gray-300 px-6 py-2 text-gray-700 transition-colors hover:bg-gray-50"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isUpdating || isSubmitting || !isDirty}
              className="rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
            >
              {isUpdating ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsTab;
