import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const Timeline = ({
  dayDate,
  dayIndex,
  isExpanded,
  onToggleExpand,
  isToday,
  isPast,
  items = [],
  onAddActivity,
  onEditActivity,
  onDeleteActivity
}) => {
  const getCategoryColor = (cat) => {
    switch (cat) {
      case "Sightseeing": return "#7C3AED";
      case "Food": return "#EC4899";
      case "Adventure": return "#F97316";
      case "Culture": return "#8B5CF6";
      case "Shopping": return "#06B6D4";
      case "Nature":
      default: return "#10B981";
    }
  };

  const formattedDayStr = new Date(dayDate).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric"
  });

  return (
    <div className={`gt-glass-card mb-3 overflow-hidden ${isPast ? "opacity-75" : ""}`}>
      {/* Day Header */}
      <div
        onClick={onToggleExpand}
        className={`p-3 p-md-4 d-flex align-items-center justify-content-between cursor-pointer border-bottom border-white border-opacity-10 select-none ${
          isToday ? "bg-dark bg-opacity-75 text-white" : "bg-transparent text-white"
        }`}
      >
        <div className="d-flex align-items-center gap-3">
          <button className="btn btn-sm p-0 border-0 text-white-50">
            <i className={`bi ${isExpanded ? "bi-chevron-down" : "bi-chevron-right"} fs-5`}></i>
          </button>
          <div>
            <div className="d-flex align-items-center gap-2">
              <h5 className={`font-heading fw-extrabold mb-0 ${isToday ? "text-saas-gradient" : "text-white"}`}>
                DAY {dayIndex + 1} — {formattedDayStr.toUpperCase()}
              </h5>
              {isToday && <span className="badge bg-saas-gradient text-white fw-bold px-2 py-1 small font-heading">TODAY</span>}
            </div>
            <span className="small text-white-50 font-heading">
              {items.length} {items.length === 1 ? "Activity Scheduled" : "Activities Scheduled"}
            </span>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddActivity(dayDate);
          }}
          className={`btn btn-sm ${isToday ? "btn-gt-primary" : "btn-gt-outline"} px-3 fw-bold font-heading`}
        >
          <i className="bi bi-plus-circle me-1"></i> Add Activity
        </button>
      </div>

      {/* Expandable Content Panel */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="p-4"
          >
            {items.length > 0 ? (
              <div className="position-relative ps-4 ms-2 border-start border-2 border-primary border-opacity-25 d-flex flex-column gap-4">
                {items.map((item) => {
                  const actName = item.activity?.activity_name || item.activity?.name || "Activity";
                  const cat = item.activity?.category || "Sightseeing";
                  const cost = parseFloat(item.activity?.cost || 0);
                  const color = getCategoryColor(cat);

                  return (
                    <div key={item.id} className="position-relative">
                      {/* Timeline Dot */}
                      <span
                        className="position-absolute rounded-circle shadow-sm border border-2 border-white"
                        style={{
                          left: "-31px",
                          top: "4px",
                          width: "16px",
                          height: "16px",
                          backgroundColor: color
                        }}
                      ></span>

                      {/* Card Content */}
                      <div className="p-3 bg-dark bg-opacity-60 rounded-4 border border-white border-opacity-10 d-flex flex-wrap align-items-center justify-content-between gap-3 hover-shadow transition-all">
                        <div className="d-flex align-items-center gap-3">
                          <span className="badge bg-dark text-white border border-white border-opacity-20 fw-bold px-2.5 py-1.5 shadow-sm font-heading">
                            <i className="bi bi-clock me-1 text-saas-gradient"></i>
                            {item.start_time} – {item.end_time}
                          </span>

                          <div>
                            <div className="d-flex align-items-center gap-2 mb-1">
                              <span className="badge text-white px-2 py-0.5 small font-heading" style={{ backgroundColor: color }}>
                                {cat}
                              </span>
                              {item.tripStop?.city?.city_name && (
                                <span className="text-white-50 small fw-semibold font-heading">
                                  📍 {item.tripStop.city.city_name}
                                </span>
                              )}
                            </div>
                            <h6 className="font-heading fw-extrabold text-white mb-0">{actName}</h6>
                            {item.notes && <p className="text-white-50 small mb-0 mt-1">{item.notes}</p>}
                          </div>
                        </div>

                        <div className="d-flex align-items-center gap-3 ms-auto">
                          <span className="fw-extrabold text-white fs-6 font-heading">
                            {cost > 0 ? `€${cost}` : "Free"}
                          </span>

                          <button
                            onClick={() => onDeleteActivity(item.id)}
                            className="btn btn-sm btn-link text-danger p-0"
                            title="Remove Activity"
                          >
                            <i className="bi bi-x-circle fs-5"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-4 bg-dark bg-opacity-50 rounded-4 border border-dashed border-white border-opacity-10">
                <p className="text-white-50 small mb-2 font-heading">No activities scheduled for this date.</p>
                <button onClick={() => onAddActivity(dayDate)} className="btn btn-sm btn-gt-outline px-3 font-heading">
                  Add Activity
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Timeline;
