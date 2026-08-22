import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { formatDateRange, calculateTripDays, getTripStatus } from "../utils/dateUtils";

const TripCard = ({ trip, onDelete }) => {
  if (!trip) return null;

  const startDate = trip.start_date || trip.startDate;
  const endDate = trip.end_date || trip.endDate;
  const name = trip.trip_name || trip.name;
  const coverImage = trip.cover_image || trip.coverImage || "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80";

  const status = getTripStatus(startDate, endDate);
  const daysCount = calculateTripDays(startDate, endDate);
  const dateFormatted = formatDateRange(startDate, endDate);

  const getStatusBadgeClass = (s) => {
    switch (s) {
      case "Ongoing":
        return "bg-success text-white fw-bold";
      case "Completed":
        return "bg-secondary text-white";
      case "Upcoming":
      default:
        return "bg-ocean-gradient text-white fw-bold";
    }
  };

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="gt-card overflow-hidden h-100 d-flex flex-column"
    >
      {/* Cover Image Header */}
      <div className="position-relative overflow-hidden" style={{ height: "180px" }}>
        <img
          src={coverImage}
          alt={name}
          className="w-100 h-100 transition-all"
          style={{ objectFit: "cover", transition: "transform 0.4s ease" }}
        />
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(7,26,43,0.75))" }}
        ></div>

        {/* Dynamic Status Badge */}
        <span className={`position-absolute top-0 end-0 m-3 badge rounded-pill px-3 py-2 ${getStatusBadgeClass(status)}`}>
          {status}
        </span>

        {/* Days Count Badge */}
        <div className="position-absolute bottom-0 start-0 m-3 text-white">
          <p className="mb-0 small fw-bold text-aqua">
            <i className="bi bi-calendar3 me-1"></i>
            {daysCount} {daysCount === 1 ? "Day" : "Days"}
          </p>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 d-flex flex-column flex-grow-1 justify-content-between">
        <div>
          <h5 className="font-heading fw-bold text-navy-deep mb-2 line-clamp-1">{name}</h5>
          <p className="text-muted small mb-3">
            <i className="bi bi-calendar-event me-2 text-ocean-blue"></i>
            {dateFormatted}
          </p>
          {trip.description && (
            <p className="text-secondary small line-clamp-2 mb-3">
              {trip.description}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-top d-flex align-items-center justify-content-between mt-auto">
          <Link to={`/itinerary/${trip.id}/view`} className="btn btn-gt-primary btn-sm px-3 fw-semibold">
            View <i className="bi bi-arrow-right ms-1"></i>
          </Link>

          <div className="d-flex gap-2">
            <Link
              to={`/trips/${trip.id}/edit`}
              className="btn btn-sm btn-light border text-navy-deep px-2.5"
              title="Edit Trip"
            >
              <i className="bi bi-pencil"></i>
            </Link>

            {onDelete && (
              <button
                onClick={() => onDelete(trip)}
                className="btn btn-sm btn-outline-danger px-2.5"
                title="Delete Trip"
              >
                <i className="bi bi-trash"></i>
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TripCard;
