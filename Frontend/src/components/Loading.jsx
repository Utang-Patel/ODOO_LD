import React from "react";
import logoPng from "../assets/logo.png";

const Loading = ({ message = "Loading your travel experience..." }) => {
  return (
    <div className="gt-glass-card d-flex flex-column align-items-center justify-content-center py-5 my-4 text-center border-0">
      <div className="mb-3 position-relative">
        <img
          src={logoPng}
          alt="GlobeTrotter Logo"
          className="rounded-3 shadow-lg p-2 bg-dark bg-opacity-75 border border-white border-opacity-20"
          style={{ width: "56px", height: "56px", objectFit: "contain" }}
        />
      </div>
      <div
        className="spinner-border text-primary mb-3"
        role="status"
        style={{ width: "2.2rem", height: "2.2rem", color: "#7C3AED" }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="text-white-50 font-heading fw-semibold mb-0 small">{message}</p>
    </div>
  );
};

export default Loading;
