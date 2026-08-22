import React from "react";
import { useParams } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import Timeline from "../../components/Timeline";
import { DUMMY_TRIPS } from "../../data/dummyData";

const Calendar = () => {
  const { tripId } = useParams();
  const trip = DUMMY_TRIPS.find((t) => t.id === tripId) || DUMMY_TRIPS[0];

  return (
    <div>
      <PageHeader
        title={`${trip.name} — Visual Calendar & Timeline`}
        subtitle="Chronological timeline schedule across all stops and daily scheduled events."
        breadcrumbs={[{ label: "My Trips", path: "/my-trips" }, { label: "Calendar Timeline" }]}
      />

      <div className="gt-card p-4 p-md-5">
        <div className="d-flex align-items-center justify-content-between pb-3 mb-4 border-bottom">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-calendar-range text-ocean-blue fs-4"></i>
            <h5 className="font-heading fw-bold text-navy-deep mb-0">
              {trip.startDate} to {trip.endDate} Schedule
            </h5>
          </div>
          <span className="badge bg-ocean-gradient text-white px-3 py-2 rounded-pill">
            {trip.daysCount} Days Scheduled
          </span>
        </div>

        <Timeline stops={trip.stops} />
      </div>
    </div>
  );
};

export default Calendar;
