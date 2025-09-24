import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import { 
  useGetEventByIdQuery, 
  useUpdateEventMutation, 
  useCreateEventMutation 
} from "@api/eventApi";
import { openSnackbar } from "@store/slices/snackbarSlice";
import FormField from "@components/common/FormField";
import TextInput from "@components/common/TextInput";
import SunEditorEditor from "@components/common/SunEditorEditor";
import BannerUpload from "@/components/features/user/BannerUpload";
import EventManagerSection from "./EventManagementManage/EventManagerSection";

// Helper function để format datetime cho input datetime-local
const formatDateTimeForInput = (dateTimeString) => {
  if (!dateTimeString) return "";
  try {
    const date = new Date(dateTimeString);
    if (isNaN(date.getTime())) return "";
    
    // Format: YYYY-MM-DDTHH:MM
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return "";
  }
};

// Helper function để format datetime cho API - Java Spring Boot Instant format (UTC)
const formatDateTimeForAPI = (dateTimeString) => {
  if (!dateTimeString) return null;
  try {
    const date = new Date(dateTimeString);
    // Format: 2025-07-01T02:00:00Z (ISO 8601 UTC)
    return date.toISOString();
  } catch (error) {
    console.error('Error formatting date for API:', error);
    return null;
  }
};

const EventForm = ({ onSuccess, onCancel, initialData, isEdit = false }) => {
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
  const [createEvent, { isLoading: isCreating }] = useCreateEventMutation();
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      startTime: formatDateTimeForInput(initialData?.start_time) || "",
      endTime: formatDateTimeForInput(initialData?.end_time) || "",
      location: initialData?.location || "",
      maxParticipants: initialData?.max_participants || "",
      urlDocs: initialData?.url_docs || "",
    },
  });

  const onSubmit = async (formData) => {
    console.log('🚀 Form Data:', formData);
    
    // Payload chuẩn Java Spring Boot
    const payload = {
      title: formData.title,
      description: formData.description,
      start_time: formatDateTimeForAPI(formData.startTime),
      end_time: formatDateTimeForAPI(formData.endTime),
      location: formData.location,
      max_participants: Number(formData.maxParticipants) || null,
      url_docs: formData.urlDocs,
    };

    console.log('📤 API Payload:', payload);

    try {
      if (isEdit) {
        // Update existing event
        const updatePayload = {
          ...payload,
          created_at: initialData?.created_at,
          eventId: initialData?.id,
        };
        console.log('📝 Update Payload:', updatePayload);
        await updateEvent(updatePayload).unwrap();
        dispatch(openSnackbar({ message: "Cập nhật sự kiện thành công!" }));
      } else {
        // Create new event
        console.log('✨ Create Payload:', payload);
        await createEvent(payload).unwrap();
        dispatch(openSnackbar({ message: "Tạo sự kiện thành công!" }));
      }
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('❌ API Error:', error);
      dispatch(
        openSnackbar({
          message: error?.data?.message || `Đã xảy ra lỗi khi ${isEdit ? 'cập nhật' : 'tạo'} sự kiện`,
          type: "error",
        }),
      );
    }
  };

  const isLoading = isUpdating || isCreating || isSubmitting;

  return (
    <div className="space-y-6">
      {/* Chỉ hiện BannerUpload và EventManagerSection khi edit */}
      {isEdit && (
        <div className="space-y-4">
          <BannerUpload eventData={eventDetail || initialData} />
          <EventManagerSection eventId={eventId} />
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title Section */}
        <div className="flex items-center gap-3">
          <div className="text-2xl">
            {isEdit ? "📝" : "✨"}
          </div>
          <h3 className="text-xl font-bold text-gray-800">
            {isEdit ? "Cập nhật thông tin sự kiện" : "Thông tin sự kiện mới"}
          </h3>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 gap-6">
          <FormField
            control={control}
            name="title"
            label="Tên sự kiện"
            rules={{ required: "Tên sự kiện là bắt buộc" }}
            Component={TextInput}
            error={errors.title}
            placeholder="Nhập tên sự kiện"
          />

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Mô tả sự kiện
            </label>
            <Controller
              name="description"
              control={control}
              rules={{ required: "Mô tả sự kiện là bắt buộc" }}
              render={({ field }) => (
                <SunEditorEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Nhập mô tả chi tiết về sự kiện..."
                />
              )}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
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
            placeholder="Nhập địa điểm tổ chức sự kiện"
          />

          <FormField
            control={control}
            name="maxParticipants"
            label="Số lượng người tham gia tối đa"
            type="number"
            Component={TextInput}
            error={errors.maxParticipants}
            placeholder="Nhập số lượng tối đa (để trống nếu không giới hạn)"
          />

          <FormField
            control={control}
            name="urlDocs"
            label="Tài liệu tham khảo (URL)"
            Component={TextInput}
            error={errors.urlDocs}
            placeholder="https://example.com/docs"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-lg bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-blue-300 transition-colors"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Đang xử lý...
              </div>
            ) : (
              isEdit ? "Cập nhật sự kiện" : "Tạo sự kiện"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
