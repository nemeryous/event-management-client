import CheckboxInput from "@components/common/CheckboxInput";
import FormField from "@components/common/FormField";
import TextInput from "@components/common/TextInput";
import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

const Register = () => {
  const { control } = useForm();

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
          <form className="space-y-6">
            <FormField
              control={control}
              label="Họ tên"
              name="fullName"
              Component={TextInput}
            />
            <FormField
              control={control}
              label="Email"
              name="email"
              type="mail"
              Component={TextInput}
            />
            <FormField
              control={control}
              label="Mật khẩu"
              name="password"
              type="password"
              Component={TextInput}
            />
            <FormField
              control={control}
              label="Xác nhận mật khẩu"
              name="confirmPassword"
              type="password"
              Component={TextInput}
            />
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <CheckboxInput className="h-4 w-4 rounded border-gray-300 text-red-500 focus:ring-red-500" />
                <span className="ml-2 text-sm text-gray-600">
                  Tôi đồng ý với{" "}
                  <Link
                    to="#"
                    className="font-medium text-blue-500 hover:text-blue-600 hover:underline"
                  >
                    Điều khoản
                  </Link>{" "}
                  &{" "}
                  <Link
                    to="#"
                    className="font-medium text-blue-500 hover:text-blue-600 hover:underline"
                  >
                    Chính sách
                  </Link>
                </span>
              </label>
            </div>
            <button
              type="submit"
              className="w-full transform cursor-pointer rounded-xl bg-red-600 px-4 py-3 text-base font-semibold text-white transition-all duration-200 hover:scale-103 hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/40 active:scale-95"
            >
              Đăng ký
            </button>
          </form>
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Đã có tài khoản?{" "}
              <Link
                to="/login"
                className="font-medium text-blue-500 hover:text-blue-600 hover:underline"
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
