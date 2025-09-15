import React, { useEffect } from "react";
import EventForm from "./EventForm";

const EventModal = ({ open, onClose, onUpdated, initialData, isEdit = false, onSubmit }) => {
  if (!open) return null;

  // Prevent background scroll when modal open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Close on ESC
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="modal" style={{ display: "block" }} role="dialog" aria-modal="true" aria-labelledby="modalTitle" onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2 id="modalTitle" style={{ color: "#c52032" }}>
          {isEdit ? "Cập nhật sự kiện" : "Tạo sự kiện"}
        </h2>
        <div className="rounded-2xl bg-white p-6 shadow-lg">
          <EventForm
            initialData={initialData}
            onSuccess={async () => {
              await onUpdated?.();
              onClose();
            }}
            onCancel={onClose}
            onError={() => {}}
            isEdit={isEdit}
            onSubmit={onSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default EventModal;