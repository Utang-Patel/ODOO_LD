import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const { signup } = useAuth();
  const navigate = useNavigate();

  const isValidEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const validatePassword = (pwd) => {
    if (pwd.length < 8) {
      return "Password must be at least 8 characters long.";
    }
    if (!/[A-Z]/.test(pwd)) {
      return "Password must contain at least 1 uppercase (capital) letter.";
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) {
      return "Password must contain at least 1 special character (e.g. !@#$%^&*).";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Full Name is required.");
      return;
    }

    if (!email.trim() || !isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    const pwdError = validatePassword(password);
    if (pwdError) {
      setError(pwdError);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setSuccessMsg("");
    setLoading(true);

    const result = await signup(name.trim(), email.trim(), password);
    setLoading(false);

    if (result.success) {
      setSuccessMsg("Account created successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } else {
      setError(result.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="gt-glass-card p-4 p-sm-5 shadow-lg border-0">
      <div className="text-center mb-4">
        <h3 className="font-heading fw-extrabold text-white mb-1">Start Your Adventure ✈️</h3>
        <p className="text-muted small">Create your GlobeTrotter account in seconds.</p>
      </div>

      {error && (
        <div className="alert alert-danger py-2 small mb-3 d-flex align-items-center gap-2" role="alert">
          <i className="bi bi-exclamation-circle-fill"></i>
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="alert alert-success py-2 small mb-3 d-flex align-items-center gap-2" role="alert">
          <i className="bi bi-check-circle-fill"></i>
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label text-white fw-semibold small font-heading">Full Name</label>
          <div className="position-relative">
            <i className="bi bi-person position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
            <input
              type="text"
              className="form-control ps-5 py-2.5 rounded-3 bg-dark text-white border-white border-opacity-20"
              placeholder="Alex Morgan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label text-white fw-semibold small font-heading">Email Address</label>
          <div className="position-relative">
            <i className="bi bi-envelope position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
            <input
              type="email"
              className="form-control ps-5 py-2.5 rounded-3 bg-dark text-white border-white border-opacity-20"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label text-white fw-semibold small font-heading">Password</label>
          <div className="position-relative">
            <i className="bi bi-lock position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
            <input
              type={showPassword ? "text" : "password"}
              className="form-control ps-5 pe-5 py-2.5 rounded-3 bg-dark text-white border-white border-opacity-20"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
            <button
              type="button"
              className="btn btn-link position-absolute top-50 end-0 translate-middle-y me-2 text-muted p-0 border-0"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex="-1"
            >
              <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
            </button>
          </div>
          <div className="form-text text-white-50 fs-8 mt-1">
            <i className="bi bi-info-circle me-1 text-saas-gradient"></i>
            Min 8 characters, 1 uppercase letter, 1 special character (e.g. @#$).
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label text-white fw-semibold small font-heading">Confirm Password</label>
          <div className="position-relative">
            <i className="bi bi-check2-circle position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
            <input
              type={showPassword ? "text" : "password"}
              className="form-control ps-5 py-2.5 rounded-3 bg-dark text-white border-white border-opacity-20"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-gt-primary w-100 py-2.5 rounded-3 mb-3 fw-bold font-heading d-flex align-items-center justify-content-center gap-2"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              <span>Creating Account...</span>
            </>
          ) : (
            <span>Create Account</span>
          )}
        </button>

        <div className="text-center">
          <p className="small text-muted mb-0">
            Already have an account?{" "}
            <Link to="/login" className="text-saas-gradient fw-bold text-decoration-none font-heading">
              Log In
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Signup;
