import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useGetEventByIdQuery, useUpdateEventMutation } from "@api/eventApi";
import { openSnackbar } from "@store/slices/snackbarSlice";
import FormField from "@components/common/FormField";
import TextInput from "@components/common/TextInput";
import SunEditorEditor from "@components/common/SunEditorEditor";
import BannerUpload from "@components/user/BannerUpload";
import EventManagerSection from "./EventManagementManage/EventManagerSection";

const EventForm = ({ onSuccess, onCancel, initialData }) => {
  const dispatch = useDispatch();

  const eventId = initialData ? initialData.id : null;
  const { data: eventDetail, refetch: refetchEvent } = useGetEventByIdQuery(
    eventId,
    { skip: !eventId },
  );

  useEffect(() => {
    if (eventId) refetchEvent();
  }, [eventId, refetchEvent]);

  const [updateEvent, { isLoading: isUpdating }] = useUpdateEventMutation();
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      startTime: initialData?.start_time || "",
      endTime: initialData?.end_time || "",
      location: initialData?.location || "",
      maxParticipants: initialData?.max_participants || "",
      urlDocs: initialData?.url_docs || "",
    },
  });

  const onSubmit = async (formData) => {
    const payload = {
      title: formData.title,
      description: formData.description,
      start_time: `${formData.startTime}`,
      end_time: `${formData.endTime}`,
      location: formData.location,
      max_participants: Number(formData.maxParticipants) || null,
      url_docs: formData.urlDocs,
      created_at: initialData?.created_at,
      eventId: initialData?.id,
    };

    try {
      await updateEvent(payload).unwrap();
      dispatch(openSnackbar({ message: "Cập nhật sự kiện thành công!" }));
      if (onSuccess) onSuccess();
    } catch (error) {
      dispatch(
        openSnackbar({
          message: error?.data?.message || "Đã xảy ra lỗi khi cập nhật sự kiện",
          type: "error",
        }),
      );
    }
  };

  const isLoading = isUpdating || isSubmitting;

  return (
    <div>
      <BannerUpload eventData={eventDetail || initialData} />

      <div className="mt-3">
        <EventManagerSection eventId={eventId} />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-3 space-y-6">
        <h3 className="text-xl font-bold">Cập nhật thông tin sự kiện</h3>
        <FormField
          control={control}
          name="title"
          label="Tên sự kiện"
          rules={{ required: "Tên sự kiện là bắt buộc" }}
          Component={TextInput}
          error={errors.title}
        />

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Mô tả
          </label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <SunEditorEditor
                value={field.value}
                onChange={field.onChange}
                placeholder={"Nhập mô tả sự kiện..."}
              />
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
            onClick={handleSubmit(onSubmit)}
            type="submit"
            disabled={isLoading}
            className="rounded-lg bg-blue-600 px-6 py-2 text-white disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {isLoading ? "Đang xử lý..." : "Cập nhật Sự Kiện"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
