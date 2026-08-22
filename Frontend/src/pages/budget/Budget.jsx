import React from "react";
import { useParams } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import BudgetCard from "../../components/BudgetCard";
import { DUMMY_TRIPS } from "../../data/dummyData";

const Budget = () => {
  const { tripId } = useParams();
  const trip = DUMMY_TRIPS.find((t) => t.id === tripId) || DUMMY_TRIPS[0];
  const breakdown = trip.budgetBreakdown;
  const dailyAverage = Math.round(breakdown.total / trip.daysCount);

  return (
    <div>
      <PageHeader
        title={`${trip.name} — Cost & Budget Analytics`}
        subtitle="Financial allocation, cost breakdowns, and daily expense metrics."
        breadcrumbs={[{ label: "My Trips", path: "/my-trips" }, { label: "Budget Breakdown" }]}
      />

      {/* Alert Warning if approaching budget */}
      <div className="alert alert-warning d-flex align-items-center gap-2 rounded-3 shadow-sm mb-4">
        <i className="bi bi-exclamation-triangle-fill fs-5"></i>
        <span>
          <strong>Budget Insight:</strong> Your estimated expenditure is within 90% of your target ₹90,000 budget cap.
        </span>
      </div>

      {/* Top Budget Metric Cards */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-lg-3">
          <BudgetCard
            title="Transport"
            amount={breakdown.transport}
            percentage={Math.round((breakdown.transport / breakdown.total) * 100)}
            icon="bi-airplane"
            color="ocean-blue"
          />
        </div>
        <div className="col-sm-6 col-lg-3">
          <BudgetCard
            title="Accommodation"
            amount={breakdown.accommodation}
            percentage={Math.round((breakdown.accommodation / breakdown.total) * 100)}
            icon="bi-building"
            color="sunset-orange"
          />
        </div>
        <div className="col-sm-6 col-lg-3">
          <BudgetCard
            title="Activities & Tours"
            amount={breakdown.activities}
            percentage={Math.round((breakdown.activities / breakdown.total) * 100)}
            icon="bi-ticket-perforated"
            color="aqua"
          />
        </div>
        <div className="col-sm-6 col-lg-3">
          <BudgetCard
            title="Meals & Dining"
            amount={breakdown.meals}
            percentage={Math.round((breakdown.meals / breakdown.total) * 100)}
            icon="bi-cup-hot"
            color="tropical-green"
          />
        </div>
      </div>

      {/* Category Breakdown Progress Bar Section */}
      <div className="gt-card p-4 mb-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <h5 className="font-heading fw-bold text-navy-deep mb-1">Total Estimated Cost</h5>
            <p className="text-muted small mb-0">Total cost calculated across all multi-city stops.</p>
          </div>
          <h2 className="font-heading fw-extrabold text-navy-deep">₹{breakdown.total.toLocaleString()}</h2>
        </div>

        <div className="progress mb-3" style={{ height: "16px", borderRadius: "10px" }}>
          <div className="progress-bar bg-primary" style={{ width: "30%" }} title="Transport"></div>
          <div className="progress-bar bg-warning" style={{ width: "35%" }} title="Accommodation"></div>
          <div className="progress-bar bg-info" style={{ width: "15%" }} title="Activities"></div>
          <div className="progress-bar bg-success" style={{ width: "20%" }} title="Meals"></div>
        </div>

        <div className="row g-2 pt-2 border-top text-center">
          <div className="col-6 col-md-3">
            <span className="text-muted fs-7 d-block">Average Cost / Day</span>
            <span className="fw-bold text-navy-deep">₹{dailyAverage.toLocaleString()}</span>
          </div>
          <div className="col-6 col-md-3">
            <span className="text-muted fs-7 d-block">Total Destinations</span>
            <span className="fw-bold text-navy-deep">{trip.citiesCount} Cities</span>
          </div>
          <div className="col-6 col-md-3">
            <span className="text-muted fs-7 d-block">Total Duration</span>
            <span className="fw-bold text-navy-deep">{trip.daysCount} Days</span>
          </div>
          <div className="col-6 col-md-3">
            <span className="text-muted fs-7 d-block">Status</span>
            <span className="badge bg-success">{trip.status}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Budget;
