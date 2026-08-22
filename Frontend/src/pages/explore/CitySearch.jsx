import React, { useState } from "react";
import PageHeader from "../../components/PageHeader";
import SearchBar from "../../components/SearchBar";
import DestinationCard from "../../components/DestinationCard";
import { DUMMY_CITIES } from "../../data/dummyData";

const CitySearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [toastMessage, setToastMessage] = useState("");

  const filteredCities = DUMMY_CITIES.filter((city) => {
    const matchesSearch =
      city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = selectedRegion === "All" || city.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  const handleAddCity = (city) => {
    setToastMessage(`Added ${city.name} to your active trip itinerary!`);
    setTimeout(() => setToastMessage(""), 3000);
  };

  return (
    <div>
      <PageHeader
        title="Explore World Cities 🌎"
        subtitle="Discover destinations, filter by cost index, and add cities directly to your itinerary."
      />

      {toastMessage && (
        <div className="alert alert-success d-flex align-items-center gap-2 rounded-3 shadow-sm mb-4">
          <i className="bi bi-check-circle-fill fs-5"></i>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Search cities by name or country (e.g. Paris, Japan)..."
        selectedFilter={selectedRegion}
        onFilterChange={setSelectedRegion}
        filterOptions={[
          { label: "All Regions", value: "All" },
          { label: "Europe", value: "Europe" },
          { label: "Asia", value: "Asia" },
          { label: "Middle East", value: "Middle East" }
        ]}
      />

      {/* Cities Grid */}
      <div className="row g-4">
        {filteredCities.map((city) => (
          <div key={city.id} className="col-md-6 col-lg-4">
            <DestinationCard city={city} onAdd={handleAddCity} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CitySearch;
