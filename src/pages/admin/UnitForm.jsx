import React from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import { 
  useCreateUnitMutation,
  useUpdateUnitMutation 
} from "@/api/unitApi";
import { openSnackbar } from "@store/slices/snackbarSlice";
import FormField from "@components/common/FormField";
import TextInput from "@components/common/TextInput";

const UNIT_TYPES = [
  { value: "DEPARTMENT", label: "Phòng ban", icon: "🏢" },
  { value: "TEAM", label: "Nhóm", icon: "👥" },
  { value: "PROJECT_GROUP", label: "Dự án", icon: "📋" },
];

const UnitForm = ({ 
  onSuccess, 
  onCancel, 
  initialData, 
  isEdit = false,
  availableParents = [] 
}) => {
  const dispatch = useDispatch();
  
  const [createUnit, { isLoading: isCreating }] = useCreateUnitMutation();
  const [updateUnit, { isLoading: isUpdating }] = useUpdateUnitMutation();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
    watch,
  } = useForm({
    defaultValues: {
      unit_name: initialData?.unit_name || "",
      unit_type: initialData?.unit_type || "DEPARTMENT",
      parent_id: initialData?.parent_id || "",
    },
  });

  // Watch unit_type để hiển thị thông tin phù hợp
  const unitType = watch("unit_type");
  const selectedUnitType = UNIT_TYPES.find(type => type.value === unitType);

  const onSubmit = async (formData) => {
    console.log('🚀 Unit Form Data:', formData);
    
    // Validate logic
    const errors = [];
    
    if (!formData.unit_name.trim()) {
      errors.push("Tên đơn vị không được để trống");
    }
    
    if (!formData.unit_type) {
      errors.push("Phải chọn loại đơn vị");
    }

    // Kiểm tra parent_id hợp lệ
    if (formData.parent_id && !availableParents.find(p => p.id === Number(formData.parent_id))) {
      errors.push("Đơn vị cha không hợp lệ");
    }

    if (errors.length > 0) {
      errors.forEach(error => {
        dispatch(openSnackbar({ message: error, type: "error" }));
      });
      return;
    }

    // Prepare payload
    const payload = {
      unit_name: formData.unit_name.trim(),
      unit_type: formData.unit_type,
      parent_id: formData.parent_id ? Number(formData.parent_id) : null,
    };

    if (isEdit) {
      payload.id = initialData.id;
    }

    console.log('📤 Unit API Payload:', payload);

    try {
      if (isEdit) {
        // Update existing unit
        await updateUnit({ id: initialData.id, ...payload }).unwrap();
        dispatch(openSnackbar({ message: "Cập nhật đơn vị thành công!" }));
      } else {
        // Create new unit
        await createUnit(payload).unwrap();
        dispatch(openSnackbar({ message: "Tạo đơn vị thành công!" }));
      }
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('❌ Unit API Error:', error);
      dispatch(
        openSnackbar({
          message: error?.data?.message || `Đã xảy ra lỗi khi ${isEdit ? 'cập nhật' : 'tạo'} đơn vị`,
          type: "error",
        }),
      );
    }
  };

  const isLoading = isCreating || isUpdating;

  return (
    <div className="space-y-6">
      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title Section */}
        <div className="flex items-center gap-3">
          <div className="text-2xl">
            {isEdit ? "🔧" : "🏢"}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              {isEdit ? "Cập nhật thông tin đơn vị" : "Thông tin đơn vị mới"}
            </h3>
            {selectedUnitType && (
              <p className="text-sm text-gray-600 mt-1">
                {selectedUnitType.icon} {selectedUnitType.label}
              </p>
            )}
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 gap-6">
          <FormField
            control={control}
            name="unit_name"
            label="Tên đơn vị"
            rules={{ 
              required: "Tên đơn vị là bắt buộc",
              minLength: {
                value: 2,
                message: "Tên đơn vị phải có ít nhất 2 ký tự"
              },
              maxLength: {
                value: 100,
                message: "Tên đơn vị không được vượt quá 100 ký tự"
              }
            }}
            Component={TextInput}
            error={errors.unit_name}
            placeholder="Nhập tên đơn vị"
          />

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Loại đơn vị <span className="text-red-500">*</span>
            </label>
            <Controller
              name="unit_type"
              control={control}
              rules={{ required: "Phải chọn loại đơn vị" }}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                >
                  {UNIT_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.unit_type && (
              <p className="mt-1 text-sm text-red-600">{errors.unit_type.message}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Đơn vị cha
            </label>
            <Controller
              name="parent_id"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Chọn đơn vị cha (tùy chọn) --</option>
                  {availableParents.map((parent) => (
                    <option key={parent.id} value={parent.id}>
                      {parent.unit_type === "DEPARTMENT" && "🏢 "}
                      {parent.unit_type === "TEAM" && "👥 "}
                      {parent.unit_type === "PROJECT_GROUP" && "📋 "}
                      {parent.unit_name}
                    </option>
                  ))}
                </select>
              )}
            />
            <p className="mt-1 text-xs text-gray-500">
              Để trống nếu đây là đơn vị cấp cao nhất
            </p>
            {errors.parent_id && (
              <p className="mt-1 text-sm text-red-600">{errors.parent_id.message}</p>
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
          <div className="flex items-start gap-3">
            <div className="text-blue-500 mt-0.5">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-sm">
              <p className="font-medium text-blue-800 mb-1">Hướng dẫn:</p>
              <ul className="text-blue-700 space-y-1">
                <li>• <strong>Phòng ban:</strong> Đơn vị cấp cao, thường không có đơn vị cha</li>
                <li>• <strong>Nhóm:</strong> Thuộc về một phòng ban</li>
                <li>• <strong>Dự án:</strong> Có thể thuộc về nhóm hoặc phòng ban</li>
              </ul>
            </div>
          </div>
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
              isEdit ? "Cập nhật đơn vị" : "Tạo đơn vị"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UnitForm;