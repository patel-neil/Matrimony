import React, { useState, useEffect } from "react";

const MatchesPage = () => {
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState(null);

  // Fetch filtered profiles from the dummy backend endpoint
  useEffect(() => {
    fetch("http://localhost:5000/api/preference-match")
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        setFilteredProfiles(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching filtered profiles:", error);
        setLoading(false);
      });
  }, []);

  const closeModal = () => setSelectedProfile(null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-700">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 p-6">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Matched Profiles</h1>
        <p className="text-lg text-gray-600 mt-2">
          Displaying filtered user details based on candidate preference.
        </p>
      </header>

      <div className="max-w-7xl mx-auto">
        {filteredProfiles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProfiles.map((profile) => (
              <div
                key={profile.id}
                className="bg-white p-6 rounded-lg shadow-xl mb-6 transform hover:scale-105 transition duration-300 ease-in-out cursor-pointer"
                onClick={() => setSelectedProfile(profile)}
              >
                <h3 className="text-2xl font-bold text-gray-800">
                  {profile.name}, {profile.age}
                </h3>
                <p className="text-gray-600">
                  {profile.profession} |{" "}
                  {profile.location.charAt(0).toUpperCase() +
                    profile.location.slice(1)}
                </p>
                <p className="mt-3 text-gray-700">
                  Gender:{" "}
                  {profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1)} | Annual Income: $
                  {profile.annualIncome}
                </p>
                <p className="mt-1 text-indigo-600 font-semibold">
                  Compatibility Score: {profile.compatibilityScore}%
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 text-xl">No matching profiles found.</p>
        )}
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
                <div className="col-span-2">
                  <p className="font-semibold">Compatibility Score:</p>
                  <p>{selectedProfile.compatibilityScore}%</p>
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

export default MatchesPage;
