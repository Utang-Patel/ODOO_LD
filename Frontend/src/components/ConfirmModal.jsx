import React from "react";

const ConfirmModal = ({ show, title, message, onConfirm, onCancel, confirmText = "Confirm", cancelText = "Cancel", isDanger = false }) => {
  if (!show) return null;

  return (
    <>
      <div className="modal-backdrop fade show" style={{ zIndex: 1060 }}></div>
      <div className="modal fade show d-block" tabIndex="-1" style={{ zIndex: 1070 }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
            <div className="modal-header border-bottom-0 pb-0">
              <h5 className="modal-title font-heading fw-bold text-navy-deep">{title}</h5>
              <button type="button" className="btn-close" onClick={onCancel}></button>
            </div>
            <div className="modal-body py-3">
              <p className="text-secondary mb-0">{message}</p>
            </div>
            <div className="modal-footer border-top-0 pt-0">
              <button type="button" className="btn btn-gt-outline btn-sm" onClick={onCancel}>
                {cancelText}
              </button>
              <button
                type="button"
                className={`btn btn-sm ${isDanger ? "btn-danger" : "btn-gt-primary"}`}
                onClick={onConfirm}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmModal;
