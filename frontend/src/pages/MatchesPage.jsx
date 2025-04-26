import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import Layout from "../Components/Layout";

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
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-rose-600 mb-4">Loading your life partners...</h2>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-red-600 mb-4">⚠️ Error Loading Matches</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-gray-600">Please log in to view matches</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (filteredProfiles.length === 0) {
    return (
      <Layout>
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
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
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
                  <p><span className="font-medium">Mobile Number:</span> +91 {Math.floor(Math.random() * 9000000000 + 1000000000)}</p>
                  <p><span className="font-medium">Age:</span> {profile.age}</p>
                  <p><span className="font-medium">Gender:</span> {profile.gender}</p>
                  <p><span className="font-medium">Religion:</span> {profile.religion}</p>
                  <p><span className="font-medium">Education:</span> {profile.education}</p>
                  <p><span className="font-medium">Occupation:</span> {profile.occupation}</p>
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
    </Layout>
  );
};

export default MatchesPage;
