import React from "react";
import { Outlet, Link } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-vh-100 d-flex bg-cloud-bg">
      <div className="container-fluid p-0">
        <div className="row g-0 min-vh-100">
          {/* Left Branding / Visual Panel */}
          <div className="col-lg-6 d-none d-lg-flex flex-column justify-content-between p-5 bg-navy-deep position-relative overflow-hidden text-white">
            {/* Background Decorative Blur Gradients */}
            <div
              className="position-absolute top-0 start-0 translate-middle rounded-circle bg-ocean-gradient opacity-25 blur-3xl"
              style={{ width: "500px", height: "500px", filter: "blur(90px)" }}
            ></div>
            <div
              className="position-absolute bottom-0 end-0 translate-middle-x rounded-circle bg-sunset-gradient opacity-20 blur-3xl"
              style={{ width: "400px", height: "400px", filter: "blur(80px)" }}
            ></div>

            {/* Top Logo */}
            <div className="position-relative z-1">
              <Link to="/" className="d-inline-flex align-items-center gap-2 text-decoration-none">
                <div className="d-flex align-items-center justify-content-center bg-ocean-gradient text-white rounded-3 p-2">
                  <i className="bi bi-airplane-engines fs-4"></i>
                </div>
                <span className="font-heading fs-3 fw-bold text-white">GlobeTrotter</span>
              </Link>
            </div>

            {/* Hero Graphic & Testimonial */}
            <div className="position-relative z-1 my-auto py-5">
              <div className="mb-4">
                <span className="badge bg-white bg-opacity-10 text-aqua px-3 py-2 rounded-pill fw-semibold mb-3 border border-secondary border-opacity-25">
                  ✨ Empowering Personalized Travel Planning
                </span>
                <h1 className="font-heading display-5 fw-extrabold text-white mb-3">
                  Design Your Next Journey <br />
                  <span className="text-ocean-gradient">In Minutes.</span>
                </h1>
                <p className="text-white-50 lead fs-6 max-w-md">
                  Personalized multi-city itineraries, smart budget management, interactive visual timelines, and seamless public trip sharing.
                </p>
              </div>

              {/* Floating Route Graphic Card */}
              <div className="glass-card p-4 rounded-4 bg-white bg-opacity-10 text-white border border-white border-opacity-20 max-w-sm shadow-lg">
                <div className="d-flex align-items-center gap-3">
                  <div className="bg-sunset-gradient text-navy-deep rounded-circle p-3 d-flex align-items-center justify-content-center fw-bold">
                    ✈️
                  </div>
                  <div>
                    <h6 className="mb-1 font-heading text-white fw-bold">Paris → Zurich → Rome</h6>
                    <p className="mb-0 text-white-50 small">8 Days • 3 Multi-City Stops</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Copyright */}
            <div className="position-relative z-1">
              <p className="small text-white-50 mb-0">
                © {new Date().getFullYear()} GlobeTrotter Hackathon Edition. All rights reserved.
              </p>
            </div>
          </div>

          {/* Right Form Container */}
          <div className="col-lg-6 d-flex align-items-center justify-content-center p-4 p-sm-5 bg-cloud-bg">
            <div className="w-100" style={{ maxWidth: "440px" }}>
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
