import React from "react";
import { motion } from "framer-motion";

const ActivityCard = ({ activity, onAdd, onQuickView, isAdded }) => {
  if (!activity) return null;

  const name = activity.activity_name || activity.name;
  const category = activity.category || "Sightseeing";
  const cost = parseFloat(activity.cost || 0);
  const currency = activity.currency || "EUR";
  const rating = activity.rating || "4.8";
  const duration = activity.duration || "2 hours";
  const image = activity.image || "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=800&q=80";

  const getCategoryBadgeColor = (cat) => {
    switch (cat) {
      case "Sightseeing":
        return "bg-primary text-white";
      case "Food":
        return "bg-warning text-dark fw-bold";
      case "Adventure":
        return "bg-success text-white";
      case "Culture":
        return "bg-dark text-aqua fw-bold";
      case "Shopping":
        return "bg-info text-dark";
      case "Nature":
      default:
        return "bg-secondary text-white";
    }
  };

  const currencySymbol = currency === "EUR" ? "€" : currency === "USD" ? "$" : currency === "GBP" ? "£" : currency === "JPY" ? "¥" : "₹";

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.01 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="gt-card overflow-hidden h-100 d-flex flex-column"
    >
      <div className="position-relative overflow-hidden" style={{ height: "170px" }}>
        <img
          src={image}
          alt={name}
          className="w-100 h-100"
          style={{ objectFit: "cover" }}
        />
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(7,26,43,0.8))" }}
        ></div>

        {/* Category & Rating */}
        <div className="position-absolute top-0 start-0 m-3 d-flex align-items-center gap-2">
          <span className="badge rounded-pill px-3 py-1 shadow-sm text-white" style={{ backgroundColor: getCategoryBadgeColor(category) }}>
            {category}
          </span>
        </div>

        <div className="position-absolute top-0 end-0 m-3">
          <span className="badge bg-navy-deep text-aqua shadow-sm">
            <i className="bi bi-star-fill me-1 text-warning"></i>
            {rating}
          </span>
        </div>

        {/* Name in Header */}
        <div className="position-absolute bottom-0 start-0 m-3 text-white">
          <h5 className="font-heading fw-bold mb-0 line-clamp-1">{name}</h5>
        </div>
      </div>

      <div className="p-3 d-flex flex-column flex-grow-1 justify-content-between">
        <div>
          <p className="text-secondary small line-clamp-2 mb-3">{activity.description}</p>

          <div className="d-flex align-items-center justify-content-between text-muted fs-7 mb-3">
            <span><i className="bi bi-clock me-1 text-ocean-blue"></i>{duration}</span>
            <span className="fw-bold text-navy-deep">{cost > 0 ? `${currencySymbol}${cost}` : "Free"}</span>
          </div>
        </div>

        <div className="d-flex align-items-center justify-content-between pt-2 border-top gap-2">
          {onQuickView && (
            <button
              type="button"
              onClick={() => onQuickView(activity)}
              className="btn btn-gt-outline btn-sm px-2.5 fw-semibold"
            >
              <i className="bi bi-eye me-1"></i> Details
            </button>
          )}

          {onAdd && (
            <button
              type="button"
              onClick={() => onAdd(activity)}
              className={`btn btn-sm px-3 fw-bold ms-auto ${
                isAdded ? "btn-success" : "btn-gt-primary"
              }`}
            >
              <i className={`bi ${isAdded ? "bi-check2" : "bi-plus-circle"} me-1`}></i>
              {isAdded ? "Added" : "+ Add Activity"}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ActivityCard;
