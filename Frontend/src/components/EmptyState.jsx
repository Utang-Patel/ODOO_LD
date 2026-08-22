import React from "react";
import { Link } from "react-router-dom";

const EmptyState = ({ title = "No trips found ✈️", description = "Start planning your next adventure today.", actionLabel, actionPath, onAction }) => {
  return (
    <div className="gt-card p-5 text-center my-4">
      <div
        className="d-inline-flex align-items-center justify-content-center bg-light text-ocean-blue rounded-circle mb-3 p-4"
        style={{ width: "90px", height: "90px" }}
      >
        <i className="bi bi-airplane-engines fs-1"></i>
      </div>
      <h4 className="font-heading fw-bold text-navy-deep mb-2">{title}</h4>
      <p className="text-muted max-w-md mx-auto mb-4" style={{ maxWidth: "420px" }}>
        {description}
      </p>

      {actionLabel && actionPath && (
        <Link to={actionPath} className="btn btn-gt-primary px-4 py-2">
          {actionLabel}
        </Link>
      )}

      {actionLabel && onAction && !actionPath && (
        <button onClick={onAction} className="btn btn-gt-primary px-4 py-2">
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
