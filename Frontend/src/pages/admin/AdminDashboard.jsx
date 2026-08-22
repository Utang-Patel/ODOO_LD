import React from "react";
import PageHeader from "../../components/PageHeader";
import StatCard from "../../components/StatCard";

const AdminDashboard = () => {
  return (
    <div>
      <PageHeader
        title="Admin & Analytics Platform 📊"
        subtitle="Platform usage metrics, user growth, popular cities, and system analytics."
      />

      {/* Top Metric Cards */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-lg-3">
          <StatCard label="Total Registered Users" value="1,248" icon="bi-people" badge="+14% this month" />
        </div>
        <div className="col-sm-6 col-lg-3">
          <StatCard label="Total Trips Created" value="3,890" icon="bi-airplane" badge="Active Platform" />
        </div>
        <div className="col-sm-6 col-lg-3">
          <StatCard label="Top Destination City" value="Paris 🇫🇷" icon="bi-trophy" badge="#1 Trending" />
        </div>
        <div className="col-sm-6 col-lg-3">
          <StatCard label="Platform Engagement" value="94.2%" icon="bi-activity" badge="Optimal" gradient />
        </div>
      </div>

      {/* Analytics Tables */}
      <div className="row g-4">
        <div className="col-lg-7">
          <div className="gt-card p-4">
            <h5 className="font-heading fw-bold text-navy-deep mb-3">Popular Travel Destinations</h5>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>City</th>
                    <th>Country</th>
                    <th>Total Trips</th>
                    <th>Cost Index</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="fw-bold">Paris 🇫🇷</td>
                    <td>France</td>
                    <td>1,240</td>
                    <td><span className="badge bg-light text-dark">$$$</span></td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Tokyo 🇯🇵</td>
                    <td>Japan</td>
                    <td>980</td>
                    <td><span className="badge bg-light text-dark">$$$</span></td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Zurich 🇨🇭</td>
                    <td>Switzerland</td>
                    <td>750</td>
                    <td><span className="badge bg-light text-dark">$$$$</span></td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Bali 🇮🇩</td>
                    <td>Indonesia</td>
                    <td>610</td>
                    <td><span className="badge bg-light text-dark">$$</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="gt-card p-4">
            <h5 className="font-heading fw-bold text-navy-deep mb-3">Recent Platform Users</h5>
            <ul className="list-group list-group-flush">
              <li className="list-group-item px-0 d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="mb-0 fw-bold">Alex Morgan</h6>
                  <span className="text-muted fs-7">alex@globetrotter.io</span>
                </div>
                <span className="badge bg-success">Active</span>
              </li>
              <li className="list-group-item px-0 d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="mb-0 fw-bold">Sophia Chen</h6>
                  <span className="text-muted fs-7">sophia@travel.org</span>
                </div>
                <span className="badge bg-success">Active</span>
              </li>
              <li className="list-group-item px-0 d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="mb-0 fw-bold">Marcus Vance</h6>
                  <span className="text-muted fs-7">marcus@wander.com</span>
                </div>
                <span className="badge bg-primary">New</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
