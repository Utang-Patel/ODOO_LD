import React from "react";

const StatCard = ({ label, value, icon, badge, gradient = false }) => {
  return (
    <div className={`gt-glass-card p-4 h-100 ${gradient ? "bg-saas-gradient text-white border-0" : ""}`}>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <span className={gradient ? "text-white-50 small fw-semibold font-heading" : "text-white-50 small fw-semibold font-heading"}>
          {label}
        </span>
        <div
          className={`d-flex align-items-center justify-content-center rounded-3 ${
            gradient ? "bg-white bg-opacity-20 text-white" : "bg-dark text-saas-gradient border border-white border-opacity-10"
          }`}
          style={{ width: "42px", height: "42px" }}
        >
          <i className={`bi ${icon} fs-4`}></i>
        </div>
      </div>
      <h2 className="font-heading fw-extrabold text-white mb-1">
        {value}
      </h2>
      {badge && (
        <span
          className={`badge rounded-pill font-heading ${
            gradient ? "bg-dark text-white fw-bold" : "bg-dark text-saas-gradient border border-primary"
          }`}
        >
          {badge}
        </span>
      )}
    </div>
  );
};

export default StatCard;
