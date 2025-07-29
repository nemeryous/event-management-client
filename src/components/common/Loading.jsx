import React from "react";

const Loading = ({ message }) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-red-600"></div>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
};

export default Loading;
