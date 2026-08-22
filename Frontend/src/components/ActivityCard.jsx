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

  const currencySymbol = currency === "EUR" ? "€" : currency === "USD" ? "$" : currency === "GBP" ? "£" : currency === "JPY" ? "¥" : "₹";

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="gt-glass-card overflow-hidden h-100 d-flex flex-column border-0 shadow-lg"
    >
      <div className="position-relative overflow-hidden" style={{ height: "190px" }}>
        <img
          src={image}
          alt={name}
          className="w-100 h-100"
          style={{ objectFit: "cover" }}
        />
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ background: "linear-gradient(to bottom, rgba(7,11,26,0.2), rgba(7,11,26,0.85))" }}
        ></div>

        {/* Category & Rating */}
        <div className="position-absolute top-0 start-0 m-3 d-flex align-items-center gap-2">
          <span className="badge rounded-pill px-3 py-1 shadow-sm bg-saas-gradient text-white font-heading">
            {category}
          </span>
        </div>

        <div className="position-absolute top-0 end-0 m-3">
          <span className="badge bg-dark bg-opacity-75 text-warning border border-white border-opacity-10 shadow-sm font-heading">
            <i className="bi bi-star-fill me-1"></i>
            {rating}
          </span>
        </div>

        {/* Name in Header */}
        <div className="position-absolute bottom-0 start-0 m-3 text-white">
          <h5 className="font-heading fw-bold mb-0 line-clamp-1 text-white">{name}</h5>
        </div>
      </div>

      <div className="p-4 d-flex flex-column flex-grow-1 justify-content-between">
        <div>
          <p className="text-white-50 small line-clamp-2 mb-3 font-heading">{activity.description}</p>

          <div className="d-flex align-items-center justify-content-between text-white-50 fs-7 mb-3 font-heading">
            <span><i className="bi bi-clock me-1 text-saas-gradient"></i>{duration}</span>
            <span className="fw-bold text-white fs-6">{cost > 0 ? `${currencySymbol}${cost}` : "Free"}</span>
          </div>
        </div>

        <div className="d-flex align-items-center justify-content-between pt-3 border-top border-white border-opacity-10 gap-3">
          {onQuickView && (
            <button
              type="button"
              onClick={() => onQuickView(activity)}
              className="btn btn-gt-outline btn-sm px-3.5 py-2 fw-semibold font-heading d-inline-flex align-items-center gap-2"
            >
              <i className="bi bi-eye"></i>
              <span>Details</span>
            </button>
          )}

          {onAdd && (
            <button
              type="button"
              onClick={() => onAdd(activity)}
              className={`btn btn-sm px-3.5 py-2 fw-bold ms-auto font-heading d-inline-flex align-items-center gap-2 ${
                isAdded ? "btn-success" : "btn-gt-primary"
              }`}
            >
              <i className={`bi ${isAdded ? "bi-check2" : "bi-plus-circle"}`}></i>
              <span>{isAdded ? "Added" : "Add Activity"}</span>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ActivityCard;
