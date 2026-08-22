import React, { useState } from "react";
import PageHeader from "../../components/PageHeader";
import ConfirmModal from "../../components/ConfirmModal";
import { useAuth } from "../../context/AuthContext";

const Profile = () => {
  const { user, updateUserProfile, logout } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || "Alex Morgan",
    email: user?.email || "alex.morgan@globetrotter.io",
    language: user?.language || "English",
    currency: user?.currency || "INR (₹)"
  });
  const [saved, setSaved] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUserProfile(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="My Profile & Settings 👤"
        subtitle="Manage your personal information, preferences, and saved travel destinations."
      />

      {saved && (
        <div className="alert alert-success d-flex align-items-center gap-2 rounded-3 shadow-sm mb-4">
          <i className="bi bi-check-circle-fill fs-5"></i>
          <span>Profile changes updated successfully!</span>
        </div>
      )}

      <div className="gt-card p-4 p-md-5 mb-4">
        {/* Profile Avatar Header */}
        <div className="d-flex align-items-center gap-4 pb-4 mb-4 border-bottom">
          <img
            src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"}
            alt={formData.name}
            className="rounded-circle border border-3 border-primary shadow-sm"
            style={{ width: "90px", height: "90px", objectFit: "cover" }}
          />
          <div>
            <h4 className="font-heading fw-bold text-navy-deep mb-1">{formData.name}</h4>
            <p className="text-muted small mb-2">{formData.email}</p>
            <span className="badge bg-ocean-gradient text-white">Pro GlobeTrotter</span>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit}>
          <div className="row g-4">
            <div className="col-md-6">
              <label className="form-label text-navy-deep fw-bold">Full Name</label>
              <input
                type="text"
                className="form-control py-2.5 rounded-3"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label text-navy-deep fw-bold">Email Address</label>
              <input
                type="email"
                className="form-control py-2.5 rounded-3"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label text-navy-deep fw-bold">Language Preference</label>
              <select
                className="form-select py-2.5 rounded-3"
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
              >
                <option value="English">English (US)</option>
                <option value="French">French (Français)</option>
                <option value="German">German (Deutsch)</option>
                <option value="Spanish">Spanish (Español)</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label text-navy-deep fw-bold">Preferred Currency</label>
              <select
                className="form-select py-2.5 rounded-3"
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              >
                <option value="INR (₹)">INR (₹) — Indian Rupee</option>
                <option value="USD ($)">USD ($) — US Dollar</option>
                <option value="EUR (€)">EUR (€) — Euro</option>
              </select>
            </div>

            <div className="col-12">
              <label className="form-label text-navy-deep fw-bold mb-2">Saved Destinations</label>
              <div className="d-flex flex-wrap gap-2">
                {["Paris 🇫🇷", "Zurich 🇨🇭", "Tokyo 🇯🇵", "Bali 🇮🇩"].map((dest) => (
                  <span key={dest} className="badge bg-light text-navy-deep border fs-6 px-3 py-2 rounded-pill">
                    {dest}
                  </span>
                ))}
              </div>
            </div>

            <div className="col-12 d-flex align-items-center justify-content-between pt-4 border-top">
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={() => setShowDeleteModal(true)}
              >
                Delete Account
              </button>

              <button type="submit" className="btn btn-gt-primary px-4 fw-bold">
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>

      <ConfirmModal
        show={showDeleteModal}
        title="Delete Account?"
        message="Are you sure you want to permanently delete your GlobeTrotter account and all associated itineraries?"
        confirmText="Delete Permanently"
        isDanger={true}
        onConfirm={logout}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
};

export default Profile;
