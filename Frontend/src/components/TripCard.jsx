import React from "react";
import { Link } from "react-router-dom";

const TripCard = ({ trip }) => {
  if (!trip) return null;

  return (
    <div className="gt-card overflow-hidden h-100 d-flex flex-column">
      {/* Cover Image Header */}
      <div className="position-relative overflow-hidden" style={{ height: "180px" }}>
        <img
          src={trip.coverImage || "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80"}
          alt={trip.name}
          className="w-100 h-100"
          style={{ objectFit: "cover", transition: "transform 0.5s ease" }}
        />
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(7,26,43,0.7))" }}
        ></div>

        {/* Status Badge */}
        <span
          className={`position-absolute top-0 end-0 m-3 badge rounded-pill px-3 py-2 ${
            trip.status === "Completed"
              ? "bg-secondary"
              : trip.status === "Draft"
              ? "bg-warning text-dark"
              : "bg-sunset-gradient text-navy-deep fw-bold"
          }`}
        >
          {trip.status || "Upcoming"}
        </span>

        {/* Floating Route Graphic Badge */}
        <div className="position-absolute bottom-0 start-0 m-3 text-white">
          <p className="mb-0 small fw-bold text-aqua">
            <i className="bi bi-geo-alt me-1"></i>
            {trip.citiesCount || 1} {trip.citiesCount === 1 ? "City" : "Cities"} • {trip.daysCount || 1} Days
          </p>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 d-flex flex-column flex-grow-1 justify-content-between">
        <div>
          <h5 className="font-heading fw-bold text-navy-deep mb-2">{trip.name}</h5>
          <p className="text-muted small mb-3">
            <i className="bi bi-calendar-event me-2 text-ocean-blue"></i>
            {trip.startDate} – {trip.endDate}
          </p>
          <p className="text-secondary small line-clamp-2 mb-3">
            {trip.description}
          </p>
        </div>

        {/* Bottom Price & View Action */}
        <div className="pt-3 border-top d-flex align-items-center justify-content-between mt-auto">
          <div>
            <span className="text-muted fs-7 d-block">Est. Budget</span>
            <span className="fw-extrabold text-navy-deep fs-6">₹{trip.estimatedBudget?.toLocaleString()}</span>
          </div>

          <div className="d-flex gap-2">
            <Link to={`/itinerary/${trip.id}`} className="btn btn-gt-outline btn-sm">
              Edit
            </Link>
            <Link to={`/itinerary/${trip.id}/view`} className="btn btn-gt-primary btn-sm">
              View Trip
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripCard;
