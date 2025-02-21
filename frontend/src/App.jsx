import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import SearchPage from './pages/SearchPage';
import MatchesPage from './pages/MatchesPage';
import ProfilePage from './pages/ProfilePage';
import AdminLogin from './pages/adminLogin';
import AdminDashboard from './pages/AdminDashboard';

function App() {
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
              <ChatPage />
            </SignedIn>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
              <AdminDashboard />
              
          }
        />
        
        <Route path="/search" element={<SearchPage />} />
        <Route path="/matches" element={<MatchesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        {/* Fallback Route (Optional) */}
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
