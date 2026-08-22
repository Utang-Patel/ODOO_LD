import React, { useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import TripCard from "../../components/TripCard";
import SearchBar from "../../components/SearchBar";
import EmptyState from "../../components/EmptyState";
import { DUMMY_TRIPS } from "../../data/dummyData";

const MyTrips = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const filteredTrips = DUMMY_TRIPS.filter((trip) => {
    const matchesSearch = trip.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "All" || trip.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      <PageHeader
        title="My Trips & Itineraries 🧳"
        subtitle="Manage, view, and organize all your upcoming and past travel adventures."
        action={
          <Link to="/create-trip" className="btn btn-gt-primary d-flex align-items-center gap-2">
            <i className="bi bi-plus-circle-fill"></i>
            <span>Plan New Trip</span>
          </Link>
        }
      />

      {/* Search & Filter Component */}
      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Search my trips by name or destination..."
        selectedFilter={filterStatus}
        onFilterChange={setFilterStatus}
        filterOptions={[
          { label: "All Statuses", value: "All" },
          { label: "Upcoming Trips", value: "Upcoming" },
          { label: "Completed Trips", value: "Completed" },
          { label: "Drafts", value: "Draft" }
        ]}
      />

      {/* Trips Grid */}
      {filteredTrips.length > 0 ? (
        <div className="row g-4">
          {filteredTrips.map((trip) => (
            <div key={trip.id} className="col-md-6 col-lg-4">
              <TripCard trip={trip} />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No trips matched your search ✈️"
          description="Try adjusting your filter or search query, or create a brand new travel itinerary."
          actionLabel="Plan New Trip"
          actionPath="/create-trip"
        />
      )}
    </div>
  );
};

export default MyTrips;
