import React, { useState, useRef, useEffect } from 'react';

export default function RichTextEditor({ value, onChange, placeholder = "Nhập mô tả sự kiện..." }) {
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isList, setIsList] = useState(false);
  const editorRef = useRef(null);

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
  };

  const handleKeyDown = (e) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          execCommand('bold');
          setIsBold(!isBold);
          break;
        case 'i':
          e.preventDefault();
          execCommand('italic');
          setIsItalic(!isItalic);
          break;
        case 'u':
          e.preventDefault();
          execCommand('underline');
          setIsUnderline(!isUnderline);
          break;
      }
    }
  };

  const handleInput = () => {
    if (onChange) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const toggleBold = () => {
    execCommand('bold');
    setIsBold(!isBold);
  };

  const toggleItalic = () => {
    execCommand('italic');
    setIsItalic(!isItalic);
  };

  const toggleUnderline = () => {
    execCommand('underline');
    setIsUnderline(!isUnderline);
  };

  const toggleList = () => {
    execCommand('insertUnorderedList');
    setIsList(!isList);
  };

  const addLink = () => {
    const url = prompt('Nhập URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const clearFormat = () => {
    execCommand('removeFormat');
    setIsBold(false);
    setIsItalic(false);
    setIsUnderline(false);
    setIsList(false);
  };

  // Chỉ cập nhật innerHTML khi value thay đổi do props (ví dụ khi mở modal hoặc reset form)
  useEffect(() => {
    if (editorRef.current && document.activeElement !== editorRef.current) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  return (
    <div className="rich-text-editor">
      <div className="editor-toolbar">
        <button type="button" className={`toolbar-btn ${isBold ? 'active' : ''}`} onClick={toggleBold} title="In đậm (Ctrl+B)"><strong>B</strong></button>
        <button type="button" className={`toolbar-btn ${isItalic ? 'active' : ''}`} onClick={toggleItalic} title="In nghiêng (Ctrl+I)"><em>I</em></button>
        <button type="button" className={`toolbar-btn ${isUnderline ? 'active' : ''}`} onClick={toggleUnderline} title="Gạch chân (Ctrl+U)"><u>U</u></button>
        <button type="button" className={`toolbar-btn ${isList ? 'active' : ''}`} onClick={toggleList} title="Danh sách">• List</button>
        <button type="button" className="toolbar-btn" onClick={addLink} title="Thêm liên kết">🔗</button>
        <button type="button" className="toolbar-btn" onClick={clearFormat} title="Xóa định dạng">🗑️</button>
        {/* Đổi màu chữ */}
        <button type="button" className="toolbar-btn" onClick={() => execCommand('foreColor', prompt('Nhập mã màu hoặc tên màu:', '#e53935'))} title="Đổi màu chữ">🎨</button>
        {/* Chèn ký tự đặc biệt */}
        <button type="button" className="toolbar-btn" onClick={() => execCommand('insertText', prompt('Nhập ký tự đặc biệt:', '★'))} title="Chèn ký tự đặc biệt">✨</button>
      </div>
      <div
        ref={editorRef}
        className="editor-content"
        contentEditable
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        dangerouslySetInnerHTML={{ __html: value || '' }}
      />
    </div>
  );
} 