import { useRegisterMutation } from "@api/rootApi";
import CheckboxInput from "@components/common/CheckboxInput";
import FormField from "@components/common/FormField";
import TextInput from "@components/common/TextInput";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import ErrorMessage from "@components/user/ErrorMessage";
import { useDispatch } from "react-redux";
import { openSnackbar } from "@store/slices/snackbarSlice";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [register, { data = {}, isLoading, error, isError, isSuccess }] =
    useRegisterMutation();

  const formSchema = yup.object().shape({
    name: yup.string().required("Tên là bắt buộc"),
    email: yup
      .string()
      .email("Định dạng email không hợp lệ")
      .required("Email là bắt buộc"),
    password: yup
      .string()
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
      .required("Mật khẩu là bắt buộc"),
    confirm_password: yup
      .string()
      .oneOf(
        [yup.ref("password"), null],
        "Mật khẩu xác nhận phải khớp với mật khẩu",
      )
      .required("Mật khẩu xác nhận là bắt buộc"),
    phone_number: yup
      .string()
      .matches(/^\d{10}$/, "Số điện thoại phải có đúng 10 chữ số")
      .required("Số điện thoại là bắt buộc"),
  });

  const {
    control,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirm_password: "",
      phone_number: "",
    },
    resolver: yupResolver(formSchema),
  });

  const isFieldValid = (fieldName) => {
    return touchedFields[fieldName] && !errors[fieldName];
  };

  function onSubmit(formData) {
    register(formData);
  }

  useEffect(() => {
    if (isSuccess) {
      dispatch(openSnackbar({ message: data.message }));
      navigate("/login");
    }
  }, [isSuccess, data.message, dispatch, navigate]);

  console.log(data, isLoading, errors);

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
              Tạo tài khoản mới
            </h2>
          </div>

          {isError && error && error.data && error.data.message && (
            <ErrorMessage message={error.data.message} />
          )}

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <FormField
              control={control}
              label="Họ tên"
              name="name"
              Component={TextInput}
              error={errors["name"]}
              isValid={isFieldValid("name")}
            />
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
              label="Số điện thoại"
              name="phone_number"
              type="tel"
              Component={TextInput}
              error={errors["phone_number"]}
              isValid={isFieldValid("phone_number")}
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
            <FormField
              control={control}
              label="Xác nhận mật khẩu"
              name="confirm_password"
              type="password"
              Component={TextInput}
              error={errors["confirm_password"]}
              isValid={isFieldValid("confirm_password")}
            />
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <CheckboxInput className="text-primary h-4 w-4 rounded border-gray-300 focus:ring-red-500" />
                <span className="ml-2 text-sm text-gray-600">
                  Tôi đồng ý với{" "}
                  <Link
                    to="#"
                    className="text-secondary font-medium hover:underline"
                  >
                    Điều khoản
                  </Link>{" "}
                  &{" "}
                  <Link
                    to="#"
                    className="text-secondary font-medium hover:underline"
                  >
                    Chính sách
                  </Link>
                </span>
              </label>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-primary w-full transform cursor-pointer rounded-xl px-4 py-3 text-base font-semibold text-white transition-all duration-200 hover:scale-103 hover:shadow-lg hover:shadow-red-500/40 active:scale-95"
            >
              Đăng ký
            </button>
          </form>
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Đã có tài khoản?{" "}
              <Link
                to="/login"
                className="text-secondary font-medium hover:underline"
              >
                Đăng nhập
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

export default Register;
