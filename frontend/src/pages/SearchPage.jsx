import React, { useState, useEffect, useCallback } from "react";
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
  const [loading, setLoading] = useState(false);

  // Fetch all profiles once
  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/search/profiles`);
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      if (data.success) {
        setProfiles(data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  // Apply client-side filters whenever profiles or filters change
  useEffect(() => {
    let result = profiles;

    if (filters.gender) result = result.filter(p => p.gender === filters.gender);
    if (filters.ageMin && filters.ageMax) result = result.filter(p => p.age >= +filters.ageMin && p.age <= +filters.ageMax);
    if (filters.location) result = result.filter(p => p.city.toLowerCase().includes(filters.location.toLowerCase()));
    if (filters.religion) result = result.filter(p => p.religion === filters.religion);
    if (filters.profession) result = result.filter(p => p.occupation.toLowerCase().includes(filters.profession.toLowerCase()));
    if (filters.heightMin && filters.heightMax) result = result.filter(p => p.height >= +filters.heightMin && p.height <= +filters.heightMax);
    if (filters.weightMin && filters.weightMax) result = result.filter(p => p.weight >= +filters.weightMin && p.weight <= +filters.weightMax);
    if (filters.incomeMin && filters.incomeMax) result = result.filter(p => p.annualIncome >= +filters.incomeMin && p.annualIncome <= +filters.incomeMax);

    setFilteredProfiles(result);
  }, [profiles, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const closeModal = () => setSelectedProfile(null);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100">
      <header className="py-8 mb-10 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Find Your Match</h1>
        <p className="text-lg text-gray-600">Use the filters below to search for the perfect match.</p>
      </header>

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3 bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-700">Filters</h2>
              <Filter className="h-6 w-6 text-gray-600" />
            </div>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Gender</label>
                <select name="gender" value={filters.gender} onChange={handleFilterChange} className="w-full p-2 border border-gray-300 rounded">
                  <option value="">All Genders</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Age Range</label>
                <div className="flex gap-3">
                  <input type="number" name="ageMin" value={filters.ageMin} onChange={handleFilterChange} placeholder="Min" className="w-1/2 p-2 border border-gray-300 rounded" />
                  <input type="number" name="ageMax" value={filters.ageMax} onChange={handleFilterChange} placeholder="Max" className="w-1/2 p-2 border border-gray-300 rounded" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">City</label>
                <input type="text" name="location" value={filters.location} onChange={handleFilterChange} placeholder="e.g. mumbai" className="w-full p-2 border border-gray-300 rounded" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Religion</label>
                <select name="religion" value={filters.religion} onChange={handleFilterChange} className="w-full p-2 border border-gray-300 rounded">
                  <option value="">All Religions</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Muslim">Muslim</option>
                  <option value="Christian">Christian</option>
                  <option value="Sikh">Sikh</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Profession</label>
                <input type="text" name="profession" value={filters.profession} onChange={handleFilterChange} placeholder="e.g. engineer" className="w-full p-2 border border-gray-300 rounded" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Height (cm)</label>
                <div className="flex gap-3">
                  <input type="number" name="heightMin" value={filters.heightMin} onChange={handleFilterChange} placeholder="Min" className="w-1/2 p-2 border border-gray-300 rounded" />
                  <input type="number" name="heightMax" value={filters.heightMax} onChange={handleFilterChange} placeholder="Max" className="w-1/2 p-2 border border-gray-300 rounded" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Weight (kg)</label>
                <div className="flex gap-3">
                  <input type="number" name="weightMin" value={filters.weightMin} onChange={handleFilterChange} placeholder="Min" className="w-1/2 p-2 border border-gray-300 rounded" />
                  <input type="number" name="weightMax" value={filters.weightMax} onChange={handleFilterChange} placeholder="Max" className="w-1/2 p-2 border border-gray-300 rounded" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Annual Income (Lakhs)</label>
                <div className="flex gap-3">
                  <input type="number" name="incomeMin" value={filters.incomeMin} onChange={handleFilterChange} placeholder="Min" className="w-1/2 p-2 border border-gray-300 rounded" />
                  <input type="number" name="incomeMax" value={filters.incomeMax} onChange={handleFilterChange} placeholder="Max" className="w-1/2 p-2 border border-gray-300 rounded" />
                </div>
              </div>
            </div>
          </div>

          <div className="md:w-2/3">
            {loading ? (
              <div className="text-center py-8"><p className="text-gray-600">Loading profiles...</p></div>
            ) : filteredProfiles.length > 0 ? (
              filteredProfiles.map(profile => (
                <div key={profile._id} className="bg-white p-6 rounded-lg shadow-xl mb-6 transform hover:scale-105 transition duration-300 ease-in-out cursor-pointer" onClick={() => setSelectedProfile(profile)}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">{profile.firstName} {profile.lastName}, {profile.age}</h3>
                      <p className="text-gray-600">{profile.occupation} | {profile.city}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-gray-700">Gender: {profile.gender} | Height: {profile.height} | Weight: {profile.weight} kg | Income: ₹{profile.annualIncome}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600 text-xl">No results found.</p>
            )}
          </div>
        </div>
      </div>

      {selectedProfile && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60" onClick={closeModal}>
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg overflow-y-auto max-h-[90vh] relative" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-t-lg">
              <h2 className="text-2xl font-bold">{selectedProfile.firstName} {selectedProfile.lastName}</h2>
              <p className="text-sm">{selectedProfile.gender} | {selectedProfile.age} years</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="font-semibold">Phone:</p><p>{selectedProfile.phone}</p></div>
                <div><p className="font-semibold">Email:</p><p>{selectedProfile.email}</p></div>
                <div><p className="font-semibold">City:</p><p>{selectedProfile.city}</p></div>
                <div><p className="font-semibold">Religion:</p><p>{selectedProfile.religion}</p></div>
                <div><p className="font-semibold">Marital Status:</p><p>{selectedProfile.maritalStatus}</p></div>
                <div><p className="font-semibold">Profession:</p><p>{selectedProfile.occupation}</p></div>
                <div><p className="font-semibold">Education:</p><p>{selectedProfile.education}</p></div>
                <div><p className="font-semibold">Hobbies:</p><p>{selectedProfile.hobbies?.join(', ')}</p></div>
                <div><p className="font-semibold">Height:</p><p>{selectedProfile.height}</p></div>
                <div><p className="font-semibold">Weight:</p><p>{selectedProfile.weight} kg</p></div>
                <div className="col-span-2"><p className="font-semibold">Annual Income:</p><p>₹{selectedProfile.annualIncome}</p></div>
              </div>
            </div>
            <div className="p-4 flex justify-end"><button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" onClick={closeModal}>Close</button></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;