import FormField from "@components/common/FormField";
import TextInput from "@components/common/TextInput";
import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { openSnackbar } from "@store/slices/snackbarSlice";
import ErrorMessage from "@components/user/ErrorMessage";
import { CircularProgress } from "@mui/material";
import { useChangePasswordMutation } from "@api/authApi";

const ChangePassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [changePassword, { isLoading, error, isError }] =
    useChangePasswordMutation();

  const formSchema = yup.object().shape({
    currentPassword: yup
      .string()
      .min(6, "Mật khẩu hiện tại phải có ít nhất 6 ký tự")
      .required("Mật khẩu hiện tại là bắt buộc"),
    newPassword: yup
      .string()
      .min(6, "Mật khẩu mới phải có ít nhất 6 ký tự")
      .required("Mật khẩu mới là bắt buộc"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("newPassword"), null], "Mật khẩu xác nhận không khớp")
      .required("Xác nhận mật khẩu là bắt buộc"),
  });

  const {
    control,
    handleSubmit,
    formState: { errors, touchedFields },
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    resolver: yupResolver(formSchema),
  });

  const isFieldValid = (fieldName) => {
    return touchedFields[fieldName] && !errors[fieldName];
  };

  const onSubmit = async (formData) => {
    try {
      const { oldPassword, newPassword, confirmPassword } = formData;
      const changePasswordData = await changePassword({
        oldPassword,
        newPassword,
        confirmPassword,
      }).unwrap();

      dispatch(openSnackbar({ message: "Đổi mật khẩu thành công" }));
      reset();
    } catch (err) {
      dispatch(
        openSnackbar({
          message: err.data?.message || "Đổi mật khẩu thất bại",
          type: "error",
        }),
      );
      console.error("Failed to change password: ", err);
    }
  };

  return (
    <div className="flex w-full items-center justify-center px-8 py-12 lg:w-1/2">
      <div className="w-full max-w-md">
        <img
          src="/vku-text-logo.svg"
          alt="VKU Logo"
          className="mb-8 block lg:hidden"
        />
        <div className="rounded-2xl bg-white p-8 shadow-lg">
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-2xl font-bold text-gray-900">
              Đổi mật khẩu
            </h2>
            <p className="text-gray-600">Cập nhật mật khẩu của bạn</p>
          </div>
          {isError && error && error.data && error.data.message && (
            <ErrorMessage message={error.data.message} />
          )}
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <FormField
              control={control}
              label="Mật khẩu hiện tại"
              name="oldPassword"
              type="password"
              Component={TextInput}
              error={errors["currentPassword"]}
              isValid={isFieldValid("currentPassword")}
            />
            <FormField
              control={control}
              label="Mật khẩu mới"
              name="newPassword"
              type="password"
              Component={TextInput}
              error={errors["newPassword"]}
              isValid={isFieldValid("newPassword")}
            />
            <FormField
              control={control}
              label="Xác nhận mật khẩu mới"
              name="confirmPassword"
              type="password"
              Component={TextInput}
              error={errors["confirmPassword"]}
              isValid={isFieldValid("confirmPassword")}
            />
            <div className="flex gap-4">
              <Link
                to="/dashboard"
                className="flex-1 transform cursor-pointer rounded-xl border-2 border-gray-300 px-4 py-3 text-center text-base font-semibold text-gray-700 transition-all duration-200 hover:scale-105 hover:bg-gray-50"
              >
                Hủy
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-primary flex-1 transform cursor-pointer rounded-xl px-4 py-3 text-base font-semibold text-white transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-red-500/40 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading && <CircularProgress size={20} className="mr-1" />}
                Đổi mật khẩu
              </button>
            </div>
          </form>
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              <Link
                to="/profile"
                className="text-secondary font-medium hover:underline"
              >
                ← Quay lại hồ sơ
              </Link>
            </p>
          </div>
        </div>
        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          © 2025 VKU Event Portal. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
