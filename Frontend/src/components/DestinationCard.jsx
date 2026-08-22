import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const DestinationCard = ({ city, onAdd, isSaved, onToggleSave }) => {
  if (!city) return null;

  const cityName = city.city_name || city.name;
  const image = city.image || "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80";
  const costIndex = city.cost_index || city.costIndex || "$$";
  const popularity = city.popularity || 5;

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="gt-glass-card overflow-hidden h-100 d-flex flex-column border-0 shadow-lg"
    >
      <div className="position-relative overflow-hidden" style={{ height: "200px" }}>
        <img
          src={image}
          alt={cityName}
          className="w-100 h-100"
          style={{ objectFit: "cover", transition: "transform 0.4s ease" }}
        />
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ background: "linear-gradient(to bottom, rgba(7,11,26,0.2), rgba(7,11,26,0.85))" }}
        ></div>

        {/* Rating */}
        <div className="position-absolute top-0 start-0 m-3 d-flex align-items-center gap-2">
          <span className="badge bg-dark bg-opacity-75 text-warning border border-white border-opacity-10 shadow-sm font-heading">
            <i className="bi bi-star-fill me-1"></i>
            {popularity}.0
          </span>
        </div>

        {/* Save Destination Heart Button */}
        {onToggleSave && (
          <button
            type="button"
            onClick={() => onToggleSave(city)}
            className="btn btn-sm bg-dark bg-opacity-60 text-white rounded-circle position-absolute top-0 end-0 m-3 shadow-sm p-1.5 border border-white border-opacity-10"
            title={isSaved ? "Remove from Saved" : "Save Destination"}
            style={{ width: "36px", height: "36px", backdropFilter: "blur(6px)" }}
          >
            <i className={`bi ${isSaved ? "bi-heart-fill text-danger" : "bi-heart text-white"} fs-5`}></i>
          </button>
        )}

        {/* City & Country Label */}
        <div className="position-absolute bottom-0 start-0 m-3 text-white">
          <h5 className="font-heading fw-bold mb-0 text-white">{cityName}</h5>
          <span className="small text-white-50 font-heading">{city.country}</span>
        </div>
      </div>

      <div className="p-4 d-flex flex-column flex-grow-1 justify-content-between">
        <p className="text-white-50 small mb-3 line-clamp-2 font-heading">{city.description}</p>

        <div className="d-flex flex-wrap align-items-center justify-content-between pt-3 border-top border-white border-opacity-10 gap-3">
          <div>
            <span className="badge bg-dark text-saas-gradient border border-primary me-2 font-heading">{costIndex}</span>
            <span className="small text-white-50 font-heading">{city.region || "Global"}</span>
          </div>

          <div className="d-flex align-items-center gap-3 ms-auto">
            <Link
              to={`/activities/${city.id}`}
              className="btn btn-gt-outline btn-sm px-3.5 py-2 fw-semibold font-heading d-inline-flex align-items-center gap-2"
              title="View Activities"
            >
              <i className="bi bi-compass"></i>
              <span>Explore</span>
            </Link>

            {onAdd && (
              <button
                onClick={() => onAdd(city)}
                className="btn btn-gt-primary btn-sm px-3.5 py-2 fw-bold font-heading d-inline-flex align-items-center gap-2"
                title="Add City Stop to Trip"
              >
                <i className="bi bi-plus-circle-fill"></i>
                <span>Add</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DestinationCard;
