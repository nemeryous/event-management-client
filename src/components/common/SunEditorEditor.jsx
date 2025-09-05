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
    <div className="editor-scope">
      <SunEditor
        className="suneditor-tailwind font-sans"
        getSunEditorInstance={handleGetInstance}
        defaultValue={value || ""}
        onChange={(html) => onChange?.(html ?? "")}
        setDefaultStyle="font-family: 'Poppins', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans';\
     font-size: 15px; line-height: 1.8; font-weight: 400; color:#333;"
        setOptions={{
          minHeight: "600px",
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
    </div>
  );
}
