import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import Loading from "../../components/Loading";
import tripService from "../../services/tripService";

const PRESET_COVERS = [
  { name: "Paris & Europe", url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80" },
  { name: "Tokyo & Japan", url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80" },
  { name: "Tropical Island", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80" },
  { name: "Alpine Mountains", url: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80" },
  { name: "New York City", url: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80" },
  { name: "Dubai Desert", url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80" }
];

const EditTrip = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    trip_name: "",
    description: "",
    start_date: "",
    end_date: "",
    cover_image: PRESET_COVERS[0].url,
    budget_limit: "",
    currency: "INR"
  });

  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        setInitialLoading(true);
        const res = await tripService.getTrip(id);
        if (res.success && res.trip) {
          const t = res.trip;
          setFormData({
            trip_name: t.trip_name || t.name || "",
            description: t.description || "",
            start_date: t.start_date || "",
            end_date: t.end_date || "",
            cover_image: t.cover_image || t.coverImage || PRESET_COVERS[0].url,
            budget_limit: t.budget_limit || "",
            currency: t.currency || "INR"
          });
        }
      } catch (err) {
        console.error("[Fetch Trip Edit Error]:", err);
        setError("Unable to load trip details for editing.");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchTrip();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.trip_name.trim()) {
      setError("Trip name is required.");
      return;
    }

    if (new Date(formData.end_date) < new Date(formData.start_date)) {
      setError("End date cannot be before start date.");
      return;
    }

    if (formData.budget_limit) {
      const parsed = parseFloat(formData.budget_limit);
      if (isNaN(parsed) || parsed <= 0) {
        setError("Budget limit must be greater than zero.");
        return;
      }
    }

    try {
      setLoading(true);
      const payload = {
        trip_name: formData.trip_name.trim(),
        description: formData.description.trim(),
        start_date: formData.start_date,
        end_date: formData.end_date,
        cover_image: formData.cover_image,
        budget_limit: formData.budget_limit ? parseFloat(formData.budget_limit) : null,
        currency: formData.currency || "INR"
      };

      const res = await tripService.updateTrip(id, payload);

      setSuccessMessage(res.message || "Trip updated successfully! ✈️");

      setTimeout(() => {
        navigate("/my-trips");
      }, 1200);
    } catch (err) {
      console.error("[Edit Trip Error]:", err);
      const apiMsg = err.response?.data?.message || "Failed to update trip.";
      setError(apiMsg);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <Loading message="Loading trip details..." />;
  }

  return (
    <div>
      <PageHeader
        title="Edit Trip Details"
        subtitle="Modify trip parameters, travel dates, or budget limits."
        breadcrumbs={[{ label: "My Trips", path: "/my-trips" }, { label: "Edit Trip" }]}
      />

      {error && (
        <div className="alert alert-danger d-flex align-items-center rounded-3 mb-4 shadow-sm">
          <i className="bi bi-exclamation-triangle-fill fs-5 me-2"></i>
          <div>{error}</div>
        </div>
      )}

      {successMessage && (
        <div className="alert alert-success d-flex align-items-center rounded-3 mb-4 shadow-sm">
          <i className="bi bi-check-circle-fill fs-5 me-2"></i>
          <div>{successMessage}</div>
        </div>
      )}

      <div className="gt-card p-4 p-md-5 max-w-3xl mx-auto">
        <form onSubmit={handleSubmit}>
          {/* Trip Name */}
          <div className="mb-4">
            <label className="form-label text-navy-deep fw-semibold">Trip Name</label>
            <input
              type="text"
              name="trip_name"
              className="form-control form-control-lg bg-light border-0 shadow-none"
              value={formData.trip_name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Dates */}
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <label className="form-label text-navy-deep fw-semibold">Start Date</label>
              <input
                type="date"
                name="start_date"
                className="form-control form-control-lg bg-light border-0 shadow-none"
                value={formData.start_date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label text-navy-deep fw-semibold">End Date</label>
              <input
                type="date"
                name="end_date"
                className="form-control form-control-lg bg-light border-0 shadow-none"
                value={formData.end_date}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Budget Limit & Currency */}
          <div className="row g-3 mb-4">
            <div className="col-md-8">
              <label className="form-label text-navy-deep fw-semibold">Budget Limit (Optional)</label>
              <input
                type="number"
                step="0.01"
                min="1"
                name="budget_limit"
                className="form-control form-control-lg bg-light border-0 shadow-none"
                placeholder="e.g. 100000"
                value={formData.budget_limit}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label text-navy-deep fw-semibold">Currency</label>
              <select
                name="currency"
                className="form-select form-select-lg bg-light border-0 shadow-none"
                value={formData.currency}
                onChange={handleChange}
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="form-label text-navy-deep fw-semibold">Description</label>
            <textarea
              name="description"
              rows="3"
              className="form-control bg-light border-0 shadow-none"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>

          {/* Actions */}
          <div className="d-flex align-items-center justify-content-end gap-3 pt-3 border-top">
            <Link to="/my-trips" className="btn btn-gt-outline px-4">
              Cancel
            </Link>
            <button type="submit" disabled={loading} className="btn btn-gt-primary px-4 py-2.5 font-heading fw-bold">
              {loading ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTrip;
