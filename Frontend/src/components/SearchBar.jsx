import React from "react";

const SearchBar = ({ value, onChange, placeholder = "Search...", filterOptions = [], selectedFilter, onFilterChange }) => {
  return (
    <div className="gt-card p-3 shadow-sm mb-4">
      <div className="row g-2 align-items-center">
        <div className="col">
          <div className="position-relative">
            <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
            <input
              type="text"
              className="form-control ps-5 py-2.5 border-0 bg-light rounded-3"
              placeholder={placeholder}
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
          </div>
        </div>

        {filterOptions.length > 0 && (
          <div className="col-auto">
            <select
              className="form-select border-0 bg-light py-2.5 rounded-3 fw-medium text-navy-deep"
              value={selectedFilter}
              onChange={(e) => onFilterChange(e.target.value)}
            >
              {filterOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
