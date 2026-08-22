import React from "react";
import logoPng from "../assets/logo.png";

const Loading = ({ message = "Loading your travel experience..." }) => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5 my-5">
      <div className="mb-3">
        <img
          src={logoPng}
          alt="GlobeTrotter Logo"
          className="rounded-3 shadow-lg bg-white p-2"
          style={{ width: "64px", height: "64px", objectFit: "contain" }}
        />
      </div>
      <div
        className="spinner-border text-ocean-blue mb-3"
        role="status"
        style={{ width: "2.5rem", height: "2.5rem" }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="text-muted font-heading fw-semibold mb-0">{message}</p>
    </div>
  );
};

export default Loading;
