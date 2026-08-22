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
      whileHover={{ y: -5, scale: 1.01 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="gt-card overflow-hidden h-100 d-flex flex-column"
    >
      <div className="position-relative overflow-hidden" style={{ height: "190px" }}>
        <img
          src={image}
          alt={cityName}
          className="w-100 h-100"
          style={{ objectFit: "cover", transition: "transform 0.4s ease" }}
        />
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(7,26,43,0.85))" }}
        ></div>

        {/* Flag & Rating */}
        <div className="position-absolute top-0 start-0 m-3 d-flex align-items-center gap-2">
          {city.country_code && (
            <span className="badge bg-white text-dark shadow-sm fs-6">
              {city.country_code}
            </span>
          )}
          <span className="badge bg-navy-deep text-aqua shadow-sm border border-secondary border-opacity-25">
            <i className="bi bi-star-fill me-1 text-warning"></i>
            {popularity}.0
          </span>
        </div>

        {/* Save Destination Heart Button */}
        {onToggleSave && (
          <button
            type="button"
            onClick={() => onToggleSave(city)}
            className="btn btn-sm bg-white rounded-circle position-absolute top-0 end-0 m-3 shadow-sm p-1.5 border-0"
            title={isSaved ? "Remove from Saved" : "Save Destination"}
            style={{ width: "36px", height: "36px" }}
          >
            <i className={`bi ${isSaved ? "bi-heart-fill text-danger" : "bi-heart text-muted"} fs-5`}></i>
          </button>
        )}

        {/* City & Country Label */}
        <div className="position-absolute bottom-0 start-0 m-3 text-white">
          <h5 className="font-heading fw-bold mb-0 text-white">{cityName}</h5>
          <span className="small text-white-50">{city.country}</span>
        </div>
      </div>

      <div className="p-3 d-flex flex-column flex-grow-1 justify-content-between">
        <p className="text-secondary small mb-3 line-clamp-2">{city.description}</p>

        <div className="d-flex align-items-center justify-content-between pt-2 border-top gap-2">
          <div>
            <span className="badge bg-light text-navy-deep border me-1">{costIndex}</span>
            <span className="small text-muted">{city.region || "Global"}</span>
          </div>

          <div className="d-flex gap-2">
            <Link to={`/activities/${city.id}`} className="btn btn-gt-outline btn-sm px-2.5 fw-semibold" title="View Activities">
              <i className="bi bi-compass me-1"></i> Explore
            </Link>

            {onAdd && (
              <button
                onClick={() => onAdd(city)}
                className="btn btn-gt-primary btn-sm px-2.5 fw-bold"
                title="Add City Stop to Trip"
              >
                <i className="bi bi-plus-circle me-1"></i> Add
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DestinationCard;
