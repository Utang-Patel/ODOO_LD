import React from "react";

const Loading = ({ message = "Loading your travel experience..." }) => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5 my-5">
      <div
        className="spinner-border text-ocean-blue mb-3"
        role="status"
        style={{ width: "3rem", height: "3rem" }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="text-muted font-heading fw-semibold">{message}</p>
    </div>
  );
};

export default Loading;
