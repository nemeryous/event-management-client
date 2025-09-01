import React, { useEffect, useRef } from "react";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";

export default function SunEditorEditor({ value, onChange, placeholder }) {
  const editorRef = useRef(null);

  const handleGetInstance = (sunEditor) => {
    editorRef.current = sunEditor;
    if (value != null) {
      sunEditor.setContents(value || "");
    }
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
      getSunEditorInstance={handleGetInstance}
      defaultValue={value || ""}
      onChange={(html) => onChange?.(html ?? "")}
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
