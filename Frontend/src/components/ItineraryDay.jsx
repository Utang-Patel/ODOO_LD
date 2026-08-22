import React from "react";

const ItineraryDay = ({ dayNumber, date, city, flag, activities = [], onAddActivity }) => {
  return (
    <div className="gt-card p-4 mb-4">
      <div className="d-flex align-items-center justify-content-between pb-3 mb-3 border-bottom">
        <div className="d-flex align-items-center gap-3">
          <div className="badge bg-ocean-gradient text-white fs-6 px-3 py-2 rounded-pill">
            DAY {dayNumber}
          </div>
          <div>
            <h5 className="font-heading fw-bold text-navy-deep mb-0">
              {flag} {city}
            </h5>
            <span className="text-muted fs-7">{date}</span>
          </div>
        </div>

        {onAddActivity && (
          <button
            onClick={() => onAddActivity(dayNumber)}
            className="btn btn-gt-outline btn-sm d-flex align-items-center gap-1"
          >
            <i className="bi bi-plus-lg"></i>
            <span>Add Activity</span>
          </button>
        )}
      </div>

      {activities.length > 0 ? (
        <div className="d-flex flex-column gap-2">
          {activities.map((act, index) => (
            <div
              key={act.id || index}
              className="p-3 bg-light rounded-3 d-flex align-items-center justify-content-between"
            >
              <div className="d-flex align-items-center gap-3">
                <span className="badge bg-white text-navy-deep border fw-bold px-2 py-1">
                  {act.time}
                </span>
                <div>
                  <h6 className="mb-0 font-heading fw-semibold text-navy-deep">{act.name}</h6>
                  <span className="text-muted fs-7 me-3">{act.category}</span>
                </div>
              </div>
              <span className="fw-bold text-ocean-blue">
                {act.cost > 0 ? `₹${act.cost}` : "Free"}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 bg-light rounded-3 border border-dashed">
          <p className="text-muted mb-0 small">No activities scheduled for Day {dayNumber}.</p>
        </div>
      )}
    </div>
  );
};

export default ItineraryDay;
