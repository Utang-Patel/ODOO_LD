import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { formatDateRange, calculateTripDays, getTripStatus } from "../utils/dateUtils";

const TripCard = ({ trip, onDelete, onShare }) => {
  const [isFavorited, setIsFavorited] = useState(false);

  if (!trip) return null;

  const startDate = trip.start_date || trip.startDate;
  const endDate = trip.end_date || trip.endDate;
  const name = trip.trip_name || trip.name;
  const coverImage = trip.cover_image || trip.coverImage || "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80";

  const status = getTripStatus(startDate, endDate);
  const daysCount = calculateTripDays(startDate, endDate);
  const dateFormatted = formatDateRange(startDate, endDate);

  // Extract stops/cities for route timeline visualization from database
  const stopsList = trip.stops || trip.trip_stops || [];
  const routeString = stopsList.length > 0
    ? stopsList.map(s => s.city?.city_name || s.City?.name || s.city_name || "City").join(" ➔ ")
    : "Multi-City Journey";

  const getStatusBadgeClass = (s) => {
    switch (s) {
      case "Ongoing":
      case "In Progress":
        return "bg-success text-white fw-bold";
      case "Completed":
        return "bg-secondary text-white";
      case "Upcoming":
      default:
        return "bg-saas-gradient text-white fw-bold";
    }
  };

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="gt-glass-card overflow-hidden h-100 d-flex flex-column border-0 shadow-lg"
    >
      {/* Cover Image Header */}
      <div className="position-relative overflow-hidden" style={{ height: "190px" }}>
        <img
          src={coverImage}
          alt={name}
          className="w-100 h-100 transition-all"
          style={{ objectFit: "cover", transition: "transform 0.4s ease" }}
        />
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ background: "linear-gradient(to bottom, rgba(7,11,26,0.2), rgba(7,11,26,0.85))" }}
        ></div>

        {/* Dynamic Status Badge */}
        <span className={`position-absolute top-0 end-0 m-3 badge rounded-pill px-3 py-1.5 font-heading ${getStatusBadgeClass(status)}`}>
          {status}
        </span>

        {/* Favorite Heart Button */}
        <button
          onClick={() => setIsFavorited(!isFavorited)}
          className="position-absolute top-0 start-0 m-3 btn btn-sm btn-dark bg-opacity-50 text-white rounded-circle p-0 d-flex align-items-center justify-content-center"
          style={{ width: "32px", height: "32px", backdropFilter: "blur(6px)" }}
          title={isFavorited ? "Remove Favorite" : "Save Favorite"}
        >
          <i className={`bi ${isFavorited ? "bi-heart-fill text-danger" : "bi-heart"}`}></i>
        </button>

        {/* Days Count Badge */}
        <div className="position-absolute bottom-0 start-0 m-3 text-white">
          <p className="mb-0 small fw-bold text-saas-gradient font-heading">
            <i className="bi bi-calendar3 me-1"></i>
            {daysCount} {daysCount === 1 ? "Day" : "Days"}
          </p>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 d-flex flex-column flex-grow-1 justify-content-between">
        <div>
          <h5 className="font-heading fw-bold text-white mb-2 text-truncate">{name}</h5>

          {/* Route Visual Line */}
          <div className="d-flex align-items-center gap-1.5 text-saas-gradient fs-7 fw-semibold mb-2 text-truncate font-heading">
            <i className="bi bi-geo-alt-fill text-secondary"></i>
            <span>{routeString}</span>
          </div>

          <p className="text-white-50 small mb-3 font-heading">
            <i className="bi bi-calendar-event me-2 text-saas-gradient"></i>
            {dateFormatted}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-top border-white border-opacity-10 d-flex align-items-center justify-content-between mt-auto">
          <Link to={`/itinerary/${trip.id}/view`} className="btn btn-gt-primary btn-sm px-3 fw-bold font-heading">
            View Itinerary <i className="bi bi-arrow-right ms-1"></i>
          </Link>

          <div className="d-flex gap-2">
            {onShare && (
              <button
                onClick={() => onShare(trip)}
                className="btn btn-sm btn-gt-outline px-2.5"
                title="Share Trip"
              >
                <i className="bi bi-share text-white"></i>
              </button>
            )}

            <Link
              to={`/trips/${trip.id}/edit`}
              className="btn btn-sm btn-gt-outline px-2.5"
              title="Edit Trip"
            >
              <i className="bi bi-pencil text-white"></i>
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
