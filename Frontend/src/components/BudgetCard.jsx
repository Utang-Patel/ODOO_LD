import React from "react";

const BudgetCard = ({ title, amount, percentage, icon, color = "ocean-blue" }) => {
  return (
    <div className="gt-card p-4 h-100">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <span className="text-muted fw-semibold small">{title}</span>
        <div className={`p-2 rounded-3 bg-light text-${color}`}>
          <i className={`bi ${icon} fs-4`}></i>
        </div>
      </div>
      <h3 className="font-heading fw-extrabold text-navy-deep mb-2">₹{amount?.toLocaleString()}</h3>
      <div className="progress mb-2" style={{ height: "6px" }}>
        <div
          className={`progress-bar bg-${color}`}
          role="progressbar"
          style={{ width: `${percentage}%` }}
          aria-valuenow={percentage}
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>
      <span className="text-muted fs-7">{percentage}% of total estimated budget</span>
    </div>
  );
};

export default BudgetCard;
