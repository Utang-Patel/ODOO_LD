import React from "react";

const StatCard = ({ label, value, icon, badge, gradient = false }) => {
  return (
    <div className={`gt-card p-4 h-100 ${gradient ? "bg-ocean-gradient text-white" : ""}`}>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <span className={gradient ? "text-white-50 small fw-semibold" : "text-muted small fw-semibold"}>
          {label}
        </span>
        <div
          className={`d-flex align-items-center justify-content-center rounded-3 ${
            gradient ? "bg-white bg-opacity-20 text-white" : "bg-light text-ocean-blue"
          }`}
          style={{ width: "42px", height: "42px" }}
        >
          <i className={`bi ${icon} fs-4`}></i>
        </div>
      </div>
      <h2 className={`font-heading fw-extrabold mb-1 ${gradient ? "text-white" : "text-navy-deep"}`}>
        {value}
      </h2>
      {badge && (
        <span
          className={`badge rounded-pill ${
            gradient ? "bg-white text-navy-deep fw-bold" : "bg-light text-success border"
          }`}
        >
          {badge}
        </span>
      )}
    </div>
  );
};

export default StatCard;
