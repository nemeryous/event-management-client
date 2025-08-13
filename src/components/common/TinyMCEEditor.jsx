import React from "react";
import { Editor } from '@tinymce/tinymce-react';

export default function TinyMCEEditor({ value, onChange, placeholder }) {
  // Lấy key từ biến môi trường
  const apiKey = import.meta.env.VITE_TINYMCE_API_KEY;
  return (
    <Editor
      apiKey={apiKey}
      value={value}
      onEditorChange={onChange}
      init={{
        height: 300,
        menubar: false,
        plugins: [
          'advlist autolink lists link charmap preview anchor',
          'searchreplace visualblocks code fullscreen',
          'insertdatetime table paste code help wordcount'
        ],
        toolbar:
          'undo redo | formatselect | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link | removeformat',
        placeholder: placeholder || 'Nhập mô tả sự kiện...'
      }}
    />
  );
}
