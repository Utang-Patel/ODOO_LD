import React from "react";

const Timeline = ({ stops = [] }) => {
  return (
    <div className="position-relative ps-4 py-2">
      {/* Vertical glowing timeline axis line */}
      <div
        className="position-absolute top-0 bottom-0 start-0 border-start border-2 border-info ms-2"
        style={{ opacity: 0.6 }}
      ></div>

      {stops.map((stop, idx) => (
        <div key={stop.id || idx} className="position-relative mb-5">
          {/* Glowing node point */}
          <div
            className="position-absolute top-0 start-0 translate-middle-x rounded-circle bg-ocean-gradient border border-3 border-white shadow-sm"
            style={{ width: "22px", height: "22px", marginLeft: "-16px" }}
          ></div>

          {/* Stop Header */}
          <div className="ms-3">
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge bg-navy-deep text-white px-3 py-2 rounded-pill fs-7">
                {stop.flag} {stop.cityName}
              </span>
              <span className="text-muted small fw-semibold">
                {stop.startDate} – {stop.endDate}
              </span>
            </div>

            {/* Stop Activities */}
            {stop.activities && stop.activities.length > 0 ? (
              <div className="d-flex flex-column gap-2 mt-3">
                {stop.activities.map((act) => (
                  <div
                    key={act.id}
                    className="p-3 gt-card border-0 bg-white shadow-sm d-flex align-items-center justify-content-between"
                  >
                    <div className="d-flex align-items-center gap-3">
                      <span className="badge bg-light text-ocean-blue border fw-bold">
                        {act.time}
                      </span>
                      <div>
                        <h6 className="mb-0 font-heading fw-bold text-navy-deep">{act.name}</h6>
                        <span className="text-muted fs-7">{act.category}</span>
                      </div>
                    </div>

                    <span className="fw-bold text-navy-deep fs-7">
                      {act.cost > 0 ? `₹${act.cost}` : "Free"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted small italic ms-2">No activities planned yet.</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;
