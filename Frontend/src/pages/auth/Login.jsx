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
        navigate(from, { replace: true });
      }, 800);
    } else {
      setError(result.message || "Invalid email or password.");
    }
  };

  return (
    <div className="gt-card p-4 p-sm-5 shadow-lg border-0">
      <div className="text-center mb-4">
        <h3 className="font-heading fw-extrabold text-navy-deep mb-1">Welcome Back 👋</h3>
        <p className="text-muted small">Continue your personalized travel journey.</p>
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
          <label className="form-label text-navy-deep fw-semibold small">Email Address</label>
          <div className="position-relative">
            <i className="bi bi-envelope position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
            <input
              type="email"
              className="form-control ps-5 py-2.5 rounded-3"
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
            <label className="form-label text-navy-deep fw-semibold small mb-0">Password</label>
            <Link to="/forgot-password" className="text-ocean-blue small text-decoration-none">
              Forgot Password?
            </Link>
          </div>
          <div className="position-relative">
            <i className="bi bi-lock position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
            <input
              type={showPassword ? "text" : "password"}
              className="form-control ps-5 pe-5 py-2.5 rounded-3"
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
          className="btn btn-gt-primary w-100 py-2.5 rounded-3 mb-3 fw-bold d-flex align-items-center justify-content-center gap-2"
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
          <p className="small text-muted mb-0">
            Don't have an account?{" "}
            <Link to="/signup" className="text-ocean-blue fw-bold text-decoration-none">
              Create Account
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
