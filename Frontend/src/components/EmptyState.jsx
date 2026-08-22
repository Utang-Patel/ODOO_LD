import React from "react";
import { Link } from "react-router-dom";

const EmptyState = ({ title = "No trips found ✈️", description = "Start planning your next adventure today.", actionLabel, actionPath, onAction }) => {
  return (
    <div className="gt-glass-card p-5 text-center my-4 border-0">
      <div
        className="d-inline-flex align-items-center justify-content-center bg-dark text-saas-gradient rounded-circle mb-3 p-4 border border-white border-opacity-10"
        style={{ width: "84px", height: "84px" }}
      >
        <i className="bi bi-airplane fs-1"></i>
      </div>
      <h4 className="font-heading fw-bold text-white mb-2">{title}</h4>
      <p className="text-white-50 max-w-md mx-auto mb-4 font-heading" style={{ maxWidth: "420px" }}>
        {description}
      </p>

      {actionLabel && actionPath && (
        <Link to={actionPath} className="btn btn-gt-primary px-4 py-2 font-heading fw-bold">
          {actionLabel}
        </Link>
      )}

      {actionLabel && onAction && !actionPath && (
        <button onClick={onAction} className="btn btn-gt-primary px-4 py-2 font-heading fw-bold">
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
