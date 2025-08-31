import React, { useEffect, useRef } from "react";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";

export default function SunEditorEditor({ value, onChange, placeholder }) {
  const editorRef = useRef(null);

  const handleLoad = (editor) => {
    editorRef.current = editor;
    if (value) editor.setContents(value);
  };

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    const current = editor.getContents(true);
    if (value !== undefined && value !== current) {
      editor.setContents(value || "");
    }
  }, [value]);

  return (
    <SunEditor
      onChange={(html) => onChange?.(html)}
      onLoad={handleLoad}
      setContents={value || ""}
      setOptions={{
        height: "300px",
        placeholder: placeholder || "Nhập mô tả sự kiện...",
        buttonList: [
          ["undo", "redo"],
          ["formatBlock"],
          ["bold", "italic", "underline", "removeFormat"],
          ["align", "list", "outdent", "indent"],
          ["link", "image", "table"],
          ["fullScreen", "codeView", "preview"],
        ],
        katex: null,
        imageFileInput: true,
      }}
    />
  );
}
