import FormField from "@components/common/FormField";
import TextInput from "@components/common/TextInput";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { openSnackbar } from "@store/slices/snackbarSlice";
import { setToken } from "@store/slices/authSlice";
import ErrorMessage from "@components/user/ErrorMessage";
import { CircularProgress } from "@mui/material";
import { useLoginMutation } from "@api/authApi";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { data = {}, isLoading, error, isError, isSuccess }] =
    useLoginMutation();

  const formSchema = yup.object().shape({
    email: yup
      .string()
      .email("Định dạng email không hợp lệ")
      .required("Email là bắt buộc"),
    password: yup
      .string()
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
      .required("Mật khẩu là bắt buộc"),
  });

  const {
    control,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "nhatnguyen4369@gmail.com",
      password: "nhat12345",
    },
    resolver: yupResolver(formSchema),
  });

  const isFieldValid = (fieldName) => {
    return touchedFields[fieldName] && !errors[fieldName];
  };

  function onSubmit(formData) {
    login(formData);
  }

  useEffect(() => {
    if (isError) {
      dispatch(openSnackbar({ message: error?.data?.message, type: "error" }));
    }

    if (isSuccess) {
      dispatch(openSnackbar({ message: "Đăng nhập thành công" }));
      dispatch(setToken(data));

      navigate("/admin/events");
    }
  }, [isError, isSuccess, data, error?.data?.message, dispatch, navigate]);

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
            <h2 className="mb-2 text-2xl font-bold text-gray-900">Đăng nhập</h2>
          </div>
          {isError && error && error.data && error.data.message && (
            <ErrorMessage message={error.data.message} />
          )}
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <FormField
              control={control}
              label="Email"
              name="email"
              type="email"
              Component={TextInput}
              error={errors["email"]}
              isValid={isFieldValid("email")}
            />
            <FormField
              control={control}
              label="Mật khẩu"
              name="password"
              type="password"
              Component={TextInput}
              error={errors["password"]}
              isValid={isFieldValid("password")}
            />
            <div className="flex items-center justify-between">
              <a
                href="#"
                className="text-secondary text-sm font-medium hover:underline"
              >
                Quên mật khẩu?
              </a>
            </div>
            <button
              type="submit"
              className="bg-primary w-full transform cursor-pointer rounded-xl px-4 py-3 text-base font-semibold text-white transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-red-500/40 active:scale-95"
            >
              {isLoading && <CircularProgress size={20} className="mr-1" />}
              Đăng nhập
            </button>
          </form>
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Chưa có tài khoản?{" "}
              <Link
                to="/register"
                className="text-secondary font-medium hover:underline"
              >
                Đăng ký ngay
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

export default Login;
