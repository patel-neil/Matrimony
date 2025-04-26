import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/clerk-react";
import { useEffect } from "react";

import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import ProfilePage from './pages/ProfilePage';
import AdminLogin from './pages/adminLogin';
import AdminDashboard from './pages/AdminDashboard';
import PartnerPreferencePage from './pages/preference';
import MatchesPage from "./pages/MatchesPage";
function App() {
  const { user } = useUser(); // Get logged-in user

  useEffect(() => {
    if (user) {
      const userData = {
        email: user.primaryEmailAddress?.emailAddress || "",
        phone: user.primaryPhoneNumber?.phoneNumber || "",
        id: user.id
      };

      console.log("Storing user in localStorage:", userData); // ✅ Debugging log
      localStorage.setItem("user", JSON.stringify(userData)); // Store user details
    }
  }, [user]); // Runs when `user` changes

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Protected Routes */}
        <Route
          path="/chat"
          element={
            <SignedIn>
            </SignedIn>
          }
        />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/partner-preference" element={<PartnerPreferencePage />} />
        <Route path="/matches" element={<MatchesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        
        {/* Fallback Route */}
        <Route
          path="*"
          element={
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
              <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
              <a href="/" className="text-rose-600 hover:underline">Go to Home</a>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
