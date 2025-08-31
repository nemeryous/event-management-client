import React from "react";
import EventForm from "./EventForm";

const EventModal = ({ open, onClose, initialData }) => {
  if (!open) return null;

  return (
    <div className="modal" style={{ display: "block" }}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2 id="modalTitle" style={{ color: "#c52032" }}>
          Cập nhật sự kiện
        </h2>

        <div className="rounded-2xl bg-white p-6 shadow-lg">
          <EventForm
            onSuccess={onClose}
            onCancel={onClose}
            initialData={initialData}
          />
        </div>
      </div>
    </div>
  );
};

export default EventModal;
