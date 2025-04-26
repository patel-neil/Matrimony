import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";

const MatchesPage = () => {
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const { user } = useUser();

  // Fetch recommendations from the backend
  useEffect(() => {
    if (!user) {
      setLoading(true); // Keep loading state true while user is being fetched
      return;
    }

    console.log('Fetching recommendations for user:', user.id);
    
    fetch(`http://localhost:5000/api/recommendations/${user.id}`)
      .then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.details || errorData.error || "Failed to fetch recommendations");
        }
        return response.json();
      })
      .then((data) => {
        console.log('Received recommendations data:', data);
        if (data.success) {
          setFilteredProfiles(data.recommendations || []);
          setError(null);
        } else {
          setError(data.error || "Failed to get recommendations");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching recommendations:", error);
        setError(error.message || "Failed to fetch recommendations");
        setLoading(false);
      });
  }, [user]);

  const closeModal = () => setSelectedProfile(null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-xl text-gray-700 mt-4">Please wait, your life partners are being loaded...</p>
          <p className="text-sm text-gray-500 mt-2">Finding the perfect match for you</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Matches</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          {error.includes("preferences") && (
            <a 
              href="/preferences" 
              className="text-blue-500 hover:text-blue-700 underline"
            >
              Set your preferences
            </a>
          )}
        </div>
      </div>
    );
  }

  if (filteredProfiles.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="text-gray-400 text-5xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Matches Found</h2>
          <p className="text-gray-600 mb-4">
            We couldn't find any matches based on your current preferences.
          </p>
          <a 
            href="/preferences" 
            className="text-blue-500 hover:text-blue-700 underline"
          >
            Update your preferences
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 p-6">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Matched Profiles</h1>
        <p className="text-lg text-gray-600 mt-2">
          Displaying filtered user details based on your preferences.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProfiles.map((profile) => (
          <div
            key={profile.user_id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {profile.full_name}
              </h2>
              <div className="space-y-2 text-gray-600">
                <p><span className="font-medium">Age:</span> {profile.age}</p>
                <p><span className="font-medium">Gender:</span> {profile.gender}</p>
                <p><span className="font-medium">Religion:</span> {profile.religion}</p>
                <p><span className="font-medium">Education:</span> {profile.education}</p>
                <p><span className="font-medium">Occupation:</span> {profile.occupation}</p>
                <p><span className="font-medium">Match Score:</span> {Math.round(profile.match_probability * 100)}%</p>
              </div>
              <button
                onClick={() => setSelectedProfile(profile)}
                className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {selectedProfile.full_name}
            </h2>
            <div className="grid grid-cols-2 gap-4 text-gray-600">
              <div>
                <p><span className="font-medium">Age:</span> {selectedProfile.age}</p>
                <p><span className="font-medium">Gender:</span> {selectedProfile.gender}</p>
                <p><span className="font-medium">Religion:</span> {selectedProfile.religion}</p>
                <p><span className="font-medium">Mother Tongue:</span> {selectedProfile.mother_tongue}</p>
                <p><span className="font-medium">Marital Status:</span> {selectedProfile.marital_status}</p>
              </div>
              <div>
                <p><span className="font-medium">Education:</span> {selectedProfile.education}</p>
                <p><span className="font-medium">Occupation:</span> {selectedProfile.occupation}</p>
                <p><span className="font-medium">Height:</span> {selectedProfile.height_cm} cm</p>
                <p><span className="font-medium">Weight:</span> {selectedProfile.weight_kg} kg</p>
                <p><span className="font-medium">Income:</span> ${selectedProfile.income_usd}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
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
