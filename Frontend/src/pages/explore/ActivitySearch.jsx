import React, { useState } from "react";
import { useParams } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import SearchBar from "../../components/SearchBar";
import ActivityCard from "../../components/ActivityCard";
import { DUMMY_ACTIVITIES, DUMMY_CITIES } from "../../data/dummyData";

const ActivitySearch = () => {
  const { cityId } = useParams();
  const city = DUMMY_CITIES.find((c) => c.id === cityId) || DUMMY_CITIES[0];
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [addedActivities, setAddedActivities] = useState({});

  const filteredActivities = DUMMY_ACTIVITIES.filter((act) => {
    const matchesSearch = act.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === "All" || act.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleToggleActivity = (activity) => {
    setAddedActivities((prev) => ({
      ...prev,
      [activity.id]: !prev[activity.id]
    }));
  };

  return (
    <div>
      <PageHeader
        title={`Things to Do in ${city.name} ${city.flag}`}
        subtitle="Browse top sightseeing, culinary experiences, culture, and nature activities."
        breadcrumbs={[{ label: "Explore Cities", path: "/cities" }, { label: `${city.name} Activities` }]}
      />

      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder={`Search activities in ${city.name}...`}
        selectedFilter={selectedCategory}
        onFilterChange={setSelectedCategory}
        filterOptions={[
          { label: "All Categories", value: "All" },
          { label: "Sightseeing", value: "Sightseeing" },
          { label: "Food & Wine", value: "Food" },
          { label: "Culture & Art", value: "Culture" },
          { label: "Nature & Parks", value: "Nature" }
        ]}
      />

      <div className="row g-4">
        {filteredActivities.map((act) => (
          <div key={act.id} className="col-md-6 col-lg-4">
            <ActivityCard
              activity={act}
              onAdd={handleToggleActivity}
              isAdded={addedActivities[act.id]}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivitySearch;
