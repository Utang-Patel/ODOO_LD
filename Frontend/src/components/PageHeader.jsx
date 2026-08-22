import React from "react";
import { Link } from "react-router-dom";

const PageHeader = ({ title, subtitle, breadcrumbs = [], action }) => {
  return (
    <div className="mb-4">
      {/* Breadcrumb links if provided */}
      {breadcrumbs.length > 0 && (
        <nav aria-label="breadcrumb" className="mb-2">
          <ol className="breadcrumb mb-0 small">
            <li className="breadcrumb-item">
              <Link to="/dashboard" className="text-decoration-none text-white-50">
                <i className="bi bi-house-door me-1"></i>Home
              </Link>
            </li>
            {breadcrumbs.map((crumb, idx) => (
              <li
                key={idx}
                className={`breadcrumb-item ${
                  idx === breadcrumbs.length - 1 ? "active fw-semibold text-saas-gradient" : "text-white-50"
                }`}
              >
                {crumb.path ? (
                  <Link to={crumb.path} className="text-decoration-none text-white-50">
                    {crumb.label}
                  </Link>
                ) : (
                  crumb.label
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      {/* Main Title & Action Row */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
        <div>
          <h2 className="font-heading fw-extrabold text-white mb-1">{title}</h2>
          {subtitle && <p className="text-white-50 mb-0 font-heading fs-6">{subtitle}</p>}
        </div>

        {action && <div>{action}</div>}
      </div>
    </div>
  );
};

export default PageHeader;
