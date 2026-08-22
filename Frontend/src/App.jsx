import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Layouts
import AuthLayout from "./layouts/AuthLayout";
import DashboardLayout from "./layouts/DashboardLayout";

// Components
import ProtectedRoute from "./components/ProtectedRoute";

// Auth Pages
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";

// Main App Pages
import Dashboard from "./pages/dashboard/Dashboard";
import CreateTrip from "./pages/trips/CreateTrip";
import MyTrips from "./pages/trips/MyTrips";
import EditTrip from "./pages/trips/EditTrip";
import ItineraryBuilder from "./pages/trips/ItineraryBuilder";
import ItineraryView from "./pages/trips/ItineraryView";
import CitySearch from "./pages/explore/CitySearch";
import ActivitySearch from "./pages/explore/ActivitySearch";
import Budget from "./pages/budget/Budget";
import Calendar from "./pages/calendar/Calendar";
import SharedTrip from "./pages/shared/SharedTrip";
import Profile from "./pages/profile/Profile";
import AdminDashboard from "./pages/admin/AdminDashboard";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Default Redirect to Dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Authentication Routes wrapped in AuthLayout */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Route>

          {/* Standalone Public Shared Trip Route (No Login Required) */}
          <Route path="/shared/:shareToken" element={<DashboardLayout />}>
            <Route index element={<SharedTrip />} />
          </Route>

          {/* Protected Dashboard & App Routes wrapped in DashboardLayout */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-trip" element={<CreateTrip />} />
            <Route path="/my-trips" element={<MyTrips />} />
            <Route path="/trips/:id/edit" element={<EditTrip />} />
            <Route path="/itinerary/:tripId" element={<ItineraryBuilder />} />
            <Route path="/itinerary/:tripId/view" element={<ItineraryView />} />
            <Route path="/cities" element={<CitySearch />} />
            <Route path="/activities/:cityId" element={<ActivitySearch />} />
            <Route path="/budget/:tripId" element={<Budget />} />
            <Route path="/calendar/:tripId" element={<Calendar />} />
            <Route path="/profile" element={<Profile />} />
            
            {/* Admin Sub-Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminDashboard />} />
            <Route path="/admin/trips" element={<AdminDashboard />} />
            <Route path="/admin/analytics" element={<AdminDashboard />} />
            <Route path="/admin/cities" element={<AdminDashboard />} />
            <Route path="/admin/activities" element={<AdminDashboard />} />
          </Route>

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
