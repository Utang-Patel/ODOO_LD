import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import Loading from "../../components/Loading";
import DestinationCard from "../../components/DestinationCard";
import ConfirmModal from "../../components/ConfirmModal";
import { useAuth } from "../../context/AuthContext";
import profileService from "../../services/profileService";
import savedDestinationService from "../../services/savedDestinationService";
import tripService from "../../services/tripService";

const Profile = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [profile, setProfile] = useState(null);
  const [savedCities, setSavedCities] = useState([]);
  const [tripCount, setTripCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  // Edit Form State
  const [name, setName] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [language, setLanguage] = useState("en");
  const [savingProfile, setSavingProfile] = useState(false);
  const [editError, setEditError] = useState("");

  // Delete Account Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      setError("");

      const profRes = await profileService.getProfile();
      if (profRes.success && profRes.user) {
        const u = profRes.user;
        setProfile(u);
        setName(u.name || "");
        setProfileImage(u.profile_image || "");
        setLanguage(u.language || "en");
      }

      const savedRes = await savedDestinationService.getSavedDestinations();
      if (savedRes.success && Array.isArray(savedRes.savedDestinations)) {
        setSavedCities(savedRes.savedDestinations);
      }

      const tripsRes = await tripService.getTrips();
      if (tripsRes.success && Array.isArray(tripsRes.trips)) {
        setTripCount(tripsRes.trips.length);
      }
    } catch (err) {
      console.error("[Fetch Profile Error]:", err);
      setError("Unable to load profile data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setEditError("");

    if (!name.trim()) {
      setEditError("Full name is required.");
      return;
    }

    try {
      setSavingProfile(true);
      const res = await profileService.updateProfile({
        name: name.trim(),
        profile_image: profileImage ? profileImage.trim() : null,
        language
      });

      if (res.success) {
        setToastMessage("Profile updated successfully! 👤");
        setProfile((prev) => ({ ...prev, name: res.user.name, profile_image: res.user.profile_image, language: res.user.language }));
        setTimeout(() => setToastMessage(""), 3000);
      }
    } catch (err) {
      console.error("[Update Profile Error]:", err);
      const apiMsg = err.response?.data?.message || "Failed to update profile.";
      setEditError(apiMsg);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleRemoveSaved = async (city) => {
    try {
      await savedDestinationService.removeSavedDestination(city.id);
      setSavedCities((prev) => prev.filter((c) => c.id !== city.id));
      setToastMessage(`Removed ${city.city_name || city.name} from saved destinations.`);
      setTimeout(() => setToastMessage(""), 3000);
    } catch (err) {
      console.error("[Remove Saved Error]:", err);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setDeletingAccount(true);
      await profileService.deleteProfile();
      logout();
      navigate("/login");
    } catch (err) {
      console.error("[Delete Account Error]:", err);
      setError("Unable to delete account. Please try again.");
    } finally {
      setDeletingAccount(false);
      setShowDeleteModal(false);
    }
  };

  const getInitials = (str) => {
    if (!str) return "GT";
    const parts = str.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return str.substring(0, 2).toUpperCase();
  };

  if (loading) {
    return <Loading message="Loading your profile..." />;
  }

  if (error || !profile) {
    return (
      <div className="gt-glass-card p-5 text-center my-4">
        <h5 className="font-heading text-white fw-bold mb-2">{error || "Profile not found"}</h5>
        <button onClick={fetchProfileData} className="btn btn-gt-primary px-4">Retry</button>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column gap-4 py-2">
      <PageHeader
        title="My Profile & Settings 👤"
        subtitle="Manage your GlobeTrotter account details, preferences, and saved destinations."
      />

      {toastMessage && (
        <div className="alert alert-success d-flex align-items-center gap-2 rounded-3 shadow-sm mb-4">
          <i className="bi bi-check-circle-fill fs-5"></i>
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="row g-4 g-xl-5">
        {/* Left Column: Profile Card Overview */}
        <div className="col-lg-4">
          <div className="gt-glass-card p-4 p-md-5 text-center h-100 d-flex flex-column justify-content-between shadow-lg">
            <div>
              {/* Default Name Word Avatar Badge */}
              <div className="position-relative d-inline-block mb-4">
                <div
                  className="rounded-circle bg-saas-gradient text-white font-heading fw-extrabold fs-1 d-flex align-items-center justify-content-center mx-auto shadow-lg border border-4 border-white border-opacity-25"
                  style={{ width: "120px", height: "120px" }}
                >
                  {getInitials(profile.name)}
                </div>
              </div>

              <h3 className="font-heading fw-extrabold text-white mb-1">{profile.name}</h3>
              <p className="text-white-50 small mb-4 font-heading">{profile.email}</p>

              <span className="badge bg-dark text-saas-gradient border border-primary px-3.5 py-2 rounded-pill fw-semibold mb-4 font-heading fs-7">
                Language: {profile.language === "hi" ? "Hindi (हिंदी)" : profile.language === "gu" ? "Gujarati (ગુજરાતી)" : "English (EN)"}
              </span>

              {/* Statistics Row */}
              <div className="row g-2 p-4 bg-dark rounded-4 border border-white border-opacity-10 mb-4">
                <div className="col-6 border-end border-white border-opacity-10">
                  <span className="text-white-50 fs-7 d-block font-heading mb-1">Trips Planned</span>
                  <span className="fw-extrabold text-white fs-4 font-heading">{tripCount}</span>
                </div>
                <div className="col-6">
                  <span className="text-white-50 fs-7 d-block font-heading mb-1">Saved Places</span>
                  <span className="fw-extrabold text-white fs-4 font-heading">{savedCities.length}</span>
                </div>
              </div>
            </div>

            {/* Logout Action */}
            <div className="pt-4 border-top border-white border-opacity-10">
              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="btn btn-outline-danger w-100 py-2.5 fw-bold font-heading"
              >
                <i className="bi bi-box-arrow-right me-2"></i> Log Out
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Edit Settings Form */}
        <div className="col-lg-8">
          <div className="gt-glass-card p-4 p-md-5 mb-4 shadow-lg">
            <h5 className="font-heading fw-extrabold text-white mb-4">Personal Information & Preferences</h5>

            {editError && (
              <div className="alert alert-danger small p-2 mb-3 rounded-3">
                <i className="bi bi-exclamation-circle me-1"></i> {editError}
              </div>
            )}

            <form onSubmit={handleUpdateProfile}>
              <div className="row g-3 g-md-4 mb-4">
                <div className="col-md-6">
                  <label className="form-label text-white fw-semibold font-heading mb-2">Full Name</label>
                  <input
                    type="text"
                    className="form-control form-control-lg bg-dark text-white border-white border-opacity-20 shadow-none"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-white fw-semibold font-heading mb-2">Email Address (Read-only)</label>
                  <input
                    type="email"
                    readOnly
                    className="form-control form-control-lg bg-dark text-muted border-white border-opacity-10 shadow-none"
                    value={profile.email}
                  />
                </div>
              </div>

              <div className="row g-3 g-md-4 mb-4">
                <div className="col-md-6">
                  <label className="form-label text-white fw-semibold font-heading mb-2">Language Preference</label>
                  <select
                    className="form-select form-select-lg bg-dark text-white border-white border-opacity-20 shadow-none"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <option value="en">English (EN)</option>
                    <option value="hi">Hindi (हिंदी)</option>
                    <option value="gu">Gujarati (ગુજરાતી)</option>
                  </select>
                </div>
              </div>

              <div className="d-flex justify-content-end pt-3 border-top border-white border-opacity-10">
                <button type="submit" disabled={savingProfile} className="btn btn-gt-primary px-4 py-2.5 fw-bold font-heading">
                  {savingProfile ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>

          {/* Danger Zone: Delete Account */}
          <div className="gt-glass-card p-4 border border-danger border-opacity-25 bg-danger bg-opacity-10 shadow-sm">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
              <div>
                <h6 className="font-heading fw-bold text-danger mb-1">Danger Zone — Delete Account</h6>
                <p className="text-white-50 small mb-0 font-heading">Permanently delete your account and all associated trips and data.</p>
              </div>
              <button onClick={() => setShowDeleteModal(true)} className="btn btn-danger btn-sm px-3.5 py-2 fw-bold font-heading">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Saved Destinations Section */}
      <div className="mt-4 pt-3">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h4 className="font-heading fw-extrabold text-white mb-1">Saved Destinations ❤️</h4>
            <p className="text-white-50 small mb-0 font-heading">Your favorite travel places saved for future itineraries.</p>
          </div>
          <Link to="/cities" className="btn btn-gt-outline btn-sm px-3.5 py-2 fw-semibold font-heading">
            Explore Cities <i className="bi bi-arrow-right ms-1"></i>
          </Link>
        </div>

        {savedCities.length > 0 ? (
          <div className="row g-4 g-xl-5">
            {savedCities.map((city) => (
              <div key={city.id} className="col-md-6 col-lg-4">
                <DestinationCard
                  city={city}
                  isSaved={true}
                  onToggleSave={handleRemoveSaved}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="gt-glass-card p-5 text-center">
            <p className="text-white-50 mb-3 font-heading">Save places you want to visit ❤️</p>
            <Link to="/cities" className="btn btn-gt-primary px-4 py-2.5 font-heading fw-bold">
              Explore Destinations
            </Link>
          </div>
        )}
      </div>

      {/* Delete Account Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete your account permanently?"
        message="Are you sure you want to delete your account? This will permanently remove your account and all your trips, itineraries, expenses, and saved destinations. This action cannot be undone."
        confirmText="Yes, Delete My Account"
        cancelText="Cancel"
        confirmVariant="danger"
        isLoading={deletingAccount}
        onConfirm={handleDeleteAccount}
        onClose={() => setShowDeleteModal(false)}
      />
    </div>
  );
};

export default Profile;
