import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Color from "@tiptap/extension-color";

export default function TiptapEditor({ value, onChange, placeholder }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Color
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      if (onChange) onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "tiptap-editor-content",
        placeholder: placeholder || "Nhập nội dung...",
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value]);

  return (
    <div className="tiptap-editor-wrapper">
      <div className="tiptap-toolbar" style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
  <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} title="In đậm"><b>B</b></button>
  <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} title="In nghiêng"><i>I</i></button>
  <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} title="Danh sách">• List</button>
  <button type="button" onClick={() => editor.chain().focus().setColor('#e53935').run()} title="Đổi màu">🎨</button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
