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

// Helper function để xử lý description với ảnh base64
const processDescriptionWithImages = async (htmlContent) => {
  if (!htmlContent) return JSON.stringify({ text: "", images: [] });

  try {
    // Tạo DOM parser để xử lý HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    
    // Tìm tất cả ảnh trong content
    const images = doc.querySelectorAll('img');
    const base64Images = [];
    let processedText = htmlContent;

    // Xử lý từng ảnh
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      const src = img.src;
      
      if (src.startsWith('data:image/')) {
        // Nếu đã là base64, thêm vào mảng
        base64Images.push(src);
        // Thay thế trong text với placeholder
        processedText = processedText.replace(src, `{{IMAGE_${i}}}`);
      } else if (src.startsWith('blob:')) {
        // Nếu là blob URL, convert sang base64
        try {
          const base64 = await convertBlobToBase64(src);
          base64Images.push(base64);
          // Thay thế trong text với placeholder
          processedText = processedText.replace(src, `{{IMAGE_${i}}}`);
        } catch (error) {
          console.error('Error converting blob to base64:', error);
        }
      } else if (src.startsWith('http')) {
        // Nếu là URL external, có thể convert hoặc giữ nguyên
        try {
          const base64 = await convertUrlToBase64(src);
          base64Images.push(base64);
          processedText = processedText.replace(src, `{{IMAGE_${i}}}`);
        } catch (error) {
          console.error('Error converting URL to base64:', error);
          // Giữ nguyên URL nếu không convert được
        }
      }
    }

    // Trả về JSON string với format yêu cầu
    return JSON.stringify({
      text: processedText,
      images: base64Images
    });

  } catch (error) {
    console.error('Error processing description with images:', error);
    // Fallback: trả về text thuần
    return JSON.stringify({
      text: htmlContent,
      images: []
    });
  }
};

// Helper function chuyển blob URL thành base64
const convertBlobToBase64 = (blobUrl) => {
  return new Promise((resolve, reject) => {
    fetch(blobUrl)
      .then(response => response.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      })
      .catch(reject);
  });
};

// Helper function chuyển URL thành base64
const convertUrlToBase64 = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL());
    };
    img.onerror = reject;
    img.src = url;
  });
};

// Helper function để parse description từ JSON format thành HTML để hiển thị
const parseDescriptionFromJSON = (jsonString) => {
  if (!jsonString) return "";
  
  try {
    // Nếu không phải JSON, trả về text thuần
    if (!jsonString.startsWith('{')) return jsonString;
    
    const parsed = JSON.parse(jsonString);
    
    if (!parsed.text || !Array.isArray(parsed.images)) {
      return jsonString; // Fallback to original
    }
    
    let htmlContent = parsed.text;
    
    // Thay thế các placeholder bằng ảnh base64
    parsed.images.forEach((base64Image, index) => {
      const placeholder = `{{IMAGE_${index}}}`;
      htmlContent = htmlContent.replace(placeholder, base64Image);
    });
    
    return htmlContent;
    
  } catch (error) {
    console.error('Error parsing description JSON:', error);
    return jsonString; // Fallback to original
  }
};

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
      description: parseDescriptionFromJSON(initialData?.description) || "",
      startTime: formatDateTimeForInput(initialData?.start_time) || "",
      endTime: formatDateTimeForInput(initialData?.end_time) || "",
      location: initialData?.location || "",
      maxParticipants: initialData?.max_participants || "",
      urlDocs: initialData?.url_docs || "",
    },
  });

  const onSubmit = async (formData) => {
    console.log('🚀 Form Data:', formData);
    
    // Xử lý description với ảnh base64
    const processedDescription = await processDescriptionWithImages(formData.description);
    
    // Payload chuẩn Java Spring Boot
    const payload = {
      title: formData.title,
      description: processedDescription,
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
