import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setError("");
    setSuccessMsg("");
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      setSuccessMsg("Login successful!");
      setTimeout(() => {
        if (result.user?.role === "admin") {
          navigate("/admin", { replace: true });
        } else {
          navigate(from, { replace: true });
        }
      }, 800);
    } else {
      setError(result.message || "Invalid email or password.");
    }
  };

  const handleQuickAdminLogin = async () => {
    setEmail("admin@gmail.com");
    setPassword("Admin@Admin");
    setError("");
    setSuccessMsg("");
    setLoading(true);

    const result = await login("admin@gmail.com", "Admin@Admin");
    setLoading(false);

    if (result.success) {
      setSuccessMsg("Logged in as Administrator 🛡️");
      setTimeout(() => {
        navigate("/admin", { replace: true });
      }, 800);
    } else {
      setError(result.message || "Failed to log in as Admin.");
    }
  };

  return (
    <div className="gt-glass-card p-4 p-sm-5 shadow-lg border-0">
      <div className="text-center mb-4">
        <h3 className="font-heading fw-extrabold text-white mb-1">Welcome Back 👋</h3>
        <p className="text-muted small mb-3 font-heading">Continue your personalized travel journey.</p>
      </div>

      {/* Admin Login Preset Button Option (Without displaying email ID text) */}
      <div className="p-3 mb-4 rounded-4 border border-warning border-opacity-30 bg-warning bg-opacity-10 text-center shadow-sm">
        <div className="d-flex align-items-center justify-content-center gap-2 text-warning fw-bold small font-heading mb-2">
          <i className="bi bi-shield-lock-fill fs-5"></i>
          <span>Administrator Access Shortcut</span>
        </div>
        <button
          type="button"
          onClick={handleQuickAdminLogin}
          disabled={loading}
          className="btn btn-warning btn-sm w-100 fw-extrabold font-heading text-dark py-2.5 shadow-sm rounded-3 d-flex align-items-center justify-content-center gap-2"
        >
          <i className="bi bi-shield-check fs-5"></i>
          <span>Login as Admin</span>
        </button>
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
          <div className="d-flex justify-content-between align-items-center mb-1">
            <label className="form-label text-white fw-semibold small mb-0 font-heading">Password</label>
            <Link to="/forgot-password" className="text-saas-gradient small text-decoration-none font-heading">
              Forgot Password?
            </Link>
          </div>
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
        </div>

        <button
          type="submit"
          className="btn btn-gt-primary w-100 py-2.5 rounded-3 mb-3 fw-bold font-heading d-flex align-items-center justify-content-center gap-2"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              <span>Logging in...</span>
            </>
          ) : (
            <span>Login</span>
          )}
        </button>

        <div className="text-center">
          <p className="small text-muted mb-0 font-heading">
            Don't have an account?{" "}
            <Link to="/signup" className="text-saas-gradient fw-bold text-decoration-none font-heading">
              Create Account
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
