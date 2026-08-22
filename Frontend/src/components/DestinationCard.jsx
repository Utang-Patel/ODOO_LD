import React from "react";
import { Link } from "react-router-dom";

const DestinationCard = ({ city, onAdd }) => {
  if (!city) return null;

  return (
    <div className="gt-card overflow-hidden h-100 d-flex flex-column group">
      <div className="position-relative overflow-hidden" style={{ height: "190px" }}>
        <img
          src={city.image}
          alt={city.name}
          className="w-100 h-100"
          style={{ objectFit: "cover", transition: "transform 0.4s ease" }}
        />
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(7,26,43,0.8))" }}
        ></div>

        {/* Flag & Rating */}
        <div className="position-absolute top-0 start-0 m-3 d-flex align-items-center gap-2">
          <span className="badge bg-white text-dark shadow-sm fs-6">{city.flag}</span>
          <span className="badge bg-navy-deep text-aqua shadow-sm">
            <i className="bi bi-star-fill me-1 text-warning"></i>
            {city.popularity}.0
          </span>
        </div>

        {/* City & Country Label */}
        <div className="position-absolute bottom-0 start-0 m-3 text-white">
          <h5 className="font-heading fw-bold mb-0 text-white">{city.name}</h5>
          <span className="small text-white-50">{city.country}</span>
        </div>
      </div>

      <div className="p-3 d-flex flex-column flex-grow-1 justify-content-between">
        <p className="text-secondary small mb-3 line-clamp-2">{city.description}</p>

        <div className="d-flex align-items-center justify-content-between pt-2 border-top">
          <div>
            <span className="badge bg-light text-navy-deep border me-2">{city.costIndex}</span>
            <span className="small text-muted">{city.region}</span>
          </div>

          <div className="d-flex gap-2">
            <Link to={`/activities/${city.id}`} className="btn btn-gt-outline btn-sm">
              Explore
            </Link>
            {onAdd && (
              <button onClick={() => onAdd(city)} className="btn btn-gt-primary btn-sm">
                + Add
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationCard;
