import React from "react";

const ActivityCard = ({ activity, onAdd, isAdded }) => {
  if (!activity) return null;

  return (
    <div className="gt-card overflow-hidden h-100 d-flex flex-column">
      <div className="position-relative" style={{ height: "160px" }}>
        <img
          src={activity.image}
          alt={activity.name}
          className="w-100 h-100"
          style={{ objectFit: "cover" }}
        />
        <span className="position-absolute top-0 end-0 m-2 badge bg-navy-deep text-white shadow-sm">
          {activity.category}
        </span>
        <span className="position-absolute bottom-0 start-0 m-2 badge bg-dark bg-opacity-75 text-white">
          <i className="bi bi-clock me-1"></i>
          {activity.duration}
        </span>
      </div>

      <div className="p-3 d-flex flex-column flex-grow-1 justify-content-between">
        <div>
          <div className="d-flex align-items-center justify-content-between mb-1">
            <h6 className="font-heading fw-bold text-navy-deep mb-0">{activity.name}</h6>
            <span className="text-warning small fw-bold">
              <i className="bi bi-star-fill me-1"></i>
              {activity.rating}
            </span>
          </div>
          <p className="text-secondary fs-7 line-clamp-2 mb-3">{activity.description}</p>
        </div>

        <div className="d-flex align-items-center justify-content-between pt-2 border-top">
          <span className="fw-bold text-navy-deep fs-6">₹{activity.cost?.toLocaleString()}</span>

          {onAdd && (
            <button
              onClick={() => onAdd(activity)}
              className={`btn btn-sm ${
                isAdded ? "btn-success" : "btn-gt-primary"
              }`}
            >
              {isAdded ? (
                <>
                  <i className="bi bi-check2 me-1"></i> Added
                </>
              ) : (
                <>
                  <i className="bi bi-plus-circle me-1"></i> Add Activity
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
