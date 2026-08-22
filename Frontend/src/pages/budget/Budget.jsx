import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import Loading from "../../components/Loading";
import EmptyState from "../../components/EmptyState";
import BudgetCategoryCard from "../../components/BudgetCategoryCard";
import BudgetChart from "../../components/BudgetChart";
import tripService from "../../services/tripService";
import expenseService from "../../services/expenseService";
import itineraryService from "../../services/itineraryService";
import {
  formatCurrency,
  calculateBudgetTotals,
  calculateAverageDailyCost,
  getBudgetStatus
} from "../../utils/budgetUtils";
import { formatDateRange } from "../../utils/dateUtils";

const Budget = () => {
  const { tripId } = useParams();

  const [trip, setTrip] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [itineraryItems, setItineraryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  // Modal State
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [category, setCategory] = useState("Transport");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [expenseDate, setExpenseDate] = useState("");
  const [submittingExpense, setSubmittingExpense] = useState(false);
  const [modalError, setModalError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      let activeTripId = tripId;

      // Fallback: If tripId is missing or "trip_1", fetch user's first real trip from MySQL!
      if (!activeTripId || activeTripId === "trip_1") {
        const allTripsRes = await tripService.getTrips();
        if (allTripsRes.success && Array.isArray(allTripsRes.trips) && allTripsRes.trips.length > 0) {
          activeTripId = allTripsRes.trips[0].id;
        }
      }

      const tripRes = await tripService.getTrip(activeTripId);
      if (tripRes.success && tripRes.trip) {
        setTrip(tripRes.trip);
      } else {
        setError("No trip budget details found.");
        return;
      }

      const expRes = await expenseService.getExpenses(activeTripId);
      if (expRes.success && Array.isArray(expRes.expenses)) {
        setExpenses(expRes.expenses);
      }

      const itinRes = await itineraryService.getItinerary(activeTripId);
      if (itinRes.success && Array.isArray(itinRes.items)) {
        setItineraryItems(itinRes.items);
      }
    } catch (err) {
      console.error("[Fetch Budget Error]:", err);
      setError("Unable to load budget details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tripId]);

  // Open Modal for Add
  const handleOpenAddModal = () => {
    setEditingExpense(null);
    setCategory("Transport");
    setDescription("");
    setAmount("");
    setExpenseDate(trip?.start_date || "");
    setModalError("");
    setShowExpenseModal(true);
  };

  // Open Modal for Edit
  const handleOpenEditModal = (exp) => {
    setEditingExpense(exp);
    setCategory(exp.category);
    setDescription(exp.description || "");
    setAmount(exp.amount);
    setExpenseDate(exp.expense_date);
    setModalError("");
    setShowExpenseModal(true);
  };

  // Submit Add/Edit Expense
  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    setModalError("");

    const parsedAmt = parseFloat(amount);
    if (isNaN(parsedAmt) || parsedAmt <= 0) {
      setModalError("Expense amount must be greater than zero.");
      return;
    }

    if (!expenseDate) {
      setModalError("Expense date is required.");
      return;
    }

    if (trip) {
      const tripStart = new Date(trip.start_date);
      const tripEnd = new Date(trip.end_date);
      const expD = new Date(expenseDate);
      if (expD < tripStart || expD > tripEnd) {
        setModalError(`Expense date must fall within trip dates (${trip.start_date} to ${trip.end_date}).`);
        return;
      }
    }

    try {
      setSubmittingExpense(true);
      const payload = {
        category,
        description,
        amount: parsedAmt,
        currency: trip?.currency || "INR",
        expense_date: expenseDate
      };

      if (editingExpense) {
        const res = await expenseService.updateExpense(trip?.id, editingExpense.id, payload);
        if (res.success) {
          setToastMessage("Expense updated successfully! 💰");
          setShowExpenseModal(false);
          fetchData();
        }
      } else {
        const res = await expenseService.addExpense(trip?.id, payload);
        if (res.success) {
          setToastMessage("Expense added successfully! 💰");
          setShowExpenseModal(false);
          fetchData();
        }
      }
      setTimeout(() => setToastMessage(""), 3000);
    } catch (err) {
      console.error("[Submit Expense Error]:", err);
      const apiMsg = err.response?.data?.message || "Failed to save expense.";
      setModalError(apiMsg);
    } finally {
      setSubmittingExpense(false);
    }
  };

  // Delete Expense
  const handleDeleteExpense = async (expId) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;
    try {
      await expenseService.deleteExpense(trip?.id, expId);
      setExpenses((prev) => prev.filter((e) => e.id !== expId));
      setToastMessage("Expense deleted successfully.");
      setTimeout(() => setToastMessage(""), 3000);
    } catch (err) {
      console.error("[Delete Expense Error]:", err);
    }
  };

  if (loading) {
    return <Loading message="Calculating your trip budget..." />;
  }

  if (error || !trip) {
    return (
      <div className="gt-glass-card p-5 text-center my-4">
        <h5 className="font-heading text-white fw-bold mb-2">{error || "No trips planned yet"}</h5>
        <p className="text-white-50 small mb-4 font-heading">Plan your first trip to track budget and travel expenses.</p>
        <Link to="/create-trip" className="btn btn-gt-primary px-4 font-heading fw-bold">Plan New Trip</Link>
      </div>
    );
  }

  const totals = calculateBudgetTotals(expenses, itineraryItems);
  const avgDailyCost = calculateAverageDailyCost(totals.totalCost, trip.start_date, trip.end_date);
  const budgetLimit = trip.budget_limit ? parseFloat(trip.budget_limit) : null;
  const budgetStatus = getBudgetStatus(totals.totalCost, budgetLimit);
  const currency = trip.currency || "INR";

  return (
    <div className="d-flex flex-column gap-4 py-2">
      <PageHeader
        title={`${trip.trip_name || trip.name} — Budget & Expenses 💰`}
        subtitle={`${formatDateRange(trip.start_date, trip.end_date)} • Track breakdown, daily average, and expense records.`}
        breadcrumbs={[{ label: "My Trips", path: "/my-trips" }, { label: "Trip Budget" }]}
        action={
          <button onClick={handleOpenAddModal} className="btn btn-gt-primary btn-sm fw-bold font-heading px-3.5 py-2 d-flex align-items-center gap-2">
            <i className="bi bi-plus-circle-fill"></i>
            <span>Add Expense</span>
          </button>
        }
      />

      {toastMessage && (
        <div className="alert alert-success d-flex align-items-center gap-2 rounded-3 shadow-sm mb-4">
          <i className="bi bi-check-circle-fill fs-5"></i>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Dark Glass Budget Alert Banner */}
      {budgetLimit && (
        <div
          className="gt-glass-card p-4 mb-4 rounded-4 d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 text-white border-0 shadow-lg"
          style={{
            background: budgetStatus.status === "over"
              ? "rgba(225, 29, 72, 0.15)"
              : budgetStatus.status === "approaching"
              ? "rgba(245, 158, 11, 0.15)"
              : "rgba(16, 185, 129, 0.15)",
            borderLeft: budgetStatus.status === "over"
              ? "5px solid #F43F5E"
              : budgetStatus.status === "approaching"
              ? "5px solid #F59E0B"
              : "5px solid #10B981"
          }}
        >
          <div className="d-flex align-items-center gap-3">
            <i
              className={`bi ${
                budgetStatus.status === "over"
                  ? "bi-exclamation-triangle-fill fs-4 text-danger"
                  : budgetStatus.status === "approaching"
                  ? "bi-exclamation-circle-fill fs-4 text-warning"
                  : "bi-check-circle-fill fs-4 text-success"
              }`}
            ></i>
            <div>
              <span className="fw-bold me-2 font-heading fs-6 text-white">{budgetStatus.message}</span>
              {budgetStatus.status === "over" && (
                <span className="small text-white-50 font-heading">Over by {formatCurrency(budgetStatus.overAmount, currency)}</span>
              )}
            </div>
          </div>
          <span className="fw-extrabold fs-5 font-heading text-saas-gradient">
            {formatCurrency(totals.totalCost, currency)} / {formatCurrency(budgetLimit, currency)}
          </span>
        </div>
      )}

      {/* Total Cost & Overview Banner */}
      <div className="row g-4 g-xl-5 mb-2">
        <div className="col-lg-8">
          <div className="gt-glass-card p-4 p-md-5 text-white position-relative overflow-hidden h-100 d-flex flex-column justify-content-between shadow-lg">
            <div className="position-relative z-1">
              <span className="badge bg-saas-gradient text-white fw-bold px-3 py-1.5 rounded-pill mb-3 font-heading">
                Total Estimated Budget
              </span>
              <h1 className="font-heading display-4 fw-extrabold text-saas-gradient mb-3">
                {formatCurrency(totals.totalCost, currency)}
              </h1>
              <p className="text-white-50 mb-0 font-heading">
                Calculated from transport, stay, meals expenses and scheduled itinerary activity costs.
              </p>
            </div>

            {/* Budget Limit Progress Bar */}
            {budgetLimit && (
              <div className="mt-4 pt-4 border-top border-white border-opacity-10">
                <div className="d-flex justify-content-between small text-white-50 mb-2 font-heading">
                  <span>Budget Limit Used</span>
                  <span className="fw-bold text-white">{budgetStatus.percentage}%</span>
                </div>
                <div className="progress rounded-pill bg-dark overflow-hidden" style={{ height: "8px" }}>
                  <div
                    className={`progress-bar rounded-pill ${
                      budgetStatus.status === "over"
                        ? "bg-danger"
                        : budgetStatus.status === "approaching"
                        ? "bg-warning"
                        : "bg-saas-gradient"
                    }`}
                    style={{ width: `${budgetStatus.percentage}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Daily Average Card */}
        <div className="col-lg-4">
          <div className="gt-glass-card p-4 p-md-5 h-100 d-flex flex-column justify-content-between shadow-lg">
            <div>
              <div className="p-3 bg-dark rounded-3 d-inline-block text-saas-gradient mb-3 border border-white border-opacity-10">
                <i className="bi bi-calculator fs-4"></i>
              </div>
              <span className="text-white-50 small fw-semibold uppercase tracking-wider d-block mb-2 font-heading">
                Average Daily Expense
              </span>
              <h3 className="font-heading fw-extrabold text-white mb-2">
                {formatCurrency(avgDailyCost, currency)} <span className="fs-6 text-white-50 font-sans fw-normal">/ day</span>
              </h3>
              <p className="text-white-50 small mb-0 font-heading">
                Estimated daily spend across your trip duration.
              </p>
            </div>

            <div className="pt-3 border-top border-white border-opacity-10 mt-4">
              <span className="small text-white-50 font-heading">
                <i className="bi bi-info-circle me-1 text-saas-gradient"></i>
                {expenses.length} expense records logged
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Cards (4 Columns with Wide Grid Spacing) */}
      <div className="row g-4 mb-2">
        <div className="col-6 col-lg-3">
          <BudgetCategoryCard category="Transport" amount={totals.transport} totalCost={totals.totalCost} currency={currency} />
        </div>
        <div className="col-6 col-lg-3">
          <BudgetCategoryCard category="Accommodation" amount={totals.accommodation} totalCost={totals.totalCost} currency={currency} />
        </div>
        <div className="col-6 col-lg-3">
          <BudgetCategoryCard category="Activities" amount={totals.activities} totalCost={totals.totalCost} currency={currency} />
        </div>
        <div className="col-6 col-lg-3">
          <BudgetCategoryCard category="Meals" amount={totals.meals} totalCost={totals.totalCost} currency={currency} />
        </div>
      </div>

      {/* Doughnut Chart & Cost Allocation Breakdown Section */}
      {totals.totalCost > 0 && (
        <div className="gt-glass-card p-4 p-md-5 mb-2 shadow-lg">
          <h5 className="font-heading fw-extrabold text-white mb-4">Cost Allocation Breakdown</h5>
          <div className="row g-4 g-xl-5 align-items-center">
            <div className="col-md-5 col-lg-4 text-center">
              <BudgetChart totals={totals} currency={currency} />
            </div>
            <div className="col-md-7 col-lg-8">
              <div className="d-flex flex-column gap-3">
                {[
                  { category: "Transport", icon: "✈️", amt: totals.transport, color: "#7C3AED" },
                  { category: "Accommodation", icon: "🏨", amt: totals.accommodation, color: "#EC4899" },
                  { category: "Activities", icon: "🗼", amt: totals.activities, color: "#F97316" },
                  { category: "Meals", icon: "🍽️", amt: totals.meals, color: "#06B6D4" }
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-3.5 px-4 rounded-4 d-flex align-items-center justify-content-between border border-white border-opacity-10 shadow-sm"
                    style={{ backgroundColor: "rgba(11, 16, 38, 0.75)" }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <span
                        className="rounded-circle d-inline-block shadow-sm"
                        style={{ width: "14px", height: "14px", backgroundColor: item.color, flexShrink: 0 }}
                      ></span>
                      <span className="fw-extrabold text-white font-heading fs-6">{item.category}</span>
                      <span className="fs-6 ms-1">{item.icon}</span>
                    </div>
                    <span className="fw-extrabold text-saas-gradient font-heading fs-5 ms-3">
                      {formatCurrency(item.amt, currency)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Expense List Table / Cards */}
      <div className="gt-glass-card p-4 p-md-5 shadow-lg">
        <div className="d-flex align-items-center justify-content-between pb-3 mb-4 border-bottom border-white border-opacity-10">
          <h5 className="font-heading fw-extrabold text-white mb-0">Expense Records</h5>
          <button onClick={handleOpenAddModal} className="btn btn-gt-primary btn-sm px-3.5 py-2 fw-bold font-heading d-flex align-items-center gap-2">
            <i className="bi bi-plus-circle-fill"></i>
            <span>Add Expense</span>
          </button>
        </div>

        {expenses.length > 0 ? (
          <div className="table-responsive">
            <table className="table align-middle table-dark table-hover bg-transparent">
              <thead>
                <tr className="border-bottom border-white border-opacity-10">
                  <th className="text-muted small fw-bold font-heading">Date</th>
                  <th className="text-muted small fw-bold font-heading">Category</th>
                  <th className="text-muted small fw-bold font-heading">Description</th>
                  <th className="text-muted small fw-bold font-heading text-end">Amount</th>
                  <th className="text-muted small fw-bold font-heading text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((exp) => (
                  <tr key={exp.id} className="border-bottom border-white border-opacity-10">
                    <td className="fw-semibold text-white font-heading">{exp.expense_date}</td>
                    <td>
                      <span className="badge bg-saas-gradient px-2.5 py-1 rounded-pill font-heading fw-bold text-white">
                        {exp.category}
                      </span>
                    </td>
                    <td className="text-white-50">{exp.description || "—"}</td>
                    <td className="fw-extrabold text-white text-end font-heading">{formatCurrency(exp.amount, currency)}</td>
                    <td className="text-end">
                      <button
                        onClick={() => handleOpenEditModal(exp)}
                        className="btn btn-sm btn-link text-saas-gradient p-0 me-3 font-heading"
                        title="Edit Expense"
                      >
                        <i className="bi bi-pencil me-1"></i> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteExpense(exp.id)}
                        className="btn btn-sm btn-link text-danger p-0 font-heading"
                        title="Delete Expense"
                      >
                        <i className="bi bi-trash me-1"></i> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No expenses added yet 💰"
            description="Start adding your travel costs to track your budget accurately."
            actionLabel="Add Expense"
            onAction={handleOpenAddModal}
          />
        )}
      </div>

      {/* Add / Edit Expense Modal */}
      {showExpenseModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(7,11,26,0.85)", zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content gt-glass-card border border-white border-opacity-20 shadow-lg overflow-hidden">
              <div className="modal-header border-bottom border-white border-opacity-10 text-white">
                <h5 className="modal-title font-heading fw-bold d-flex align-items-center gap-2">
                  <i className="bi bi-currency-dollar text-saas-gradient"></i>
                  {editingExpense ? "Edit Expense" : "Add New Expense"}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowExpenseModal(false)}></button>
              </div>

              <form onSubmit={handleExpenseSubmit}>
                <div className="modal-body p-4">
                  {modalError && (
                    <div className="alert alert-danger small p-2 mb-3 rounded-3">
                      <i className="bi bi-exclamation-circle me-1"></i> {modalError}
                    </div>
                  )}

                  {/* Category */}
                  <div className="mb-3">
                    <label className="form-label text-white fw-semibold small font-heading">Expense Category</label>
                    <select className="form-select bg-dark text-white border-white border-opacity-20" value={category} onChange={(e) => setCategory(e.target.value)} required>
                      <option value="Transport">Transport (Flight, Train, Taxi)</option>
                      <option value="Accommodation">Accommodation (Hotel, Resort, Airbnb)</option>
                      <option value="Activities">Activities (Tours, Tickets)</option>
                      <option value="Meals">Meals (Dining, Street Food, Drinks)</option>
                    </select>
                  </div>

                  {/* Description */}
                  <div className="mb-3">
                    <label className="form-label text-white fw-semibold small font-heading">Description</label>
                    <input
                      type="text"
                      className="form-control bg-dark text-white border-white border-opacity-20"
                      placeholder="e.g. Flight tickets to Paris..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  {/* Amount & Date */}
                  <div className="row g-3">
                    <div className="col-6">
                      <label className="form-label text-white fw-semibold small font-heading">Amount ({currency})</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        className="form-control bg-dark text-white border-white border-opacity-20"
                        placeholder="25000"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label text-white fw-semibold small font-heading">Expense Date</label>
                      <input
                        type="date"
                        className="form-control bg-dark text-white border-white border-opacity-20"
                        value={expenseDate}
                        onChange={(e) => setExpenseDate(e.target.value)}
                        min={trip?.start_date}
                        max={trip?.end_date}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-top border-white border-opacity-10">
                  <button type="button" className="btn btn-gt-outline btn-sm font-heading" onClick={() => setShowExpenseModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" disabled={submittingExpense} className="btn btn-gt-primary btn-sm px-4 fw-bold font-heading">
                    {submittingExpense ? "Saving..." : editingExpense ? "Update Expense" : "Add Expense"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Budget;
