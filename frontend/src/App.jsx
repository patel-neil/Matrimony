import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import SearchPage from './pages/SearchPage';
import MatchesPage from './pages/MatchesPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/chat"
          element={
            <>
              <SignedIn>
                <ChatPage />
              </SignedIn>
              <SignedOut>
                <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                  <h2 className="text-2xl font-bold mb-4">Please sign in to access chat</h2>
                  <SignInButton mode="modal">
                    <button className="bg-rose-600 text-white px-6 py-2 rounded-md hover:bg-rose-700">
                      Sign In
                    </button>
                  </SignInButton>
                </div>
              </SignedOut>
            </>
          }
        />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/matches" element={<MatchesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;