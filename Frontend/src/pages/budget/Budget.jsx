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

      const tripRes = await tripService.getTrip(tripId);
      if (tripRes.success && tripRes.trip) {
        setTrip(tripRes.trip);
      } else {
        setError("Trip not found.");
        return;
      }

      const expRes = await expenseService.getExpenses(tripId);
      if (expRes.success && Array.isArray(expRes.expenses)) {
        setExpenses(expRes.expenses);
      }

      const itinRes = await itineraryService.getItinerary(tripId);
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
        const res = await expenseService.updateExpense(tripId, editingExpense.id, payload);
        if (res.success) {
          setToastMessage("Expense updated successfully! 💰");
          setShowExpenseModal(false);
          fetchData();
        }
      } else {
        const res = await expenseService.addExpense(tripId, payload);
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
      await expenseService.deleteExpense(tripId, expId);
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
      <div className="gt-card p-5 text-center my-4">
        <h5 className="font-heading text-navy-deep fw-bold mb-2">{error || "Trip not found"}</h5>
        <Link to="/my-trips" className="btn btn-gt-primary px-4">Back to My Trips</Link>
      </div>
    );
  }

  const totals = calculateBudgetTotals(expenses, itineraryItems);
  const avgDailyCost = calculateAverageDailyCost(totals.totalCost, trip.start_date, trip.end_date);
  const budgetLimit = trip.budget_limit ? parseFloat(trip.budget_limit) : null;
  const budgetStatus = getBudgetStatus(totals.totalCost, budgetLimit);
  const currency = trip.currency || "INR";

  return (
    <div>
      <PageHeader
        title={`${trip.trip_name || trip.name} — Budget & Expenses 💰`}
        subtitle={`${formatDateRange(trip.start_date, trip.end_date)} • Track breakdown, daily average, and expense records.`}
        breadcrumbs={[{ label: "My Trips", path: "/my-trips" }, { label: "Trip Budget" }]}
        action={
          <button onClick={handleOpenAddModal} className="btn btn-gt-primary btn-sm fw-bold">
            <i className="bi bi-plus-circle me-1"></i> + Add Expense
          </button>
        }
      />

      {toastMessage && (
        <div className="alert alert-success d-flex align-items-center gap-2 rounded-3 shadow-sm mb-4">
          <i className="bi bi-check-circle-fill fs-5"></i>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Budget Warning Alert (if limit set) */}
      {budgetLimit && (
        <div
          className={`alert ${
            budgetStatus.status === "over"
              ? "alert-danger"
              : budgetStatus.status === "approaching"
              ? "alert-warning"
              : "alert-success"
          } d-flex align-items-center justify-content-between rounded-3 shadow-sm mb-4 p-3`}
        >
          <div className="d-flex align-items-center gap-2">
            <i
              className={`bi ${
                budgetStatus.status === "over"
                  ? "bi-exclamation-triangle-fill fs-5 text-danger"
                  : budgetStatus.status === "approaching"
                  ? "bi-exclamation-circle-fill fs-5 text-warning"
                  : "bi-check-circle-fill fs-5 text-success"
              }`}
            ></i>
            <div>
              <span className="fw-bold me-2">{budgetStatus.message}</span>
              {budgetStatus.status === "over" && (
                <span className="small">Over by {formatCurrency(budgetStatus.overAmount, currency)}</span>
              )}
            </div>
          </div>
          <span className="fw-extrabold fs-6">
            {formatCurrency(totals.totalCost, currency)} / {formatCurrency(budgetLimit, currency)}
          </span>
        </div>
      )}

      {/* Total Cost & Overview Banner */}
      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <div className="gt-card p-4 p-md-5 bg-navy-deep text-white position-relative overflow-hidden h-100 d-flex flex-column justify-content-between shadow-lg">
            <div className="position-relative z-1">
              <span className="badge bg-ocean-gradient text-white fw-bold px-3 py-1.5 rounded-pill mb-3">
                Total Estimated Budget
              </span>
              <h1 className="font-heading display-4 fw-extrabold text-aqua mb-2">
                {formatCurrency(totals.totalCost, currency)}
              </h1>
              <p className="text-white-50 mb-0">
                Calculated from transport, stay, meals expenses and scheduled itinerary activity costs.
              </p>
            </div>

            {/* Budget Limit Progress Bar */}
            {budgetLimit && (
              <div className="mt-4 pt-3 border-top border-secondary border-opacity-25">
                <div className="d-flex justify-content-between small text-white-50 mb-1">
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
                        : "bg-teal"
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
          <div className="gt-card p-4 h-100 d-flex flex-column justify-content-between">
            <div>
              <div className="p-3 bg-light rounded-3 d-inline-block text-ocean-blue mb-3">
                <i className="bi bi-calculator fs-4"></i>
              </div>
              <span className="text-muted small fw-semibold uppercase tracking-wider d-block mb-1">
                Average Daily Expense
              </span>
              <h3 className="font-heading fw-extrabold text-navy-deep mb-2">
                {formatCurrency(avgDailyCost, currency)} <span className="fs-6 text-muted font-sans fw-normal">/ day</span>
              </h3>
              <p className="text-secondary small mb-0">
                Estimated daily spend across your trip duration.
              </p>
            </div>

            <div className="pt-3 border-top mt-3">
              <span className="small text-muted">
                <i className="bi bi-info-circle me-1"></i>
                {expenses.length} expense records logged
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Cards (4 Columns) */}
      <div className="row g-3 mb-4">
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

      {/* Doughnut Chart & Breakdown Section */}
      {totals.totalCost > 0 && (
        <div className="gt-card p-4 p-md-5 mb-4">
          <h5 className="font-heading fw-extrabold text-navy-deep mb-4">Cost Allocation Breakdown</h5>
          <div className="row g-4 align-items-center">
            <div className="col-md-6">
              <BudgetChart totals={totals} currency={currency} />
            </div>
            <div className="col-md-6">
              <div className="d-flex flex-column gap-3">
                {[
                  { label: "Transport ✈️", amt: totals.transport, color: "#0EA5E9" },
                  { label: "Accommodation 🏨", amt: totals.accommodation, color: "#06D6C9" },
                  { label: "Activities 🗼", amt: totals.activities, color: "#FF8A3D" },
                  { label: "Meals 🍽️", amt: totals.meals, color: "#FFD166" }
                ].map((item, i) => (
                  <div key={i} className="p-3 bg-light rounded-3 d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-2">
                      <span className="rounded-circle d-inline-block" style={{ width: "10px", height: "10px", backgroundColor: item.color }}></span>
                      <span className="fw-semibold text-navy-deep">{item.label}</span>
                    </div>
                    <span className="fw-bold text-navy-deep">{formatCurrency(item.amt, currency)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Expense List Table / Cards */}
      <div className="gt-card p-4 p-md-5">
        <div className="d-flex align-items-center justify-content-between pb-3 mb-4 border-bottom">
          <h5 className="font-heading fw-extrabold text-navy-deep mb-0">Expense Records</h5>
          <button onClick={handleOpenAddModal} className="btn btn-gt-primary btn-sm px-3 fw-bold">
            <i className="bi bi-plus-circle me-1"></i> Add Expense
          </button>
        </div>

        {expenses.length > 0 ? (
          <div className="table-responsive">
            <table className="table align-middle table-hover">
              <thead className="bg-light">
                <tr>
                  <th className="text-muted small fw-bold">Date</th>
                  <th className="text-muted small fw-bold">Category</th>
                  <th className="text-muted small fw-bold">Description</th>
                  <th className="text-muted small fw-bold text-end">Amount</th>
                  <th className="text-muted small fw-bold text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((exp) => (
                  <tr key={exp.id}>
                    <td className="fw-semibold text-navy-deep">{exp.expense_date}</td>
                    <td>
                      <span
                        className={`badge ${
                          exp.category === "Transport"
                            ? "bg-primary"
                            : exp.category === "Accommodation"
                            ? "bg-info text-dark"
                            : exp.category === "Activities"
                            ? "bg-warning text-dark"
                            : "bg-secondary"
                        } px-2.5 py-1 rounded-pill`}
                      >
                        {exp.category}
                      </span>
                    </td>
                    <td className="text-secondary">{exp.description || "—"}</td>
                    <td className="fw-extrabold text-navy-deep text-end">{formatCurrency(exp.amount, currency)}</td>
                    <td className="text-end">
                      <button
                        onClick={() => handleOpenEditModal(exp)}
                        className="btn btn-sm btn-link text-ocean-blue p-0 me-3"
                        title="Edit Expense"
                      >
                        <i className="bi bi-pencil"></i> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteExpense(exp.id)}
                        className="btn btn-sm btn-link text-danger p-0"
                        title="Delete Expense"
                      >
                        <i className="bi bi-trash"></i> Delete
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
            actionLabel="+ Add Expense"
            onAction={handleOpenAddModal}
          />
        )}
      </div>

      {/* Add / Edit Expense Modal */}
      {showExpenseModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content gt-card border-0 shadow-lg overflow-hidden">
              <div className="modal-header bg-navy-deep text-white">
                <h5 className="modal-title font-heading fw-bold d-flex align-items-center gap-2">
                  <i className="bi bi-currency-dollar text-aqua"></i>
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
                    <label className="form-label text-navy-deep fw-semibold small">Expense Category</label>
                    <select className="form-select bg-light border-0" value={category} onChange={(e) => setCategory(e.target.value)} required>
                      <option value="Transport">Transport (Flight, Train, Taxi)</option>
                      <option value="Accommodation">Accommodation (Hotel, Resort, Airbnb)</option>
                      <option value="Activities">Activities (Tours, Tickets)</option>
                      <option value="Meals">Meals (Dining, Street Food, Drinks)</option>
                    </select>
                  </div>

                  {/* Description */}
                  <div className="mb-3">
                    <label className="form-label text-navy-deep fw-semibold small">Description</label>
                    <input
                      type="text"
                      className="form-control bg-light border-0"
                      placeholder="e.g. Flight tickets to Paris..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  {/* Amount & Date */}
                  <div className="row g-3">
                    <div className="col-6">
                      <label className="form-label text-navy-deep fw-semibold small">Amount ({currency})</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        className="form-control bg-light border-0"
                        placeholder="25000"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label text-navy-deep fw-semibold small">Expense Date</label>
                      <input
                        type="date"
                        className="form-control bg-light border-0"
                        value={expenseDate}
                        onChange={(e) => setExpenseDate(e.target.value)}
                        min={trip?.start_date}
                        max={trip?.end_date}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-footer bg-light border-top">
                  <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setShowExpenseModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" disabled={submittingExpense} className="btn btn-gt-primary btn-sm px-4 fw-bold">
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
