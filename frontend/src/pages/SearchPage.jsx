import React, { useState, useEffect } from "react";
import { Filter } from "lucide-react";

const SearchPage = () => {
  const [filters, setFilters] = useState({
    ageMin: "",
    ageMax: "",
    location: "",
    religion: "",
    gender: "",
    profession: "",
    heightMin: "",
    heightMax: "",
    weightMin: "",
    weightMax: "",
    incomeMin: "",
    incomeMax: "",
  });
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);

  // Fetch profiles from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/profiles")
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        setProfiles(data);
        setFilteredProfiles(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // Handle filter input changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Apply filters based on user inputs
  useEffect(() => {
    const ageMin = filters.ageMin === "" ? 0 : Number(filters.ageMin);
    const ageMax = filters.ageMax === "" ? Infinity : Number(filters.ageMax);
    const heightMin = filters.heightMin === "" ? 0 : Number(filters.heightMin);
    const heightMax = filters.heightMax === "" ? Infinity : Number(filters.heightMax);
    const weightMin = filters.weightMin === "" ? 0 : Number(filters.weightMin);
    const weightMax = filters.weightMax === "" ? Infinity : Number(filters.weightMax);
    const incomeMin = filters.incomeMin === "" ? 0 : Number(filters.incomeMin);
    const incomeMax = filters.incomeMax === "" ? Infinity : Number(filters.incomeMax);

    const filtered = profiles.filter((profile) => {
      return (
        profile.age >= ageMin &&
        profile.age <= ageMax &&
        profile.height >= heightMin &&
        profile.height <= heightMax &&
        profile.weight >= weightMin &&
        profile.weight <= weightMax &&
        profile.annualIncome >= incomeMin &&
        profile.annualIncome <= incomeMax &&
        (filters.location === "" ||
          profile.location.toLowerCase().includes(filters.location.toLowerCase())) &&
        (filters.religion === "" ||
          profile.religion.toLowerCase() === filters.religion.toLowerCase()) &&
        (filters.gender === "" ||
          profile.gender.toLowerCase() === filters.gender.toLowerCase()) &&
        (filters.profession === "" ||
          profile.profession.toLowerCase().includes(filters.profession.toLowerCase()))
      );
    });
    setFilteredProfiles(filtered);
  }, [filters, profiles]);

  const closeModal = () => setSelectedProfile(null);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100">
      {/* Hero Section */}
      <header className="py-8 mb-10 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Find Your Match</h1>
        <p className="text-lg text-gray-600">
          Use the filters below to search for the perfect match.
        </p>
      </header>

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Section */}
          <div className="md:w-1/3 bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-700">Filters</h2>
              <Filter className="h-6 w-6 text-gray-600" />
            </div>
            <div className="space-y-5">
              {/* Gender Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Gender</label>
                <select
                  name="gender"
                  value={filters.gender}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="">All Genders</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              {/* Age Range */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Age Range</label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    name="ageMin"
                    value={filters.ageMin}
                    onChange={handleFilterChange}
                    placeholder="Min"
                    className="w-1/2 p-2 border border-gray-300 rounded"
                  />
                  <input
                    type="number"
                    name="ageMax"
                    value={filters.ageMax}
                    onChange={handleFilterChange}
                    placeholder="Max"
                    className="w-1/2 p-2 border border-gray-300 rounded"
                  />
                </div>
              </div>
              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">City</label>
                <input
                  type="text"
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  placeholder="e.g. mumbai"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              {/* Religion */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Religion</label>
                <select
                  name="religion"
                  value={filters.religion}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="">All Religions</option>
                  <option value="hindu">Hindu</option>
                  <option value="muslim">Muslim</option>
                  <option value="christian">Christian</option>
                  <option value="sikh">Sikh</option>
                </select>
              </div>
              {/* Profession */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Profession</label>
                <input
                  type="text"
                  name="profession"
                  value={filters.profession}
                  onChange={handleFilterChange}
                  placeholder="e.g. engineer"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              {/* Height */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Height (cm)</label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    name="heightMin"
                    value={filters.heightMin}
                    onChange={handleFilterChange}
                    placeholder="Min"
                    className="w-1/2 p-2 border border-gray-300 rounded"
                  />
                  <input
                    type="number"
                    name="heightMax"
                    value={filters.heightMax}
                    onChange={handleFilterChange}
                    placeholder="Max"
                    className="w-1/2 p-2 border border-gray-300 rounded"
                  />
                </div>
              </div>
              {/* Weight */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Weight (kg)</label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    name="weightMin"
                    value={filters.weightMin}
                    onChange={handleFilterChange}
                    placeholder="Min"
                    className="w-1/2 p-2 border border-gray-300 rounded"
                  />
                  <input
                    type="number"
                    name="weightMax"
                    value={filters.weightMax}
                    onChange={handleFilterChange}
                    placeholder="Max"
                    className="w-1/2 p-2 border border-gray-300 rounded"
                  />
                </div>
              </div>
              {/* Annual Income */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Annual Income ($)</label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    name="incomeMin"
                    value={filters.incomeMin}
                    onChange={handleFilterChange}
                    placeholder="Min"
                    className="w-1/2 p-2 border border-gray-300 rounded"
                  />
                  <input
                    type="number"
                    name="incomeMax"
                    value={filters.incomeMax}
                    onChange={handleFilterChange}
                    placeholder="Max"
                    className="w-1/2 p-2 border border-gray-300 rounded"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Search Results Section */}
          <div className="md:w-2/3">
            {filteredProfiles.length > 0 ? (
              filteredProfiles.map((profile) => (
                <div
                  key={profile.id}
                  className="bg-white p-6 rounded-lg shadow-xl mb-6 transform hover:scale-105 transition duration-300 ease-in-out cursor-pointer"
                  onClick={() => setSelectedProfile(profile)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">
                        {profile.name}, {profile.age}
                      </h3>
                      <p className="text-gray-600">
                        {profile.profession} |{" "}
                        {profile.location.charAt(0).toUpperCase() +
                          profile.location.slice(1)}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-gray-700">
                    Gender: {profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1)} | Height: {profile.height} cm | Weight: {profile.weight} kg | Income: ${profile.annualIncome}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600 text-xl">No results found.</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Modal Popup for Detailed Information */}
      {selectedProfile && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg shadow-2xl w-full max-w-lg overflow-y-auto max-h-[90vh] relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-t-lg">
              <h2 className="text-2xl font-bold">{selectedProfile.name}</h2>
              <p className="text-sm">
                {selectedProfile.gender.charAt(0).toUpperCase() +
                  selectedProfile.gender.slice(1)} | {selectedProfile.age} years
              </p>
            </div>
            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold">Phone:</p>
                  <p>{selectedProfile.phone}</p>
                </div>
                <div>
                  <p className="font-semibold">Email:</p>
                  <p>{selectedProfile.email}</p>
                </div>
                <div>
                  <p className="font-semibold">City:</p>
                  <p>
                    {selectedProfile.location.charAt(0).toUpperCase() +
                      selectedProfile.location.slice(1)}
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Religion:</p>
                  <p>{selectedProfile.religion}</p>
                </div>
                <div>
                  <p className="font-semibold">Marital Status:</p>
                  <p>{selectedProfile.maritalStatus}</p>
                </div>
                <div>
                  <p className="font-semibold">Profession:</p>
                  <p>{selectedProfile.profession}</p>
                </div>
                <div>
                  <p className="font-semibold">Education:</p>
                  <p>{selectedProfile.education}</p>
                </div>
                <div>
                  <p className="font-semibold">Hobbies:</p>
                  <p>{selectedProfile.hobbies}</p>
                </div>
                <div>
                  <p className="font-semibold">Height:</p>
                  <p>{selectedProfile.height} cm</p>
                </div>
                <div>
                  <p className="font-semibold">Weight:</p>
                  <p>{selectedProfile.weight} kg</p>
                </div>
                <div className="col-span-2">
                  <p className="font-semibold">Annual Income:</p>
                  <p>${selectedProfile.annualIncome}</p>
                </div>
              </div>
            </div>
            {/* Modal Footer */}
            <div className="p-4 flex justify-end">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
